define(function () {
    var enums = {
        ModelType: {
            Image: 0,
            Text: 1,
            Rect: 2,
            Cycle: 3
        },
        Command: {
            Worker: {
                Init: "Worker Init",
                Ready: "Worker Ready",
                ProcessAnimations: "Worker Process Animations"
            }
        },
        Timeline: {
            PlaybackDirection: {
                forward: "forward",
                backward: "backward"
            }
        },
        LayerProperties: {
            UI: 1,
            ScrollPane: 2,
            Background: 3
        },
        LayerState: {
            playing: 0,
            stopped: 1
        }
    }
    return enums;
});
