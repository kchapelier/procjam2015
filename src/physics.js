"use strict";

var CustomRaycaster = require('./utils/custom-raycaster'),
    ray = new CustomRaycaster();

var physics = {};

physics.applyConstraints = function (entity, meshCollisions) {
    this.constraintY(entity, meshCollisions);
    this.constraintX(entity, meshCollisions);
};

physics.constraintX = function (entity, meshCollisions) {
    var intersects = [],
        direction = entity.movement,
        length = direction.length(),
        rayCastingDistance = length + entity.width / 2;

    ray.direction.x = direction.x;
    ray.direction.y = 0;
    ray.direction.z = direction.z;

    ray.direction.normalize();

    ray.origin.x = entity.position.x - direction.x;
    ray.origin.y = entity.position.y;
    ray.origin.z = entity.position.z - direction.z;

    ray.intersectObjects(meshCollisions, false, intersects);

    var minIntersect = null,
        minDistanceIntersect = rayCastingDistance;

    for(var i = 0; i < intersects.length; i++) {
        if (intersects[i].distance < minDistanceIntersect /* && intersects[i].object.userData.collision */) {
            minIntersect = intersects[i];
            minDistanceIntersect = minIntersect.distance;
        }
    }

    if (minIntersect) {
        var position = minIntersect.point.clone();

        position.sub(entity.position);
        position.normalize();

        //TODO calculate the best position
        entity.position.x = minIntersect.point.x - (position.x * entity.width / 2);
        entity.position.z = minIntersect.point.z - (position.z * entity.width / 2);

        /*
        entity.movement.x = 0;
        entity.movement.z = 0;
        */
    }
};

physics.constraintY = function (entity, meshCollisions) {
    var intersects = [],
        yDirection = entity.movement.y < 0 ? -1 : 1,
        lengthFall = Math.abs(entity.movement.y),
        height = entity.height,
        rayCastingOriginY = entity.position.y - (lengthFall + height / 2) * yDirection, //POSY + H/2 + DIRY
        rayCastingDistance = lengthFall + height; // DIRY + H

    ray.direction.x = 0;
    ray.direction.z = 0;
    ray.direction.y = yDirection;

    ray.origin.y = rayCastingOriginY;

    ray.origin.x = entity.position.x;
    ray.origin.z = entity.position.z;

    ray.intersectObjects(meshCollisions, false, intersects);

    var minIntersect = null,
        minDistanceIntersect = rayCastingDistance;

    for(var i = 0; i < intersects.length; i++) {
        if (intersects[i].distance < minDistanceIntersect /* && intersects[i].object.userData.collision */) {
            minIntersect = intersects[i];
            minDistanceIntersect = minIntersect.distance;
        }
    }

    if (minIntersect !== null) {
        if (yDirection < 0) {
            entity.jumpCount = 0;
            entity.currentJumpStrength = 0;
        }

        entity.position.y = minIntersect.point.y - height / 2 * yDirection;

        if (yDirection == Math.sign(entity.movement.y)) {
            entity.movement.y = 0;
            entity.currentJumpStrength = 0;
        }
    } else if (yDirection < 0 && entity.jumpCount === 0) {
        //falling from a platform, set currentJump to avoid double jump
        entity.jumpCount = 1;
    }
};

module.exports = physics;
