define([
        'underscore',
        'lib/enums',
        'class/Model',
        'class/Layer',
        'lib/imgUtil',
        'lib/loopUtil',
        'lib/Renderer',
        'lib/Animator',
        'lib/Global',
    ], function(_, enums, AnimatedModel, Layer, ImgUtil, loopUtil, Renderer, Animator, Global){
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
    var Framework = Framework || function (canvasDomID) {
        this.running = false;
        this.requestId = 0;
        this.layers = [];
        this.renderer = new Renderer(canvasDomID, this.layers);
        this.animator = new Animator();
        Global.animator = this.animator;
        
         if(this.renderer === null){
            console.info("DOM Element not found");
            return null;    
        }       
    };

    Framework.prototype = {
        createLayer: function(name, zIndex) {
            var tempLayer = new Layer(name, zIndex);
            this.layers.push(tempLayer);
            this.renderer.initLayer(tempLayer);
            return tempLayer;
        },
        deleteLayer: function(name){
            var index = _.findIndex(this.layers, function(item){
                return item.name === name;    
            });
            var layer = this.layers[index];
            layer.delete();
            this.layers.splice(index, 1);
            this.renderer.deleteLayerCanvas(name);
        },
        getLayer: function(name) {
            var index = _.findIndex(this.layers, function(item){
                return item.name === name;    
            });
            return this.layers[index];            
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
                var renderer = this.renderer;
                var layers = this.layers;
                renderer.render(layers);
                renderer.renderOnBuffer(layers);
                this.animator.animate();
            }
        }
    };  
    return Framework;
});