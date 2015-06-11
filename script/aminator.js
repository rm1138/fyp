
/**
 * Animator.js - A library to create tweened, callback-based animations.
 *
 * Animator is designed to run as a singleton, but multiple animators can be
 * used at the expense of efficiency. Create a new animator like so:
 *
 * var animator = new Animator();
 *
 * And create an animation like so:
 *
 * var id = animator.animate(500, animator.EASE_IN_OUT,
 *   function(alpha, progress) {
 *     // Do animation
 *     return true;
 *   });
 *
 * Extra optional parameters and functions are documented in-line, private
 * functions are prefixed with an _underscore. All documentation blocks begin
 * with '/**'.
 *
 * (c) 2012, 2013 Chris Lord <contact@chrislord.net> - see the included
 * LICENSE file for licensing information.
 */
function Animator() {
  /**
   * Default easing functions. An easing function is an equation applied to
   * the animation progress that modifies its progression. The resulting value
   * is referred to as 'alpha'.
   *
   * LINEAR: [alpha = progress]
   *   Alpha progresses at a constant rate.
   *
   * EASE_IN: [alpha = progress^2]
   *   Alpha starts slower and ends faster.
   *
   * EASE_OUT: [alpha = 1 - (1 - progress)^2]
   *   Alpha starts faster and ends slower.
   *
   * EASE_IN_OUT: [alpha = progress < 0.5 ?
   *                 progress^2 / 2 :
   *                 (1 - (2 - progress * 2)^2) / 2 + 0.5]
   *   Alpha starts slow, speeds up, and ends slower.
   *
   * _CUBIC, _QUAD and _SINE variations just alter the factors to adjust the
   * rate at which the animation speeds up and slows down.
   */
  this.LINEAR = 0;

  this.EASE_IN = 1;
  this.EASE_IN_CUBIC = 2;
  this.EASE_IN_QUAD = 3;
  this.EASE_IN_SINE = 4;

  this.EASE_OUT = 5;
  this.EASE_OUT_CUBIC = 6;
  this.EASE_OUT_QUAD = 7;
  this.EASE_OUT_SINE = 8;

  this.EASE_IN_OUT = 9;
  this.EASE_IN_OUT_CUBIC = 10;
  this.EASE_IN_OUT_QUAD = 11;
  this.EASE_IN_OUT_SINE = 12;


  this.EASE_LAST = 12;

  this._animations = new Array();
  this._spareAnimations = new Array();
  this.activeAnimations = 0;
  this._animating = false;
  this._compactSpares = false;
  this._alphas = new Array();
  this._spareAlphas = new Array();
  this._nextId = 0;
  this.numberRegex = /(\d*\.?(?=\d)\d*)(.*)/;

  this.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame;

  this._create();
}

Animator.prototype = {
  _create: function() {
    // Create the default easing functions

    // Linear
    this._alphas[0] = function(progress) { return progress; };

    // Quadratic

    // Ease in
    var easeIn = function(i) { return function(progress) {
      return Math.pow(progress, i);
    }; };

    // Ease out
    var easeOut = function(i) { return function(progress) {
      return 1 - Math.pow(1 - progress, i);
    }; };

    // Ease in/out
    var easeInOut = function(i) { return function(progress) {
      return progress < 0.5 ?
        Math.pow(progress * 2, i) / 2 :
        (1 - Math.pow(2 - progress * 2, i)) / 2 + 0.5;
    }; };

    for (var i = 2; i <= 4; i++) {
      this._alphas[this.EASE_IN + (i - 2)] = easeIn(i);
      this._alphas[this.EASE_OUT + (i - 2)] = easeOut(i);
      this._alphas[this.EASE_IN_OUT + (i - 2)] = easeInOut(i);
    }

    // Sine
    this._alphas[this.EASE_IN_SINE] = function(progress) {
      return 1.0 - Math.cos(progress * Math.PI / 2);
    };
    this._alphas[this.EASE_OUT_SINE] = function(progress) {
      return Math.sin(progress * Math.PI / 2);
    };
    this._alphas[this.EASE_IN_OUT_SINE] = function(progress) {
      return progress < 0.5 ?
        (1.0 - Math.cos(progress * Math.PI)) / 2 :
        (Math.sin((progress - 0.5) * Math.PI)) / 2 + 0.5;
    };
  },

  /**
   * Start an animation.
   *
   * @duration: The duration of the animation, in ms. Negative values are valid,
   *   in which case the animation will run until it is manually cancelled.
   * @easing: The easing function ID.
   * @callback: The animation callback. Has the prototype
   *   function(alpha, progress, duration, startTime, currentTime)
   *   and returns true if the animation should continue. The animation will
   *   automatically stop after progress has reached >= 1.0. All parameters
   *   are optional.
   * @loop: [Optional] Whether the animation should repeat once it reaches its
   *   end.
   * @reverse: [Optional] Whether the animation should run in the opposite
   *   direction after looping.
   *
   * Returns an animation ID.
   */
  animate: function(duration, easing, callback, loop, reverse) {
    if (callback != null && typeof callback != "function")
      throw new TypeError("\"animate\" called with invalid callback (expected function, given " + (typeof callback) + ")");

    var animation = {};
    animation.duration = duration;
    animation.easing = easing;
    animation.callback = callback;
    animation.loop = loop ? true : false;
    animation.reverse = reverse ? 1 : 0;
    animation.id = this._spareAnimations.length ?
                   this._spareAnimations.pop() : this._animations.length;

    this._animations[animation.id] = animation;
    var animator = this;
    if (!this._animating) {
      this._animating = true;
      this.requestAnimationFrame.apply(window, [function(t) { animator._doAnimation(t); }]);
    }

    this.activeAnimations++;

    return animation.id;
  },

  /**
   * Creates an animation callback that can be used to animate a numeric
   * JavaScript object property.
   *
   * @object: The object on which the property exists.
   * @name: The name of the property.
   * @target: The value the property should animate to.
   *
   * Returns a function which can be used with the animate() method.
   */
  propertyAnimator: function(object, name, target) {
    var start, suffix;
    var isNumber = typeof object[name] == "number";
    if (!isNumber) {
      if (typeof object[name] != "string")
        throw new TypeError("Cannot animate non-number and non-string properties");
      var match = this.numberRegex.exec(object[name]);
      if (!match)
        throw new TypeError("Object property is not a recognisable number");

      start = parseFloat(match[1]);
      suffix = match[2];
    } else {
      start = object[name];
      suffix = 0;
    }

    return function(alpha, progress, duration) {
      var value = (target * alpha) + (start * (1 - alpha));
      object[name] = value + suffix;
      return true;
    };
  },

  _doAnimation: function(timestamp) {
    this._animating = false;

    // Run animation callbacks
    var shouldBeAnimating = false;
    for (var i = 0; i < this._animations.length; i++) {
      var animation = this._animations[i];
      if (animation == null) continue;
      if (!animation.startTime) animation.startTime = timestamp;
      var progress = Math.min((timestamp - animation.startTime) / animation.duration, 1.0);
      if (animation.reverse == 2) progress = 1 - progress;
      var alpha = this._alphas[animation.easing](progress);
      if (animation.reverse == 2) progress = 1 - progress;

      if ((!animation.callback ||
           animation.callback(alpha, progress, animation.duration, animation.startTime, timestamp)) &&
          progress < 1.0) {
        shouldBeAnimating = true;
      } else if (animation.loop) {
        shouldBeAnimating = true;
        animation.startTime = timestamp;
        if (animation.reverse > 0) animation.reverse = 3 - animation.reverse;
      } else {
        if (!this.cancelAnimation(i)) i--;
      }
    }

    // Compact the spares list - is it even worth doing this?
    if (this._compactSpares) {
      this._compactSpares = false;
      for (var i = 0; i < this._spareAnimations.length; i++) {
        if (this._spareAnimations[i] >= this._animations.length) {
          this._spareAnimations.splice(i, 1);
          i--;
        }
      }
    }

    var animator = this;
    if (shouldBeAnimating && !this._animating) {
      this._animating = true;
      this.requestAnimationFrame.apply(window, [function(t) { animator._doAnimation(t); }]);
    }
  },

  /**
   * Cancels the given animation.
   */
  cancelAnimation: function(id) {
    var animation = this._animations[id];
    if (!animation) return false;
    this.activeAnimations--;
    if (animation.id == this._animations.length - 1) {
      this._animations.splice(id, 1);
      this._compactSpares = true;
      return false;
    } else {
      this._animations[id] = null;
      this._spareAnimations.push(id);
      return true;
    }
  },

  /**
   * Cancels all animations that have the given callback function.
   */
  cancelAnimationByCallback: function(callback) {
    var remove = new Array();
    for (var i = 0; i < this._animations.length; i++) {
      var animation = this._animations[i];
      if (animation && animation.callback == callback)
        remove.push(i);
    }
    for (var i = 0; i < remove.length; i++)
      this.cancelAnimation(remove[i]);
  },

  /**
   * Cancel all animations.
   */
  cancelAnimations: function() {
    for (var i = this._animations.length - 1; i >= 0; i--) {
      if (this._animations[i]) this.cancelAnimation(i);
    }
  },

  /**
   * Add a custom easing function.
   *
   * @easing: a function with prototype function(progress) that returns a
   *   number.
   *
   * Returns an animation easing ID that can be used with the animate()
   * function.
   */
  addEasingFunction: function(easing) {
    var slot = this._spareAlphas.length ?
               this._spareAlphas.pop() : this.alphas.length;
    this._alphas[slot] = easing;
    return slot;
  },

  /**
   * Removes a custom easing function.
   *
   * @id: An easing function ID, as returned by addEasingFunction()
   */
  removeEasingFunction: function(id) {
    if (id < this.EASE_LAST) {
      console.log("removeEasingFunction: Invalid id '" + id + "'");
      return;
    }

    if (id == this._alphas.length - 1) {
      this._alphas.splice(id, 1);
      for (var i = 0; i < this._spareAlphas.length; i++) {
        if (this._spareAlphas[i] >= this._spareAlphas.length) {
          this._spareAlphas.splice(i, 1);
          i--;
        }
      }
    } else {
      this._alphas[id] = null;
      this._spareAlphas.push(id);
    }
  }
};
