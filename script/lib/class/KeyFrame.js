define(['class/Animation'], function(Animation){
    var KeyFrame = KeyFrame || function(duration){
        this.duration = duration;
        this.animations = [];
    };
    
    KeyFrame.prototype = {
        addAnimation: function(model, animation){
            this.animations.push(new Animation(model, animation));
        },
        commit: function(){
            
        },
        clearAnimation: function(){
            this.animations = [];
        },
        setDuration: function(duration){
            this.duration = duration;
        }
    };
    
    return KeyFrame;
});