var THREE = require('three');

var groundGeometryConversion = function groundGeometryConversion (data) {
    var geometry = new THREE.BufferGeometry();

    geometry.addAttribute('position', new THREE.BufferAttribute(data.position, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(data.normal, 3));

    return geometry;
};

module.exports = groundGeometryConversion;
