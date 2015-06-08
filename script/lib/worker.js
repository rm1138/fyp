importScripts("../external/require.js");
var functionContainer = {};

require(["enums", "loopUtil", "imgUtil"], function(enums, loopUtil, imgUtil){
    var updateObjects = function(arr, delta) {
        loopUtil.fastLoop(arr, imgUtil.calculateCoordinate);
        return arr;
    };

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
    self.postMessage({
        command: enums.command.ready
    });
});

/*

var ans = functionContainer["myFunct"]("abc");
console.log(ans);

*/