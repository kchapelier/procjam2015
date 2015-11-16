"use strict";

var pointer = {
    movementX : 0,
    movementY : 0,
    requestPointerLock : function (document, element) {
        var self = this;

        // do not allow to apply the event listener multiple times
        if (document.pointerLockElement === element ||
            document.mozPointerLockElement === element ||
            document.webkitPointerLockElement === element) {
            return false;
        }

        document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        // Hook pointer lock state change events for different browsers
        document.addEventListener('pointerlockchange', lockChangeAlert, false);
        document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
        document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);

        function lockChangeAlert() {
            if(document.pointerLockElement === element ||
                document.mozPointerLockElement === element ||
                document.webkitPointerLockElement === element) {
                console.log('The pointer lock status is now locked');
                document.addEventListener("mousemove", canvasLoop, false);
            } else {
                console.log('The pointer lock status is now unlocked');
                document.removeEventListener("mousemove", canvasLoop, false);
                document.removeEventListener("pointerlockchange", lockChangeAlert, false);
                document.removeEventListener("mozpointerlockchange", lockChangeAlert, false);
                document.removeEventListener("webkitpointerlockchange", lockChangeAlert, false);
            }
        }

        function canvasLoop (event) {
            self.movementX += event.movementX;
            self.movementY += event.movementY;
        }

        element.requestPointerLock();
    },
    clearMovements: function () {
        this.movementX = 0;
        this.movementY = 0;
    }
};

module.exports = pointer;
