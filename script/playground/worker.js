console.log("start worker " + new Date().getTime());
var date = new Date().getTime();
var my = self;
setTimeout(function(){
    console.log("worker complete " + new Date().getTime());
    self.postMessage({});
    console.log("message posted " + new Date().getTime());
}, 100);
