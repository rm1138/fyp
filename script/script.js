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
    var toggleQoS = document.getElementById('QoS');
    toggleQoS.onclick = function () {
        fw.__configIsQoSEnable = !fw.__configIsQoSEnable;
    }
    var toggleSpatialHashing = document.getElementById('SpatialHashing');
    toggleSpatialHashing.onclick = function () {
        fw.__configIsUseSpatialHashing = !fw.__configIsUseSpatialHashing;
    }
    var deadline = document.getElementById('deadline');
    deadline.onchange = function (e) {
        var val = e.target.value;
        if (val == -1) {
            fw.__configRenderDeadline = Number.POSITIVE_INFINITY;
        } else {
            fw.__configRenderDeadline = parseFloat(val);
        }
    }

    var layer1;
    var model = [];
    layer1 = fw.createLayer("layer1");

    var modelCount = 100;
    var moveModelCount = 100;


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

    container.addEventListener('click', function () {
        fw.start();
        layer1.play();

        setTimeout(function () {
            for (var i = 0; i < modelCount; i++) {
                model[i].addAnimation({
                    x: Math.random() * container.width,
                    y: Math.random() * container.height,
                    duration: 1000
                }, true);
            }

        }, 1000);
        setTimeout(function () {
            layer1.stop();
            fw.pause();
            var deltaArr = fw.renderer.delta;
            var str = deltaArr.join(',');
            var csvContent = "data:text/csv;charset=utf-8,";
        }, 22000);
    });

});
//Math.floor(Math.random() * 100)
