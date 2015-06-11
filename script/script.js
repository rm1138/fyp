require(['lib/main'], function(Framework){
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    fw.start();

    var easingArr = [
        "linear","easeInQuad","easeOutQuad","easeInOutQuad","easeInCubic","easeOutCubic","easeInOutCubic","easeInQuart","easeOutQuart", "easeInOutQuart","easeInQuint","easeOutQuint","easeInOutQuint"
    ];
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
        var easing = easingArr[Math.floor((Math.random() * 13))];

        mykeyframe.addAnimation(model, {
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            orientation: Math.random() * 360,
            easing: easing, //easeInOutCubic
            scaleX: Math.random() * 1.2,
            scaleY: Math.random() * 1.2,
            opacity: Math.random(),
            callback: function(){
                console.log("Key frame completed");
            }
        });

    }

  
    layer.commitKeyFrame(mykeyframe);
    layer.play();
 
    
    container.addEventListener("click", function(){
        
    }, false);
});
//
//        var easing = easingArr[Math.floor((Math.random() * 13))];
//
//        mykeyframe.addAnimation(model, {
//            x: Math.random() * container.width,
//            y: Math.random() * container.height,
//            orientation: Math.random() * 360,
//            easing: easing, //easeInOutCubic
//            scaleX: Math.random() * 1.2,
//            scaleY: Math.random() * 1.2,
//            opacity: Math.random(),
//            callback: function(){
//                console.log("Key frame completed");
//            }
//        });