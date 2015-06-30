define(['lib/enums', 'lib/MathUtil'], function(enums, MathUtil) {
    var AnimationManager = AnimationManager || function (fw) {
        //throttling
        if(AnimationManager.instance) {
            return AnimationManager.instance;    
        }
        this.fw = fw;
        this.step = MathUtil.step;                //process frame step
        this.batchSize = 1000;
        this.supportWorker = false;
        if(window.Worker){
            this.numOfThread = 3;//navigator.hardwareConcurrency || 4;
            this.workers = [];
            this.initWorker();
            this.supportWorker = true;
            this.readyWorker = 0;
        }
        AnimationManager.instance = this;
        return this;
    };
    
    AnimationManager.prototype = {
        onWorkerReturn: function(e){
            var command = e.data.command;
            var payload = e.data.payload;

            var that = this;
            if(command === enums.Command.Worker.ProcessKeyFrame){
                this.fw.getLayer(payload.layerName).getTimeline().addFrames(payload.batchOrder, payload.frames, payload.queueID);
                e.target.postMessage({
                    command: enums.Command.Worker.Continue
                });
            }else if(command === enums.Command.Worker.Ready) {
                e.target.postMessage({
                    command: enums.Command.Worker.Init,
                    payload: {}
                });
                this.updateWorker();
            }
        },
        initWorker: function(){
            var that = this;
            var i = this.numOfThread ;
            while(i--){
                var worker = new Worker("script/lib/AnimationWorker.js");
                worker.onmessage = function(e){
                    that.onWorkerReturn(e);
                };
                this.workers.push(worker);
            }
        },
        processAnimations: function(layers){
            var i = layers.length,
                animations,
                layer;
            while(i--){
                layer = layers[i];
                animations = layer.getLayerAnimation();
                if(animations.layerAnimationsCount > 0){
                    
                    
                    console.log(animation
                }
            }
        },
        processKeyFrame: function(keyFrame) {
            var queueID = MathUtil.genRandomId();
            this.fw.getLayer(keyFrame.layerName).getTimeline().reset(queueID);
            var command = enums.Command.Worker.ProcessKeyFrame;
            var workers = this.workers;
            var processStep = this.step;
            var payload = {    
                keyFrame: keyFrame,
                processLimit: this.batchSize,
                processStep: processStep,
                batchOrder: 0,
                totalWorker: workers.length,
                queueID: queueID
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
            
        },
        updateWorker: function(){
            var command = enums.Command.Worker.UpdateInfo;
            var payload = {
                step: this.step,
                batchSize: this.batchSize
            }
            var i = this.workers.length;
            while(i--){
                this.workers[i].postMessage({
                    command: command, 
                    payload: payload
                });
            }           
        }
    }
    
    return AnimationManager;
});