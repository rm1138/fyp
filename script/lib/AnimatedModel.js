define(
    function(){
        var AnimateModel = AnimateModel || function(obj){
            for(var prop in obj){
                this[prop] = obj[prop];    
            }
            this.updated = true;
            this.animation = [];
        }
        AnimateModel.prototype = {
            animate: function(obj){
                this.animate.push({
                    rotate: obj.rotate,
                    toX: obj.x,
                    toY: obj.y,
                    duration: obj.duration
                });
            },
            update: function(obj){
                this.x = obj.x;
                this.y = obj.y;
            },
            moveTo: function(obj){
                this.x = obj.x;
                this.y = obj.y;
            },
            chain: function(obj){
                this.chain.push(obj);   
            }
        }
        return AnimateModel;
});