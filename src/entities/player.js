"use strict";

var THREE = require('three'),
    axisUp = new THREE.Vector3(0, 1, 0),
    PI_2 = Math.PI / 2;

var Player = function Player (camera, input, pointer) {
    this.height = 100;
    this.width = 100;

    this.position = new THREE.Vector3(0, 0, 0);
    this.movement = new THREE.Vector3(0, 0, 0);

    this.leftCommand = input.commands.left;
    this.rightCommand = input.commands.right;
    this.upCommand = input.commands.up;
    this.downCommand = input.commands.down;
    this.viewZCommand = input.commands.viewZ;
    this.viewXCommand = input.commands.viewX;
    this.viewYMinusCommand = input.commands.viewYPlus;
    this.viewYPlusCommand = input.commands.viewYMinus;

    this.pointer = pointer;
    this.camera = camera;
};

Player.prototype.update = function (dt, gravity, checkCollision) {
    //MOVEMENTS
    this.movement.x = this.leftCommand.active ? this.leftCommand.value : -this.rightCommand.value;
    this.movement.z = this.upCommand.active ? this.upCommand.value : -this.downCommand.value;
    this.movement.y = 0;

    if (this.movement.x || this.movement.z) {
        // TODO the theta and phi should be calculated on the player entity and then passed to the camera
        this.movement.normalize();
        this.movement.applyAxisAngle(axisUp, -this.camera.theta + PI_2);
    }

    // TODO refactor in a jump action
    if (this.viewYPlusCommand.active) {
        this.movement.y = this.viewYPlusCommand.value * 3;
    } else {
        this.movement.y = -this.viewYMinusCommand.value * 3;
    }

    this.movement.add(gravity);
    this.movement.multiplyScalar(dt);

    this.camera.setMousePosition(
        this.pointer.movementX + Math.sign(this.viewXCommand.value) * Math.pow(this.viewXCommand.value, 2) * 25,
        this.pointer.movementY + Math.sign(this.viewZCommand.value) * Math.pow(this.viewZCommand.value, 2) * 25,
        dt
    );

    this.camera.position.z = this.position.z = this.position.z + this.movement.z;
    this.camera.position.x = this.position.x = this.position.x + this.movement.x;
    this.camera.position.y = this.position.y = this.position.y + this.movement.y;

    this.camera.position.y+= this.height * 0.75;

    checkCollision(this);
};


module.exports = Player;

