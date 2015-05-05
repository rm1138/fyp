var animatedFW = new AnimatedCanvas("myCanvas");
animatedFW.run();
var layer = animatedFW.newLayer("layer1");
var arr = [];

window.onkeydown = function() {
    for(var i=0; i<300; i++){
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;

        var animateObject = layer.addObject({
            name: "object" + i,
            url: "img/sensei.png",
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        });

        animateObject.animate({
            x: x,
            y: y,
            duration: 10000
        });

        arr.push(animateObject);
    }
}

function shift(){
    console.log(layer);
    for(var i=arr.length-1; i>=0; i-=1){
        var x = Math.random() * window.innerWidth;
        var y = Math.random() * window.innerHeight;        
        
        arr[i].animate({
            x: x,
            y: y,
            duration: 1000
        });
    }
    console.log("shifted");
}
//var count = 0;
//var doTouchStart = function (e){
//    e.preventDefault();
//    canvas_x = e.targetTouches[0].pageX;
//    canvas_y = e.targetTouches[0].pageY; 
//    var animateObject = layer.addObject({
//        name: "object" + count,
//        url: "img/sensei.png",
//        x: 0,
//        y: 0
//    });
//
//    animateObject.animate({
//        x: canvas_x,
//        y: canvas_y,
//        duration: 1000
//    });
//    count++;
//}
//
//var canvas = document.getElementById("myCanvas");
//canvas.addEventListener("touchstart", doTouchStart, false);