define([
        'lib/enums',
        'lib/AnimateModel',
        'lib/model/ModelLayer',
        'lib/imgUtil',
        'lib/loopUtil'
    ], function(enums, AnimateModel, ModelLayer, ImgUtil, loopUtil){

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
    var AnimatedCanvas = AnimatedCanvas || function (canvasDomID, devMode) {
        var domElement = document.getElementById(canvasDomID);
        if(domElement === null){
            console.info("DOM Element not found");
            return null;   
        }
        
        var _this = this;
        this.canvasID = canvasDomID;
        this.domElement = domElement;
        
        this.__debug  = devMode;
        if(this.__debug){
            this.canvasWidth = window.innerWidth;
            this.canvasHight = window.innerHeight;
            this.domElement.width = this.canvasWidth;
            this.domElement.height = this.canvasHight;
        }

        this.context = domElement.getContext("2d");

        //Create a buffer canves for pre-render
        this.__bufferCanvas = document.createElement('canvas');
        this.__bufferCanvas.width = this.canvasWidth;
        this.__bufferCanvas.height = this.canvasHight;
        this.__bufferContext = this.__bufferCanvas.getContext("2d");

        //models list
        this.models = new ModelLayer();

        //running statue
        this.running = false;
        this.lastPaintTime = new Date().getTime();

        //debug
        this.__frameCount = 0;
        this.__requestId = 0;

        //worker support
        this.__supportWorker = false;
        if(window.Worker){
            this.__numOfThread = 1;//navigator.hardwareConcurrency || 4;
            this.__workers = [];
            this.initWorker();
            this.__supportWorker = true;
        }
    }
/*
    Layer - contains objects (top layer overlaps bottom layers)
    Object - URL, type, style, coordinate, state, ...
    */
    AnimatedCanvas.prototype = {
        addModel: function(obj){
            var _this = this;
           
            
            if(obj.url){
                //pre load image
                var img = new Image();
                img.src = obj.url;
                obj.type = enums.ObjectType.Image;
                
            }
            var temp  = new AnimateModel(obj);
            _this.models.add(temp);
            return tempObject;
        },
        run: function () {
            if(!this.requestId){
                this.running = true;
                this.lastPaintTime = new Date().getTime();
                this.__draw();
            }
        },
        pause: function () {
            if(this.__requestId){
                this.running = false;
                window.cancelAnimationFrame(this.__requestId);
                this.__requestId = 0;
            }
        },
        __draw: function(){
            var that = this;
            if(this.running){

                this.__requestId = window.requestAnimationFrame(function(){
                    that.__draw();
                });

                //render the buffer to the canvas
                //this.__bufferContext.imageSmoothingEnabled = false;
                if(this.__bufferImagerData){
                    //console.log(this.__bufferImagerData);
                    this.__bufferContext.putImageData(this.__bufferImagerData, 0, 0);
                    //this.pause();
                }
                if(this.__debug){
                    var delta = new Date().getTime() - this.lastPaintTime;
                    this.renderFrameCount(delta);
                
                }
                this.context.clearRect(0, 0, this.canvasWidth, this.canvasHight);
                this.context.drawImage(this.__bufferCanvas, 0, 0);
                this.__frameCount += 1;

                var now = new Date().getTime();
                var delta = now - this.lastPaintTime;
                this.lastPaintTime = now;

                //this.__calculateMovment(delta);
                this.__renderOnBuffer();


            }
        },
        __renderOnBuffer: function(){
            this.lastPaintTime = new Date().getTime();
            //clear buffer canvas
            this.__bufferContext.clearRect(0, 0, this.canvasWidth, this.canvasHight);
            var objects = this.objects;
            
            loopUtil.fastLoop(objects, function(object){
                var name = item.name;
                this.__bufferContext.drawImage(
                    this.images[name],
                    object.x - this.images[name].width,
                    object.y - this.images[name].height
                )
            });

        },
        __calculateMovment: function(delta){
            
//            for(var i=0; i<this.__numOfThread; i+=1){
//                var payload = {
//                    delta: delta,
//                    objects: this.objects
//                }
//                this.__workers[i].postMessage({command: "draw", payload: payload});
//            }
        },
        renderFrameCount: function(delta){
            if(Math.random() > 0.9){    
                this.fps = Math.floor(1000/delta);
            }
            this.__bufferContext.clearRect(5, 5, 120, 30);
            this.__bufferContext.beginPath();
            this.__bufferContext.fillStyle = "#FF0000";
            this.__bufferContext.font = "30px Arial";
            this.__bufferContext.fillText("FPS: " + this.fps,  10, 30);
            this.__bufferContext.closePath();
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
            for(var i=0; i< this.__numOfThread; i+=1){
                var worker = new Worker("script/lib/worker.js");
                worker.onmessage = function(e){
                    _this.onWorkerReturn(e);
                }
                this.__workers.push(worker);
            }
        },
        model: function(name) {
            return this.models.getByName(name);                
        }
    };
    
    return AnimatedCanvas;
});