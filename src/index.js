"use strict";

var THREE = require('three'),
    GameLoop = require('migl-gameloop'),
    renderer = require('./renderer'),
    Camera = require('./camera'),
    camera = new Camera(85, renderer.screenWidth / renderer.screenHeight),
    pointer = require('./pointer'),
    input = require('./input'),
    fullscreen = require('./fullscreen'),
    generateGeometryData = require('./utils/generate-geometry-data'),
    converToGeometry = require('./utils/convert-to-geometry'),
    Player = require('./entities/player');

var init = function init () {
    var element = document.getElementById('game');

    element.addEventListener('click', function () {
        fullscreen.requestFullscreen(element);
        pointer.requestPointerLock(document, element);
    });

    renderer.infectDom(element);
    renderer.useCamera(camera);

    /*
    // axis and center of the scene for reference
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(3000,10,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,3000,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,10,3000), new THREE.MeshNormalMaterial()));
    */

    var width = 32,
        height = 128,
        depth = 32;

    generateGeometryData('test 2', width, height, depth, function (error, data) {
        var geometry = converToGeometry(data, 100, 100, 100);

        var cube = new THREE.Mesh(
            geometry,
            new THREE.MeshPhongMaterial({
                color: 0x111111,
                specular: 0x694489,
                shininess: 10,
                metal: true
            })
        );

        renderer.addToScene(cube);
    });

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 0.2, 1, 0.3 );

    renderer.addToScene(directionalLight);

    var loop = new GameLoop();

    var player = new Player(camera, input, pointer);

    loop.update = function(dt) {
        input.update(dt);
        player.update(dt);
        camera.update(dt);
    };

    loop.postUpdate = function(dt) {
        pointer.clearMovements();
    };

    loop.render = function (dt) {
        renderer.render(dt);
    };

    loop.start();
};

module.exports = init;
