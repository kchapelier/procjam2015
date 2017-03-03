"use strict";

var createWebWorkers = function createWebWorkers (script, number) {
    var workers = [],
        now = Date.now(),
        i;

    for (i = 0; i < number; i++) {
        workers.push(new Worker(script + '#cache=' + now));
    }

    return workers;
};

var WebWorkerPool = function WebWorkerQueue (script, number) {
    this.script = script;
    this.number = number || navigator.hardwareConcurrency || 2;

    this.workers = createWebWorkers(this.script, this.number);
    this.iteration = 0;
    this.availableWorkers = [];

    this.listeners = {};

    var self = this;

    this.workers.forEach(function workerIteration (worker, id) {
        self.availableWorkers.push(worker);
        worker.task = 0;
        //worker.id = id;

        worker.addEventListener('message', function onMessage (e) {
            worker.task--;

            //console.log('message', worker.id, worker.task);

            if (worker.task < 1 && self.availableWorkers.indexOf(worker) === -1) {
                self.availableWorkers.push(worker);
            }

            self.emitEvent('message', e);
        });

        worker.addEventListener('error', function onError (e) {
            worker.task--;

            //console.log('error', worker.id, worker.task);

            if (worker.task < 1 && self.availableWorkers.indexOf(worker) === -1) {
                self.availableWorkers.push(worker);
            }

            self.emitEvent('error', e);
        });
    });
};

WebWorkerPool.prototype.getWorker = function () {
    var result = this.availableWorkers.pop();

    if (!result) {
        result = this.workers[this.iteration];
        this.iteration = (this.iteration + 1) % this.workers.length;
    }

    return result;
};

WebWorkerPool.prototype.postMessage = function (aMessage, transferList) {
    var worker = this.getWorker();
    worker.task++;

    //console.log('post', worker.id);

    worker.postMessage(aMessage, transferList);
};

WebWorkerPool.prototype.emitEvent = function (event, arg) {
    var listeners = this.listeners[event],
        i;

    if (!!listeners) {
        for (i = 0; i < listeners.length; i++) {
            listeners[i](arg);
        }
    }
};

WebWorkerPool.prototype.addEventListener = function (event, callback) {
    if (!this.listeners[event]) {
        this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
};

module.exports = WebWorkerPool;
