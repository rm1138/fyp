//head-start------------
var wk = new Worker("script/worker.js");
//head-end--------------
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


var source = document.getElementById("img");
source.src = "img/bg.jpg"
source.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var tempContext = canvas.getContext("2d");
    var canvasData = tempContext.createImageData(canvas.width, canvas.height);
       // console.log(canvasData.data);
    var buf;
    setInterval(function(){
        buf = canvasData.data.buffer;
        if(buf.byteLength > 0)
            wk.postMessage(buf, [buf]);
    }, 1000/30);
    wk.onmessage = function (e) {
        var arr = new Uint8ClampedArray(e.data);
        canvasData = tempContext.createImageData(canvas.width, canvas.height);
        canvasData.data.set(arr);
        tempContext.putImageData(canvasData, 0, 0);
    }
    //tempContext.clearRect(0, 0, canvas.width, canvas.height);
}