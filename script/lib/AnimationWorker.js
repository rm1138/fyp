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