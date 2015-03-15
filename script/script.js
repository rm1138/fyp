var AnimatedCanvas = function (canvasDomID) {
    "use strict";
    this.canvasID = canvasDomID;
    this.objList = [];
};

var AnimatedObject = function (id, imgURL, x, y) {
    "use strict";
    this.id = id;
    this.imgURL = imgURL;
    this.x = x;
    this.y = y;
};

AnimatedObject.prototype.setCanvas = function (canvas) {
    "use strict";
    this.canvas = canvas;
};

AnimatedObject.prototype.getId = function () {
	"use strict";
	return this.id;
};

AnimatedCanvas.prototype.getObjectList = function () {
	"use strict";
	return this.objList;
};

AnimatedCanvas.prototype.getObjectById = function (id){
	return this.objList[id];
};

AnimatedCanvas.prototype.add = function (obj) {
    "use strict";
	var id = obj.getId();
	if(typeof this.objList[id] === "undefined") {
		this.objList[id] = obj;
    }
	obj.setCanvas(this);
};
//-----------------------------testing code

var ac = new AnimatedCanvas("myCanvas");
var aniObj = new AnimatedObject("id", "img.jpg", 10, 20);
ac.add(aniObj);
