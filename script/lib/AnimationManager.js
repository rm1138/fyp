define(['lib/enums', 'lib/MathUtil'], function(enums, MathUtil) {
    var AnimationManager = AnimationManager || function () {
        //throttling
        if(AnimationManager.instance) {
            return AnimationManager.instance;    
        }
        this.step = MathUtil.step;                //process frame step
        this.batchSize = 1000;
        this.supportWorker = false;
        if(window.Worker){
            this.numOfThread = 3;//navigator.hardwareConcurrency || 4;
            this.workers = [];
            this.channels = [];
            this.initWorker();
            this.supportWorker = true;
            this.readyWorker = 0;
        }
        AnimationManager.instance = this;
        this.layerFrameSetBuffer = {};
        this.layerFrameSetIndex = {};
        this.layerFrameSetStartTime = {};
        this.layerRequestFlag = {};
        return this;
    };
    
    AnimationManager.prototype = {
        onWorkerReturn: function(e){
            var command = e.data.command;
            var payload = e.data.payload;

            var that = this;
            if(command === enums.Command.Worker.Ready) {
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
            if(command === enums.Command.TimelineWorker.GetFrameSet) {
                console.log("got frame");
                (this.layerFrameSetBuffer[payload.layerName]).push(payload.frameSetObj);
                this.layerRequestFlag[payload.layerName] = false;   
            }else if(command === enums.Command.TimelineWorker.NoFrame) {
                console.log("no frame");
                this.layerRequestFlag[payload.layerName] = false;   
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
            var i = this.numOfThread - 2
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
            this.layerFrameSetBuffer[layerName] = [];
            this.layerFrameSetIndex[layerName] = 0;
            this.layerFrameSetStartTime[layerName] = 0;
        },
        removeLayer: function(layName) {
            this.timelineWorker.postMessage({
                command: enums.Command.TimelineWorker.RemoveLayer,
                payload: {
                    layerName: layerName
                }
            });
            delete this.layerFrameSetBuffer[layerName];
            delete this.layerFrameSetIndex[layerName];
            delete this.layerFrameSetStartTime[layerName];
        },
        getFrame: function(layerName, funct) {
            var layerFrameSetStartTime =this.layerFrameSetStartTime[layerName]
            var index = this.layerFrameSetIndex[layerName]
            var layerFrameSetBuffer = this.layerFrameSetBuffer[layerName][index];
            if(layerFrameSetBuffer){
                if(layerFrameSetStartTime === 0 ){
                    var temp = new Date().getTime();
                    this.layerFrameSetStartTime[layerName] = temp;
                    layerFrameSetStartTime = temp;
                }
                var frameTime = (new Date().getTime() - layerFrameSetStartTime) / this.step;
                frameTime = Math.round(frameTime);
                var result = layerFrameSetBuffer[frameTime];

                if(layerFrameSetBuffer.length - frameTime <= 20 && index === this.layerFrameSetBuffer[layerName].length - 1){
                    this.__fetchNextFrameSet(layerName);               
                }
                
                if(result) {
                    funct(result);
                }else{
                    if(index < this.layerFrameSetBuffer[layerName].length){
                        this.layerFrameSetIndex[layerName]++;
                        this.layerFrameSetStartTime[layerName] = new Date().getTime();
                        console.log("shifted frame set");
                    }
                    this.getFrame(layerName, funct);
                }
            }else{
                this.__fetchNextFrameSet(layerName);
            }
        },
        __fetchNextFrameSet: function(layerName) {
            
            if(!this.layerRequestFlag[layerName]){
                this.layerRequestFlag[layerName]= true;
                console.log("__fetchNextFrameSet");
                this.timelineWorker.postMessage({
                    command: enums.Command.TimelineWorker.GetFrameSet,
                    payload: {
                        layerName: layerName
                    }
                });
            }
        },
        processKeyFrame: function(keyFrame) {
            this.layerFrameSetBuffer[keyFrame.layerName] = [];
            this.layerFrameSetIndex[keyFrame.layerName] = 0;
            this.layerFrameSetStartTime[keyFrame.layerName] = 0;
            
            this.timelineWorker.postMessage({
                command: enums.Command.TimelineWorker.ResetLayer,
                payload: {
                    layerName: keyFrame.layerName    
                }
            });
            var command = enums.Command.Worker.ProcessKeyFrame;
            var workers = this.workers;
            var processStep = this.step;
            var payload = {    
                keyFrame: keyFrame,
                processLimit: this.batchSize,
                processStep: processStep,
                batchOrder: 0,
                totalWorker: workers.length
            };
            var i = workers.length;
            while(i--){
                this.workers[i].postMessage({
                    command: command, 
                    payload: payload
                });
                payload.batchOrder++;
            }

        },
        throttling: function(){
            
        }
    }
    
    return AnimationManager;
});