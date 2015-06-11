require(['lib/main'], function(Framework){
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    fw.start();

    var layer = fw.createLayer("layer0");
    var mykeyframe = layer.createKeyframe(10000);
    for(var i=0; i<100; i++){
        var model = layer.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            url: "img/sensei.png",
            name: "model" + i
        });

        mykeyframe.addAnimation(model, {
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            orientation: Math.random() * 3600 - 1800,
            easing: "easeInOutCubic", //easeInOutCubic
            callback: function(){
            }
        });

    }
    
//    var animation = {modelName: "sensei"};
//    animation.animation = {
//        x: 100,
//        easing: "linear",
//        callback: function(){
//            console.log("Animation Finished");        
//        }
//    };

    

    setTimeout(function(){
        layer.commitKeyFrame(mykeyframe);
        layer.play();
    }, 1000);
    
    container.addEventListener("click", function(){
        
    }, false);
});