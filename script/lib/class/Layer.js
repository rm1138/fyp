define([
        'class/KeyFrame',
        'class/Model',
        'lib/enums',
        'lib/MathUtil',
        'class/Timeline'
    ], function (KeyFrame, Model, enums, MathUtil, Timeline){
    
    var Layer = Layer || function(name, zIndex, fw){
        this.fw = fw;
        this.animationManager = fw.getAnimationManager();
        this.name = name;
        this.modelCount = 0;
        this.zIndexModelMapping = [];
        this.nameModelMapping = {};

        this.canvas = document.createElement("canvas");
        this.bufferCanvas = document.createElement("canvas");
        this.width = 0;
        this.height = 0;
        this.ctx = null;
        this.bufferCtx = null;
        
        this.zIndex = 0;
        if(zIndex){
            this.canvas.style.zIndex = zIndex;
            this.zIndex = zIndex;
        }
        
        this.timeline = new Timeline();
        this.callBackMapping = {};
        this.isDirty = false;
        this.state = enums.LayerState.stopped;
    }

    Layer.prototype = {
        addModel: function(options){
            var that = this;
            var model = new Model(options);
            if(typeof options.zIndex === "number"){
                this.zIndexModelMapping.splice(options.zIndex, 0, model);       
            }else{
                this.zIndexModelMapping.push(model);
            }
            this.nameModelMapping[model.name] = model;
            this.modelCount += 1;
            return model;
        },
        removeModel: function(arg){
            //To Be Implement Object Pool
            if(typeof arg === "number"){
                var name = this.zIndexModelMapping[arg].name;
                this.zIndexModelMapping.splice(arg, 1);
                delete this.nameModelMapping[name];
            }else if (typeof arg === "string"){
                var zIndex = this.nameModelMapping[arg].zIndex;
                delete this.nameModelMapping[arg];
                this.zIndexModelMapping.splice(zIndex, 1);
            }
            this.modelCount -= 1;
        },
        getModelByName: function(name){
            return this.nameModelMapping[zIndex];    
        },
        setZIndex: function(zIndex) {
            this.zIndex = zIndex;    
            this.canvas.style.zIndex = zIndex;
        },
        __delete: function(){
            var canvas = this.canvas;
            canvas.parentNode.removeChild(canvas);
        },
        play: function(){
            this.state = enums.LayerState.playing;
            console.log("started");
        },
        stop: function() {
            this.state = enums.LayerState.stopped;
            console.log("stopped");
        },
        getTimeline: function(){
            return this.timeline;    
        },
        getLayerAnimation: function() {
            var result = {},
                models = this.zIndexModelMapping,
                i = models.length,
                count = 0;
            while(i--){
                var modelAnimation = models[i].getModelAnimation();
                if(modelAnimation !== null){
                    result[models[i].name] = modelAnimation;
                    count+=1;
                }
            }
            return {
                layerName: this.name,
                layerAnimations: result,
                layerAnimationsCount: count
            };
        },
        __renderOnBuffer: function(){
            var animations = this.timeline.getAnimations(this.modelCount, this.animationManager.step);
            if(this.state === enums.LayerState.playing && animations !== null){

                var renderModels = this.zIndexModelMapping;
                var count = renderModels.length - 1;
                var ctx = this.bufferCtx;
                var model;
                ctx.clearRect(0, 0, this.width, this.height);  
                while(model = renderModels[count]){
                    var animation = animations[count];

                    
                    ctx.globalAlpha = animation.opacity;
                    ctx.translate(animation.x, animation.y);
                    ctx.rotate(-MathUtil.radians(animation.orientation));
                    ctx.scale(animation.scaleX, animation.scaleY);
                    ctx.drawImage(
                        model.img,
                        -model.width/2, 
                        -model.height/2
                    );
                    ctx.scale(1/animation.scaleX, 1/animation.scaleY);
                    ctx.rotate(MathUtil.radians(animation.orientation));
                    ctx.translate(-animation.x, -animation.y);
                    model.__update(animation);
                    count--;
                }
                this.isDirty = true;
            }
        },
        __render: function(){
            if(this.isDirty){
                var ctx = this.ctx;                 
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.drawImage(this.bufferCanvas, 0, 0);         
                this.isDirty = false;
            }
        }
    }

    return Layer;
});