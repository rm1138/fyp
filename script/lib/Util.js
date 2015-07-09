/*
 * Easing Function, Credit by Gaëtan Renaudeau
 * Retreved from https://gist.github.com/gre/1650294
 * only considering the t value for the range [0, 1] => [0, 1]
 */

define(['class/Box'], function (Box) {
    var Util = {};

    Util.ANIMATION_PROP_ARR = ['x', 'y', 'scaleX', 'scaleY', 'orientation', 'opacity'];
    Util.step = 1000 / 60;
    Util.easingArr = [
        "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint"
    ];
    Util.EasingFunctions = {
        // no easing, no acceleration
        linear: function (t) {
            return t
        },
        // accelerating from zero velocity
        easeInQuad: function (t) {
            return t * t
        },
        // decelerating to zero velocity
        easeOutQuad: function (t) {
            return t * (2 - t)
        },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) {
            return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        },
        // accelerating from zero velocity 
        easeInCubic: function (t) {
            return t * t * t
        },
        // decelerating to zero velocity 
        easeOutCubic: function (t) {
            return (--t) * t * t + 1
        },
        // acceleration until halfway, then deceleration 
        easeInOutCubic: function (t) {
            return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
        },
        // accelerating from zero velocity 
        easeInQuart: function (t) {
            return t * t * t * t
        },
        // decelerating to zero velocity 
        easeOutQuart: function (t) {
            return 1 - (--t) * t * t * t
        },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) {
            return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
        },
        // accelerating from zero velocity
        easeInQuint: function (t) {
            return t * t * t * t * t
        },
        // decelerating to zero velocity
        easeOutQuint: function (t) {
            return 1 + (--t) * t * t * t * t
        },
        // acceleration until halfway, then deceleration 
        easeInOutQuint: function (t) {
            return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
        }
    }

    Util.processAnimation = function (animation, progress, result, ptr) {
        var from = animation.from;
        var to = animation.to;
        var easing = Util.EasingFunctions[animation.easing];
        var keys = Util.ANIMATION_PROP_ARR;
        var i = keys.length;

        while (i--) {
            var key = keys[i];
            if (from[key] !== to[key]) {
                result[ptr.val++] = Util.valueProjection(from[key], to[key], progress, easing);
            } else {
                result[ptr.val++] = (from[key]);
            }
        }
    };

    Util.valueProjection = function (from, to, progress, easing) {
        if (typeof easing === "function") {
            progress = easing(progress);
        }
        return from * (1 - progress) + to * progress;
    };

    Util.processAnimations = function (animations, step) {
        var totalFrames = 0;
        for (var i = 2, count = animations.length; i < count; i += 3) {
            totalFrames += Math.ceil(animations[i] / step);
        }
        var result = new Float32Array(totalFrames);

        var ptr = 0;
        for (var i = 0, count = animations.length; i < count;) {
            var delta = animations[i++];
            var easingIdx = animations[i++];
            var duration = animations[i++];
            var frameCount = Math.ceil(duration / step);
            var easing = Util.easingArr[easingIdx];
            var start = 0;

            var index = 0;
            while (index < frameCount) {
                result[ptr++] = Util.valueProjection(0, delta, start / duration, easing);
                start += step;
                index++;
            }
            if (index !== Math.ceil(duration / step)) {
                debugger;
            }
        }

        return result;
    };


    Util.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    Util.degrees = function (radians) {
        return radians * 180 / Math.PI;
    };

    Util.genRandomId = function () {
        return Math.random().toString(36).substr(2, 5);
    }

    Util.getBox = function getBox(obj) {
        var width = Math.abs(obj.width * obj.scaleX * Math.cos(Util.radians(obj.orientation))) + Math.abs(obj.height * obj.scaleY * Math.sin(Util.radians(obj.orientation)));
        var height = Math.abs(obj.width * obj.scaleX * Math.sin(Util.radians(obj.orientation))) + Math.abs(obj.height * obj.scaleY * Math.cos(Util.radians(obj.orientation)))
        var result = new Box(
            Math.floor(obj.x - width / 2),
            Math.floor(obj.y - height / 2),
            Math.ceil(width),
            Math.ceil(height)
        );
        return result;
    }

    Util.isOverlap = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        var result = false;

        if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
            result = true;
        }
        return result;
    }

    Util.simpleObjectClone = function (obj) {
        var result = {};
        for (var key in obj) {
            result[key] = obj[key];
        }
        return result;
    }

    Util.rasterize = function (img) {
        var tempCanvas = document.createElement("canvas");
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        var tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(img, 0, 0, img.width, img.height);
        return Util.convertCanvasToImage(tempCanvas);
    }

    Util.convertCanvasToImage = function (canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    }

    Util.getRandomImage = function (width, height) {
        var data = new Uint8ClampedArray(width * height * 4);
        for (var y = 0; y < width * 4; y++) {
            for (var x = 0; x < height * 4; x++) {
                data[y * width + x] = Math.random() * 0xff;
            }
        }
        var testCanvas = document.createElement('canvas');
        testCanvas.width = width;
        testCanvas.height = height;
        var ctx = testCanvas.getContext('2d');
        var imageData = new ImageData(data, width, height);
        ctx.putImageData(imageData, 0, 0);
        return Util.convertCanvasToImage(testCanvas);
    }
    return Util;
});
