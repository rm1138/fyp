/*
 * Easing Function, Credit by Gaëtan Renaudeau
 * Retreved from https://gist.github.com/gre/1650294
 * only considering the t value for the range [0, 1] => [0, 1]
 */

define(function () {
    var MathUtil = {};

    MathUtil.ANIMATION_PROP_ARR = ['x', 'y', 'scaleX', 'scaleY', 'orientation', 'opacity'];
    MathUtil.step = 1000 / 60;
    MathUtil.easingArr = [
        "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint"
    ];
    MathUtil.EasingFunctions = {
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

    MathUtil.processAnimation = function (animation, progress, result, ptr) {
        var from = animation.from;
        var to = animation.to;
        var easing = MathUtil.EasingFunctions[animation.easing];
        var keys = MathUtil.ANIMATION_PROP_ARR;
        var i = keys.length;

        while (i--) {
            var key = keys[i];
            if (from[key] !== to[key]) {
                result[ptr.val++] = MathUtil.valueProjection(from[key], to[key], progress, easing);
            } else {
                result[ptr.val++] = (from[key]);
            }
        }
    };

    MathUtil.valueProjection = function (from, to, progress, easing) {
        if (typeof easing === "function") {
            progress = easing(progress);
        }
        return from * (1 - progress) + to * progress;
    };

    MathUtil.processAnimations = function (animations, step) {
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
            var easing = MathUtil.easingArr[easingIdx];
            var start = 0;

            var index = 0;
            while (index < frameCount) {
                result[ptr++] = MathUtil.valueProjection(0, delta, start / duration, easing);
                start += step;
                index++;
            }
            if (index !== Math.ceil(duration / step)) {
                debugger;
            }
        }

        return result;
    };


    MathUtil.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    MathUtil.degrees = function (radians) {
        return radians * 180 / Math.PI;
    };

    MathUtil.genRandomId = function () {
        return Math.random().toString(36).substr(2, 5);
    }

    MathUtil.getBox = function getBox(obj) {
        var width = Math.abs(obj.width * obj.scaleX * Math.cos(MathUtil.radians(obj.orientation))) + Math.abs(obj.height * obj.scaleY * Math.sin(MathUtil.radians(obj.orientation)));
        var height = Math.abs(obj.width * obj.scaleX * Math.sin(MathUtil.radians(obj.orientation))) + Math.abs(obj.height * obj.scaleY * Math.cos(MathUtil.radians(obj.orientation)))
        var result = {
            width: width,
            height: height,
            x: obj.x - width / 2,
            y: obj.y - height / 2
        };

        return result;
    }

    MathUtil.isOverlap = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        var result = false;

        if (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2) {
            result = true;
        }
        return result;
    }


    return MathUtil;
});
