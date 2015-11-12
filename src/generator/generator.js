"use strict";

var THREE = require('three'),
    WebWorkerQueue = require('./../utils/web-worker-queue'),
    materials = require('./../materials/materials'),
    Chunk = require('./../entities/chunk'),
    meshGeometryConversion = require('./mesh-geometry-conversion'),
    groundGeometryConversion = require('./ground-geometry-conversion'),
    particleGeometryConversion = require('./particle-geometry-conversion'),
    rng = require('migl-rng');

var Generator = function (seed, callback) {
    this.seed = seed;
    this.worker = new WebWorkerQueue('./build/worker.js');

    var self = this;

    this.worker.addEventListener('message', function (e) {

        //console.log('received : ', e.data.request.posX, ' , ', e.data.request.posY);

        var geometry = meshGeometryConversion(e.data.result.mesh, 100, 100, 100, 0.08, rng.create(e.data.request.seed).random),
            mesh = new THREE.Mesh(geometry, materials.building),
            groundGeometry = groundGeometryConversion(e.data.result.ground, 64),
            groundMesh = new THREE.Mesh(groundGeometry, materials.sand),
            particleGeometry = particleGeometryConversion(e.data.result.particle),
            particleSystem = new THREE.Points(particleGeometry, materials.dust);

        groundMesh.position.set(e.data.request.posX * 6400, 0, e.data.request.posY * 6400);
        mesh.position.set(e.data.request.posX * 6400, -1000, e.data.request.posY * 6400);
        particleSystem.position.set(e.data.request.posX * 6400, 2000, e.data.request.posY * 6400);

        callback(e.data.error, new Chunk(
            e.data.request.posX,
            e.data.request.posY,
            mesh,
            groundMesh,
            particleSystem
        ));
    });
};

Generator.prototype.generate = function (posX, posY) {
    //console.log('generate : ', posX, ' , ', posY);
    this.worker.postMessage({ seed: this.seed, posX: posX, posY: posY });
};

module.exports = Generator;
