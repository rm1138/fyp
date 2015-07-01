importScripts("../external/require.js");
var functionContainer = {};

require(["enums", "loopUtil", "imgUtil", "MathUtil"], function(enums, loopUtil, imgUtil, MathUtil){
    
    var processKeyFrame = function() {
        var keyFrame = currentJob.keyFrame;
        var batchOrder = currentJob.batchOrder;
        var duration = currentJob.keyFrame.duration;
        var totalWorker = currentJob.totalWorker;
        var queueID = currentJob.queueID;

        var end = (batchOrder+1)*batchSize > duration? duration : (batchOrder+1)*batchSize;
        if(batchOrder >= duration / batchSize || end === batchOrder*batchSize){
            self.postMessage({
                command: enums.Command.Worker.FinishJob,
                payload: {},
                workerId: workerId
            });
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
            payload: resultPayload,
            workerId: workerId
        }, [frames.buffer]);
        currentJob.batchOrder += totalWorker;     
    }

            
    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        
        if(command === enums.Command.Worker.ProcessAnimations){
            var temp = MathUtil.processAnimations(payload.animations, payload.modelNamesMap, payload.step, payload.batchSize);
            var result = {
                frameId: payload.frameId,
                frames: temp.frames,
                nameMap: temp.nameMap
            };
            
            self.postMessage({
                command: command,
                payload: result,
            }, [result.frames.buffer]);
        }else if(command === enums.Command.Worker.Init){
            workerId = e.data.workerId;
            console.log("Worker inited");
        }
    };
    self.postMessage({
        command: enums.Command.Worker.Ready,
        payload: {}
    });
});