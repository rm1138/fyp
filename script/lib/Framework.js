define([
        'lib/enums',
        'lib/Renderer',
        'class/Layer',
        'lib/AnimationManager',
        'lib/Util'
    ], function (enums, Renderer, Layer, AnimationManager, Util) {
    "use strict";
    (function () {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());

    //constructor
    var Framework = Framework || function (canvasDomID, readyCall) {
        this.running = false;
        this.requestId = 0;
        this.renderer = new Renderer(canvasDomID, this);
        this.layers = [];
        this.animationManager = new AnimationManager(this);
        if (this.renderer === null) {
            console.log("DOM Element not found");
            return undefined;
        }
        this.__configShowRedrawArea = false;
        this.animationProcessTime = 0;
        this.performance = this.__runBrowserRenderTest(canvasDomID);
    };

    Framework.prototype = {
        __runBrowserRenderTest: function (canvasDomID) {
            var dom = document.getElementById(canvasDomID);
            var testCanvas = document.createElement('canvas');
            testCanvas.width = dom.width;
            testCanvas.height = dom.height;
            var ctx = testCanvas.getContext('2d');
            var imgs = Util.getRandomImage(100, 100);
            var count = 0;
            var start = new Date().getTime();
            var now;
            do {
                ctx.drawImage(imgs, Math.random() * testCanvas.width, Math.random() * testCanvas.height);
                now = new Date().getTime();
                count += 1;
            } while ((now - start) < 1000 / 60);
            return count / 4;
        },
        createLayer: function (name, zIndex) {
            var layer = new Layer(name, zIndex, this);
            this.layers.push(layer);
            this.renderer.initLayer(layer);
            return layer;
        },
        deleteLayer: function (name) {
            var layer = this.getLayer(name);
            if (layer) {
                var layers = this.layers;
                var index = layers.indexOf(layer);
                layer.__delete();
                layers.splice(index, 1);
                return true;
            }
            return false;
        },
        getLayer: function (name) {
            var layers = this.layers;
            var i = layers.length;
            while (i--) {
                if (layers[i].name === name) {
                    break;
                }
            }
            return layers[i];
        },
        start: function () {
            if (!this.requestId) {
                this.running = true;
                this.__ticking();
            }
        },
        pause: function () {
            if (this.requestId) {
                this.running = false;
                window.cancelAnimationFrame(this.requestId);
                this.requestId = 0;
            }
        },
        __ticking: function () {
            var that = this,
                layers = this.layers;
            if (this.running) {
                this.requestId = window.requestAnimationFrame(function () {
                    that.__ticking();
                });
                this.renderer.render(layers);
                var now = new Date().getTime();
                this.animationManager.processAnimation();
                this.animationManager.processAnimation();
                if (now - this.animationProcessTime > 50) {

                    this.animationProcessTime = now;
                }
            }
        },
        getAnimationManager: function () {
            return this.animationManager;
        },
        getRenderer: function () {
            return this.renderer;
        }
    };
    return Framework;
});
