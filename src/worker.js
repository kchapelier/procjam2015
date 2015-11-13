"use strict";

var meshGeometryGeneration = require('./generator/mesh-geometry-generation'),
    groundGeometryGeneration = require('./generator/ground-geometry-generation'),
    particleGeometryGeneration = require('./generator/particle-geometry-generation');

self.addEventListener('message', function onMessage (e) {
    var seed = e.data.seed,
        includeParticles = e.data.includeParticles,
        definitionGround = e.data.definitionGround,
        x = e.data.posX,
        y = e.data.posY;

    var meshGeometry = meshGeometryGeneration(seed, x, y),
        groundGeometry = groundGeometryGeneration(seed, x, y, 6400, definitionGround),
        particleGeometry = includeParticles ? particleGeometryGeneration(1800, 2500, 1800, 1000) : null;

    self.postMessage({
        request: e.data,
        result: {
            mesh: meshGeometry,
            ground: groundGeometry,
            particle: particleGeometry
        }
    });
});

module.exports = self;
