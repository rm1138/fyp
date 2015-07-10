define(['lib/Util', 'class/Animation'], function (Util, Animation) {
    var Timeline = function (model) {
        this.animationQueue = [];
        this.currentAnimation = null;
        this.animationStartTime = 0;
        this.model = model;
    };

    Timeline.prototype = {
        __addAnimation: function (options, append) {
            var animationQueue = this.animationQueue;
            if (append) {
                var animation = new Animation(this.model.final, options);
                this.animationQueue.push(animation);
            } else {
                var animation = new Animation(this.model.current, options);
                this.animationQueue = [animation];
                this.currentAnimation = null;
            }
        },
        __getAnimation: function () {
            if (this.currentAnimation === null) {
                if (this.animationQueue.length === 0) {
                    return null;
                }
                this.currentAnimation = this.animationQueue.shift();
                this.animationStartTime = new Date().getTime();
            }
            var duration = this.currentAnimation.duration;
            var timelapse = new Date().getTime() - this.animationStartTime;
            if (timelapse > duration) {
                this.currentAnimation = null;
                return this.__getAnimation();
            }

            return {
                animation: this.currentAnimation,
                startTime: this.animationStartTime
            };
        }
    };

    return Timeline;
});
