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
        this.drawQoSLimit = 10;
        this.drawQoSMax = 10 * this.width * this.height >> 5;
        this.fps = 0;
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
            renderLayer.bufferCtx = bufferCanvas.getContext('2d');
            var bufferCanvas2 = renderLayer.bufferCanvas2;
            bufferCanvas2.width = this.width;
            bufferCanvas2.height = this.height;
            renderLayer.bufferCtx2 = bufferCanvas2.getContext('2d');
        },

        render: function (layers) {
            var now = new Date().getTime();
            var delta = now - this.lastDrawTime;
            this.lastDrawTime = now;
            if (this.fw.__configIsQoSEnable) {
                this.drawQoSLimit = Math.min(this.drawQoSMax, this.drawQoSLimit);
                if (delta > 1000 / 30) {
                    this.drawQoSLimit = Math.max(0, this.drawQoSLimit - 10000);
                } else if (delta < 1000 / 55) {
                    this.drawQoSLimit = this.drawQoSLimit + 50;
                }
            } else {
                this.drawQoSLimit = Number.POSITIVE_INFINITY;
            }
            this.renderOnCanvas(layers);
            this.renderOnBuffer(layers, this.drawQoSLimit);
            this.delta.push(delta);
            if (this.delta.length > 300) {
                //this.delta.shift();
            }
        },
        renderOnCanvas: function (layers) {
            var i = layers.length;
            while (i--) {
                layers[i].__render();
            }
            this.renderFrameCount();
        },
        renderOnBuffer: function (layers, drawQoSLimit) {
            var i = layers.length;
            while (i--) {
                layers[i].__renderOnBuffer(drawQoSLimit);
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
                ctx.clearRect(5, 5, 400, 35);
                ctx.beginPath();
                ctx.fillStyle = "#FF0000";
                ctx.font = "30px Arial";
                ctx.fillText("Avg FPS: " + this.fps + " " + Math.round(this.drawQoSLimit), 10, 30);
                ctx.closePath();
            }
        }
    };

    return Renderer;
});
