define(["lib/enums", "class/Animation", "lib/Util", "class/Timeline"],
    function (enums, Animation, Util, Timeline) {
        var Model = function (obj, layer) {
            var that = this;
            this.layer = layer;
            this.name = obj.name;
            this.timeline = new Timeline(this);
            this.isActive = false;
            this.needRender = false;
            this.QoSLevel = typeof obj.QoSLevel !== "undefined" ? obj.QoSLevel : 1;
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
            } else if (obj.type === "canvas") {
                this.type = enums.ModelType.Canvas;
                this.__completeImg(obj.canvas);
            }
            this.setting = false;
            this.skipped = false;
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
            __update: function (options) {
                this.pendingValue = options;
            },
            addAnimation: function (options, append) {
                this.timeline.__addAnimation(options, append);
                this.__updateFinal(options);
                return this;
            },
            __frameDispatch: function (drawQosLimit) {
                var framesObj = this.timeline.__getFrame();
                if (this.QoSLevel > drawQosLimit) {
                    return;
                }

                if (framesObj === null) {
                    return;
                } else {
                    var frames = framesObj.frames;
                    var timelapse = new Date().getTime() - framesObj.startTime;
                    var animationPorp = Util.ANIMATION_PROP_ARR;
                    var duration = frames.duration;
                    var i = animationPorp.length;

                    if (timelapse === 0) {
                        this.base = Util.simpleObjectClone(this.current);
                    }
                    while (i--) {
                        var animationName = animationPorp[i];
                        var frameIndex = Math.round(timelapse * (frames[animationName].length - 1) / duration);
                        if (frameIndex >= frames[animationName].length) {
                            frameIndex = frames[animationName].length - 1;
                        }
                        var value = this.base[animationName] + frames[animationName][frameIndex];
                        this.last[animationName] = this.current[animationName];
                        this.current[animationName] = value;
                    }

                    this.last.keys = this.current.keys;
                    this.current.keys = null;
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
