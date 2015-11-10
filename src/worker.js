"use strict";

var generateGeometryData = require('./utils/generate-geometry-data');

self.addEventListener('message', function (e) {
    var seed = e.data.seed,
        width = e.data.width,
        height = e.data.height,
        depth = e.data.width;

    generateGeometryData(seed, width, height, depth, function (error, data) {
        self.postMessage({
            request: e.data,
            error: error,
            result: data
        });
    });
});

module.exports = self;
