importScripts("../external/require.js");
var functionContainer = {};

require(["enums", "loopUtil", "imgUtil", "MathUtil"], function(enums, loopUtil, imgUtil, MathUtil){

    var currentJob = null;
    var step = MathUtil.step;
    var batchSize = 0;
    
    var processKeyFrame = function() {

        var keyFrame = currentJob.keyFrame;
        var batchOrder = currentJob.batchOrder;
        var duration = currentJob.keyFrame.duration;
        var totalWorker = currentJob.totalWorker;
        var queueID = currentJob.queueID;

        var end = (batchOrder+1)*batchSize > duration? duration : (batchOrder+1)*batchSize;
        if(batchOrder >= duration / batchSize || end === batchOrder*batchSize){
            return;
        }

        var frames = MathUtil.processKeyFrame(keyFrame, batchOrder*batchSize, end, step);

        var resultPayload = {
            frames: frames,
            layerName: keyFrame.layerName,
            callBackId: keyFrame.callBackId,
            batchOrder: batchOrder,
            queueID: queueID
        };

        self.postMessage({
            command: enums.Command.Worker.ProcessKeyFrame,
            payload: resultPayload
        }, [frames.buffer]);
        currentJob.batchOrder += totalWorker;     
    }
        
        
    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        
        if(command === enums.Command.Worker.Continue){
            processKeyFrame();
        }else if(command === enums.Command.Worker.UpdateInfo){
            step = payload.step;
            batchSize = payload.batchSize;
        }else if(command === enums.Command.Worker.ProcessKeyFrame){
            currentJob = payload;
            processKeyFrame();
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