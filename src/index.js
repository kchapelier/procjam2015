"use strict";

var THREE = require('three'),
    GameLoop = require('migl-gameloop'),
    GameInput = require('migl-input'),
    renderer = require('./renderer'),
    Camera = require('./camera'),
    camera = new Camera(50, renderer.screenWidth / renderer.screenHeight),
    pointer = require('./pointer'),
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

    loop.update = function(dt) {
        camera.setMousePosition(pointer.movementX, pointer.movementY, dt);
        camera.update(dt);
    };

    loop.render = function (dt) {
        renderer.render(dt);

        pointer.clearMovements();
    };

    loop.start();
};

module.exports = init;
