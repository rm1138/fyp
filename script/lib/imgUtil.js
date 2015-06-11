define(function(){
    "use strict";
    var ImgUtil = ImgUtil || {};

    ImgUtil.isOverlap = function(x1, y1, w1, h1, x2, y2, w2, h2){
        var result = false;
        
        if (x1 < x2+w2 && x1+w1 > x2 && y1 < y2+h2 && y1+h1 > y2){
            result = true;    
        }
        return result;
    }
    
    ImgUtil.toUint8ClampedArray = function(img){
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;  
        
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        return imageData.data;
    }
    
    ImgUtil.calculateCoordinate = function(obj){
       if(obj.remain > 0){
            if(obj.remain - delta > 0){
                obj.remain -= delta;
            }else{
                obj.remain = 0;
            }
            var tempX = (obj.toX - obj.originX) / obj.duration;
            tempX *= (obj.duration-obj.remain);

            var tempY = (obj.toY - obj.originY) / obj.duration;
            tempY *= (obj.duration-obj.remain);

            obj.x = obj.originX + tempX;
            obj.y = obj.originY + tempY;
       }
    }
    return ImgUtil;
});