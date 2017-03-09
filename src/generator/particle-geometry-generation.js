"use strict";

// we don't really care about the position of the particles, lets just use Math.random

var generateGeometryData = function generateGeometryData (radiusX, radiusY, radiusZ, particles) {
    var arrayBuffer = new ArrayBuffer(particles * 16),
        positions = new Float32Array(arrayBuffer, 0, particles * 3),
        offsets = new Float32Array(arrayBuffer, particles * 12, particles),
        i;

    for (i = 0; i < particles; i++) {
        positions[ i * 3 ] = ( Math.random() * 2 - 1 ) * radiusX;
        positions[ i * 3 + 1 ] = ( Math.pow(Math.random(), 2.5) * 2 - 1 ) * radiusY;
        positions[ i * 3 + 2 ] = ( Math.random() * 2 - 1 ) * radiusZ;

        offsets[ i ] = Math.random() * 100 * Math.PI;
    }

    return {
        buffer : arrayBuffer
    };
};

module.exports = generateGeometryData;
