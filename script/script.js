require(['lib/main'], function (Framework) {
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;


    var layer1;
    var model = [];
    layer1 = fw.createLayer("layer1");
    fw.start();
    var modelCount = 5000;
    var moveModelCount = 5000;


    for (var i = 0; i < modelCount - 50; i++) {
        model[i] = layer1.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            name: "model" + i,
            opacity: 0.3,
            url: "img/square.svg",
            QoSLevel: 1 + Math.round(Math.random() * 10)
        });
    }

    for (; i < modelCount; i++) {
        model[i] = layer1.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            name: "model" + i,
            url: "img/sensei.png",
            QoSLevel: 0
        });

    }
    layer1.play();
    var j = 0;
    container.addEventListener("click", function (e) {

        for (var i = 0; i < moveModelCount; i++) {
            model[i + j].addAnimation({
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                //                opacity: Math.random() * 0.2 + 0.8,
                //                orientation: Math.random() * 360 - 180,
                //                scaleX: Math.random() * 1.2,
                //                scaley: Math.random() * 1.2,
                duration: 10000
            }, false);
        }
        j += i;
        if (j >= modelCount) {
            j = 0;
        }

    });
});
//Math.floor(Math.random() * 100)
