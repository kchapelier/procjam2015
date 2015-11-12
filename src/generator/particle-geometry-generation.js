"use strict";

var generateGeometryData = function generateGeometryData (radiusX, radiusY, radiusZ, particles) {
    var positions = new Float32Array( particles * 3),
        offsets = new Float32Array( particles),
        i;

    for (i = 0; i < particles; i++) {
        positions[ i * 3 ] = ( Math.random() * 2 - 1 ) * radiusX;
        positions[ i * 3 + 1 ] = ( Math.pow(Math.random(), 2.5) * 2 - 1 ) * radiusY;
        positions[ i * 3 + 2 ] = ( Math.random() * 2 - 1 ) * radiusZ;

        offsets[ i ] = Math.random() * 100 * Math.PI;
    }

    return {
        positions : positions,
        offsets : offsets
    };
};

module.exports = generateGeometryData;
