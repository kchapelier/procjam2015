"use strict";

var meshGeometryConversion = function meshGeometryConversion (data) {
    var geometry = new THREE.BufferGeometry();

    var vertexNumber = data.buffer.byteLength / 24,
        vertexLength = vertexNumber * 12,
        normalLength = vertexNumber * 12;

    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.buffer, 0, vertexLength / 4), 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.buffer, vertexLength, normalLength / 4), 3));

    return geometry;

};

module.exports = meshGeometryConversion;
