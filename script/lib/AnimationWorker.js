importScripts("../external/require.js");
var functionContainer = {};

require(["enums", "MathUtil"], function (enums, MathUtil) {

    onmessage = function (e) {
        var command = e.data.command;
        var payload = e.data.payload;

        if (command === enums.Command.Worker.ProcessAnimations) {
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
        } else if (command === enums.Command.Worker.Init) {
            workerId = e.data.workerId;
            console.log("Worker inited");
        }
    };
    self.postMessage({
        command: enums.Command.Worker.Ready,
        payload: {}
    });
});
