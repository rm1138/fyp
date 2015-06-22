/*
 * Easing Function, Credit by Gaëtan Renaudeau
 * Retreved from https://gist.github.com/gre/1650294
 * only considering the t value for the range [0, 1] => [0, 1]
 */

define(function(){
    var MathUtil = {};
    
    MathUtil.step = 1000/60;
    MathUtil.EasingFunctions = {
        // no easing, no acceleration
        linear: function (t) { return t },
        // accelerating from zero velocity
        easeInQuad: function (t) { return t*t },
        // decelerating to zero velocity
        easeOutQuad: function (t) { return t*(2-t) },
        // acceleration until halfway, then deceleration
        easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
        // accelerating from zero velocity 
        easeInCubic: function (t) { return t*t*t },
        // decelerating to zero velocity 
        easeOutCubic: function (t) { return (--t)*t*t+1 },
        // acceleration until halfway, then deceleration 
        easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
        // accelerating from zero velocity 
        easeInQuart: function (t) { return t*t*t*t },
        // decelerating to zero velocity 
        easeOutQuart: function (t) { return 1-(--t)*t*t*t },
        // acceleration until halfway, then deceleration
        easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
        // accelerating from zero velocity
        easeInQuint: function (t) { return t*t*t*t*t },
        // decelerating to zero velocity
        easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
        // acceleration until halfway, then deceleration 
        easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
    } 
    
    MathUtil.valueProjection = function(animation, progress){
        var from = animation.from;
        var to = animation.to;
        var easing = MathUtil.EasingFunctions[animation.easing];
        var result = {};
        var keys = Object.keys(from);
        var i = keys.length-1;
        while(i >= 0) {
            var key = keys[i];
            if(from[key] !== to[key]) {
                progress = easing(progress);
                result[key] = from[key] * (1-progress) + to[key] * progress;
            }else{
                result[key] = from[key];
            }
            i-=1;    
        }
        return result;
    };
    
    MathUtil.processKeyFrame = function(keyFrame){
        var timeLapse = keyFrame.processStart;
        var end = keyFrame.processEnd;
        var step = MathUtil.step;
        var duration = keyFrame.duration;
        var result = {};
        var animations = keyFrame.animations;
        while(timeLapse <= end) {
            var frame = {};
            for(var i=0, count = animations.length; i<count; i+=1) {
                var animation = animations[i];
                frame[animation.modelName] = MathUtil.valueProjection(animation, timeLapse/duration);
            }
            
            result[Math.floor(timeLapse)] = frame;
            timeLapse += step;
        }
        return result;      
    };
    
    MathUtil.radians = function(degrees) {
      return degrees * Math.PI / 180;
    };
    
    MathUtil.degrees = function(radians) {
      return radians * 180 / Math.PI;
    };
    
    return MathUtil;
});

/*
obj = {
    x: 100,
    y: 200,
    



}


*/