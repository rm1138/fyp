define([
        'class/Timeline',
        'class/KeyFrame',
        'class/Model',
        'class/Animation',
        'lib/Global',
        'lib/enums',
        'lib/MathUtil'
    ], function (Timeline, KeyFrame, Model, Animation, Global, enums, MathUtil){
    
    var Layer = Layer || function(name, zIndex){
        
        this.name = name;
        this.length = 0;
        
        this.zIndexModelMapping = [];
        this.nameZIndexMapping = {};
        
        this.timeline = new Timeline();
        this.layerFrameTimer = 0;
        
        this.canvas = document.createElement("canvas");
        this.bufferCanvas = document.createElement("canvas");
        this.width = 0;
        this.height = 0;
        this.ctx = null;
        this.bufferCtx = null;
        
        this.dirty = false;
        
        this.zIndex = 0;
        this.state = enums.LayerState.stopped; 
        if(zIndex){
            this.canvas.style.zIndex = zIndex;
            this.zIndex = zIndex;
        }
    }

    Layer.prototype = {
        //Public
        addModel: function(options){
            var that = this;
            var model = new Model(options);
            if(typeof options.zIndex === "number"){
                this.zIndexModelMapping.splice(options.zIndex, 0, model);
                this.nameZIndexMapping[model.name] = options.zIndex;
            }else{
                this.zIndexModelMapping.push(model);
                this.nameZIndexMapping[model.name] = this.zIndexModelMapping.length - 1;
            }
            this.length += 1;
            return model;
        },
        __getZIndexModelMapping: function(){
            return this.zIndexModelMapping;
        },
        __getNameZIndexMapping: function(){
            return this.nameZIndexMapping;
        },
        removeModel: function(arg){
            //To Be Implement Object Pool
            if(typeof arg === "number"){
                var name = this.zIndexModelMapping[arg].name;
                this.zIndexModelMapping.splice(arg, 1);
                delete this.nameZIndexMapping[name];
            }else if (typeof arg === "string"){
                var zIndex = this.nameZIndexMapping[arg];
                delete this.nameZIndexMapping[arg];
                this.zIndexModelMapping.splice(zIndex, 1);
            }
            this.readyToRender = true;
        },
        getModelByName: function(name){
            var zIndex = this.nameZIndexMapping[name];
            return this.zIndexModelMapping[zIndex];    
        },
//        addKeyFrame: function(animations, duration) {
//            var formatedAnimation = [];
//            for(var i=0, length = animations.length; i < length; i+=1) {
//                var modelName = animations[i].modelName;  
//                var animation = new Animation(this.getModelByName(modelName), animations[i].animation);
//                formatedAnimation.push(animation);
//            }
//            var keyframe = new KeyFrame(formatedAnimation, duration);
//            this.timeline.addKeyframe(keyframe);
//        },
        setZIndex: function(zIndex) {
            this.zIndex = zIndex;    
            this.canvas.style.zIndex = zIndex;
        },
        __delete: function(){
            var canvas = this.canvas;
            canvas.parentNode.removeChild(canvas);
        },
        createKeyframe: function(duration){
            return new KeyFrame(duration, this);
        },
        play: function(){
            this.state = enums.LayerState.playing;
            console.log("started");
        },
        stop: function() {
            this.state = enums.LayerState.stopped;
            console.log("stopped");
        },
        __renderOnBuffer: function(){
            if(Global.modelCount !== Global.readyModelCount){
                return;                
            };
            var frame = this.timeline.getFrame();
            if(this.state === enums.LayerState.playing && frame !== undefined){
                var renderModels = this.__getZIndexModelMapping();
                var count = renderModels.length - 1;
                var ctx = this.bufferCtx;
                var model;
                ctx.clearRect(0, 0, this.width, this.height);  
                while(model = renderModels[count]){
                    
                    var animation = frame[model.name];
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
                    
                    count--;
                }
                this.dirty = true;
            }
        },
        __render: function(){
            if(this.dirty){
                var ctx = this.ctx;                 
                ctx.clearRect(0, 0, this.width, this.height);
                ctx.drawImage(this.bufferCanvas, 0, 0);         
                this.dirty = false;
            }
        }
    }

    return Layer;
});