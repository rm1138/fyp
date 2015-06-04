define(function (){
    
    var ModelLayer = ModelLayer || function(){
        this.length = 0;
        this.zIndexModelMapping = [];
        this.nameZIndexMapping = {};
    }

    ModelLayer.prototype = {
        addModel: function(model, index){
            if(typeof index === "number"){
                this.zIndexModelMapping.splice(index, 0, model);
                this.nameZIndexMapping[model.name] = index;
            }else{
                this.zIndexModelMapping.push(model);
                this.nameZIndexMapping[model.name] = this.zIndexModelMapping.length - 1;
            }
            this.length += 1;
        },
        getZIndexModelMapping: function(){
            return this.zIndexModelMapping2;
        },
        getNameZIndexMapping: function(){
            return this.nameZIndexMapping;
        },
        removeModel: function(arg){
            if(typeof arg === "number"){
                var name = this.zIndexModelMapping[arg].name;
                this.zIndexModelMapping.remove(arg);
                delete this.nameZIndexMapping[name];
            }else if (type arg === "string"){
                var index = this.nameZIndexMapping[arg];
                delete this.nameZIndexMapping[arg];
                this.zIndexModelMapping.remove(index);
            }
        },
        getModelByName: function(name){
            var zIndex = nameZIndexMapping[name];
            return this.zIndexModelMapping[zIndex];    
        }
    }

    return ModelLayer;
});