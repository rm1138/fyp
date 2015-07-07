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

    for (var i = 0; i < 10;) {

        model[i] = layer1.addModel({
            type: "image",
            x: container.width / 2,
            y: container.height / 2,
            name: "model" + i,
            url: "img/square.svg"
        });
        i++;
    }
    layer1.play();

    container.addEventListener("mousemove", function (e) {
        for (var i = 0; i < 10; i++) {
            model[i].set({
                x: e.clientX + Math.random() * 100 - 50,
                y: e.clientY + Math.random() * 100 - 50,
            });
        }
    });
});
//Math.floor(Math.random() * 100)
