define(['lib/enums', 'lib/MathUtil'], function(enums, MathUtil){
    var Animator = Animator || function(){
        //worker support
        this.step = MathUtil.step;
        this.supportWorker = false;
        this.layerLookup = {};
        if(window.Worker){
            this.numOfThread = navigator.hardwareConcurrency || 4;
            this.workers = [];
            this.initWorker();
            this.supportWorker = true;
            this.readyWorker = 0;
        }
    };
    
    Animator.prototype = {
        onWorkerReturn: function(e){
            var command = e.data.command;
            var payload = e.data.payload;
            var that = this;
            if(command === enums.command.processKeyFrame){
                var token = e.data.token;
                var layer = that.layerLookup[token];
                layer.timeline.addKeyframe(payload);
                if(layer.state === enums.LayerState.playing){
                    layer.timeline.start();
                }
                delete that.layerLookup[token];
            } else if(command === enums.command.ready) {
                that.readyWorker += 1;
                e.target.postMessage({command: enums.command.init, payload: {}});    
            }
        },
        initWorker: function(){
            var _this = this;
            for(var i=0; i< this.numOfThread; i+=1){
                var worker = new Worker("script/lib/worker.js");
                worker.onmessage = function(e){
                    _this.onWorkerReturn(e);
                }
                this.workers.push(worker);
            }
        },
        animate: function(){
            
        },
        preProcess: function(keyFrame, layer) {
            if(this.supportWorker && this.readyWorker === this.numOfThread) {
                var token = MathUtil.genToken();
                this.layerLookup[token] = layer;
                this.workers[0].postMessage({command: enums.command.processKeyFrame, payload: keyFrame, token: token});
            }else{
                layer.timeline.addKeyframe(MathUtil.processKeyFrame(keyFrame)); 
            }
        }
    }
    
    return Animator;
});

//                
//                var animationFunction = function (str) {
//                    return str + "abcc";
//                };
//
//                var b = new Blob([
//                    "functionContainer.myFunct = " + animationFunction.toString()
//                ], { type: 'application/javascript' });
//                this.workers[0].postMessage({
//                        command: enums.command.test,
//                        payload: b
//                });