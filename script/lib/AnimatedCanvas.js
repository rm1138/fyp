define([
        'underscore',
        'lib/enums',
        'class/Model',
        'class/Layer',
        'lib/imgUtil',
        'lib/loopUtil',
        'lib/Renderer',
        'lib/Global',
    ], function(_, enums, AnimatedModel, Layer, ImgUtil, loopUtil, Renderer, Global){
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
    var AnimatedCanvas = AnimatedCanvas || function (canvasDomID) {
        this.renderer = new Renderer(canvasDomID);
        if(this.renderer === null){
            console.info("DOM Element not found");
            return null;    
        }
        
        this.debug  = Global.debug;
        this.running = false;
        this.requestId = 0;
        
        this.layers = [];
        
        //worker support
        this.supportWorker = false;
        if(window.Worker){
            this.numOfThread = navigator.hardwareConcurrency || 4;
            this.workers = [];
            this.initWorker();
            this.supportWorker = true;
        }
    };

    AnimatedCanvas.prototype = {
        createLayer: function(name, index) {
            var tempLayer = {
                name: name,
                layer: new Layer(name)
            };
            this.layers.push(tempLayer);
            this.renderer.addLayerCanvas(name);
            return tempLayer.layer;
        },
        deleteLayer: function(name){
            console.log(_);
            var removeId = _.findIndex(this.layers, function(item){
                return item.name === name;    
            });
            console.log(this.layers[removeId]);
            this.layers.remove(removeId);
        },
        start: function () {
            if(!this.requestId){
                this.running = true;
                this.lastPaintTime = new Date().getTime();
                if(this.supportWorker){
                    this.draw();
                }else{
                    this.drawFallBack();
                }
            }
        },
        pause: function () {
            if(this.requestId){
                this.running = false;
                window.cancelAnimationFrame(this.requestId);
                this.requestId = 0;
            }
        },
        draw: function(){
            var that = this;
            if(this.running){
                this.requestId = window.requestAnimationFrame(function(){
                    that.draw();
                });
                var renderer = this.renderer;
                renderer.render();
                
                
                var layers = this.layers;
                var count = layers.length-1;

                while(Global.modelCount === Global.readyModelCount && count !== -1){
                    renderer.renderOnBuffer(layers[count].layer);        
                    count -= 1;
                };
//                
//                var animationFunction = function (str) {
//                    return str + "abcc";
//                };
//
//                var b = new Blob([
//                    "functionContainer.myFunct = " + animationFunction.toString()
//                ], { type: 'application/javascript' });
//                this.workers[0].postMessage({
//                        command: enums.command.test,
//                        payload: b
//                });
            }
        },
        drawFallBack: function(){
            var that = this;
            if(this.running){
                this.requestId = window.requestAnimationFrame(function(){
                    that.drawFallBack();
                });
            }
            /*
                To Be Implement for browser with no web worker support.
            */
        },
        onWorkerReturn: function(e){
            var command = e.data.command;
            var _this = this;
            if(command === enums.command.updateObject){
                var objects = e.data.objects;
                for(var name in _this.objects){
                    _this.objects[name].update(objects[name]);
                }
            } else if(command === enums.command.ready) {
                var payload = {};
                e.currentTarget.postMessage({
                    command: enums.command.init,
                    payload: payload
                }); 
            }
        },
        initWorker: function(){
            var _this = this;
            for(var i=0; i< this.numOfThread; i+=1){
                var worker = new Worker("script/lib/worker.js");
                worker.onmessage = function(e){
                    _this.onWorkerReturn(e);
                }
                this.workers.push(worker);
            }
        }
    };  
    return AnimatedCanvas;
});