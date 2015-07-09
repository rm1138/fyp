require(['lib/main'], function (Framework) {
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;

    var toggleRedrawRegion = document.getElementById("toggleRedrawRegion");
    toggleRedrawRegion.onclick = function () {
        fw.__configShowRedrawArea = !fw.__configShowRedrawArea;

    }

    var layer1;
    var model = [];
    layer1 = fw.createLayer("layer1");
    fw.start();
    var modelCount = 100;
    var moveModelCount = 10;
    for (var i = 0; i < modelCount;) {

        model[i] = layer1.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            name: "model" + i,
            url: "img/square.svg"
        });
        i++;
    }
    layer1.play();
    var j = 0;
    container.addEventListener("click", function (e) {
        setInterval(function () {
            for (var i = 0; i < moveModelCount; i++) {
                model[i + j].addAnimation({
                    x: Math.random() * container.width,
                    y: Math.random() * container.height,
                    opcity: Math.random() * 0.2 + 0.8,
                    orientation: Math.random() * 360 - 180,
                    scaleX: Math.random() * 1.2,
                    scaley: Math.random() * 1.2,
                    duration: Math.random() * 1000
                }, false);
            }
            j += i;
            if (j >= modelCount) {
                j = 0;
            }
        }, 500);
    });
});
//Math.floor(Math.random() * 100)
