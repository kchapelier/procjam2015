"use strict";

var meshGeometryGeneration = require('./generator/mesh-geometry-generation'),
    groundGeometryGeneration = require('./generator/ground-geometry-generation'),
    particleGeometryGeneration = require('./generator/particle-geometry-generation'),
    rng = require('migl-rng');

self.addEventListener('message', function onMessage (e) {
    var seed = e.data.seed,
        includeParticles = e.data.includeParticles,
        definitionGround = e.data.definitionGround,
        x = e.data.posX,
        y = e.data.posY;

    var generalRng = rng.create(seed),
        needBuilding = Math.abs(generalRng.perlin2(x / 7, y / 8)) > 0.35,
        buildingRng = needBuilding ? rng.create(seed + x + '-' + y) : null;

    var meshGeometry = needBuilding ? meshGeometryGeneration(buildingRng, x, y) : null,
        groundGeometry = groundGeometryGeneration(generalRng, x, y, 6400, definitionGround),
        particleGeometry = includeParticles && needBuilding ? particleGeometryGeneration(1800, 2500, 1800, 2000) : null;

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
