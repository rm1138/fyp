define(['enums'], function (enums){
    
    var TimelineProxy = TimelineProxy || function(){
        this.frames = [];
        this.playingFrameSet = null;
        this.frameSetStartTime = 0;
        this.playingFrameSetIndex = 0;
    };

    TimelineProxy.prototype = {
        getNextFrameSet: function() {
            if(this.frames[this.playingFrameSetIndex]) {
                var result = this.frames[this.playingFrameSetIndex];
                this.frameSetStartTime = new Date().getTime();
                this.playingFrameSetIndex += 1;
                return result;
            }
            return null;
        },
        getFrame: function(step){
            if(this.playingFrameSet === null || this.playingFrameSet === undefined) {
                
                this.playingFrameSet = this.getNextFrameSet();
                if(this.playingFrameSet === null || this.playingFrameSet === undefined) {
                    return undefined;    
                }
            }
            var playingFrameSet = this.playingFrameSet;
            var frameTime = (new Date().getTime() - this.frameSetStartTime) / step;
            frameTime = Math.round(frameTime);
            var result = playingFrameSet[frameTime]
            if(result){
                return result;   
            } else {
                this.playingFrameSet = this.getNextFrameSet();
                return this.getFrame(step);
            }
        },
        reverse: function(){
            var temp = this.keyframes.reverse();
            this.keyframes = this.playedFrames.reverse();
            this.playedFrames = temp;                                
        },
        clear: function(){
            this.frames = [];
            this.playingFrameSet = null;
            this.frameSetStartTime = 0;
            this.playingFrameSetIndex = 0;
        }
    };
    return TimelineProxy;
});
