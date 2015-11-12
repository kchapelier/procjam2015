"use strict";

var THREE = require('three');

var convertToGeometry = function convertToGeometry (data) {
    var geometry = new THREE.BufferGeometry();

    geometry.addAttribute( 'position', new THREE.BufferAttribute( data.positions, 3 ) );
    geometry.addAttribute( 'offset', new THREE.BufferAttribute( data.offsets, 1 ) );

    return geometry;
};

module.exports = convertToGeometry;
