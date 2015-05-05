var animatedFW = new AnimatedCanvas("myCanvas");
animatedFW.run();
var layer = animatedFW.newLayer("layer1");




var count = 0;
var doTouchStart = function (e){
    e.preventDefault();
    canvas_x = e.targetTouches[0].pageX;
    canvas_y = e.targetTouches[0].pageY; 
    var animateObject = layer.addObject({
        name: "object" + count,
        url: "img/sensei.png",
        x: 0,
        y: 0
    });

    animateObject.animate({
        x: canvas_x,
        y: canvas_y,
        duration: 1000
    });
    count++;
}

var canvas = document.getElementById("myCanvas");
canvas.addEventListener("touchstart", doTouchStart, false);