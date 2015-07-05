require(['lib/main'], function (Framework) {
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;


    var layer1, layer2, layer3, layer4, layer5;
    var model = [];
    layer1 = fw.createLayer("layer1");
    fw.start();

    for (var i = 0; i < 5;) {

        model[i] = layer1.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            name: "model" + i,
            url: "img/sensei.png"
        });
        i++;
    }
    layer1.play();
    var started = true;
    var j = 500;
    container.addEventListener("click", function () {
        //setInterval(function () {
        var easing = "easeInOutQuad";
        for (var i = 0; i < 2; i++) {
            model[i].addAnimation({
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                orientation: Math.random() * 360 - 180,
                easing: easing, //easeInOutCubic
                scaleX: Math.random() * 1.2,
                scaleY: Math.random() * 1.2,
                opacity: Math.random() * 0.2 + 0.8,
                duration: Math.random() * 1000 + 1500
            }, false)
        }
        //}, 500);
    }, false);
});
//Math.floor(Math.random() * 100)
