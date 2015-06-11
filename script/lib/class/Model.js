define(["lib/Global", "lib/enums"],
    function(Global, enums){
        var Model = Model || function(obj){
            Global.modelCount += 1;
            var that = this;
            if(obj.type === "image") {
                this.type = enums.ModelType.Image;
                var img = new Image();
                img.src = obj.url;
                img.onload = function(){
                    that.img = this;//that.resizeImage(this,1.2);    
                    that.width = this.width;
                    that.height = this.height;
                    Global.readyModelCount += 1;
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
            this.enlargeRatio = 1.0;
        };
    
        Model.prototype = {
            __update: function(obj){
                for(prop in obj){
                    this[prop] = obj[prop];    
                }
            }
        }
        return Model;
});

/*

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