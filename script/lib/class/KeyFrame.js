define(['class/Animation', "lib/AnimationManager"], function(Animation, AnimationManager){
    var KeyFrame = KeyFrame || function(duration, callBackId, layerName){
        this.duration = duration;
        this.animations = [];
        this.callBackId = callBackId;
        this.layerName = layerName;
    };
    
    KeyFrame.prototype = {
        addAnimation: function(model, animation){
            this.animations.push(new Animation(model, animation));
        },
        clearAnimations: function(){
            this.animations = [];
        },
        setDuration: function(duration){
            this.duration = duration;
        },
        commit: function(){
            var animationManager = new AnimationManager();
            animationManager.processKeyFrame(this);
        }
    };
    
    return KeyFrame;
});