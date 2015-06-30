define(['lib/enums', 'lib/MathUtil'], function (enums, MathUtil){
    
    var Timeline = Timeline || function(){
        this.frames = [];
        this.playingFrameSetIndex = 0;
        this.queueID = null;
        this.frameSetStartTime = 0;
        this.playingFrameSet = undefined;
    };

    Timeline.prototype = {
        getNextFrameSet: function() {
            if(this.frames[this.playingFrameSetIndex]) {
                return this.frames[this.playingFrameSetIndex++];
            }
            return null;
        },
        getAnimations: function(modelCount, step){
            var frame = this.playingFrameSet;
            if(!frame){
                this.playingFrameSet = this.getNextFrameSet();
                this.frameSetStartTime = new Date().getTime();
                if(this.playingFrameSet){
                    return this.getAnimations(modelCount, step);
                }else{
                    return null;
                }
            }   
            var frameCount = Math.round((new Date().getTime() - this.frameSetStartTime) / step);
            var frameIndex = modelCount * MathUtil.ANIMATION_PROP_ARR.length * frameCount;
            var shiftIndex = frameIndex+modelCount*MathUtil.ANIMATION_PROP_ARR.length;
            if(shiftIndex >= frame.length){
                this.playingFrameSet = this.getNextFrameSet();
                this.frameSetStartTime = new Date().getTime();
                return this.getAnimations(modelCount, step);
            }
            var result = [];
            var i, keys = MathUtil.ANIMATION_PROP_ARR
            while(modelCount--){
                var animation = {};
                i = keys.length;
                shiftIndex = frameIndex+modelCount*MathUtil.ANIMATION_PROP_ARR.length;
                while(i--) {
                    animation[keys[5-i]] = frame[shiftIndex+i];
                }
                result.unshift(animation);
            }
            return result;
        },
        reset: function(queueID){
            this.queueID = queueID;
            this.frames = [];
            this.playingFrameSetIndex = 0;
        },
        addFrames: function(index, frame, queueID){
            if(this.queueID === queueID){
                this.frames[index] = frame;
            }
        }
    };
    return Timeline;
});
