var i;

var doSomthing = function () {
    return;
}
var loop = function() {
    var w = new Worker("script/playground/worker.js");
    w.onmessage = function (e) {
        console.log("worker return " + new Date().getTime());
    };
    
    setTimeout(function(){
        i = 0;
        console.log("start loop " + new Date().getTime());
        while(i < 1000000000){
            doSomthing();
            i++;
        };
        console.log("stop loop " + new Date().getTime());
    }, 150);
}

loop();