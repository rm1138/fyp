require(['lib/main'], function(Framework){
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;
    fw.start();

    var layer;
    var model = [];

    layer = fw.createLayer("layer0");
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
    layer.play(); 

    setInterval(function(){
        var mykeyframe = layer.createKeyframe(100, function(){
            console.log("my frame is completed");
        });
        var easing = "linear";
        for(var i=0; i<10; i++){
            mykeyframe.addAnimation(model[Math.floor(Math.random() * 100)], {
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
    }, 100);

    var started = true;
    container.addEventListener("click", function(){
        if(started){
            layer.stop(); 
        }else {
            layer.play(); 
        }
        started = !started;
    }, false);
});