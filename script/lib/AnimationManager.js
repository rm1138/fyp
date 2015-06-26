define(['lib/enums', 'lib/MathUtil'], function(enums, MathUtil) {
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
            this.channels = [];
            this.initWorker();
            this.supportWorker = true;
            this.readyWorker = 0;
        }
        AnimationManager.instance = this;
        this.getFrameCallBack = {};
        return this;
    };
    
    AnimationManager.prototype = {
        onWorkerReturn: function(e){
            var command = e.data.command;
            var payload = e.data.payload;

            var that = this;
            if(command === enums.Command.Worker.ProcessKeyFrame){
                console.log(payload);
                //this.timelines[payload.layerName].frames[payload.order] = payload.frames;
                //console.log(payload.order);
            } else if(command === enums.Command.Worker.Ready) {
                e.target.postMessage({
                    command: enums.Command.Worker.Init,
                    payload: {}
                }, [that.channels[that.readyWorker++].port2]);    
            }
        },
        onTimeWorkerReturn: function(e){
            var command = e.data.command;
            var payload = e.data.payload;

            var that = this;
            if(command === enums.Command.TimelineWorker.GetFrame) {
                that.getFrameCallBack[payload.id](payload.frame);
            }else if(command === enums.Command.TimelineWorker.Ready){ 
                var i = that.channels.length;
                while(i--){
                    e.target.postMessage({
                        command: enums.Command.TimelineWorker.Init,
                        payload: {}
                    }, [that.channels[i].port1]);
                }
            }
        },
        initWorker: function(){
            var that = this;
            var i = this.numOfThread - 1
            var timelineWorker = new Worker("script/lib/TimelineWorker.js");
            var channel = new MessageChannel();
            timelineWorker.onmessage = function(e){
                that.onTimeWorkerReturn(e);    
            };
            this.timelineWorker = timelineWorker;
            while(i--){
                var worker = new Worker("script/lib/Worker.js");
                worker.onmessage = function(e){
                    that.onWorkerReturn(e);
                };
                this.workers.push(worker);
                var messageChannel = new MessageChannel();
                this.channels.push(messageChannel);
            }
        },
        addLayer: function(layerName) {
            this.timelineWorker.postMessage({
                command: enums.Command.TimelineWorker.AddLayer,
                payload: {
                    layerName: layerName
                }
            });
        },
        removeLayer: function(layName) {
            this.timelineWorker.postMessage({
                command: enums.Command.TimelineWorker.RemoveLayer,
                payload: {
                    layerName: layerName
                }
            });
        },
        getFrame: function(layerName, funct) {
            var id = MathUtil.genRandomId();
            this.getFrameCallBack[id] = funct;
            this.timelineWorker.postMessage({
                command: enums.Command.TimelineWorker.GetFrame,
                payload: {
                    layerName: layerName,
                    id: id
                }
            });
            return undefined
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