onmessage = function(e){
    e = JSON.parse(e.data);
    var delta = e.delta;
    var objects = e.objects;
    var layer = e.layer;
    
    var objectCount = objects.length;
    for(var i=0; i<objectCount; i+=1){
        var object = objects[i];
        if(object.remain > 0){
            if(object.remain - delta > 0){
                object.remain -= delta;
            }else{
                object.remain = 0;
            }
            object.x = abs(object.toX - object.originX) / object.duration;
            object.x = object.x * (object.duration-object.remain);
            object.y = abs(object.toY - object.originY) / object.duration;
            object.y = object.y * (object.duration-object.remain);

        }
    }
    self.postMessage(JSON.stringify(e));
};

var abs = function(num){
    return Math.abs(num);
}