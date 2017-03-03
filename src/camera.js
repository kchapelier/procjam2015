"use strict";

var Camera = function Camera (p1, p2) {
    THREE.PerspectiveCamera.call(this, p1, p2, 1, 50000);

    this.position.set(50, 50, 50);

    this.target = new THREE.Vector3(0,0,0);
    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;
};

Camera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.lat = null;
Camera.prototype.lon = null;
Camera.prototype.phi = null;
Camera.prototype.theta = null;

//TODO smooth out the camera movements

Camera.prototype.setMousePosition = function (deltaX, deltaY, dt) {
    this.lon = this.lon + deltaX * dt / 200;
    this.lat = Math.max(-80, Math.min(80, this.lat - deltaY * dt / 180));
};

Camera.prototype.update = function (dt) {
    this.phi = ( 90 - this.lat ) * Math.PI / 180;
    this.theta = this.lon * Math.PI / 180;

    this.target.x = this.position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
    this.target.y = this.position.y + 100 * Math.cos( this.phi );
    this.target.z = this.position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

    this.lookAt(this.target);
};

module.exports = Camera;
