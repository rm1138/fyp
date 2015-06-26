define(['enums'], function (enums){
    
    var Timeline = Timeline || function(){
        this.frames = [];
        this.playingFrameSet = null;
        this.playingFrameSetKeys = null;
        this.framesIndex = 0;
        this.frameSetIndex = 0;
    };

    Timeline.prototype = {
        addKeyframe: function(frame) {
            this.keyframes.push(frame);
        },
        getFrame: function(){
            var frames = this.frames;
            if(frames.length === 0)
                return undefined;
            var framesIndex = this.framesIndex;
            var frameSet;
            var frameSetIndex = this.frameSetIndex;
            if(frameSet = frames[framesIndex]) {
                if(frameSet[frameSetIndex]){

                        return frameSet[this.frameSetIndex++];

                }else{

                        this.frameSetIndex = 0;
                        this.framesIndex++;
  
                    return this.getFrame();
                }
            }
            this.clear();
            return undefined;
//            if(this.playingFrameSet === null && this.keyframes.length > 0){
//                this.playingFrameSet = this.keyframes.shift();
//                this.playingFrameSetKeys = Object.keys(this.playingFrameSet);
//                this.playedFrames.push(this.playingFrameSet);
//                this.lastKeyIndex = 0;
//            }
//            
//            if(this.playingFrameSet === null) {
//                return undefined;
//            }
//
//            var keys = this.playingFrameSetKeys;
//
//            if(this.lastKeyIndex >= keys.length){
//                this.playingFrameSet = null; 
//                console.log("Next key frame");
//                var temp = new Date().getTime()
//                Global.FrameSwapLimit = (temp - this.lastFrameSwapTime);
//                this.lastFrameSwapTime = temp;
//                console.log(Global.FrameSwapLimit);
//                return this.getFrame();
//            }
//            return this.playingFrameSet[keys[this.lastKeyIndex++]]; 
        },
        reverse: function(){
            var temp = this.keyframes.reverse();
            this.keyframes = this.playedFrames.reverse();
            this.playedFrames = temp;                                
        },
        clear: function(){
            this.keyframes = [];
            this.playedFrames = []; 
            this.framesIndex = 0;
            this.frameSetIndex = 0;
        },
        getRemainFrameCount: function(){
            return this.keyframes.length;    
        }
    };
    return Timeline;
});
