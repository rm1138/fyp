define(['lib/enums', 'lib/Util', 'lib/AnimationHashMap'], function (enums, Util, AnimationHashMap) {

    if (!window.Worker || window.forceIframeWorker) {
        if (window.Worker) window.nativeWorker = window.Worker;
        window.Worker = function (script) {
            var worker = this;

            // prepare and inject iframe
            worker._iframeEl = document.createElement('iframe');
            worker._iframeEl.style.visibility = 'hidden';
            worker._iframeEl.style.width = '1px';
            worker._iframeEl.style.height = '1px';
            worker._iframeEl.onload = worker._iframeEl.onreadystatechange = function () {
                if (this.readyState && this.readyState !== "loaded" && this.readyState !== "complete") return;
                worker._iframeEl.onload = worker._iframeEl.onreadystatechange = null;
                var w = this.contentWindow,
                    doc = this.contentWindow.document;

                function injectScript(script, callback) {
                    var scriptEl = doc.createElement('script');
                    scriptEl.src = script;
                    scriptEl.type = 'text/javascript';
                    scriptEl.onload = scriptEl.onreadystatechange = function () {
                        if (scriptEl.readyState && scriptEl.readyState !== "loaded" && scriptEl.readyState !== "complete") return;
                        scriptEl.onload = scriptEl.onreadystatechange = null;
                        doc.body.removeChild(scriptEl);
                        scriptEl = null;
                        if (callback) {
                            callback();
                        }
                    };
                    doc.body.appendChild(scriptEl);
                }

                // Some interfaces within the Worker scope.

                w.Worker = window.Worker; // yes, worker could spawn another worker!
                w.onmessage = function (ev) {}; // placeholder function
                var postMessage = function (data) {
                    if (typeof worker.onmessage === 'function') {
                        worker.onmessage.call(
                            worker, {
                                currentTarget: worker,
                                timeStamp: (new Date()).getTime(),
                                srcElement: worker,
                                target: worker,
                                data: data
                            }
                        );
                    }
                };
                w.postMessage = w.workerPostMessage = postMessage;
                if (w.postMessage !== postMessage) {
                    // IE doesn't allow overwriting postMessage
                }
                w.close = function () {
                    worker.terminate();
                };
                w.importScripts = function () {
                    for (var i = 0; i < arguments.length; i++) {
                        injectScript(window.Worker.baseURI + arguments[i]);
                    }
                }

                // inject worker script into iframe			
                injectScript(window.Worker.baseURI + script, function () {
                    worker._quere.push = function (callback) {
                        if (!worker._unloaded) {
                            callback();
                        }
                    };
                    if (!worker._unloaded) {
                        while (worker._quere.length) {
                            (worker._quere.shift())();
                        }
                    }
                });
            };
            this._iframeEl.src = window.Worker.iframeURI;
            (document.getElementsByTagName('head')[0] || document.body).appendChild(this._iframeEl);

            worker._quere = [];
            worker._unloaded = false;
        };
        window.Worker.prototype.postMessage = function (obj) {
            var worker = this;
            setTimeout(
                function () {
                    worker._quere.push(
                        function () {
                            // IE8 throws an error if we call worker._iframeEl.contentWindow.onmessage() directly
                            var win = worker._iframeEl.contentWindow,
                                onmessage = win.onmessage;
                            onmessage.call(win, {
                                data: obj
                            });
                        }
                    );
                },
                0
            );
        };
        window.Worker.prototype.terminate = function () {
            if (!this._unloaded) {
                (document.getElementsByTagName('head')[0] || document.body).removeChild(this._iframeEl);
            }
            this._iframeEl = null;
            this._unloaded = true;
        };
        window.Worker.prototype.addEventListener = function () {};
        window.Worker.prototype.removeEventListener = function () {};

        window.Worker.notNative = true;
        window.Worker.iframeURI = './worker.iframe.html';
        window.Worker.baseURI = '';
    }

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
