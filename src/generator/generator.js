"use strict";

var THREE = require('three'),
    WebWorkerQueue = require('./../utils/web-worker-queue'),
    materials = require('./../materials/materials'),
    meshGeometryGeneration = require('./mesh-geometry-generation'),
    meshGeometryConversion = require('./mesh-geometry-conversion'),
    groundGeometryGeneration = require('./ground-geometry-generation'),
    rng = require('migl-rng');

var Generator = function (seed, callback) {
    this.seed = seed;
    this.worker = new WebWorkerQueue('./build/worker.js');

    var self = this;

    this.worker.addEventListener('message', function (e) {
        console.log(e);

        var geometry = meshGeometryConversion(e.data.result.mesh, 100, 100, 100, 0.08, rng.create(e.data.request.seed).random),
            mesh = new THREE.Mesh(geometry, materials.building),
            groundMesh;

        var groundGeometry = e.data.result.ground;

        var groundSegments = 64;

        var plane = new THREE.PlaneGeometry(groundSegments * 100, groundSegments * 100, groundSegments, groundSegments);

        plane.rotateX(-Math.PI / 2);

        for (var x = 0; x <= groundSegments; x++) {
            for (var z = 0; z <= groundSegments; z++) {
                var i = x * (groundSegments + 1) + z;

                plane.vertices[i].y = groundGeometry[z * (groundSegments + 1) + x];
            }
        }

        plane.computeFaceNormals();

        plane.computeVertexNormals();

        plane.normalsNeedUpdate = true;

        groundMesh = new THREE.Mesh(plane, materials.sand);

        groundMesh.position.set(e.data.request.posX * 6400, 0, e.data.request.posY * 6400);

        mesh.position.set(e.data.request.posX * 6400, -100 * 10, e.data.request.posY * 6400);

        callback(e.data.error, mesh, groundMesh);
    });
};

Generator.prototype.generate = function (posX, posY, width, height, depth) {
    this.worker.postMessage({ seed: this.seed, posX: posX, posY: posY, width: width, height: height, depth: depth });
};


var generator = function generator (seed, posX, posY, width, height, depth, callback) {
    /* */
    worker.addEventListener('message', function (e) {
        console.log(e.data.result);

        var geometry = meshGeometryConversion(e.data.result, 100, 100, 100, 0.08, rng.create(seed).random),
            mesh = new THREE.Mesh(geometry, materials.building);

        mesh.position.set(posX * 6400, -100 * 10, posY * 6400);

        callback(e.data.error, mesh);
    });

    worker.postMessage({ seed: seed, posX: posX, posY: posY, width: width, height: height, depth: depth });
    /*/
    meshGeometryGeneration(seed, width, height, depth, function (error, data) {
        var geometry = meshGeometryConversion(data, 100, 100, 100, 0.08, rng.create(seed).random),
            mesh = new THREE.Mesh(geometry, materials.building);



        var groundSegments = 64;

        var groundGeometry = groundGeometryGeneration(seed, groundSegments, data.ndarray);

        var plane = new THREE.PlaneGeometry(groundSegments * 100, groundSegments * 100, groundSegments, groundSegments);

        plane.rotateX(-Math.PI / 2);

        for (var x = 0; x <= groundSegments; x++) {
            for (var z = 0; z <= groundSegments; z++) {
                var i = x * (groundSegments + 1) + z;

                plane.vertices[i].y = groundGeometry.get(x, z);
            }
        }

        plane.computeFaceNormals();

        plane.computeVertexNormals();

        plane.normalsNeedUpdate = true;

        var groundMesh = new THREE.Mesh(plane, materials.sand);

        mesh.position.set(0, -100 * 10, 0);
        groundMesh.position.set(0, -100 * 10, 0);

        callback(error, mesh, groundMesh);
    });
    /* */
};

module.exports = Generator;
