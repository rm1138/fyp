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
var numThread = 1;//navigator.hardwareConcurrency || 4;

var wkArray = [];

source.onload = function () {

    var canvas = document.getElementById("myCanvas");
	canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var slicedWidth = canvas.width / numThread;
    var slicedHeight = canvas.height; 
    var tempContext = canvas.getContext("2d");
    var canvasData = [];
    var looper = [];
	var cycle = 0;
	var render = function (e) {
		var arr = new Uint8ClampedArray(e.data.data);
		var index = e.data.index;
		canvasData = tempContext.createImageData(slicedWidth, slicedHeight);
		canvasData.data.set(arr);
		tempContext.putImageData(canvasData, index*slicedWidth, 0);
	};
    for(var i=0; i<numThread; i++){
        var worker = new Worker("script/worker.js");
        worker.onmessage = render; 
		wkArray.push(worker);
    }
    
    for(var i=0; i<numThread; i++){
        setInterval(function(j){
            canvasData[j] = tempContext.getImageData(0, i*slicedWidth, slicedWidth, slicedHeight);

            var package = {
                index: j,   
                width: slicedWidth,
                height: slicedHeight,
                data: canvasData[j].data.buffer
            };
            //if(package.data.byteLength > 0){
                wkArray[j].postMessage(package, [package.data]);
            //}
        }, 1000/30, i);         
    }

}