window.onkeydown = function(e) {
    
    if(animatedFW.isRunning()){
        animatedFW.pause();
    }else{
        animatedFW.run();
    }
};

var animatedFW = new AnimatedCanvas("myCanvas");
var timeline = animatedFW.newTimeline();
var layer = animatedFW.newLayer();

layer.name = "layer1";
layer.objects.push({
        name: "object1",
        url: "img/sensei.png",
        x: 0,
        y: 0
    });

timeline.name = "timeline1";
timeline.events.push({
        name: "event1",
        object: "object1",
        animation: {
            x: 50,
            y: 50,
            duration: 5
        },
    });

console.log(animatedFW);
animatedFW.run();

