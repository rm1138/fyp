define([
        'class/Timeline',
        'class/Animation',
        'class/Model'
    ], function (Timeline, Animation, Model){
    
    var Layer = Layer || function(name){
        this.name = name;
        this.length = 0;
        this.zIndexModelMapping = [];
        this.nameZIndexMapping = {};
        this.timeline = new Timeline();
        this.currentFrame = {};
        this.readyToRender = true;
    }

    Layer.prototype = {
        addModel: function(options){
            var that = this;
            this.readyToRender = false;
            var model = new Model(options);
            if(typeof options.zIndex === "number"){
                this.zIndexModelMapping.splice(options.zIndex, 0, model);
                this.nameZIndexMapping[model.name] = options.zIndex;
            }else{
                this.zIndexModelMapping.push(model);
                this.nameZIndexMapping[model.name] = this.zIndexModelMapping.length - 1;
            }
            this.length += 1;
            this.readyToRender = true;
            console.log("Added Model on Layer: " + this.name); 
            return model;
        },
        getZIndexModelMapping: function(){
            return this.zIndexModelMapping;
        },
        getNameZIndexMapping: function(){
            return this.nameZIndexMapping;
        },
        removeModel: function(arg){
            //To Be Implement Object Pool
            if(typeof arg === "number"){
                var name = this.zIndexModelMapping[arg].name;
                this.zIndexModelMapping.remove(arg);
                delete this.nameZIndexMapping[name];
            }else if (typeof arg === "string"){
                var zIndex = this.nameZIndexMapping[arg];
                delete this.nameZIndexMapping[arg];
                this.zIndexModelMapping.remove(zIndex);
            }
            this.readyToRender = true;
        },
        getModelByName: function(name){
            var zIndex = nameZIndexMapping[name];
            return this.zIndexModelMapping[zIndex];    
        },
        addKeyFrame: function(args) {
            var names = Object.keys(args);
            for(var i=0, length = names.length; i<length; i+=1){
                
            }
        },
        getRenderData: function(){
            if(this.currentFrame.remain <= 0){
                    
            }   
        },
        delete: function(){
            
        }
    }

    return Layer;
});