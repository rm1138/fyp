define(['class/Animation', 'lib/Global'], function(Animation, Global){
    var KeyFrame = KeyFrame || function(duration, layer){
        this.duration = duration;
        this.animations = [];
        this.lastProcessMark = 0;
        this.layer = layer;
    };
    
    KeyFrame.prototype = {
        addAnimation: function(model, animation){
            this.animations.push(new Animation(model, animation));
        },
        clearAnimation: function(){
            this.animations = [];
        },
        setDuration: function(duration){
            this.duration = duration;
        },
        commit: function(){
            Global.animator.addProcessQueue(this);
        },
    };
    
    return KeyFrame;
});