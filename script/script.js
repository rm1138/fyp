require(['lib/main'], function(Framework){
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;
    fw.start();

    var easingArr = [
        "linear","easeInQuad","easeOutQuad","easeInOutQuad","easeInCubic","easeOutCubic","easeInOutCubic","easeInQuart","easeOutQuart", "easeInOutQuart","easeInQuint","easeOutQuint","easeInOutQuint"
    ];
    var layer = fw.createLayer("layer0");
    var layer2 = fw.createLayer("layer1");
    var rotate = layer2.addModel({
            type: "image",
            x: 200,
            y: 200,
            url: "img/sensei.png",
            name: "rotate"
        });
    
    var rotate2 = layer2.addModel({
            type: "image",
            x: 200,
            y: 200,
            orientation: 360,
            url: "img/sensei.png",
            name: "rotate2"
        });
    
    var kf = layer2.createKeyframe(1000);
    kf.addAnimation(rotate, {
        orientation: 360
    });
    setTimeout(function(){
        kf.commit();
        layer2.play();
    }, 1000);
    
    var model = [];
    for(var i=0; i<100; i++){
        model[i] = layer.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            url: "img/sensei.png",
            name: "model" + i,
            onCollision: function(){
                console.log("model" + i + " hit other object");    
            }
        });
    }
    
    container.addEventListener("click", function(){
        var mykeyframe = layer.createKeyframe(10000, function(){
            console.log("my frame is completed");
        });
        var easing = easingArr[Math.floor((Math.random() * 13))];
        easing = "linear";
        for(var i=0; i<100; i++){
            mykeyframe.addAnimation(model[i], {
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                orientation: Math.random() * 360,
                easing: easing, //easeInOutCubic
                scaleX: Math.random() * 1.2,
                scaleY: Math.random() * 1.2,
                opacity: Math.random()
            });
        }
        mykeyframe.commit();
        layer.play();   
       // setTimeout(function(){fw.pause();}, 1000);
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