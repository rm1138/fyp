define(['lib/MathUtil'], function (MathUtil) {
    var Animation = Animation || function (model, animation) {
        if (arguments[0] instanceof Animation) {
            var cloneTarget = arguments[0];
            this.to = cloneTarget.to;
            this.from = cloneTarget.from;
            this.easing = cloneTarget.easing;
            this.start = cloneTarget.start;
            this.end = cloneTarget.duration;
            this.duration = cloneTarget.duration;
        } else {
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
            this.easing = MathUtil.EasingFunctions[animation.easing] ? animation.easing : "linear";
            this.duration = animation.duration;
        }
    }

    Animation.prototype = {
        split: function (time) {
            if (this.end - this.start <= time) {
                return {
                    first: this,
                    remain: null
                };
            } else {
                var first = new Animation(this);
                var end = this.start + time;
                first.end = end;
                this.start = end;

                return {
                    first: first,
                    remain: this
                };
            }
        }
    }

    return Animation;
});
