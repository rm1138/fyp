"use strict";

//(function() {
//    var lastTime = 0;
//    var vendors = ['ms', 'moz', 'webkit', 'o'];
//    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
//        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
//                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
//    }
// 
//    if (!window.requestAnimationFrame)
//        window.requestAnimationFrame = function(callback, element) {
//            var currTime = new Date().getTime();
//            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
//              timeToCall);
//            lastTime = currTime + timeToCall;
//            return id;
//        };
// 
//    if (!window.cancelAnimationFrame)
//        window.cancelAnimationFrame = function(id) {
//            clearTimeout(id);
//        };
//}());

//constructor
var AnimatedCanvas = AnimatedCanvas || function (canvasDomID) {
    var domElement = document.getElementById(canvasDomID);
    if(domElement === null){
        return null;   
    }
    
    this.canvasID = canvasDomID;
    this.domElement = domElement;
    this.domElement.width = window.innerWidth;
    this.domElement.height = window.innerHeight;
    this.context2D = domElement.getContext("2d");
    this.layers = [];
    this.timelines = [];
    this.running = false;
    this.lastPaintTime = new Date().getTime();
    this.__frameCount = 0;
    this.__requestId = 0;
    this.__numOfThread = 4;
}

//methods and body
/*
Layer - contains objects (top layer overlaps bottom layers)
Timeline - contains events (The running order)
    1 thread handle 1 time line

Object - URL, type, style, coordinate, state, ...
Event - Involved object ID, Animation, type, duration, empty event
*/
AnimatedCanvas.prototype = {
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
            // Drawing code goes here... for example updating an 'x' position:
            //render from bottom layer to top layer
            var delta = new Date().getTime() - this.lastPaintTime;
            this.lastPaintTime = new Date().getTime();
            this.context2D.clearRect(0, 0, this.domElement.width, this.domElement.height);
            this.context2D.font = "30px Arial";
            this.context2D.fillText(delta,  Math.random()*this.domElement.width, Math.random()*this.domElement.height);
        }
    },
    isRunning: function(){
        return this.running;   
    },
    newTimeline: function() {
        var newTimeline = {
            name: "",
            events: []
        };
        this.timelines.push(newTimeline);
        return newTimeline;
    },
    newLayer: function() {
        var newLayer = {
            name: "",
            objects: []
        };
        this.layers.push(newLayer);
        return newLayer;
    }
};