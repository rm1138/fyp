define(['lib/enums', 'lib/Util', 'lib/AnimationHashMap'], function (enums, Util, AnimationHashMap) {
    var AnimationManager = AnimationManager || function (fw) {
        this.fw = fw;
        this.models = [];
        this.step = Util.step; //process frame step
        this.supportWorker = false;
        this.animationHashMap = new AnimationHashMap(fw);
        if (window.Worker) {
            this.supportWorker = true;
            this.numOfThread = navigator.hardwareConcurrency || 4;
            this.workers = [];
            this.initWorker();
        }
    };
    AnimationManager.prototype = {
        addModel: function (model) {
            this.models.push(model);
        },
        removeModel: function (model) {
            var index = this.models.indexOf(model);
            this.models.splice(index, 1)
        },
        onWorkerReturn: function (e) {
            var command = e.data.command;
            var payload = e.data.payload;

            var that = this;
            if (command === enums.Command.Worker.ProcessAnimations) {
                this.updateMapping(payload.frames, payload.animations, payload.step);
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
            var models = this.models;
            var i = models.length;
            var animationHashMap = this.animationHashMap;

            var animationsNeedToProcess = [];
            while (i--) {
                var timeline = models[i].timeline;
                var animation = timeline.__getFirstAnimation();
                if (animation) {
                    var frames = animationHashMap.hashAnimation(animation, this.step);
                    if (frames.duration !== -1) {
                        timeline.__removeFirstAnimation();
                        timeline.__addFrames(frames);
                    }
                }
            }
            animationsNeedToProcess = animationHashMap.getProcessQueue();

            if (animationsNeedToProcess.length > 0) {
                this.processAnimationInWorker(animationsNeedToProcess);
            }
        },
        processAnimationInWorker: function (animations) {
            var count = animations.length / 3;
            var workers = this.workers;
            var batchSize = Math.round(count / workers.length);
            var command = enums.Command.Worker.ProcessAnimations;
            var step = this.step;

            for (var i = 0, workerCount = workers.length; i < workerCount; i += 1) {
                var arr = animations.slice((i * batchSize) * 3, (i + 1) * batchSize * 3);
                arr = new Float32Array(arr);
                var payload = {
                    animations: arr,
                    step: step
                };
                this.workers[i].postMessage({
                    command: command,
                    payload: payload
                }, [payload.animations.buffer]);
            }
        },
        updateMapping: function (frames, animations, step) {
            var start = 0;
            var animationHashMap = this.animationHashMap;
            for (var i = 0, count = animations.length; i < count;) {
                var delta = animations[i++];
                var easingIdx = animations[i++];
                var duration = animations[i++];
                var end = start + Math.ceil(duration / step);
                var animationFrames = frames.subarray(start, end);
                animationHashMap.addFrames(delta, easingIdx, animationFrames);
                start = end;
            }
        }
    }

    return AnimationManager;
});
