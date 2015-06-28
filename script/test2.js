
/*
    5
    Event type:
        onPause?
        onMouseHover?
        onClick?
*/
objects.event("collisionWithModel", function(anotherModel) {
    
    
});
/*
    10
    boundary "top", "right", "bottom", "left"
*/
objects.event("collisionWithBoundary", function(boundary) {
    
    
});

//1
animationQueue.add({});
//5
animationQueue.clear();


objects.animate(
    {
        //1
        moveTo: {
            x: 100,    
            y: 200,
            ease: "test"
        },
        //10
        rotate: {
            x: 0,
            y: 0,
            reference: "Model", // or "Canvas"
            degree: 180,
            ease: "test"
        },
        //10
        zoom: {
            ratio: 1.0    
        },
        //1
        duration: 100, // 0 for immidinate
        //1
        callBack: function(){
            
            
        }
    }
);

//object api 


animationFW.addModel(
    {
        type: "image", //"rect", "text", "line", "cycle", 
        url: "http://...",
        x: 100,
        y: 200,
        color: "#FFFFFF",
        index: 1
    }
);
