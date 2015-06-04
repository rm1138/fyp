require(['lib/main'], function(AnimatedCanvas){
var animatedFW = new AnimatedCanvas("myCanvas", true);
var imgCount = 10;

animatedFW.run();


var arr = [];
    
for(var i=0; i<imgCount; i+=1){
    var myObj = animatedFW.addModel({
        name: "object" + i,
        url: "img/sensei.png",
        x: 0,//Math.random() * window.innerWidth,
        y: 0,//Math.random() * window.innerHeight,
        type: "image"
    });
    arr.push(myObj);
}
var move = function() {

    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;        

    arr[Math.floor(Math.random() * imgCount)].animate({
        x: x,
        y: y,
        duration: Math.random()*1000
    });
    //setTimeout(move, 10);
}
//move();


var last = new Date().getTime();
var doTouchStart = function (e){
    var now = new Date().getTime();
    var delta = now - last;
    last = now;
    alert(1000/(delta/animatedFW.__frameCount));
    animatedFW.__frameCount = 0;
}

var canvas = document.getElementById("myCanvas");
canvas.addEventListener("touchstart", doTouchStart, false);
canvas.addEventListener("click", doTouchStart, false);
});