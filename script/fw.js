"use strict";
var AnimatedCanvas = AnimatedCanvas || function (canvasDomID) {
    var domElement = document.getElementById(canvasDomID);
    if(domElement === null){
        return null;   
    }
    this.canvasID = canvasDomID;
    this.domElement = domElement;
    this.context2D = domElement.getContext("2d");
}

AnimatedCanvas.prototype = {
    objectList: [],
    animatedQueue: [],
    state: "stopped",
    add: function (id, obj) {
        if(typeof this.objectList[id] === "undefined") {
            this. objectList[id] = obj;
        }
        obj.setCanvas(this);       
    },
    getObjectById: function (id) {
        return this.objectList[id];
    },
    getObjectList: function (){
        return this.objectList;   
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
    this.id = id;
    this.imgURL = imgURL;
    this.x = x;
    this.y = y;
};

var Animation = Animation || function (firstObject, secondObject, type, duration) {
    this.firstObject = firstObject;
    this.secondObject = secondObject;
    this.type = type;
    this.duration = duration;
};