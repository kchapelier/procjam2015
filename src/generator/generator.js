"use strict";

var THREE = require('three'),
    WebWorkerQueue = require('./../utils/web-worker-queue'),
    materials = require('./../materials/materials'),
    meshGeometryGeneration = require('./mesh-geometry-generation'),
    meshGeometryConversion = require('./mesh-geometry-conversion'),
    groundGeometryGeneration = require('./ground-geometry-generation'),
    groundGeometryConversion = require('./ground-geometry-conversion'),
    rng = require('migl-rng');

var Generator = function (seed, callback) {
    this.seed = seed;
    this.worker = new WebWorkerQueue('./build/worker.js');

    var self = this;

    this.worker.addEventListener('message', function (e) {
        var geometry = meshGeometryConversion(e.data.result.mesh, 100, 100, 100, 0.08, rng.create(e.data.request.seed).random),
            mesh = new THREE.Mesh(geometry, materials.building),
            groundGeometry = groundGeometryConversion(e.data.result.ground, 64),
            groundMesh = new THREE.Mesh(groundGeometry, materials.sand);

        groundMesh.position.set(e.data.request.posX * 6400, 0, e.data.request.posY * 6400);
        mesh.position.set(e.data.request.posX * 6400, -100 * 10, e.data.request.posY * 6400);

        callback(e.data.error, mesh, groundMesh);
    });
};

Generator.prototype.generate = function (posX, posY) {
    this.worker.postMessage({ seed: this.seed, posX: posX, posY: posY });
};

module.exports = Generator;
