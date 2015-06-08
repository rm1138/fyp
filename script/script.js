require(['lib/main'], function(AnimatedCanvas){
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var animatedFW = new AnimatedCanvas("myCanvas");
    animatedFW.start();
    var loopId = 0;
    var addLayer = function(x){
        var layer = animatedFW.createLayer("layer" + x);
        var count = 100;
        while(count){
            layer.addModel({
                type: "image",
                x: Math.round(Math.random() * container.width),
                y: Math.round(Math.random() * container.height),
                url: "img/sensei.png",
                name: "sensei" + count
            });
            count--;
        };
        if(x >= 2){
            clearInterval(loopId);  
            animatedFW.deleteLayer("layer0");
        }
    }
    
    var x = 0;
    loopId = setInterval(function() {
        addLayer(x);
        x++;
    }, 1000);    
    
    //var arr = [];
    //    
    //for(var i=0; i<imgCount; i+=1){
    //    var myObj = animatedFW.addModel({
    //        name: "object" + i,
    //        url: "img/sensei.png",
    //        x: 0,//Math.random() * window.innerWidth,
    //        y: 0,//Math.random() * window.innerHeight,
    //        type: "image"
    //    });
    //    arr.push(myObj);
    //}
    //var move = function() {
    //
    //    var x = Math.random() * window.innerWidth;
    //    var y = Math.random() * window.innerHeight;        
    //
    //    arr[Math.floor(Math.random() * imgCount)].animate({
    //        x: x,
    //        y: y,
    //        duration: Math.random()*1000
    //    });
    //    //setTimeout(move, 10);
    //}
    ////move();
    //

//    var last = new Date().getTime();
//    var doTouchStart = function (e){
//        var now = new Date().getTime();
//        var delta = now - last;
//        last = now;
//        alert(1000/(delta/animatedFW.__frameCount));
//        animatedFW.__frameCount = 0;
//    }
//    
//var canvas = document.getElementById("myCanvas");
//    canvas.addEventListener("touchstart", doTouchStart, false);
//canvas.addEventListener("click", function(){animatedFW.removeRandomModel()}, false);
});