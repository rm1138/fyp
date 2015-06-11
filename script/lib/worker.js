importScripts("../external/require.js");
var functionContainer = {};

require(["enums", "loopUtil", "imgUtil", "MathUtil"], function(enums, loopUtil, imgUtil, MathUtil){
 
    onmessage = function(e){
        var command = e.data.command;
        var payload = e.data.payload;
        if(command === enums.command.processKeyFrame){
            var token = e.data.token;
            var result = MathUtil.processKeyFrame(payload);
            postMessage({command: command, payload: result, token: token});
        }else if(command === enums.command.init){
            console.info("Worker is inited");
        }
    };
    self.postMessage({
        command: enums.command.ready
    });
});

/*

var ans = functionContainer["myFunct"]("abc");
console.log(ans);

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
    
*/