"use strict";

var THREE = require('three'),
    WebWorkerPool = require('./../utils/web-worker-pool'),
    materials = require('./../materials/materials'),
    Chunk = require('./../entities/chunk'),
    meshGeometryConversion = require('./mesh-geometry-conversion'),
    groundGeometryConversion = require('./ground-geometry-conversion'),
    particleGeometryConversion = require('./particle-geometry-conversion');

var Generator = function (seed, options, callback) {
    this.seed = seed;
    this.includeParticles = options.particles;
    this.definitionGround = options.highDefGround ? 64 : 16;
    this.worker = new WebWorkerPool('./build/worker.js', Math.max(2, (navigator.hardwareConcurrency / 1.5) | 0));

    var self = this;

    this.worker.addEventListener('message', function onMessage (e) {

        //console.log('received : ', e.data.request.posX, ' , ', e.data.request.posY);

        var building,
            particles,
            ground;

        if (e.data.result.ground) {
            ground = new THREE.Mesh(groundGeometryConversion(e.data.result.ground), materials.sand);
            ground.position.set(e.data.request.posX * 6400, 0, e.data.request.posY * 6400);
        }

        if (e.data.result.mesh) {
            building = new THREE.Mesh(meshGeometryConversion(e.data.result.mesh), materials.building);
            building.position.set(e.data.request.posX * 6400, -1000, e.data.request.posY * 6400);
        }

        if (e.data.result.particle) {
            particles = new THREE.Points(particleGeometryConversion(e.data.result.particle), materials.dust);
            particles.position.set(e.data.request.posX * 6400, 2000, e.data.request.posY * 6400);
        }

        callback(e.data.error, new Chunk(
            e.data.request.posX,
            e.data.request.posY,
            building,
            ground,
            particles
        ));
    });
};

Generator.prototype.generate = function (posX, posY) {
    //console.log('generate : ', posX, ' , ', posY);
    this.worker.postMessage({ seed: this.seed, posX: posX, posY: posY, includeParticles: this.includeParticles, definitionGround: this.definitionGround });
};

module.exports = Generator;
