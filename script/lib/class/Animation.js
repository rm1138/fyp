define(['lib/Util'], function (Util) {
    var Animation = Animation || function (model, animation) {
        this.from = {
            x: model.x,
            y: model.y,
            orientation: model.orientation,
            opacity: model.opacity,
            scaleX: model.scaleX,
            scaleY: model.scaleY,
        };
        this.to = {
            x: animation.x ? animation.x : model.x,
            y: animation.y ? animation.y : model.y,
            orientation: animation.orientation ? animation.orientation : model.orientation,
            opacity: animation.opacity ? animation.opacity : model.opacity,
            scaleX: animation.scaleX ? animation.scaleX : model.scaleX,
            scaleY: animation.scaleY ? animation.scaleY : model.scaleY
        };
        //pre-format the easing function
        this.easing = Util.EasingFunctions[animation.easing] ? animation.easing : "linear";
        this.duration = animation.duration;
        
    }

    Animation.prototype = {

    }

    return Animation;
});
