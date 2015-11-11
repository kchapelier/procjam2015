"use strict";

var meshGeometryGeneration = require('./generator/mesh-geometry-generation'),
    groundGeometryGeneration = require('./generator/ground-geometry-generation');

self.addEventListener('message', function (e) {
    var seed = e.data.seed,
        x = e.data.posX,
        y = e.data.posY,
        width = e.data.width,
        height = e.data.height,
        depth = e.data.width;

    var meshGeometry = meshGeometryGeneration(seed, x, y, width, height, depth),
        groundGeometry = groundGeometryGeneration(seed, x, y, 64);

    self.postMessage({
        request: e.data,
        result: {
            mesh: meshGeometry,
            ground: groundGeometry
        }
    });
});

module.exports = self;
