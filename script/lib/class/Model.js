define(["lib/enums", "class/Animation", "lib/MathUtil"],
    function(enums, Animation, MathUtil){
        var Model = Model || function(obj){

            var that = this;
            if(obj.type === "image") {
                this.type = enums.ModelType.Image;
                var img = new Image();
                img.src = obj.url;
                img.onload = function(){
                    that.img = this;//that.rasterize(this);    
                    that.width = this.width;
                    that.height = this.height;
                };
            }else if(obj.type === "canvasObject"){
                this.img = document.createElement("canvas");
                var ctx = img.getContext("2d");
                /*
                    To be implement
                    Simple Canvas API
                */
            }
            this.name = obj.name;
            this.x = obj.x;
            this.y = obj.y;
            this.orientation = 0;
            this.opacity = 1.0;
            this.scaleX  = 1.0;
            this.scaleY  = 1.0;
            this.animationQueue = [];
            this.currentFrame = null;
            this.frameStartTime = 0;
            this.framesQueue = [];
        };
    
        Model.prototype = {
            __update: function(options){
                this.x = options.x;
                this.y = options.y;
                this.orientation = options.orientation;
                this.opacity = options.opacity;
                this.scaleX  = options.scaleX;
                this.scaleY  = options.scaleY;
            },
            addAnimation: function(options, append){
                var animation = new Animation(this, options);
                var frameQueue = this.framesQueue;
                var animationQueue = this.animationQueue;
                if(append){
                    var i = animationQueue.length;
                    var j = frameQueue.length;
                    if(i--){
                        animation.from = animationQueue[i].to;
                    }else if(j--){
                        MathUtil.getAnimationPropFromTypedArray(animation.from , frameQueue[j], frameQueue[j].length-MathUtil.ANIMATION_PROP_ARR.length);
                    }
                    this.animationQueue.push(animation);
                }else{
                    this.animationQueue = [animation];
                    this.framesQueue = [];
                }
            },
            getModelAnimation: function(batchSize){
                var animationQueue = this.animationQueue;
                if(animationQueue.length > 0){
                    var temp = animationQueue.shift();
                    temp = temp.split(batchSize);
                    if(temp.remain !== null){
                        animationQueue.unshift(temp.remain);    
                    }
                    return temp.first;
                }else{
                    return null;    
                }
            },
            getRenderData: function(step){
                var framesQueue = this.framesQueue;
                if(this.currentFrame === null){
                    if(framesQueue.length === 0){
                        return this;        
                    }
                    this.currentFrame = framesQueue.shift();
                    this.frameStartTime = new Date().getTime();
                } 
                var currentFrame = this.currentFrame;
                var delta = new Date().getTime() - this.frameStartTime;
                //console.log(this.name + " " + currentFrame.length);    
                
                var animationProp = MathUtil.ANIMATION_PROP_ARR;
                var frameIndex = Math.round(delta/step) * animationProp.length;
                if(frameIndex + animationProp.length > currentFrame.length){
                    this.currentFrame = null;
                    return this.getRenderData(step);    
                }

                MathUtil.getAnimationPropFromTypedArray(this, currentFrame, frameIndex);
 
                return this;
            },
            rasterize: function(img){
                var tempCanvas = document.createElement("canvas");
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                var tempCtx = tempCanvas.getContext("2d");
                tempCtx.drawImage(img, 0, 0);
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

/*
            convertToCtx: function(img){
                var tempCanvas = document.createElement("canvas");
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                var tempCtx = tempCanvas.getContext("2d");
                tempCtx.drawImage(img, 0, 0);
                return this.convertCanvasToImage(tempCanvas);
            },
            convertCanvasToImage: function (canvas) {
                var image = new Image();
                image.src = canvas.toDataURL("image/png");
                return image;
            }
,
            resizeImage: function(img, quality){
                var tempCanvas = document.createElement("canvas");
                tempCanvas.width = img.width/quality;
                tempCanvas.height = img.height/quality;
                var tempCtx = tempCanvas.getContext("2d");
                tempCtx.mozImageSmoothingEnabled = false;
                tempCtx.webkitImageSmoothingEnabled = false;
                tempCtx.msImageSmoothingEnabled = false;
                tempCtx.imageSmoothingEnabled = false;
                tempCtx.drawImage(img, 0, 0, img.width/quality, img.height/quality);
                return this.convertCanvasToImage(tempCanvas);
            },
            convertCanvasToImage: function (canvas) {
                var image = new Image();
                image.src = canvas.toDataURL("image/png");
                return image;
            }
            
*/