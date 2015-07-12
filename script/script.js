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
    //    var testArray = [
    //            [true, true, -1], [true, false, -1], [false, true, -1], [false, false, -1], [true, true, 200], [true, false, 200], [false, true, 200], [false, false, 200], [true, true, 100], [true, false, 100], [false, true, 100], [false, false, 100], [true, true, 66.6667], [true, false, 66.6667], [false, true, 66.6667], [false, false, 66.6667], [true, true, 50], [true, false, 50], [false, true, 50], [false, false, 50], [true, true, 40], [true, false, 40], [false, true, 40], [false, false, 40], [true, true, 33.3336], [true, false, 33.3336], [false, true, 33.3336], [false, false, 33.3336], [true, true, 28.5714], [true, false, 28.5714], [false, true, 28.5714], [false, false, 28.5714], [true, true, 25], [true, false, 25], [false, true, 25], [false, false, 25], [true, true, 22.2222], [true, false, 22.2222], [false, true, 22.2222], [false, false, 22.2222], [true, true, 20], [true, false, 20], [false, true, 20], [false, false, 20]
    //        ];
    var testArray = [
            [true, true, 40],
            [true, true, 20],
            [true, true, Number.POSITIVE_INFINITY],
            [false, true, Number.POSITIVE_INFINITY],
            [false, false, Number.POSITIVE_INFINITY]
        ];

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
            layer.bufferCtx2.clearRect(0, 0, container.width, container.height);
            var i = model.length;
            while (i--) {
                model[i].isActive = true;
            }
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
    moveButton.onclick = move;

    function move() {
        layer.stop();
        fw.renderer.delta = [];
        fw.renderer.renderedModel = [];
        fw.renderer.skippedModel = [];
        for (var i = 0; i < 500; i++) {
            model[Math.floor(Math.random() * model.length)].addAnimation({
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                duration: 10000
            }, false);
        }
        layer.play();
        setTimeout(function () {
            if (testArray.length > 0) {
                var testSet = testArray.shift();
                fw.renderer.newTest();
                fw.__configIsQoSEnable = testSet[0];
                fw.__configIsUseSpatialHashing = testSet[1];
                fw.__configRenderDeadline = testSet[2];
                if (fw.__configIsUseSpatialHashing) {
                    layer.bufferCtx2.clearRect(0, 0, container.width, container.height);
                    var i = model.length;
                    while (i--) {
                        model[i].isActive = true;
                        model[i].skipped = 0;
                    }
                }
                move();
            } else {
                fw.renderer.newTest();
                downloadCSV();
            }
        }, 10000);
    };

    var addButton = document.getElementById("Add");
    addButton.onclick = function (e) {

        var e = document.getElementById("QoSLevel");
        var QoSLevel = parseInt(e.options[e.selectedIndex].value);
        QoSLevel = 10;
        for (var i = 0; i < 3500; i++) {
            if (i % 350 === 0) {
                QoSLevel--;
            }
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
