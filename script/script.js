require(['lib/main'], function (Framework) {
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;

    var layer = fw.createLayer("layer1");
    var model = [];
    var modelCount = 500;
    var movingModel = modelCount;
    var imageName = ['500', '450', '400', '350', '300', '250', '200', '150', '100', '50'];
    fw.start();
    layer.play();

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

    var moveButton = document.getElementById("move");
    moveButton.onclick = function () {
        layer.stop();
        fw.renderer.delta = [];
        fw.renderer.renderedModel = [];
        fw.renderer.skippedModel = [];
        for (var i = 0; i < 50; i++) {
            model[Math.floor(Math.random() * model.length)].addAnimation({
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                duration: 10000
            }, false);
        }
        layer.play();
        setTimeout(function () {
            downloadCSV();
        }, 10000);
    };

    var addButton = document.getElementById("Add");
    addButton.onclick = function (e) {

        var e = document.getElementById("QoSLevel");
        var QoSLevel = parseInt(e.options[e.selectedIndex].value);

        for (var i = 0; i < 50; i++) {
            //var index = Math.round(Math.random() * 10) % 3;
            var modelTemp = layer.addModel({
                type: "image",
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                name: "model" + model.length,
                url: "img/" + imageName[9] + ".png",
                QoSLevel: QoSLevel
            });
            model.push(modelTemp);
            document.getElementById("modelCount").innerHTML = "Model Count:" + model.length;
        }
    }

    function downloadCSV() {
        var dom = document.getElementById('autodownload');
        if (dom.checked) {
            fw.renderer.getResult();
        }
    }

});
//Math.floor(Math.random() * 100)
