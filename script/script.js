require(['lib/main'], function (Framework) {
    var container = document.getElementById("myCanvas");
    container.width = window.innerWidth;
    container.height = window.innerHeight;
    var fw = new Framework("myCanvas");
    document.fw = fw;

    var backgroundLayer = fw.createLayer("bg");
    var slideIdx = 0;
    var lastSlide = 0;
    var slides = [];
    var background = [];
    var model = [];
    var easingArr = [
        "linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic",
        "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart",
        "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint"
    ];

    fw.start();

    var init = function () {
        backgroundLayer.play();
        for (var i = 0; i < 50; i++) {
            var modelTemp = backgroundLayer.addModel({
                type: "image",
                x: Math.random() * container.width,
                y: Math.random() * container.height,
                name: "background" + background.length,
                url: "img/star.png",
                opacity: 1,
                QoSLevel: 9
            });
            background.push(modelTemp);
        }

        var moveBg = function () {
            for (var i = 0, count = background.length; i < count; i += 1) {
                background[i].addAnimation({
                    x: Math.random() * container.width,
                    y: Math.random() * container.height,
                    easing: easingArr[Math.floor((Math.random() * 13))],
                    duration: Math.random() * 10000 + 5000
                }, true);
            }
            setTimeout(moveBg, 10000);
        };
        setTimeout(function () {
            moveBg();
        }, 500);
    }




    var play = function () {
        if (lastSlide !== slideIdx) {


        }
    }
    var nextSlide = function () {
        console.log("next");
        lastSlide = slideIdx;
        if (slideIdx < slide.length - 1) {
            slideIdx++;
        }
        play();
    };
    var previousSlide = function () {
        console.log("previous");
        lastSlide = slideIdx;
        if (slideIdx > 0) {
            slideIdx--;
        }
        play();
    }
    container.addEventListener("click", function () {
        nextSlide();
    });
    var body = document.getElementsByTagName("body")[0];
    body.addEventListener("keydown", function (e) {
        if (e.which === 37) {
            previousSlide();
        } else if (e.which === 39) {
            nextSlide();
        }
    });
    init();
});
