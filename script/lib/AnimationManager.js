define(['lib/enums', 'lib/MathUtil', 'class/Timeline'], function(enums, MathUtil, Timeline) {
    var AnimationManager = AnimationManager || function () {
        //throttling
        if(AnimationManager.instance) {
            return AnimationManager.instance;    
        }
        this.step = MathUtil.step;                //process frame step
        this.workerReturnFactor = 2;
        this.supportWorker = false;
        if(window.Worker){
            this.numOfThread = navigator.hardwareConcurrency || 4;
            this.workers = [];
            this.initWorker();
            this.supportWorker = true;
        }
        AnimationManager.instance = this;
        this.timelines = {};
        return this;
    };
    
    AnimationManager.prototype = {
        onWorkerReturn: function(e){
            var command = e.data.command;
            var payload = e.data.payload;

            var that = this;
            if(command === enums.Command.Worker.ProcessKeyFrame){
                console.log(payload);
                this.timelines[payload.layerName].frames[payload.order] = payload.frames;
                //console.log(payload.order);
            } else if(command === enums.Command.Worker.Ready) {
                e.target.postMessage({
                    command: enums.Command.Worker.Init,
                    payload: {}
                });    
            }
        },
        initWorker: function(){
            var that = this;
            var i = this.numOfThread - 1
            while(i--){
                var worker = new Worker("script/lib/Worker.js");
                worker.onmessage = function(e){
                    that.onWorkerReturn(e);
                };
                this.workers.push(worker);
            }
        },
        addLayer: function(layerName) {
            this.timelines[layerName] = new Timeline();
        },
        removeLayer: function(layName) {
            delete this.timelines[layerName];
        },
        getFrame: function(layerName) {
            return this.timelines[layerName].getFrame();   
        },
        processKeyFrame: function(keyFrame) {
            var command = enums.Command.Worker.ProcessKeyFrame;
            var workers = this.workers;
            var batchSize = Math.round(keyFrame.duration / Math.pow(2, workers.length));
            var step = this.step;
            var payload = {    
                keyFrame: keyFrame,
                start: 0,
                end: batchSize,
                processLimit: null,
                step: step,
                order: 0
            };
            var i = workers.length;
            while(i--){
                payload.processLimit = Math.floor((payload.end - payload.start)/this.workerReturnFactor);
                this.workers[i].postMessage({
                    command: command, 
                    payload: payload
                });
                console.log(payload);
                batchSize *= 2;
                payload.order += this.workerReturnFactor;
                payload.start = payload.end;
                if(i === 1){
                    payload.end = keyFrame.duration;
                }else{
                    payload.end += batchSize;
                }
                
            }

        },
        throttling: function(){
            
        }
    }
    
    return AnimationManager;
});


/*
        onWorkerReturn: function(e){
            var Command = e.data.Command;
            var payload = e.data.payload;
            var that = this;
            if(Command === enums.Command.processKeyFrame){
                var layerName = e.data.layerName;
                var layer = that.layerLookup[layerName];
                layer.timeline.addKeyframe(payload);
                this.workerReturnCount += 1;
                console.log("worker returned");
            } else if(Command === enums.Command.ready) {
                e.target.postMessage({Command: enums.Command.initAsWorkerManager, payload: {}});    
            }
        },


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
                        Command: enums.Command.processKeyFrame,
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
*/