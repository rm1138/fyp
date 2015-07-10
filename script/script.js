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
    var download = document.getElementById('download');
    download.onclick = downloadCSV;

    function downloadCSV() {
        fw.renderer.getResult();
    }
    var layer = fw.createLayer("layer1");
    var model = [];
    var modelCount = 500;
    var imageName = ['500', '450', '400', '350', '300', '250', '200', '150', '100', '50'];
    for (var i = 0; i < modelCount; i++) {
        var index = i % 10;
        model[i] = layer.addModel({
            type: "image",
            x: Math.random() * container.width,
            y: Math.random() * container.height,
            name: "model" + i,
            url: "img/" + imageName[index] + ".png",
            QoSLevel: index
        });
    }


    fw.start();
    layer.play();
    container.addEventListener('click', function () {
        fw.renderer.delta = [];
        fw.renderer.renderedModel = [];
        fw.renderer.skippedModel = [];
        for (var i = 0; i < modelCount; i++) {
            model[i].addAnimation({
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                duration: 3000
            }, false);
        }
        setTimeout(function () {
            downloadCSV();
        }, 3000);
    });

});
//Math.floor(Math.random() * 100)
