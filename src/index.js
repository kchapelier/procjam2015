"use strict";

var THREE = require('three'),
    GameLoop = require('migl-gameloop'),
    renderer = require('./renderer'),
    Camera = require('./camera'),
    camera = new Camera(85, renderer.screenWidth / renderer.screenHeight),
    pointer = require('./pointer'),
    input = require('./input'),
    fullscreen = require('./fullscreen');



var init = function init () {
    var element = document.getElementById('game');

    element.addEventListener('click', function () {
        fullscreen.requestFullscreen(element);
        pointer.requestPointerLock(document, element);
    });

    renderer.infectDom(element);
    renderer.useCamera(camera);

    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(3800,100,100), new THREE.MeshNormalMaterial()));

    var loop = new GameLoop();

    var leftCommand = input.commands.left,
        rightCommand = input.commands.right,
        upCommand = input.commands.up,
        downCommand = input.commands.down,
        viewYCommand = input.commands.viewY,
        viewXCommand = input.commands.viewX;

    var movement = new THREE.Vector3(0, 0, 0);
    var axisUp = new THREE.Vector3(0, 1, 0);

    loop.update = function(dt) {
        input.update(dt);

        camera.setMousePosition(pointer.movementX + viewXCommand.value * 10, pointer.movementY + viewYCommand.value * 10, dt);

        if (leftCommand.active) {
            movement.x = leftCommand.value;
        } else {
            movement.x = -rightCommand.value;
        }

        if (upCommand.active) {
            movement.z = upCommand.value;
        } else {
            movement.z = -downCommand.value;
        }

        if (movement.x || movement.z) {
            // TODO the theta and phi should be calculated on the player entity
            movement.normalize();
            movement.applyAxisAngle(axisUp, -camera.theta + Math.PI / 2);
        }


        camera.position.z += movement.z * dt;
        camera.position.x += movement.x * dt;
        camera.update(dt);
    };

    loop.render = function (dt) {
        renderer.render(dt);

        pointer.clearMovements();
    };

    loop.start();
};

module.exports = init;
