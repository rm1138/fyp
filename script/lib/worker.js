importScripts("../external/require.js");
var functionContainer = {};

require(["enums", "loopUtil", "imgUtil", "MathUtil"], function(enums, loopUtil, imgUtil, MathUtil){

    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        if(command === enums.Command.Worker.ProcessKeyFrame){
            var keyFrame = payload.keyFrame;
            var processLimit = payload.processLimit;
            var batchOrder = payload.batchOrder;
            var duration = payload.keyFrame.duration;
            var totalWorker = payload.totalWorker;
            var i = batchOrder
            var myfunc = function(){

                var end = (i+1)*processLimit > duration? duration : (i+1)*processLimit;
                if(end === i*processLimit)
                    return;
                var frames = MathUtil.processKeyFrame(keyFrame, i*processLimit, end, payload.processStep);
                var resultPayload = {
                    frames: frames,
                    layerName: keyFrame.layerName,
                    callBackId: keyFrame.callBackId,
                    batchOrder: i
                }
                self.postMessage({
                    command: command,
                    payload: resultPayload
                }, [frames.buffer]);
                i+= totalWorker;
                if(i < duration / processLimit){
                    setTimeout(myfunc, 100);
                }
            };
            myfunc();
            
        }else if(command === enums.Command.Worker.Init){
            console.log("Worker inited");
        }
    };
    self.postMessage({
        command: enums.Command.Worker.Ready,
        payload: {}
    });
});
/*

var ans = functionContainer["myFunct"]("abc");
console.log(ans);

    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        if(command === enums.command.updateObject){
            var ans = functionContainer["myFunct"]("pobb");
            console.log(ans);
        }else if(command === enums.command.init){
            console.info("Worker is inited");
        }else if(command === enums.command.injectFunction){
            var url = URL.createObjectURL(payload);
            importScripts(url);
        }
    };
    
//*/
//        onWorkerReturn: function(e){
//            
//            var command = e.data.command;
//            var payload = e.data.payload;
//            var that = this;
//            if(command === enums.command.processKeyFrame){
//                var layerName = e.data.layerName;
//                var layer = that.layerLookup[layerName];
//                layer.timeline.addKeyframe(payload);
//                this.workerReturnCount += 1;
//                console.log("worker returned");
//            } else if(command === enums.command.ready) {
//                that.readyWorker += 1;
//                e.target.postMessage({command: enums.command.init, payload: {}});    
//            }
//        }