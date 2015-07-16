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
        layer1.bufferCtx2.clearRect(0, 0, container.width, container.height);
        backgroundLayer.bufferCtx2.clearRect(0, 0, container.width, container.height);
        asteroids.isActive = true;
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
    var moveButton = document.getElementById('move');
    moveButton.onclick = function (e) {
        for (var i = 0; i < 50; i++) {
            moveBg(Math.round(Math.random() * background.length));
        }
    }


    var layer1 = fw.createLayer("layer1");
    var spaceship;
    var background = [];
    var asteroids = [];
    var easingArr = [
        "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic",
        "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart",
        "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint"
    ];

    var gameTick = function () {

        setTimeout(gameTick, 100);
    };

    var init = function () {

        for (var i = 0; i < 1000; i++) {
            var scale = Math.random() * 0.05;
            var modelTemp = layer1.addModel({
                type: "image",
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                name: "background" + background.length,
                url: "img/star.png",
                scaleX: 0.1,
                scaleY: 0.1,
                opacity: 1,
                scaleX: scale,
                scaleY: scale,
                QoSLevel: Math.round(Math.random() * 8) + 1
            });
            background.push(modelTemp);
        }

        for (var i = 0; i < 20; i++) {
            var asteroid = layer1.addModel({
                type: "image",
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                name: "asteroid" + asteroids.length,
                url: "img/asteroid.png",
                QoSLevel: 0
            });
            asteroids.push(asteroid);
        }

        spaceship = layer1.addModel({
            x: container.width / 2,
            y: container.height * 0.8,
            type: "image",
            url: "img/spaceship.png",
            QoSLevel: 0,
            name: "spaceship"
        });
    }
    var moveBg = function (i) {
        var duration = Math.max(100, Math.random() * 20000);
        var star = background[i];
        var scale = Math.random() * 0.05;
        star.addAnimation({
            y: -20,
            x: Math.random() * container.width,
            scaleX: scale,
            scaleY: scale,
            duration: 1
        });

        star.addAnimation({
            y: container.height + 20,
            easing: "linear",
            duration: duration,
            orientation: Math.random() * 3060 - 1800
        }, true);

        //setTimeout(moveBg, duration + 100, i);
    };

    var moveAsteroid = function (i) {
        var duration = Math.max(3000, Math.random() * 10000);
        var asteroid = asteroids[i];
        var scale = Math.max(1, Math.random() * 0.8 + 0.5);
        asteroid.addAnimation({
            y: -100,
            x: Math.random() * container.width,
            scaleX: scale,
            scaleY: scale,
            duration: 1
        });
        asteroid.addAnimation({
            y: container.height + 100,
            easing: "linear",
            duration: duration,
            orientation: Math.random() * 360 - 180
        }, true);
        setTimeout(moveAsteroid, duration + 100, i);
    };


    var start = function () {
        fw.start();
        layer1.play();



        for (var i = 0; i < asteroids.length; i++) {
            moveAsteroid(i);
        }

        gameTick();
    }

    var body = document.getElementsByTagName("body")[0];
    var lastKeytime = 0;
    var lastKey = 0;
    body.addEventListener("keydown", function (e) {
        var now = new Date().getTime();
        var moveDelta = 100; //Math.min(100, (1 / (now - lastKeytime)) * 1000);
        var moveDuration = 200;
        var easing = "linear";
        var append = false;
        var x = spaceship.current.x;
        var y = spaceship.current.y;
        if (!append || now - lastKeytime > moveDuration) {
            if (e.which === 37 || e.which === 65) {
                console.log("left");
                x = x - moveDelta;
            } else if (e.which === 38 || e.which === 87) {
                console.log("up");
                y = y - moveDelta;
            } else if (e.which === 39 || e.which === 68) {
                console.log("right");
                x = x + moveDelta;
            } else if (e.which === 40 || e.which === 83) {
                console.log("down");
                y = y + moveDelta;
            } else if (e.which === 32) {
                console.log("space");
            }

            spaceship.addAnimation({
                x: x,
                y: y,
                duration: moveDuration,
                easing: easing
            }, append);

            lastKeytime = now;
            lastKey = e.which;
        }

    });
    init();
    setTimeout(start, 500);

});
