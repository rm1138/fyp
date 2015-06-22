define(["lib/Global"], function (Global){
    
    var Timeline = Timeline || function(){
        this.keyframes = [];
        this.playedFrames = [];
        this.lastKeyIndex = 0;
        this.playingFrameSet = null;
        this.playingFrameSetKeys = null;
        this.lastFrameSwapTime = new Date().getTime();
        this.fps = 0;
    };

    Timeline.prototype = {
        addKeyframe: function(frame) {
            this.keyframes.push(frame);
        },
        getFrame: function(){
            if(this.playingFrameSet === null && this.keyframes.length > 0){
                this.playingFrameSet = this.keyframes.shift();
                this.playingFrameSetKeys = Object.keys(this.playingFrameSet);
                this.playedFrames.push(this.playingFrameSet);
                this.lastKeyIndex = 0;
            }
            
            if(this.playingFrameSet === null) {
                return undefined;
            }

            var keys = this.playingFrameSetKeys;

            if(this.lastKeyIndex >= keys.length){
                this.playingFrameSet = null; 
                console.log("Next key frame");
                var temp = new Date().getTime()
                Global.FrameSwapLimit = (temp - this.lastFrameSwapTime);
                this.lastFrameSwapTime = temp;
                console.log(Global.FrameSwapLimit);
                return this.getFrame();
            }
            return this.playingFrameSet[keys[this.lastKeyIndex++]]; 
        },
        reverse: function(){
            var temp = this.keyframes.reverse();
            this.keyframes = this.playedFrames.reverse();
            this.playedFrames = temp;                                
        },
        clear: function(){
            this.keyframes = [];
            this.playedFrames = []; 
        },
        getRemainFrameCount: function(){
            return this.keyframes.length;    
        }
    };
    return Timeline;
});
