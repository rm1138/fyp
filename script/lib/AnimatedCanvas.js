define([
        'lib/enums',
        'lib/AnimatedObject'
    ], function(enums, AnimatedObject){

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
        var domElement = document.getElementById(canvasDomID);
        if(domElement === null){
            return null;   
        }
        var _this = this;
        this.canvasID = canvasDomID;
        this.domElement = domElement;
        this.canvasWidth = window.innerWidth;
        this.canvasHight = window.innerHeight;
        this.domElement.width = this.canvasWidth;
        this.domElement.height = this.canvasHight;
        this.context = domElement.getContext("2d");


        //Create a buffer canves for pre-render
        this.__bufferCanvas = document.createElement('canvas');
        this.__bufferCanvas.width = this.canvasWidth;
        this.__bufferCanvas.height = this.canvasHight;
        this.__bufferContext = this.__bufferCanvas.getContext("2d");


        //objects list and images list
        this.objects = {};
        this.images = {};


        //running statue
        this.running = false;
        this.lastPaintTime = new Date().getTime();


        //
        this.__frameCount = 0;
        this.__requestId = 0;

        if(window.Worker){
            this.__numOfThread = 4;//navigator.hardwareConcurrency || 4;
            this.__workers = [];
            for(var i=0; i< this.__numOfThread; i+=1){
                var worker = new Worker("script/lib/worker.js");
                worker.onmessage = function(e){
                    e = JSON.parse(e.data);
                    if(_this.objects[e.objID].drawing){
                        _this.objects[e.objID].update(e.object);
                        _this.objects[e.objID].drawing = false;
                    }
                }
                this.__workers.push(worker);
            }
            this.__supportWorker = true;
        }else{
            this.__supportWorker = false;
        }
    }

    //methods and body
    /*
    Layer - contains objects (top layer overlaps bottom layers)
    Object - URL, type, style, coordinate, state, ...
    */
    AnimatedCanvas.prototype = {
        createObject: function(obj){
            this.objects[obj.name] = new AnimatedObject(obj);
            if(obj.url){
                //pre load image
                var img = new Image();
                img.src = obj.url;
                this.images[obj.name] = img;
            }
            return this.objects[obj.name];
        },
        debug: true,
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
                this.context.clearRect(0, 0, this.canvasWidth, this.canvasHight);
                this.context.drawImage(this.__bufferCanvas, 0, 0);


                var now = new Date().getTime();
                var delta = now - this.lastPaintTime;
                this.lastPaintTime = now;

                this.__calculateMovment(delta);
                this.__renderOnBuffer();

                //debug
                if(this.debug)
                    this.renderFrameCount();
            }
        },
        __renderOnBuffer: function(){
            //clear buffer canvas
            this.__bufferContext.clearRect(0, 0, this.canvasWidth, this.canvasHight);

            var objects = this.objects;
            for(var name in objects){
                if(objects.hasOwnProperty(name)){
                    var object = objects[name];
                    this.__bufferContext.drawImage(this.images[name], object.x, object.y);
                }
            }
        },
        __calculateMovment: function(delta){
            var count = 0;
            var objects = this.objects;
            for(var name in objects){
                if(objects.hasOwnProperty(name)){
                    var object = objects[name];
                    if(!object.drawing && object.remain>0){
                        var data = {
                            command: "draw",
                            objID: name,
                            delta: delta,
                            object: object
                        }
                        this.__workers[count % this.__numOfThread].postMessage(JSON.stringify(data));
                        this.objects[name].drawing = true;
                    }
                }
                count+=1;
            }
        },
        renderFrameCount: function(){
            this.__bufferContext.clearRect(5, 5, 80, 30);
            this.__bufferContext.beginPath();
            this.__bufferContext.fillStyle = "#FF0000";
            this.__bufferContext.font = "30px Arial";
            this.__bufferContext.fillText(this.__frameCount++,  10, 30);
            this.__bufferContext.closePath();
        },
        isRunning: function(){
            return this.running;   
        },
        commit: function(){

        }
    };
    
    return AnimatedCanvas;
});