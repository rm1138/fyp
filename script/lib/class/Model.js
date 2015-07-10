define(["lib/enums", "class/Animation", "lib/Util", "class/Timeline"],
    function (enums, Animation, Util, Timeline) {
        var Model = function (obj, layer) {

            var that = this;
            this.layer = layer;
            this.name = obj.name;

            this.timeline = new Timeline(this);

            this.isActive = false;
            this.needRender = false;

            this.QoSLevel = typeof obj.QoSLevel !== "undefined" ? obj.QoSLevel : 5;
            this.skipped = 0;

            this.current = {
                x: obj.x,
                y: obj.y,
                orientation: obj.orientation ? obj.orientation : 0,
                opacity: obj.opacity ? obj.opacity : 1,
                scaleX: obj.scaleX ? obj.scaleX : 1,
                scaleY: obj.scaleY ? obj.scaleY : 1,
                width: 0,
                height: 0
            }

            this.last = null;
            this.base = null;
            this.final = null;

            if (obj.type === "image") {
                this.type = enums.ModelType.Image;
                var img = new Image();
                img.src = obj.url;
                img.onload = function () {
                    that.__completeImg(this);
                };
            }
        };

        Model.prototype = {
            __completeImg: function (img) {
                this.img = Util.rasterize(img);
                this.current.width = img.width;
                this.current.height = img.height;
                this.isActive = true;
                this.layer.sptialHashMapping.insert(this);
                this.last = Util.simpleObjectClone(this.current);
                this.base = Util.simpleObjectClone(this.current);
                this.final = Util.simpleObjectClone(this.current);
            },
            addAnimation: function (options, append) {
                this.timeline.__addAnimation(options, append);
                this.__updateFinal(options);
                return this;
            },
            __frameDispatch: function (frameStartTime, drawQosLimit, deadline) {
                var animationObj = this.timeline.__getAnimation();
  
                var box = Util.getBox(this.current);
                if (this.skipped === 0) {
                    if (this.QoSLevel > drawQosLimit) {
                        this.skipped = frameStartTime;
                        return;
                    }
                } else if (frameStartTime - this.skipped < deadline) {
                    return;
                }
                this.skipped = 0;
                if (animationObj === null) {
                    return;
                } else {
                    var animation = animationObj.animation;
                    var from = animation.from;
                    var to = animation.to;
                    var easingFunction = Util.EasingFunctions[animation.easing];
                    var timelapse = (new Date().getTime() - animationObj.startTime)/animation.duration;;
                    var animationPorp = Util.ANIMATION_PROP_ARR;
                    var duration = animation.duration;
                    var i = animationPorp.length;

                    while (i--) {
                        var animationName = animationPorp[i];
                        var value = Util.valueProjection(from[animationName], to[animationName],timelapse, easingFunction); 
                        this.last[animationName] = this.current[animationName];
                        this.current[animationName] = value;
                    }

                    this.last.keys = this.current.keys;
                    this.last.box = this.current.box;
                    this.current.keys = null;
                    this.current.box = null;
                    this.isActive = true;
                }
            },
            __updateFinal: function (options) {
                for (var key in options) {
                    this.final[key] = options[key];
                }
            },
            setZIndex: function (zIndex) {
                var zIndexMapping = this.layer.zIndexMapping;
                var oldIndex = zIndexMapping.indexOf(this);
                zIndexMapping.splice(oldIndex, 1);
                zIndexMapping.splice(zIndex, 0, this);
                return this;
            },
            set: function (options) {
                if (this.isActive) {
                    return
                }
                this.last = Util.simpleObjectClone(this.current);
                for (var key in options) {
                    this.current[key] = options[key];
                }
                this.__updateFinal(options);
                this.last.keys = this.current.keys;
                this.current.keys = null;
                this.isActive = true;
            }
        }
        return Model;
    });
