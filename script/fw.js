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
    this.domElement.width = window.innerWidth;
    this.domElement.height = window.innerHeight;
    this.context = domElement.getContext("2d");

    
    //Create a buffer canves for pre-render
    this.__bufferCanvas = document.createElement('canvas');
    this.__bufferCanvas.width = this.domElement.width;
    this.__bufferCanvas.height = this.domElement.height;
    this.__bufferContext = this.__bufferCanvas.getContext("2d");
    
    this.layers = [];
    this.imges = {};
    
    this.running = false;
    this.lastPaintTime = new Date().getTime();
    
    this.__frameCount = 0;
    this.__requestId = 0;
    
    if(window.Worker){
        this.__numOfThread = 1;//navigator.hardwareConcurrency || 4;
        this.__workers = [];
        for(var i=0; i< this.__numOfThread; i+=1){
            var worker = new Worker("script/worker.js");
            worker.onmessage = function(e){
                e = JSON.parse(e.data);
                _this.layers[e.layer].objects = e.objects;
                _this.layers[e.layer].drawing = false;
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
    debug: false,
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
    setState: function (state) {
        this.state = state;   
    },
    __draw: function(){
        var that = this;
        if(this.running){
            this.__requestId = window.requestAnimationFrame(function(){
                that.__draw();
            });
            //render the buffer to the canvas
            this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
            this.context.drawImage(this.__bufferCanvas, 0, 0);
            
            
            // Drawing code goes here... for example updating an 'x' position:
            //render from bottom layer to top layer
            var delta = new Date().getTime() - this.lastPaintTime;
            this.lastPaintTime = new Date().getTime();
            
            this.__calculateMovment(delta);
            
            this.__renderOnBuffer();
            //debug
            if(this.debug)
                this.renderFrameCount();
        }
    },
    __renderOnBuffer: function(){
        this.__bufferContext.clearRect(0, 0, this.domElement.width, this.domElement.height);
        
        var layerCount = this.layers.length;
        for(var i = 0; i<layerCount; i += 1){
            var layer = this.layers[i];
            var objectCount = this.layers[i].objects.length;
             
            for(var j = 0; j<objectCount; j+=1){
                var object = layer.objects[j];
                var img = this.imges[object.name];
                this.__bufferContext.drawImage(img, object.x - img.width/2, object.y - img.height/2);
            }
        }
    },
    __calculateMovment: function(delta){
        var layerCount = this.layers.length;
        for(var i = 0; i<layerCount; i += 1){
            if(!this.layers[i].drawing){
                var data = {
                    layer: i,
                    delta: delta,
                    objects: this.layers[i].objects
                }
                this.__workers[i % this.__numOfThread].postMessage(JSON.stringify(data));
                this.layers[i].drawing = true;
            }
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
    newLayer: function(name) {
        var newLayer = new Layer(name, this)
        this.layers.push(newLayer);
        return newLayer;
    }
};

var Layer = Layer || function (name, canvas){
    this.name = name;
    this.objects = [];
    this.canvas = canvas;
    this.drawing = false;
}

Layer.prototype = {
    addObject: function(obj){
        if(obj.url){
            //pre load image
            var img = new Image();
            img.src = obj.url;
            this.canvas.imges[obj.name] = img;
            obj.type = Enums.ObjectType.Image;
        }
        var animateObj = new AnimateObject(obj);
        this.objects.push(animateObj);
        return animateObj;
    }
};

var AnimateObject = AnimateObject || function(obj){
    for(var prop in obj){
        this[prop] = obj[prop];    
    }
    console.log(this);
}

AnimateObject.prototype = {
    animate: function(obj){
        this.toX = obj.x;
        this.toY = obj.y;
        this.originX = this.x;
        this.originY = this.y;
        this.duration = obj.duration;
        this.remain = obj.duration;
        console.log(this);
    }
}

var Enums = {
    ObjectType:{
        Image:0
    }
}