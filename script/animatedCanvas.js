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

AnimatedCanvas.prototype.add = function (obj) {
    "use strict";
    this.objList.push(obj);
    obj.setCanvas(this);
};
//-----------------------------testing code

var ac = new AnimatedCanvas("id");

var id = 0;
var x = 0;
var y = 0;
var aniObj = new AnimatedObject(id, "img.jpg", x, y);
ac.add(aniObj);
