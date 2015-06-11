define(function (){
    
    var Timeline = Timeline || function(){
        this.keyframes = [];
        this.playedFrames = [];
        this.playingKeyFrame = null;
        this.playingKeyFrameStartTime = 0;
        this.lastKeyIndex = 0;
    };

    Timeline.prototype = {
        addKeyframe: function(frame) {
            this.keyframes.push(frame);

        },
        start: function(){ 

            if(this.playingKeyFrame === null && this.keyframes.length > 0){
                var tempFrame = this.keyframes.pop();
                this.playedFrames.push(tempFrame);
                this.playingKeyFrame = tempFrame;
                this.playingKeyFrameStartTime = new Date().getTime();
            }
        },
        getFrame: function(){
            if(this.playingKeyFrame !== null){
                var delta = new Date().getTime() - this.playingKeyFrameStartTime;
                var keys = Object.keys(this.playingKeyFrame);
                while(delta >= keys[this.lastKeyIndex]){
                    this.lastKeyIndex++;    
                }
                if(delta - keys[this.lastKeyIndex-1] < keys[this.lastKeyIndex] - delta){
                    return this.playingKeyFrame[keys[this.lastKeyIndex-1]];    
                } else {
                return this.playingKeyFrame[keys[this.lastKeyIndex]];
                }
            }
            return undefined;
        },
        stop: function(){
            this.playingKeyFrame === null;
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
