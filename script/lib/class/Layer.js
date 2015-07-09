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
        this.bufferCanvas2 = document.createElement('canvas');

        this.width = 0;
        this.height = 0;
        this.ctx = null;
        this.bufferCtx = null;
        this.bufferCtx2 = null;
        this.zIndex = 0;
        if (zIndex) {
            this.canvas.style.zIndex = zIndex;
            this.zIndex = zIndex;
        }

        this.state = enums.LayerState.stopped;
        this.sptialHashMapping = new SptailHashing(3);
        this.dirtyRegions = [];
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
        __renderOnBuffer: function () {
            if (this.state === enums.LayerState.playing) {

                var sptialHashingMappig = this.sptialHashMapping;
                var zIndexMapping = this.zIndexMapping;
                var ctx = this.bufferCtx;
                var renderModels = [];
                for (var i = 0, count = this.modelCount; i < count; i += 1) {
                    var model = zIndexMapping[i];

                    model.__frameDispatch();
                    if (model.isActive) {

                        var boxOld = Util.getBox(model.last);
                        var boxNew = Util.getBox(model.current);
                        this.dirtyRegions.push(boxOld);
                        this.dirtyRegions.push(boxNew);

                        ctx.clearRect(boxOld.x, boxOld.y, boxOld.width, boxOld.height);
                        ctx.clearRect(boxNew.x, boxNew.y, boxNew.width, boxNew.height);

                        sptialHashingMappig.updateAndSetNearModelRerender(model);
                        model.isActive = false;
                    }
                };


                for (var i = 0, count = zIndexMapping.length; i < count; i += 1) {
                    var model = zIndexMapping[i];
                    if (model.needRender) {
                        renderModels.push(model);
                        model.needRender = false;

                    }
                }

                for (var i = 0, count = renderModels.length; i < count; i += 1) {
                    var model = renderModels[i];
                    this.drawModel(model.img, model.current, ctx);
                }
            }
        },
        drawModel: function (img, model, ctx) {
            ctx.save();
            ctx.globalAlpha = model.opacity;
            ctx.translate(model.x, model.y);
            ctx.rotate(-Util.radians(model.orientation));
            ctx.scale(model.scaleX, model.scaleY);
            ctx.drawImage(
                img, -model.width / 2, -model.height / 2
            );
            ctx.restore();
//            ctx.scale(1 / model.scaleX, 1 / model.scaleY);
  //            ctx.rotate(Util.radians(model.orientation));
  //            ctx.translate(-model.x, -model.y);
        },
        __render: function () {
            this.drawOnBuffer2();
            this.drawOnCanvas();
        },
        drawOnBuffer2: function () {
            var bufferCanvas = this.bufferCanvas;
            var bufferCtx2 = this.bufferCtx2;
            var dirtyRegions = this.dirtyRegions;
            var i = dirtyRegions.length;
            var processedHashRegions = {};
            while (i--) {
                var dirtyRegion = dirtyRegions[i];
                var temp = dirtyRegion.toString();
                if (!processedHashRegions[temp]) {
                    var x = dirtyRegion.x;
                    var y = dirtyRegion.y;
                    var width = dirtyRegion.width;
                    var height = dirtyRegion.height;
                    bufferCtx2.clearRect(x, y, width, height);
                    bufferCtx2.drawImage(bufferCanvas, x, y, width, height, x, y, width, height);
                    if (this.fw.__configShowRedrawArea) {
                        bufferCtx2.globalAlpha = 0.1;
                        bufferCtx2.fillRect(x, y, width, height);
                        bufferCtx2.globalAlpha = 1;
                    }
                    processedHashRegions[temp] = true;
                }
            }
            this.dirtyRegions = [];
        },
        drawOnCanvas: function () {
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.drawImage(this.bufferCanvas2, 0, 0);

        }
    }

    return Layer;
});
