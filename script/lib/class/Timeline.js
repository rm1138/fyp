define(['lib/Util', 'class/Animation'], function(Util, Animation){
    var Timeline = function(model){
        this.animationQueue = [];
        this.currentFrame = null;
        this.frameStartTime = 0;
        this.framesQueue = []; 
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
                this.framesQueue = [];
                this.currentFrame = null;
            }
        },
        __getFrame: function(){
            if (this.currentFrame === null) {
                if (this.framesQueue.length === 0) {
                    return null;
                }
                this.currentFrame = this.framesQueue.shift();
                this.frameStartTime = new Date().getTime();
            }
            var duration = this.currentFrame.duration;
            var timelapse = new Date().getTime() - this.frameStartTime;
            if (timelapse > duration) {
                this.currentFrame = null;
                return this.__getFrame();
            }
            
            return {
                frames: this.currentFrame,
                startTime: this.frameStartTime
            };
        },
        __getFirstAnimation: function () {
            return this.animationQueue[0];
        },
        __removeFirstAnimation: function () {
            this.animationQueue.shift();
        },
        __addFrames: function (frames) {
            this.framesQueue.push(frames);
        }
    };
    
    return Timeline;
});