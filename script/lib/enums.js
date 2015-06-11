define(function(){
    var enums = {
        ModelType:{
            Image: 0,
            Text: 1,
            Rect: 2,
            Cycle: 3
        },
        command:{
            error: -1,
            init: 0,
            ready: 1,
            updateObject: 2,
            injectFunction: 3,
            processKeyFrame: 4
        },
        LayerProperties:{
            UI: 1,
            ScrollPane: 2,
            Background: 3
        },
        LayerState:{
            playing: 0,
            stopped: 1
        }
    }
    return enums;
});