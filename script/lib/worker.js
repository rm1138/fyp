importScripts("../external/require.js");
var functionContainer = {};

require(["enums", "loopUtil", "imgUtil", "MathUtil"], function(enums, loopUtil, imgUtil, MathUtil){
    
    var init = function (payload) {
        
    }
    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        if(command === enums.Command.Worker.ProcessKeyFrame){
            var keyFrame = payload.keyFrame;
            var start = payload.start;
            var end = payload.end;
            var processLimit = payload.processLimit;
            var order = payload.order;
            for(var i=start; i<end; i+= processLimit){
                var frames = MathUtil.processKeyFrame(keyFrame, i, i+processLimit, payload.step);
                var resultPayload = {
                    frames: frames,
                    layerName: keyFrame.layerName,
                    callBackId: keyFrame.callBackId,
                    order: order++,
                    start: i,
                    end: i + processLimit,
                    workerId: payload.workerId
                }
                self.postMessage({
                    command: command,
                    payload: resultPayload
                });
            }
            
        }else if(command === enums.Command.Worker.Init){
            init(payload);
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