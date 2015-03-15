"use strict";
var AnimatedCanvas = AnimatedCanvas || function (canvasDomID) {
    "use strict"
    var domElement = document.getElementById(canvasDomID);
    if(domElement === null){
        return null;   
    }
    this._canvasID = canvasDomID;
    this._domElement = domElement;
    this._context2D = domElement.getContext("2d");
}
AnimatedCanvas.prototype = {
    _objectList: [],
    _animatedQueue: [],
    _state: "stopped",
    add: function (id, obj) {
        if(typeof this._objectList[id] === "undefined") {
            this._objectList[id] = obj;
        }
        obj.setCanvas(this);       
    },
    getObjectById: function (id) {
        return this._objectList[id];
    },
    getObjectList: function (){
        return this._objectList;   
    },
    run: function () {
 
    },
    pause: function () {
        
    },
    setState: function (state) {
        this.state = state;   
    }
};

var AnimatedImage = AnimatedImage || function (id, imgURL, x, y) {
    "use strict";
    this._id = id;
    this._imgURL = imgURL;
    this._x = x;
    this._y = y;
};

AnimatedImage.prototype = {
    setCanvas: function (canvas) {
        this.canvas = canvas;
    },
    getId: function () {
        return this._id;
    }
};

var Animation = Animation || function (firstObject, secondObject, type, duration) {
    this.firstObject = firstObject;
    this.secondObject = secondObject;
    this.type = type;
    this.duration = duration;
};
//-----------------------------testing code

var ac = new AnimatedCanvas("myCanvas");
var anImg = new AnimatedImage("id", "img.jpg", (Math.random() * 1200), (Math.random() * 700));
ac.add(anImg.getId(), anImg);

var wk = new Worker("script/worker.js");
wk.postMessage(ac,[ac]);
var wk2 = new Worker("script/worker2.js");