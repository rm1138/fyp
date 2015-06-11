define(['lib/Global', 'lib/enums'], function(Global, enums){
    
    //Renderer, the only connecton to the DOM Canvas Element
    var Renderer = Renderer || function(canvasDomID, layers){
        this.container = document.getElementById(canvasDomID);
        this.container.style.position = "relative";
        if(this.container === null){
            console.info("DOM Element not found");
            return null;   
        }
        this.width = this.container.width;
        this.height = this.container.height;
        
        this.lastDrawTime = new Date().getTime();
        this.delta = 0;
        this.layers = layers;
        
        var that = this;
        
        this.fpsCanvas = document.createElement("canvas");
        this.fpsCanvas.width = this.container.width;
        this.fpsCanvas.height = this.container.height;
        this.fpsCanvas.style.position = "absolute";
        this.fpsCanvas.style.left = "0px";
        this.fpsCanvas.style.top = "0px";
        this.fpsCanvas.style.zIndex = "100";
        this.fpsCtx = this.fpsCanvas.getContext("2d");
        this.container.appendChild(this.fpsCanvas);
        this.renderFrameCount()

    };
    
    Renderer.prototype = {
        //render the Layer on the buffer
        renderOnBuffer: function() {
            var layers = this.layers;
            var index = layers.length -1;
            while(index !== -1){
                layers[index].__renderOnBuffer();
                index--;
            }
        },
        //render the buffer canvas to the main canvas.context
        render: function(){
            var now = new Date().getTime();
            var delta = now - this.lastDrawTime;
            this.lastDrawTime = now;
            
            var layers = this.layers;
            var index = layers.length -1;
            while(index !== -1){
                layers[index].__render();
                index--;
            }
            this.delta = delta;
        },
        renderFrameCount: function(){
            var fps = Math.floor(1000/this.delta);
            var ctx = this.fpsCtx;
            ctx.clearRect(5, 5, 200, 35);
            ctx.beginPath();
            ctx.fillStyle = "#FF0000";
            ctx.font = "30px Arial";
            ctx.fillText("FPS: " + fps,  10, 30);
            ctx.closePath();
            var that = this;
            setTimeout(function(){
                that.renderFrameCount();
            }, 1000);
        },
        initLayer: function(layer){
            var canvas = layer.canvas;
            canvas.id = layer.name;
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.style.position = "absolute";
            canvas.style.left = "0px";
            canvas.style.top = "0px";
            layer.ctx = canvas.getContext("2d");
            layer.width = this.width;
            layer.height = this.height;
            this.container.appendChild(canvas);
            
            var bufferCanvas = layer.bufferCanvas;
            bufferCanvas.width = this.width;
            bufferCanvas.height = this.height;
            layer.bufferCtx = bufferCanvas.getContext('2d')
        },
        deleteLayerCanvas: function(name){
            delete this.isLayerDirty[name];
        }
    };
    
    return Renderer;
});