require(['lib/main'], function(AnimatedCanvas){
var animatedFW = new AnimatedCanvas("myCanvas");
animatedFW.run();

var x = Math.random() * window.innerWidth;
var y = Math.random() * window.innerHeight;

var myObj = animatedFW.createObject({
    name: "object1",
    url: "img/sensei.png",
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
});

myObj.animate({
    x: x,
    y: y,
    duration: 1000
});


window.onkeydown = function() {
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;        

    myObj.animate({
        x: x,
        y: y,
        duration: Math.random()*1000
    });
    
    console.log("shifted");
}
var count = 0;
var doTouchStart = function (e){
    e.preventDefault();
    canvas_x = e.targetTouches[0].pageX;
    canvas_y = e.targetTouches[0].pageY; 


    myObj.animate({
        x: canvas_x,
        y: canvas_y,
        duration: 1000
    });
    count++;
    if(count===3){
        alert("Chuii <3");    
    }
}

var canvas = document.getElementById("myCanvas");
canvas.addEventListener("touchstart", doTouchStart, false);
});