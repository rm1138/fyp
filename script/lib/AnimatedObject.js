define(
    function(){
        var AnimateObject = AnimateObject || function(obj){
            for(var prop in obj){
                this[prop] = obj[prop];    
            }
            this.drawing = false;
        }
        AnimateObject.prototype = {
            animate: function(obj){
                this.toX = obj.x;
                this.toY = obj.y;
                this.originX = this.x;
                this.originY = this.y;
                this.duration = obj.duration;
                this.remain = obj.duration;
            },
            update: function(obj){
                for(var prop in obj){
                    this[prop] = obj[prop];    
                }
                this.drawing = false;
            }
        }
        return AnimateObject;
});