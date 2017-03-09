"use strict";

var groundGeometryConversion = function groundGeometryConversion (data) {
    var geometry = new THREE.BufferGeometry();

    var vertexNumber = (data.buffer.byteLength - data.indices) / 32,
        indexLength = data.indices,
        vertexLength = 3 * vertexNumber * 4,
        normalLength = 3 * vertexNumber * 4,
        uvLength = 2 * vertexNumber * 4;

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(data.buffer, 0, data.indices / 2), 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.buffer, indexLength, vertexLength / 4), 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.buffer, indexLength + vertexLength, normalLength / 4), 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.buffer, indexLength + vertexLength + normalLength, uvLength / 4), 2));

    return geometry;
};

module.exports = groundGeometryConversion;
