importScripts("../external/require.js");
var functionContainer = {};

require(["enums", "MathUtil"], function (enums, MathUtil) {

    onmessage = function (e) {
        var command = e.data.command;
        var payload = e.data.payload;

        if (command === enums.Command.Worker.ProcessAnimations) {
            var frames = MathUtil.processAnimations(payload.animations, payload.step);
            var result = {
                frames: frames,
                animations: payload.animations,
                step: payload.step
            };

            self.postMessage({
                command: command,
                payload: result,
            }, [result.frames.buffer, result.animations.buffer]);
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
