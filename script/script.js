require(['lib/main'], function (Framework) {
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;
    fw.start();

    var layer;
    var model = [];

    layer = fw.createLayer("layer0");
    for (var i = 0; i < 1000; i++) {
        model[i] = layer.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            url: "img/sensei.png",
            name: "model" + i,
            onCollision: function () {
                console.log("model" + i + " hit other object");
            }
        });
    }
    layer.play();

    var started = true;
    container.addEventListener("click", function () {
        setInterval(function () {
            var easing = "linear";
            for (var i = 0; i < 1000; i++) {
                model[i].addAnimation({
                    x: Math.random() * container.width,
                    y: Math.random() * container.height,
                    orientation: Math.random() * 360,
                    easing: easing, //easeInOutCubic
                    scaleX: Math.random() * 1.2,
                    scaleY: Math.random() * 1.2,
                    opacity: Math.random(),
                    duration: Math.random() * 10000
                }, true);
            }
        }, 1000);
    }, false);
});
//Math.floor(Math.random() * 100)
