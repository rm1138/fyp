var animatedFW = new AnimatedCanvas("myCanvas");
animatedFW.run();
var arr = []; 
var myObj;


var x = Math.random() * window.innerWidth;
var y = Math.random() * window.innerHeight;

myObj = new AnimateObject({
    name: "object1",
    url: "img/sensei.png",
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
});
arr.push(myObj);
animatedFW.addObject(myObj);

myObj.animate({
    x: x,
    y: y,
    duration: 1000
});


window.onkeydown = function() {
//    for(var i=arr.length-1; i>=0; i-=1){
    var x = Math.random() * window.innerWidth;
    var y = Math.random() * window.innerHeight;        
//        
//        var name = arr[i].name;
//        var obj = animatedFW.get(name);
//        obj.animate({
//            x: x,
//            y: y,
//            duration: 1000
//        });
//    }
    myObj.animate({
        x: x,
        y: y,
        duration: 1000
    });
    
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