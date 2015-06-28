require(['lib/main'], function(Framework){
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;
    fw.start();

    var layer;
    var model = [];
    setTimeout(function(){
        layer = fw.createLayer("layer0");
        for(var i=0; i<200; i++){
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
        layer.play(); 
    }, 1000);
    

    
    container.addEventListener("click", function(){
        setInterval(function(){
        var mykeyframe = layer.createKeyframe(1000, function(){
            console.log("my frame is completed");
        });
        var easing = "linear";
        for(var i=0; i<200; i++){
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
        }, 1000);
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