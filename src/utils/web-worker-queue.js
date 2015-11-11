"use strict";

var EventEmitter = require('eventemitter3');

var createWebWorkers = function createWebWorkers (script, number) {
    var workers = [],
        now = Date.now(),
        i;

    for (i = 0; i < number; i++) {
        workers.push(new Worker(script + '#cache=' + now));
    }

    return workers;
};

var WebWorkerQueue = function WebWorkerQueue (script, number) {
    this.script = script;
    this.number = number || navigator.hardwareConcurrency || 2;

    this.workers = createWebWorkers(this.script, this.number);
    this.iteration = 0;
    this.availableWorkers = [];

    this.emitter = new EventEmitter();

    var self = this;

    this.workers.forEach(function (worker) {
        self.availableWorkers.push(worker);
        worker.task = 0;

        worker.addEventListener('message', function (e) {
            worker.task--;

            if (worker.task < 1 && self.availableWorkers.indexOf(worker) === -1) {
                self.availableWorkers.push(worker);
            }

            self.emitter.emit('message', e);
        });

        worker.addEventListener('error', function (e) {
            worker.task--;

            if (worker.task < 1 && self.availableWorkers.indexOf(worker) === -1) {
                self.availableWorkers.push(worker);
            }

            self.emitter.emit('error', e);
        });
    });
};

WebWorkerQueue.prototype.getWorker = function () {
    var result = this.availableWorkers.pop();

    if (!result) {
        result = this.workers[this.iteration];
        this.iteration = (this.iteration + 1) % this.workers.length;
    }

    return result;
};

WebWorkerQueue.prototype.postMessage = function (aMessage, transferList) {
    var worker = this.getWorker();
    worker.task++;

    worker.postMessage(aMessage, transferList);
};

WebWorkerQueue.prototype.addEventListener = function (event, callback) {
    this.emitter.addListener(event, callback);
};

module.exports = WebWorkerQueue;
