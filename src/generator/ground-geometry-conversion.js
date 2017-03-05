"use strict";

var groundGeometryConversion = function groundGeometryConversion (data) {
    var geometry = new THREE.BufferGeometry();

    geometry.setIndex(new THREE.BufferAttribute(data.indices, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(data.position, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(data.normal, 3));
    geometry.addAttribute('uv', new THREE.BufferAttribute(data.uv, 2));

    return geometry;
};

module.exports = groundGeometryConversion;
