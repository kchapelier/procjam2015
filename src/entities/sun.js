"use strict";

var THREE = require('three'),
    materials = require('./../materials/materials');

var Sun = function Sun () {
    var geometry = new THREE.SphereGeometry(36000,50,55);
    this.mesh = new THREE.Mesh(geometry, materials.sun);
};

module.exports = Sun;
