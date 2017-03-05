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
        y = e.data.posY,
        generalRng = rng.create(seed),
        needBuilding = Math.abs(generalRng.perlin2(x / 7, y / 8)) > 0.35,
        buildingRng = needBuilding ? rng.create(seed + x + '-' + y) : null;

    var groundGeometry = groundGeometryGeneration(generalRng, x, y, 6400, definitionGround);

    var response = {
        request: e.data,
        result: {
            ground: groundGeometry,
            mesh: null,
            particle: null
        }
    };

    var transferables = [
        response.result.ground.indices,
        response.result.ground.position,
        response.result.ground.normal,
        response.result.ground.uv
    ];

    if (needBuilding) {
        response.result.mesh = meshGeometryGeneration(buildingRng, x, y);
        transferables.push(response.result.mesh.position, response.result.mesh.normal);
    }

    if (includeParticles && needBuilding) {
        response.result.particle = particleGeometryGeneration(1800, 2500, 1800, 2000);
        transferables.push(response.result.particle.position, response.result.particle.offset);
    }

    self.postMessage(response, transferables);
});

module.exports = self;
