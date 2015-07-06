define(['lib/Util'], function (Util) {
    var AnimationHashMap = AnimationHashMap || function (fw) {

        this.animationManager = fw;
        this.mapping = {};
        this.processQueue = [];

        this.roundingLimit = 10;
        this.decimalPlaces = 2;

    };

    AnimationHashMap.prototype = {
        hashAnimation: function (animation, step) {
            var animationManager = this.animationManager;
            var animationKeys = Util.ANIMATION_PROP_ARR;
            var duration = Math.round(animation.duration);
            var easingIdx = Util.easingArr.indexOf(animation.easing);
            var i = animationKeys.length;
            var result = {
                duration: duration
            };
            while (i--) {
                var animationPorp = animationKeys[i];
                var delta = animation.to[animationPorp] - animation.from[animationPorp];
                var key = this.getKey(delta, easingIdx);
                var temp = this.mapping[key];
                if (!temp || step * temp.length < duration) {
                    this.processQueue.push(delta);
                    this.processQueue.push(easingIdx);
                    this.processQueue.push(duration * 10);
                    result.duration = -1;

                } else {

                    result[animationPorp] = temp;
                }

            }
            return result;
        },
        getKey: function (delta, easing) {
            delta = this.formatDelta(delta);
            var key = delta + " " + easing;
            return key;
        },
        formatDelta: function (delta) {
            var roundingLimit = this.roundingLimit;
            //delta = Math.abs(delta);
            if (delta > roundingLimit || delta < -roundingLimit) {
                delta = Math.round(delta);
            } else {
                delta = delta.toFixed(this.decimalPlaces);
            }
            return delta;
        },
        getProcessQueue: function () {
            var temp = this.processQueue;
            this.processQueue = [];
            return temp;
        },
        addFrames: function (delta, easingIdx, frames) {
            var key = this.getKey(delta, easingIdx);
            this.mapping[key] = frames;
        }
    };

    return AnimationHashMap;
});
