importScripts("../external/require.js");

require(["enums", "class/Timeline", "MathUtil"], function(enums, Timeline, MathUtil){
    var timelines = {};
    var channelPorts = [];
    var requestQueue = [];
    var getChannelMessage = function(e) {
        console.log(e);
        var command = e.data.command;
        var payload = e.data.payload;
        var that = this;
        if(command === enums.Command.Worker.ProcessKeyFrame){
            console.log("get frame from worker");
            timelines[payload.layerName].frames[payload.batchOrder] = payload.frames;
            if(requestQueue.indexOf(payload.layerName) !== -1) {
                getAndSendFrame(payload.layerName, false);
            }
        }
    };
    
    var getAndSendFrame = function(layerName, newRequest) {
        var frameSet;
        frameSet = timelines[layerName].getNextFrameSet();
        if(frameSet !== null){
            var result = {
                layerName: layerName,
                frameSetObj: frameSet
            };
            self.postMessage({
                command: enums.Command.TimelineWorker.GetFrameSet,
                payload: result
            });
            if(!newRequest){
                var index = requestQueue.indexOf(layerName);
                requestQueue.splice(index, 1);
            }
        }else{
            if(newRequest){
                requestQueue.push(layerName);
            }
        }        
    }
    
    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        if(command === enums.Command.TimelineWorker.GetFrameSet) {
            getAndSendFrame(payload.layerName, true);
        }else if(command === enums.Command.TimelineWorker.ResetLayer){
            timelines[payload.layerName].clear();
        }else if(command === enums.Command.TimelineWorker.AddLayer) {
            timelines[payload.layerName] = new Timeline();
        }else if (command === enums.Command.TimelineWorker.RemoveLayer) {
            delete timelines[payload.layerName];    
        }else if(command === enums.Command.TimelineWorker.Init){
            var channelPort = e.ports[0];
            channelPort.onmessage = getChannelMessage;
            channelPorts.push(channelPort);
            console.log("channel inited");
        }
    };
    
    self.postMessage({
        command: enums.Command.TimelineWorker.Ready,
        payload: {}
    });
});