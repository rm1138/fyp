define(['lib/MathUtil'], function(MathUtil){
    var Animation = Animation || function(model, animation) {
        this.from = {
            x: model.x,
            y: model.y,
            orientation: model.orientation,
            opacity: model.opacity,
            enlargeRatio: model.enlargeRatio
        };
        this.to = {
            x: animation.x?animation.x:model.x,
            y: animation.y?animation.y:model.y,
            orientation: animation.orientation?animation.orientation:model.orientation,
            opacity: animation.opacity?animation.opacity:model.opacity,
            enlargeRatio: animation.enlargeRatio?animation.enlargeRatio:model.enlargeRatio      
        };
        //pre-format the easing function
        this.easing = MathUtil.EasingFunctions[animation.easing]?animation.easing:"linear";
        this.modelName = model.name;
    }
    
    Animation.prototype = {

        
    }
    
    return Animation;
});

/*
    toX         cooridinate
    toY         cooridinate
    rotate      +/- deg
    Zoom        +/- 
    fade        0.0 - 1.0 (transparancy)
    duration    second
    ease        ease function name
    callback    call back function when the animation completed
    ...

*/

