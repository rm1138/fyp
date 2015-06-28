define(['lib/enums'], function (enums){
    
    var Timeline = Timeline || function(){
        this.frames = [];
        this.playingFrameSetIndex = 0;
    };

    Timeline.prototype = {
        getNextFrameSet: function() {
            if(this.frames[this.playingFrameSetIndex]) {
                var result = this.frames[this.playingFrameSetIndex];
                this.playingFrameSetIndex += 1;
                return result;
            }
            return null;
        },
        clear: function(){
            this.frames = [];
            this.playingFrameSetIndex = 0;
        }
    };
    return Timeline;
});
