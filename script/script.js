require(['lib/main'], function (Framework) {
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;

    var toggleRedrawRegion = document.getElementById("toggleRedrawRegion");
    toggleRedrawRegion.onclick = function (e) {
        fw.__configShowRedrawArea = !fw.__configShowRedrawArea;
        if (fw.__configShowRedrawArea) {
            e.target.innerHTML = "Disable Redraw Region";
        } else {
            e.target.innerHTML = "Enable Redraw Region";
        }
    }
    var toggleQoS = document.getElementById('QoS');
    toggleQoS.onclick = function (e) {
        fw.__configIsQoSEnable = !fw.__configIsQoSEnable;
        if (fw.__configIsQoSEnable) {
            e.target.innerHTML = "Disable QoS";
        } else {
            e.target.innerHTML = "Enable QoS";
        }
    }
    var toggleSpatialHashing = document.getElementById('SpatialHashing');
    toggleSpatialHashing.onclick = function (e) {
        fw.__configIsUseSpatialHashing = !fw.__configIsUseSpatialHashing;
        if (fw.__configIsUseSpatialHashing) {
            e.target.innerHTML = "Disable Spatial Hashing";
        } else {
            e.target.innerHTML = "Enable Spatial Hashing";
        }
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

    var layer = fw.createLayer("layer1");
    var model = [];
    var modelCount = 1000;

    for (var i = 0; i < modelCount - 50; i++) {
        model[i] = layer.addModel({
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
        model[i] = layer.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            name: "model" + i,
            url: "img/sensei.png",
            QoSLevel: 0
        });

    }
    fw.start();
    layer.play();
    container.addEventListener('click', function () {


        for (var i = 0; i < modelCount; i++) {
            model[i].addAnimation({
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                duration: 10000
            }, false);
        }
    });

});
//Math.floor(Math.random() * 100)
