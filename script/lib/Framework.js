define([
        'lib/enums',
        'lib/Renderer',
        'class/Layer',
        'lib/AnimationManager'
    ], function(enums, Renderer, Layer, AnimationManager){
    "use strict";
    (function() {
        var lastTime = 0;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                       || window[vendors[x]+'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
    }());

    //constructor
    var Framework = Framework || function (canvasDomID, readyCall) {
        this.running = false;
        this.requestId = 0;
        this.renderer = new Renderer(canvasDomID);
        this.layers = [];
        this.animationManager = new AnimationManager();
        if(this.renderer === null){
            console.log("DOM Element not found");
            return undefined;    
        }       
        console.log("Framework Inited");
    };

    Framework.prototype = {
        createLayer: function(name, zIndex){
            var layer = new Layer(name, zIndex);
            this.layers.push(layer);
            this.renderer.initLayer(layer);
            this.animationManager.addLayer(name);
            return layer;
        },
        deleteLayer: function(name){
            var layer = this.getLayer(name);
            if(layer){
                var layers = this.layers;
                var index = layers.indexOf(layer);  
                layer.__delete();
                layers.splice(index, 1);
                this.animationManager.removeLayer(name);
                return true;
            }
            return false;
        },
        getLayer: function(name) {
            var layers = this.layers;
            var i = layers.length;
            while(i--){
                if(layers[i].name === name){
                    break;
                }
            }
            return layers[i];
        },
        start: function () { 
            if(!this.requestId){
                this.running = true;
                this.__ticking();
            }
        },
        pause: function () {
            if(this.requestId){
                this.running = false;
                window.cancelAnimationFrame(this.requestId);
                this.requestId = 0;
            }
        },
        __ticking: function(){
            var that = this;
            if(this.running){
                this.requestId = window.requestAnimationFrame(function(){
                    that.__ticking();
                });
                this.renderer.render(this.layers);
            }
        }
    };  
    return Framework;
});