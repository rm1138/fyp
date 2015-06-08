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
            injectFunction: 3
        }
    }
    return enums;
});