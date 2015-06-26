/*
    Interact with DOM Canvas and Buffer Canvas
    Response for rendering 
*/
define([
        'lib/enums',
        'lib/AnimationManager'
    ], function(enums, AnimationManager){
    
    //Renderer, the only connecton to the DOM Canvas Element
    var Renderer = Renderer || function(canvasDomID){
        this.container = document.getElementById(canvasDomID);
        this.container.style.position = "relative";
        if(this.container === null){
            console.info("DOM Element not found");
            return null;   
        }
        this.width = this.container.width;
        this.height = this.container.height;
        
        this.aniamtionManager = new AnimationManager();
        //for render the fps
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
        this.lastDrawTime = new Date().getTime();
        this.delta = 0;
    };
    
    Renderer.prototype = {
        initLayer: function(renderLayer) {
            /*
                this.workerManager.addWorkerLayer(renderLayer);
            */
            var canvas = renderLayer.canvas;
            canvas.id = renderLayer.name;
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.style.position = "absolute";
            canvas.style.left = "0px";
            canvas.style.top = "0px";
            renderLayer.ctx = canvas.getContext("2d");
            renderLayer.width = this.width;
            renderLayer.height = this.height;
            this.container.appendChild(canvas);
            var bufferCanvas = renderLayer.bufferCanvas;
            bufferCanvas.width = this.width;
            bufferCanvas.height = this.height;
            renderLayer.bufferCtx = bufferCanvas.getContext('2d')
        },

        render: function(layers){
            this.renderOnCanvas(layers);
            this.renderOnBuffer(layers);
        },
        renderOnCanvas: function(layers) {
            var now = new Date().getTime();
            var delta = now - this.lastDrawTime;
            this.lastDrawTime = now;
            
            var i = layers.length;
            while(i--){
                layers[i].__render();
            }
            this.delta = delta; 
        },
        renderOnBuffer: function(layers) {
            var i = layers.length;
            while(i--){
                var layer = layers[i];
                this.aniamtionManager.getFrame(layer.name, function(frame){
                   layer.__renderOnBuffer(frame); 
                });
            }         
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
        }
    };
    
    return Renderer;
});