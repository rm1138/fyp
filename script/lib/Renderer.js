define([], function(){
    
    //Renderer, the only connecton to the DOM Canvas Element
    var Renderer = Renderer || function(canvasDomID){
        this.canvas = document.getElementById(canvasDomID);
        if(this.canvas === null){
            console.info("DOM Element not found");
            return null;   
        }
        var canvsa = this.canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.ctx = canvas.getContext("2d");
        
        this.bufferCanvas = document.createElement("canvas");
        this.bufferCanvas.width = this.width;
        this.bufferCanvas.height = this.height;
        this.bufferCtx = this.bufferCanvas.getContext("2d");
    };
    
    Renderer.prototype = {
        //render the ObjectList on the buffer
        renderOnBuffer: function(objectList, coordinateList) {
            this.bufferCtx.clearRect(0, 0, this.width, this.height);
            
            var count = objectList.length - 1;
            var ctx = this.bufferCtxctx;
            
            while(count){
                var coordinate = coordinateList[count];
                ctx.drawImage(objectList[count], coordinate.x, coordinate.y);
                count--;
            }
        },
        //render the buffer canvas to the main canvas.context
        render: function(){
            var ctx = this.ctx;
            ctx.clearRect(0, 0, this.width, this.height);
            ctx.drawImage(this.bufferCanvas, 0, 0);
        }
    };
    
    return Renderer;
});