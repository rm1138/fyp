define([
        'class/Model',
        'lib/enums',
        'lib/Util',
        'lib/SptialHashing'
    ], function (Model, enums, Util, SptailHashing) {

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
        this.sptialHashMapping = new SptailHashing();
        this.renderRegion = null;
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
            var model = this.zIndexNameMapping[index];
            this.animationManager.removeModel(this.zIndexNameMapping[index]);
            this.sptialHashMapping.removeAndSetNearModelRerender(this.zIndexNameMapping[index]);
            this.zIndexNameMapping.splice(index, 1);
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
        __renderOnBuffer: function (drawQosLimit) {
            if (this.state === enums.LayerState.playing) {
                var zIndexMapping = this.zIndexMapping;
                var ctx = this.bufferCtx;
                var renderModels = [];
                var renderRegion = {
                    x1: null,
                    y1: null,
                    x2: null,
                    y2: null
                };
                //               for (var i = 0, count = zIndexMapping.length; i < count; i += 1) {
                //                    var model = zIndexMapping[i];
                //                    model.__frameDispatch(drawQosLimit);
                //                    if (model.isActive) {
                //                        model.isActive = false;
                //                        var box = Util.getBox(model.last);
                //                        if (renderRegion.x1 === null) {
                //                            renderRegion.x1 = box.x;
                //                            renderRegion.y1 = box.y;
                //                            renderRegion.x2 = box.x + box.width;
                //                            renderRegion.y2 = box.y + box.height;
                //                        } else {
                //                            if (renderRegion.x1 > box.x) {
                //                                renderRegion.x1 = box.x;
                //                            }
                //                            if (renderRegion.y1 > box.y) {
                //                                renderRegion.y1 = box.y;
                //                            }
                //                            if (renderRegion.x2 < box.x + box.width) {
                //                                renderRegion.x2 = box.x + box.width;
                //                            }
                //                            if (renderRegion.y2 < box.y + box.height) {
                //                                renderRegion.y2 = box.y + box.height;
                //                            }
                //                        }
                //
                //                    }
                //                };
                //ctx.clearRect(renderRegion.x1, renderRegion.y1, renderRegion.x2 - renderRegion.x1, renderRegion.y2 - renderRegion.y1);
                ctx.clearRect(0, 0, this.width, this.height);

                for (var i = 0, count = zIndexMapping.length; i < count; i += 1) {
                    var model = zIndexMapping[i];
                    model.__frameDispatch(drawQosLimit);
                    //
                    //                    var modelBox = Util.getBox(model.last);
                    //
                    //                    var isOverlap = Util.isOverlap(
                    //                        modelBox.x, modelBox.y, modelBox.width, modelBox.height,
                    //                        renderRegion.x1, renderRegion.y1, renderRegion.x2 - renderRegion.x1, renderRegion.y2 - renderRegion.y1
                    //                    );
                    if (model.isActive && model.QoSLevel <= drawQosLimit) {
                        renderModels.push(model);
                    }
                }

                for (var i = 0, count = renderModels.length; i < count; i += 1) {
                    var model = renderModels[i];
                    this.__drawModel(model.img, model.current, ctx);
                }
                this.fw.renderer.renderedModelCount = i;
                this.renderRegion = renderRegion;
            }
        },
        __drawModel: function (img, model, ctx) {
            ctx.globalAlpha = model.opacity;
            ctx.translate(model.x, model.y);
            ctx.rotate(-Util.radians(model.orientation));
            ctx.scale(model.scaleX, model.scaleY);
            ctx.drawImage(
                img, -model.width / 2, -model.height / 2
            );
            ctx.scale(1 / model.scaleX, 1 / model.scaleY);
            ctx.rotate(Util.radians(model.orientation));
            ctx.translate(-model.x, -model.y);
        },
        __render: function () {
//            var renderRegion = this.renderRegion;
//            if (this.renderRegion) {
//                var x = renderRegion.x1;
//                var y = renderRegion.y1;
//                var width = renderRegion.x2 - renderRegion.x1;
//                var height = renderRegion.y2 - renderRegion.y1
//                var ctx = this.ctx;
//                ctx.clearRect(x, y, width, height);
//                ctx.drawImage(this.bufferCanvas, x, y, width, height, x, y, width, height);
//            }
                        var renderRegion = this.renderRegion;
            
                        var ctx = this.ctx;
                        ctx.clearRect(0, 0, this.width, this.height);
                        ctx.drawImage(this.bufferCanvas, 0, 0);

        }
    }

    return Layer;
});
