var temp = setInterval(function(){
    console.log("worker1");
}, 500)

onmessage = function(e){
    clearInterval(temp);
    console.log(e);
};