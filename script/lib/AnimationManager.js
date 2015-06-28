define(['lib/enums', 'lib/MathUtil', 'class/Timeline'], function(enums, MathUtil, Timeline) {
    var AnimationManager = AnimationManager || function () {
        //throttling
        if(AnimationManager.instance) {
            return AnimationManager.instance;    
        }
        this.step = MathUtil.step;                //process frame step
        this.batchSize = 200;
        this.supportWorker = false;
        this.layers = {};
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
                this.layers[payload.layerName].frames[payload.batchOrder] = payload.frames;
            }else if(command === enums.Command.Worker.Ready) {
                e.target.postMessage({
                    command: enums.Command.Worker.Init,
                    payload: {}
                });    
            }
        },
        initWorker: function(){
            var that = this;
            var i = this.numOfThread ;
            while(i--){
                var worker = new Worker("script/lib/Worker.js");
                worker.onmessage = function(e){
                    that.onWorkerReturn(e);
                };
                this.workers.push(worker);
            }
        },
        addLayer: function(layerName) {
            this.layers[layerName] = new Timeline();
        },
        removeLayer: function(layName) {
            delete this.layers[layerName];
        },
        getFrame: function(layerName) {
            var result  = this.layers[layerName].frames.shift();
            return result;
        },
        processKeyFrame: function(keyFrame) {
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