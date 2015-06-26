importScripts("../external/require.js");

require(["enums", "class/Timeline", "MathUtil"], function(enums, Timeline, MathUtil){
    var timelines = {};
    var channelPorts = [];
    
    var getChannelMessage = function(e) {
        var command = e.data.command;
        var payload = e.data.payload;
        var that = this;
        if(command === enums.Command.Worker.ProcessKeyFrame){
            if(payload.order === 0)
                 timelines[payload.layerName].clear();
            timelines[payload.layerName].frames[payload.order] = payload.frames;
        }
    };
    
    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        if(command === enums.Command.TimelineWorker.GetFrame) {
            var result = {
                id: payload.id,
                frame: timelines[payload.layerName].getFrame()
            };
            self.postMessage({
                command: command,
                payload: result
            });
        }else if(command === enums.Command.TimelineWorker.AddLayer) {
            timelines[payload.layerName] = new Timeline();
        }else if (command === enums.Command.TimelineWorker.RemoveLayer) {
            delete timelines[payload.layerName];    
        }else if(command === enums.Command.TimelineWorker.Init){
            var channelPort = e.ports[0];
            channelPort.onmessage = getChannelMessage;
            channelPorts.push(channelPort);
            console.log("Timeline Worker is inited");
        }
    };
    
    self.postMessage({
        command: enums.Command.TimelineWorker.Ready,
        payload: {}
    });
});