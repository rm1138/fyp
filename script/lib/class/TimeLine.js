define(['lib/enums'], function (enums){
    
    var Timeline = Timeline || function(){
        this.frames = [];
        this.playingFrameSetIndex = 0;
        this.queueID = null;
    };

    Timeline.prototype = {
        getNextFrameSet: function() {
            if(this.frames[this.playingFrameSetIndex]) {
                return this.frames[this.playingFrameSetIndex++];
            }
            return null;
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
