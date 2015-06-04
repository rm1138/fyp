importScripts("../external/require.js");


require(["enums", "loopUtil"], function(enums, loopUtil){
    var updateObjects = function(arr, delta) {
        loopUtil.fastLoop(arr, 
            function(item){ 
                if(item.remain > 0){
                    if(item.remain - delta > 0){
                        item.remain -= delta;
                    }else{
                        item.remain = 0;
                    }
                    var tempX = (item.toX - item.originX) / item.duration;
                    tempX *= (item.duration-item.remain);

                    var tempY = (item.toY - item.originY) / item.duration;
                    tempY *= (item.duration-item.remain);

                    item.x = item.originX + tempX;
                    item.y = item.originY + tempY;
                }
            }
        );
        return arr;
    };

    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        if(command === enums.command.updateObject){
            updateObjects(payload.objects, payload.delta);
            self.postMessage({
                command: enums.command.updateObject,
                payload: payload
            }); 
        }else if(command === enums.command.init){
            console.info("Worker is inited");
        }
    };
    self.postMessage({
        command: enums.command.ready
    });
});