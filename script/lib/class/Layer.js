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
        this.zIndexNameMapping = [];

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
     
        this.isDirty = false;
        this.state = enums.LayerState.stopped;
    }

    Layer.prototype = {
        addModel: function(options){
            var model = new Model(options);
            if(typeof options.zIndex === "number"){
                this.zIndexNameMapping.splice(options.zIndex, 0, options.name);      
            }else{
                this.zIndexNameMapping.push(options.name);
            }
            this.animationManager.addModel(model);
            this.modelCount += 1;
            return model;
        },
        removeModel: function(arg){
            var name,
                index;
            if(typeof arg === "number"){
                name = this.zIndexNameMapping[arg];
                index = arg;
            }else if (typeof arg === "string"){
                name = arg;
                index = this.zIndexNameMapping.indexOf(arg);
            }
            this.zIndexNameMapping.splice(index, 1);
            this.animationManager.removeModel(name);
            this.modelCount -= 1;
        },
        getModel: function(name){
            return this.animationManager.getModel(name);    
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
        __renderOnBuffer: function(){
            if(this.state === enums.LayerState.playing){
                
                var animationManager = this.animationManager;
                var zIndexNameMapping = this.zIndexNameMapping;
                var ctx = this.bufferCtx;
                ctx.clearRect(0, 0, this.width, this.height);
                
                for(var i=0, count=this.modelCount; i<count; i+=1){    
                    var name = zIndexNameMapping[i];
                    if(typeof name === "undefined")
                        continue;
                    var model = animationManager.getModel(name).getRenderData(animationManager.step);
                    if(model.img){
  
                        ctx.globalAlpha = model.opacity;
                        ctx.translate(model.x, model.y);
                        ctx.rotate(-MathUtil.radians(model.orientation));
                        ctx.scale(model.scaleX, model.scaleY);
                        ctx.drawImage(
                            model.img,
                            -model.width/2, 
                            -model.height/2
                        );
                        ctx.scale(1/model.scaleX, 1/model.scaleY);
                        ctx.rotate(MathUtil.radians(model.orientation));
                        ctx.translate(-model.x, -model.y);
                    }
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