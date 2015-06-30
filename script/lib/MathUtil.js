/*
 * Easing Function, Credit by Gaëtan Renaudeau
 * Retreved from https://gist.github.com/gre/1650294
 * only considering the t value for the range [0, 1] => [0, 1]
 */

define(function(){
    var MathUtil = {};
    
    MathUtil.ANIMATION_PROP_ARR = ['x', 'y', 'scaleX', 'scaleY', 'orientation', 'opacity'];
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
    
    MathUtil.valueProjection = function(animation, progress, result, arrPtr){
        var from = animation.from;
        var to = animation.to;
        var easing = MathUtil.EasingFunctions[animation.easing];
        var keys = MathUtil.ANIMATION_PROP_ARR;
        var i = keys.length;

        while(i--) {
            var key = keys[i];
            if(from[key] !== to[key]) {
                progress = easing(progress);
                result[arrPtr.val++] = (from[key] * (1-progress) + to[key] * progress);
            }else{
                result[arrPtr.val++] = (from[key]);
            }   
        }
    };
    
    MathUtil.processKeyFrame = function(keyFrame, start, end, step){
        var timeLapse = start + (step - (start % step));
        var end = end;
        var step = MathUtil.step;
        var duration = keyFrame.duration;
        var result = new Float32Array(keyFrame.animations.length * Math.ceil((end - start)/ MathUtil.step)*this.ANIMATION_PROP_ARR.length);
        var animations = keyFrame.animations;
        var arrPtr = {val: 0};
        var i = 0;
        while(timeLapse <= end) {
            for(var i=0, count = animations.length; i<count; i+=1) {
                MathUtil.valueProjection(animations[i], timeLapse/duration, result, arrPtr);
            }
            timeLapse += step;
        }
        return result;      
    };
    
    MathUtil.parseAnimation = function(animation, batchSize) {
        var result = [],
            duration = animation,
            start = 0,
            end = (duration > batchSize)? batchSize: duration,
            keys = MathUtil.ANIMATION_PROP_ARR,
            i,
            temp;
                   
        while(end <= duration){
            temp = {};
            i = keys.length;
            while(i--){
                temp[keys[i] = MathUtil.valueProjection
                
            }
            
        }
    }
    
    MathUtil.radians = function(degrees) {
        return degrees * Math.PI / 180;
    };
    
    MathUtil.degrees = function(radians) {
        return radians * 180 / Math.PI;
    };
    
    MathUtil.genRandomId = function() {
        return Math.random().toString(36).substr(2, 5);   
    }
    
    return MathUtil;
});