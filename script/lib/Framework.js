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
    var Framework = function (canvasDomID, readyCall) {
        this.running = false;
        this.requestId = 0;
        this.renderer = new Renderer(canvasDomID, this);
        this.layers = [];
        //this.animationManager = new AnimationManager(this);
        if (this.renderer === null) {
            console.log("DOM Element not found");
            return undefined;
        }
        this.__configShowRedrawArea = false;
        this.__configRenderDeadline = 1000 / 40;
        this.__configIsUseSpatialHashing = true;
        this.__configIsQoSEnable = true;
        this.animationProcessTime = 0;
        this.util = Util;
    };

    Framework.prototype = {
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
                //                var now = new Date().getTime();
                //                if (now - this.animationProcessTime > 200) {
                //                    this.animationManager.processAnimation();
                //                    this.animationProcessTime = now;
                //                }
            }
        }
    };
    return Framework;
});
