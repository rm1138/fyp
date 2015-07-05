define(["lib/enums", "class/Animation", "lib/MathUtil"],
    function (enums, Animation, MathUtil) {
        var Model = Model || function (obj, layer) {
            var that = this;
            this.layer = layer;
            this.isActive = false;
            if (obj.type === "image") {
                this.type = enums.ModelType.Image;
                var img = new Image();
                img.src = obj.url;
                img.onload = function () {
                    that.img = this; //that.rasterize(this);
                    that.width = this.width;
                    that.height = this.height;
                    that.last.width = this.width;
                    that.last.height = this.height;
                    that.isActive = true;
                };
            } else if (obj.type === "canvas") {
                this.img = obj.canvas;
                this.width = obj.canvas.width;
                this.height = obj.canvas.height;
                this.last.width = obj.canvas.width;
                this.last.height = obj.canvas.height;
                this.isActive = true;
            }
            this.name = obj.name;

            this.x = obj.x;
            this.y = obj.y;
            this.orientation = obj.orientation ? obj.orientation : 0;
            this.opacity = obj.opacity ? obj.opacity : 1;
            this.scaleX = obj.scaleX ? obj.scaleX : 1;
            this.scaleY = obj.scaleY ? obj.scaleY : 1;

            if (!Model.uniqueId++) {
                Model.uniqueId = 1;
            }
            this.uniqueId = Model.uniqueId;
            this.animationQueue = [];

            this.currentFrame = null;
            this.frameStartTime = 0;
            this.framesQueue = [];

            this.last = {
                x: obj.x,
                y: obj.y,
                orientation: obj.orientation ? obj.orientation : 0,
                opacity: obj.opacity ? obj.opacity : 1,
                scaleX: obj.scaleX ? obj.scaleX : 1,
                scaleY: obj.scaleY ? obj.scaleY : 1
            };

            this.base = {
                x: 0,
                y: 0,
                scaleX: 0,
                scaleY: 0,
                opacity: 0,
                orientation: 0
            }

        };

        Model.prototype = {
            __update: function (options) {
                this.x = options.x;
                this.y = options.y;
                this.orientation = options.orientation;
                this.opacity = options.opacity;
                this.scaleX = options.scaleX;
                this.scaleY = options.scaleY;
            },
            addAnimation: function (options, append) {
                var animation = new Animation(this, options);
                var animationQueue = this.animationQueue;
                if (append) {
                    var lastAniamtion = animationQueue[animationQueue.length - 1];
                    if (lastAniamtion) {
                        animation.from = lastAniamtion.to;
                    }
                    this.animationQueue.push(animation);
                } else {
                    this.animationQueue = [animation];
                    this.framesQueue = [];
                    //this.currentFrame = null;
                }
                return this;
            },
            update: function (step) {
                var framesQueue = this.framesQueue;
                if (this.currentFrame === null) {
                    if (framesQueue.length === 0) {
                        return;
                    }
                    this.currentFrame = framesQueue.shift();
                    this.frameStartTime = new Date().getTime();
                    this.base.x = this.x;
                    this.base.y = this.y;
                    this.base.scaleX = this.scaleX;
                    this.base.scaleY = this.scaleY;
                    this.base.opacity = this.opacity;
                    this.base.orientation = this.orientation;
                }
                var currentFrame = this.currentFrame;
                var duration = Math.abs(currentFrame.duration);
                var sign = currentFrame.duration < 0 ? -1 : 1;
                var timelapse = new Date().getTime() - this.frameStartTime;
                if (timelapse > duration) {
                    this.currentFrame = null;
                    this.update(step);
                    return;
                }

                var animationPorp = MathUtil.ANIMATION_PROP_ARR;
                var i = animationPorp.length;

                while (i--) {
                    var animationName = animationPorp[i];
                    var frameIndex = Math.round(timelapse * (currentFrame[animationName].length - 1) / duration);
                    var value = this.base[animationName] + currentFrame[animationName][frameIndex];
                    if (animationName === 'x' || animationName === 'y' || animationName === "orientation") {
                        value = Math.round(value);
                    }
                    this.last[animationName] = this[animationName];
                    this[animationName] = value;
                }
                this.isActive = true;
            },
            setZIndex: function (zIndex) {
                var layer = this.layer;
                var zIndexNameMapping = layer.zIndexNameMapping;
                var oldIndex = zIndexNameMapping.indexOf(this.name);
                zIndexNameMapping.splice(oldIndex, 1);
                zIndexNameMapping.splice(zIndex, 0, this.name);
                return this;
            },
            getFirstAnimation: function () {
                return this.animationQueue[0];
            },
            removeFirstAnimation: function () {
                this.animationQueue.shift();
            },
            addFrames: function (frames) {
                this.framesQueue.push(frames);
            },
            rasterize: function (img) {
                var tempCanvas = document.createElement("canvas");
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                var tempCtx = tempCanvas.getContext("2d");
                tempCtx.drawImage(img, 0, 0, img.width, img.height);
                return this.convertCanvasToImage(tempCanvas);
            },
            convertCanvasToImage: function (canvas) {
                var image = new Image();
                image.src = canvas.toDataURL("image/png");
                return image;
            }
        }
        return Model;
    });
