/*
    Interact with DOM Canvas and Buffer Canvas
    Response for rendering 
*/
define([
        'lib/enums'
    ], function (enums) {

    //Renderer, the only connecton to the DOM Canvas Element
    var Renderer = Renderer || function (canvasDomID, fw) {
        this.container = document.getElementById(canvasDomID);
        this.container.style.position = "relative";
        if (this.container === null) {
            console.info("DOM Element not found");
            return null;
        }
        this.fw = fw;
        this.width = this.container.width;
        this.height = this.container.height;

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
        this.lastDrawTime = new Date().getTime();
        this.delta = [];
        this.drawQosLimit = 10;
        this.fps = 60;
        this.renderedModelCount = 0;
    };

    Renderer.prototype = {
        initLayer: function (renderLayer) {
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

        render: function (layers) {

            var now = new Date().getTime();
            var delta = now - this.lastDrawTime;
            this.lastDrawTime = now;
            if (delta > 1000 / 30) {
                this.drawQosLimit = Math.max(0, this.drawQosLimit - 0.05);
            } else if (delta < 1000 / 45) {
                this.drawQosLimit = Math.min(10, this.drawQosLimit + 0.05);
            }
            this.renderOnCanvas(layers);
            this.renderOnBuffer(layers, this.drawQosLimit);
            this.delta.push(delta);
            if (this.delta.length > 30) {
                this.delta.shift();
            }
        },
        renderOnCanvas: function (layers) {
            var i = layers.length;
            while (i--) {
                layers[i].__render();
            }
            this.renderFrameCount();
        },
        renderOnBuffer: function (layers, drawQosLimit) {
            var i = layers.length;
            while (i--) {
                layers[i].__renderOnBuffer(drawQosLimit);
            }
        },
        renderFrameCount: function () {
            var average,
                sum = 0,
                deltaArr = this.delta,
                i = deltaArr.length;
            while (i--) {
                sum += deltaArr[i];
            }
            if (sum > 0) {
                average = sum / deltaArr.length;
                this.fps = Math.floor(1000 / average);
                var ctx = this.fpsCtx;
                ctx.clearRect(5, 5, 800, 35);
                ctx.beginPath();
                ctx.fillStyle = "#FF0000";
                ctx.font = "30px Arial";
                ctx.fillText("Avg FPS: " + this.fps + " QoS Level: " + Math.round(this.drawQosLimit) + " Rendered Models " + this.renderedModelCount, 10, 30);
                ctx.closePath();
            }
        }
    };

    return Renderer;
});
