"use strict";

var particleGeometryConversion = function particleGeometryConversion (data) {
    var geometry = new THREE.BufferGeometry();

    geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array(data.position), 3 ) );
    geometry.addAttribute( 'offset', new THREE.BufferAttribute( new Float32Array(data.offset), 1 ) );

    return geometry;
};

module.exports = particleGeometryConversion;
