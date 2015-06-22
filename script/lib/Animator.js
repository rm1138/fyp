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
        this.workerReturnCount = 0;
        this.processQueue = [];
        this.processLimit = 500;
    };
    
    Animator.prototype = {
        onWorkerReturn: function(e){
            
            var command = e.data.command;
            var payload = e.data.payload;
            var that = this;
            if(command === enums.command.processKeyFrame){
                var layerName = e.data.layerName;
                var layer = that.layerLookup[layerName];
                layer.timeline.addKeyframe(payload);
                this.workerReturnCount += 1;
                console.log("worker returned");
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
        addProcessQueue: function(keyFrame){
            this.processQueue.push(keyFrame);
        },
        processFrame: function() {
            var queue = this.processQueue;
            if(queue.length > 0){
                var keyFrame;
                var partly;
                var remain = queue[0].duration - queue[0].lastProcessMark;
                if(remain <= this.processLimit){
                    keyFrame = queue.shift();
                    partly = false;
                } else {
                    keyFrame = queue[0];    
                    partly = true;
                }
                
                var end = (partly)? keyFrame.lastProcessMark + this.processLimit : keyFrame.duration;
                var payload = {
                    animations: keyFrame.animations,
                    duration: keyFrame.duration,
                    processStart: keyFrame.lastProcessMark,
                    processEnd: end
                };
                    
                if(this.supportWorker && this.readyWorker === this.numOfThread) {

                    var layerName = keyFrame.layer.name;
                    this.layerLookup[layerName] = keyFrame.layer;
                    this.workers[0].postMessage({
                        command: enums.command.processKeyFrame,
                        payload: payload,
                        layerName: layerName
                    });
                }else{
                    keyFrame.layer.timeline.addKeyframe(MathUtil.processKeyFrame(payload)); 
                }
            
                if(partly){
                    queue[0].lastProcessMark += this.processLimit;
                }
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