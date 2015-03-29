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
    var ctx = canvas.getContext("2d");
    
    var tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    var tempCtx = tempCanvas.getContext("2d");
    
    var slicedWidth = canvas.width / numThread;
    var slicedHeight = canvas.height; 
    var threadRendered = [];
	var render = function (e) {
		var arr = new Uint8ClampedArray(e.data.data);
		var index = e.data.index;
        var temp = tempCtx.createImageData(slicedWidth, slicedHeight);
		temp.data.set(arr);
		tempCtx.putImageData(temp, index*slicedWidth, 0);
        threadRendered[index] = true;
        if(threadRendered.indexOf(true) != -1 ){
            var temp = tempCtx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.putImageData(temp, 0, 0);
        }
	};
    
    
    for(var i=0; i<numThread; i++){
        var worker = new Worker("script/worker.js");
        worker.onmessage = render; 
		wkArray.push(worker);
        threadRendered[i] = true;
    }
    
    for(var i=0; i<numThread; i++){
        setInterval(function(j){
            if(threadRendered[j]){
                var temp = ctx.getImageData(i*slicedWidth, 0, slicedWidth, slicedHeight);
                var pack = {
                    index: j,   
                    width: slicedWidth,
                    height: slicedHeight,
                    data: temp.data.buffer
                };
                wkArray[j].postMessage(temp, [temp]);
            }
            threadRendered[j] = false;
        }, 1000, i);         
    }

}

var updatePixelColor = function (canvas, x, y, r, g, b, a) {
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.width);
    
    var arr = new Uint32Array(imageData.data.buffer);
    arr[y * canvas.width + x] = 
        (a << 24) |
        (b << 16) |
        (g << 8) |
        (r);
    var tempArr = new Uint8ClampedArray(arr.buffer);
    imageData.data.set(tempArr);
    ctx.putImageData(imageData, 0, 0);
}