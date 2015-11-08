"use strict";

var THREE = require('three');

var CustomRaycaster = function CustomRaycaster () {
    this.ray = new THREE.Ray(new THREE.Vector3(), new THREE.Vector3());
    this.near = 0;
    this.far = Infinity;
    this.precision = 0.0001;
    this.linePrecision = 1;

    // what is this ?
    this.params = {
        Sprite: {},
        Mesh: {},
        PointCloud: { threshold: 1 },
        LOD: {},
        Line: {}
    };

    this.origin = this.ray.origin;
    this.direction = this.ray.direction;
};

var intersectObjectRecursive = function intersectObjectRecursive (object, raycaster, intersects)  {
    var children,
        childrenNumber = children.length,
        i;

    object.raycast(raycaster, intersects);

    children = object.children;

    for (i = 0; i < childrenNumber; i++) {
        intersectObjectRecursive(children[i], raycaster, intersects, true);
    }
};

CustomRaycaster.prototype.intersectObjects = function ( objects, recursive, intersects ) {
    var numberOfObjects = objects.length,
        i;

    intersects = intersects || [];

    if (recursive) {
        for (i = 0; i < numberOfObjects; i++) {
            intersectObjectRecursive(objects[i], this, intersects);
        }
    } else {
        for (i = 0; i < numberOfObjects; i++) {
            objects[i].raycast(this, intersects);
        }
    }


    return intersects;
};

module.exports = CustomRaycaster;
