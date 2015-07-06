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
        this.sptialHashMapping = new SptailHashing(2);
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
            this.animationManager.removeModel(this.zIndexNameMapping[index]);
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
                        model.isActive = false;
                        var boxOld = Util.getBox(model.last);
                        var boxNew = Util.getBox(model.current);

                        this.dirtyRegions.push(boxOld);
                        this.dirtyRegions.push(boxNew);
                        ctx.clearRect(boxOld.x, boxOld.y, boxOld.width, boxOld.height);
                        ctx.clearRect(boxNew.x, boxNew.y, boxNew.width, boxNew.height);
                        sptialHashingMappig.setToRerender(model);
                        sptialHashingMappig.update(model);  
                        sptialHashingMappig.setToRerender(model);
                    }
                };
                

                for (var i = 0, count = zIndexMapping.length; i < count; i += 1) {
                    var model = zIndexMapping[i];
                    if(model.needRender){
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
            var dirtyRegions = this.dirtyRegions;
            var i = dirtyRegions.length;
            var ctx = this.ctx;
            while(i--){
                var dirtyRegion = dirtyRegions[i];
                var x = dirtyRegion.x;
                var y = dirtyRegion.y;
                var width = dirtyRegion.width;
                var height = dirtyRegion.height;

                ctx.clearRect(x, y, width, height);
                ctx.drawImage(this.bufferCanvas, x, y, width, height, x, y, width, height);
            }
            this.dirtyRegions = [];
        }
    }

    return Layer;
});
