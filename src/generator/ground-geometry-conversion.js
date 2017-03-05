"use strict";

var groundGeometryConversion = function groundGeometryConversion (data) {
    var geometry = new THREE.BufferGeometry();

    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(data.indices), 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(data.position), 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(data.normal), 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(data.uv), 2));

    return geometry;
};

module.exports = groundGeometryConversion;
