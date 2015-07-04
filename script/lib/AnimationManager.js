define(['lib/enums', 'lib/MathUtil'], function (enums, MathUtil) {
    var AnimationManager = AnimationManager || function (fw) {
        this.fw = fw;
        this.models = {};
        this.modelCount = 0;
        this.step = MathUtil.step; //process frame step
        this.batchSize = 200;
        this.framesQueue = [];
        this.supportWorker = false;
        this.framesCache = {};
        this.nameFramesMapCache = {};
        if (window.Worker) {
            this.supportWorker = true;
            this.numOfThread = navigator.hardwareConcurrency || 4;
            this.workers = [];
            this.initWorker();
        }
    };
    AnimationManager.prototype = {
        addModel: function (model) {
            this.models[model.name] = model;
            this.modelCount++;
        },
        removeModel: function (modelName) {
            delete this.models[modelName];
            this.modelCount--;
        },
        getModel: function (modelName) {
            return this.models[modelName];
        },
        onWorkerReturn: function (e) {
            var command = e.data.command;
            var payload = e.data.payload;

            var that = this;
            if (command === enums.Command.Worker.ProcessAnimations) {
                this.nameFramesMapCache[payload.frameId].push(payload.nameMap);
                this.framesCache[payload.frameId].push(payload.frames);
                if (this.nameFramesMapCache[payload.frameId].length === this.workers.length) {
                    var framesCache = this.framesCache[payload.frameId];
                    var nameFramesMapCache = this.nameFramesMapCache[payload.frameId];
                    var models = this.models;
                    delete this.framesCache[payload.frameId];
                    delete this.nameFramesMapCache[payload.frameId];
                    var nameMap = {};

                    for (var i = 0, length = this.workers.length; i < length; i++) {
                        var temp = nameFramesMapCache[i];
                        while (temp.length > 0) {
                            var mapping = temp.shift();
                            models[mapping.name].framesQueue.push(framesCache[i].subarray(mapping.startIndex, mapping.endIndex));
                        }
                    }
                }
            } else if (command === enums.Command.Worker.Ready) {
                e.target.postMessage({
                    command: enums.Command.Worker.Init,
                    payload: {}
                });
            }
        },
        initWorker: function () {
            var that = this;
            var i = this.numOfThread;
            while (i--) {
                var worker = new Worker("script/lib/AnimationWorker.js");
                worker.onmessage = function (e) {
                    that.onWorkerReturn(e);
                };
                this.workers.push(worker);
            }
        },
        processAnimation: function () {
            if (this.modelCount === 0) {
                return;
            }
            var models = this.models;
            var modelNames = Object.keys(models);
            var modelNamesMap = [];
            var batchSize = this.batchSize;
            var animations = [];

            var i = modelNames.length;
            while (i--) {
                var modelName = modelNames[i];
                var model = models[modelName];
                var animation = model.getModelAnimation(batchSize);
                if (animation !== null) {
                    animations.push(animation);
                    modelNamesMap.push(modelName);
                }
            }
            if (modelNamesMap.length > 0) {
                this.processAnimationInWorker(modelNamesMap, animations);
            }
        },
        processAnimationInWorker: function (modelNamesMap, animations) {
            var command = enums.Command.Worker.ProcessAnimations;
            var workers = this.workers;
            var animationPerWorker = animations.length / workers.length;
            var step = this.step;
            var batchSize = this.batchSize;
            var frameId = MathUtil.genRandomId();
            var i = this.workers.length;

            this.framesCache[frameId] = [];
            this.nameFramesMapCache[frameId] = [];

            while (i--) {
                var payload = {
                    modelNamesMap: modelNamesMap.slice(i * animationPerWorker, (i + 1) * animationPerWorker),
                    animations: animations.slice(i * animationPerWorker, (i + 1) * animationPerWorker),
                    step: step,
                    frameId: frameId,
                    batchSize: batchSize
                };
                workers[i].postMessage({
                    command: command,
                    payload: payload
                });
            }
        },
        throttling: function () {

        }
    }

    return AnimationManager;
});
//MathUtil.animationsToTypedFloat32Array(animations.slice(i * animationPerWorker, (i + 1) * animationPerWorker)),
