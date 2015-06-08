define(function (){
    
    var Timeline = Timeline || function(){
        this.keyframes = [];
        this.playedFrames = [];
    };

    Timeline.prototype = {
        addKeyframe: function(frame) {
            this.keyframes.push(frame);
        },
        getNextFrame: function(){ 
            var tempFrame = this.keyframes.pop();
            this.playedFrames.push(tempFrame);
            return tempFrame;
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
