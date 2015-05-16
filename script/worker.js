onmessage = function(e){
    e = JSON.parse(e.data);
    var delta = e.delta;
    var object = e.object;

    if(object.remain > 0){
        if(object.remain - delta > 0){
            object.remain -= delta;
        }else{
            object.remain = 0;
        }
        var tempX = (object.toX - object.originX) / object.duration;
        tempX = tempX * (object.duration-object.remain);
        
        var tempY = (object.toY - object.originY) / object.duration;
        tempY = tempY * (object.duration-object.remain);
        
        object.x = object.originX + tempX;
        object.y = object.originY + tempY;
    }
    self.postMessage(JSON.stringify(e));
};