"use strict";

var particleGeometryConversion = function particleGeometryConversion (data) {
    var geometry = new THREE.BufferGeometry(),
        vertexNumber = data.buffer.byteLength / 16,
        vertexLength = 3 * vertexNumber * 4,
        offsetLength = vertexNumber * 4;

    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.buffer, 0, vertexLength / 4), 3));
    geometry.addAttribute('offset', new THREE.BufferAttribute(new Float32Array(data.buffer, vertexLength, offsetLength / 4), 1));

    return geometry;
};

module.exports = particleGeometryConversion;
