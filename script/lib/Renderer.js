define([], function(){
    
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
        
        this.canvasList = {};
        this.bufferList = {};
        this.isLayerDirty = {};
//        this.bufferCanvas = document.createElement("canvas");
//        this.bufferCanvas.width = this.width;
//        this.bufferCanvas.height = this.height;
//        this.bufferCtx = this.bufferCanvas.getContext("2d");
        this.lastDrawTime = new Date().getTime();
        this.delta = 0;
        var that = this;
        setTimeout(function(){
                that.renderFrameCount();
        }, 1000);
    };
    
    Renderer.prototype = {
        //render the Layer on the buffer
        renderOnBuffer: function(layer) {
            if(layer.readyToRender){
                var name = layer.name;
                var renderModels = layer.getZIndexModelMapping();
                var count = renderModels.length - 1;
                var ctx = this.bufferList[name].ctx;
                var model;
                ctx.clearRect(0, 0, this.width, this.height);  
                while(model = renderModels[count]){
                    ctx.drawImage(
                        model.img,
                        model.x, 
                        model.y
                    );
                    count--;
                }
                layer.readyToRender = false;
                this.isLayerDirty[name] = true;
                console.log("Render on buffer Layer: " + layer.name); 
            }
        },
        //render the buffer canvas to the main canvas.context
        render: function(){
            var now = new Date().getTime();
            var delta = now - this.lastDrawTime;
            this.lastDrawTime = now;
            
            var canvasList = this.canvasList;
            var bufferList = this.bufferList;
            var isLayerDirty = this.isLayerDirty;
            
            var layerNames = Object.keys(canvasList);
            var index = layerNames.length -1;
            var width = this.width;
            var height = this.height;
            
            while(index !== -1){
                var name = layerNames[index];
                if(isLayerDirty[name]){
                    var ctx = canvasList[name].ctx;
                    var bufferCtx = bufferList[name].ctx;
                    var bufferCanvas = bufferList[name].canvas;                  
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(bufferCanvas, 0, 0);         
                    isLayerDirty[name] = false;
                    console.log("Render on Layer: " + name);
                }
                index--;
            }
            this.delta = delta;
        },
        renderFrameCount: function(){
            var delta = this.delta;
            if(Math.random() > 0.9){    
                this.fps = Math.floor(1000/delta);
            }
            if(this.fps){
                var layerNames = Object.keys(this.canvasList);
                var ctx = this.canvasList[layerNames[layerNames.length - 1]].ctx;
                
                ctx.clearRect(5, 5, 120, 30);
                ctx.beginPath();
                ctx.fillStyle = "#FF0000";
                ctx.font = "30px Arial";
                ctx.fillText("FPS: " + this.fps,  10, 30);
                ctx.closePath();
            }
            var that = this;
            setTimeout(function(){
                that.renderFrameCount();
            }, 1000);
        },
        addLayerCanvas: function(name){
            var tempCanvas = document.createElement("canvas");
            tempCanvas.id = name;
            tempCanvas.width = this.width;
            tempCanvas.height = this.height;
            tempCanvas.style.position = "absolute";
            tempCanvas.style.left = "0px";
            tempCanvas.style.top = "0px";
            
            this.canvasList[name] = {
                canvas: tempCanvas,
                ctx: tempCanvas.getContext('2d')
            }
            this.container.appendChild(tempCanvas);
            
            var bufferCanvas = document.createElement("canvas");
            bufferCanvas.width = this.width;
            bufferCanvas.height = this.height;
            this.bufferList[name] = {
                canvas: bufferCanvas,
                ctx: bufferCanvas.getContext('2d')
            }
            this.isLayerDirty[name] = false;
        }
    };
    
    return Renderer;
});