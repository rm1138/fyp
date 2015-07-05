define([
        'class/Model',
        'lib/enums',
        'lib/MathUtil',
        'lib/SptialHashing'
    ], function (Model, enums, MathUtil, SptailHashing) {

    var Layer = Layer || function (name, zIndex, fw) {
        this.fw = fw;
        this.animationManager = fw.getAnimationManager();
        this.name = name;
        this.modelCount = 0;
        this.zIndexMapping = [];

        this.canvas = document.createElement("canvas");
        this.bufferCanvas = document.createElement("canvas");
        this.width = 0;
        this.height = 0;
        this.ctx = null;
        this.bufferCtx = null;

        this.zIndex = 0;
        if (zIndex) {
            this.canvas.style.zIndex = zIndex;
            this.zIndex = zIndex;
        }

        this.state = enums.LayerState.stopped;
        this.sptialHashMapping = new SptailHashing(8);
    }

    Layer.prototype = {
        addModel: function (options) {
            var that = this;
            var model = new Model(options, this);
            if (typeof options.zIndex === "number") {
                this.zIndexMapping.splice(options.zIndex, 0, model);
            } else {
                this.zIndexMapping.push(model);
            }
            this.animationManager.addModel(model);
            this.modelCount += 1;
            return model;
        },
        removeModel: function (arg) {
            var name,
                index;
            if (typeof arg === "number") {
                name = this.zIndexNameMapping[arg];
                index = arg;
            } else if (typeof arg === "string") {
                name = arg;
                index = this.zIndexNameMapping.indexOf(arg);
            }
            this.zIndexNameMapping.splice(index, 1);
            this.animationManager.removeModel(name);
            this.modelCount -= 1;
        },
        getModel: function (name) {
            return this.animationManager.getModel(name);
        },
        setZIndex: function (zIndex) {
            this.zIndex = zIndex;
            this.canvas.style.zIndex = zIndex;
        },
        __delete: function () {
            var canvas = this.canvas;
            canvas.parentNode.removeChild(canvas);
        },
        play: function () {
            this.state = enums.LayerState.playing;
            console.log("started");
        },
        stop: function () {
            this.state = enums.LayerState.stopped;
            console.log("stopped");
        },
        __renderOnBuffer: function () {
            if (this.state === enums.LayerState.playing) {

                var animationManager = this.animationManager;
                var zIndexMapping = this.zIndexMapping;
                var ctx = this.ctx;
                var renderModels = [];
                var renderRegion = {
                    x1: null,
                    y1: null,
                    x2: null,
                    y2: null
                };
                for (var i = 0, count = this.modelCount; i < count; i += 1) {
                    var model = zIndexMapping[i];
                    model.update();
                    if (model.isActive) {
                        model.isActive = false;
                        var box = MathUtil.getBox(model.last || mod);
                        if (renderRegion.x1 === null) {
                            renderRegion.x1 = box.x;
                            renderRegion.y1 = box.y;
                            renderRegion.x2 = box.x + box.width;
                            renderRegion.y2 = box.y + box.height;
                        } else {
                            if (renderRegion.x1 > box.x) {
                                renderRegion.x1 = box.x;
                            }
                            if (renderRegion.y1 > box.y) {
                                renderRegion.y1 = box.y;
                            }
                            if (renderRegion.x2 < box.x + box.width) {
                                renderRegion.x2 = box.x + box.width;
                            }
                            if (renderRegion.y2 < box.y + box.height) {
                                renderRegion.y2 = box.y + box.height;
                            }
                        }

                    }
                };
                ctx.clearRect(renderRegion.x1, renderRegion.y1, renderRegion.x2 - renderRegion.x1, renderRegion.y2 - renderRegion.y1);

                for (var i = 0, count = zIndexMapping.length; i < count; i += 1) {
                    var model = zIndexMapping[i];
                    var modelBox = MathUtil.getBox(model);
                    var isOverlap = MathUtil.isOverlap(
                        modelBox.x, modelBox.y, modelBox.width, modelBox.height,
                        renderRegion.x1, renderRegion.y1, renderRegion.x2 - renderRegion.x1, renderRegion.y2 - renderRegion.y1
                    );
                    if (isOverlap) {
                        renderModels.push(model);
                    }
                }

                for (var i = 0, count = renderModels.length; i < count; i += 1) {
                    var model = renderModels[i];
                    this.drawModel(renderModels[i], ctx);
                }

            }
        },
        drawModel: function (model, ctx) {
            ctx.globalAlpha = model.opacity;
            ctx.translate(model.x, model.y);
            ctx.rotate(-MathUtil.radians(model.orientation));
            ctx.scale(model.scaleX, model.scaleY);
            ctx.drawImage(
                model.img, -model.width / 2, -model.height / 2
            );
            ctx.scale(1 / model.scaleX, 1 / model.scaleY);
            ctx.rotate(MathUtil.radians(model.orientation));
            ctx.translate(-model.x, -model.y);
            console.log(model.name);
        },
        __render: function () {
            // var ctx = this.ctx;
            //ctx.clearRect(0, 0, this.width, this.height);
            //ctx.drawImage(this.bufferCanvas, 0, 0);
        }
    }

    return Layer;
});
