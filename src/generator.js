"use strict";

var THREE = require('three'),
    generateGeometryData = require('./utils/generate-geometry-data'),
    converToGeometry = require('./utils/convert-to-geometry'),
    rng = require('migl-rng');

var material = new THREE.MeshPhongMaterial({
    color: 0x202020,
    specular: 0xE0E0E0,
    shininess: 11,
    shading: THREE.SmoothShading,
    metal: true
});

var getWorker = function () {
    var worker = new Worker('./build/worker.js#t=' + Date.now());
    return worker;
};

var generator = function generator (seed, width, height, depth, callback) {
    /* */
    var worker = getWorker();

    worker.addEventListener('message', function (e) {
        console.log(e);

        var geometry = converToGeometry(e.data.result, 100, 100, 100, 0.08, rng.create(seed).random);

        callback(e.data.error, new THREE.Mesh(
            geometry,
            material
        ));
    });

    worker.postMessage({ seed: seed, width: width, height: height, depth: depth });
    /*/
    generateGeometryData(seed, width, height, depth, function (error, data) {
        var geometry = converToGeometry(data, 100, 100, 100, 0.08, rng.create(seed).random);

        callback(error, new THREE.Mesh(
            geometry,
            material
        ));
    });
    /* */
};

module.exports = generator;
