"use strict";

var THREE = require('three'),
    GameLoop = require('migl-gameloop'),
    renderer = require('./renderer'),
    Camera = require('./camera'),
    camera = new Camera(75, renderer.screenWidth / renderer.screenHeight),
    pointer = require('./pointer'),
    input = require('./input'),
    fullscreen = require('./fullscreen'),
    generateGeometryData = require('./utils/generate-geometry-data'),
    converToGeometry = require('./utils/convert-to-geometry'),
    DayNightCycle = require('./utils/day-night-cycle'),
    Player = require('./entities/player');

var init = function init () {
    var element = document.getElementById('game');

    element.addEventListener('click', function () {
        fullscreen.requestFullscreen(element);
        pointer.requestPointerLock(document, element);
    });

    renderer.infectDom(element);
    renderer.useCamera(camera);

    var material = new THREE.MeshPhongMaterial({
        color: 0x202020,
        specular: 0xE0E0E0,
        shininess: 11,
        metal: true
    });

    /*
    // axis and center of the scene for reference
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(3000,10,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,3000,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,10,3000), new THREE.MeshNormalMaterial()));

     */

    var sun = new THREE.Mesh(new THREE.SphereGeometry(40000,50,50), new THREE.MeshNormalMaterial())
    renderer.addToScene(sun);


    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(100000,1,100000), material));

    var width = 32,
        height = 128,
        depth = 32;


    generateGeometryData('test 2', width, height, depth, function (error, data) {
        var geometry = converToGeometry(data, 100, 100, 100);

        var cube = new THREE.Mesh(
            geometry,
            material
        );

        cube.position.set(width * 100, height * 90, depth * 100);

        renderer.addToScene(cube);
    });


    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set( 0.2, 1, 0.3 );

    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x111111, 1.5);


    renderer.addToScene(hemisphereLight);
    renderer.addToScene(directionalLight);

    var loop = new GameLoop(),
        player = new Player(camera, input, pointer),
        dayNightCycle = new DayNightCycle(renderer.renderer, renderer.scene.fog, directionalLight, hemisphereLight, sun);

    loop.update = function(dt) {
        input.update(dt);
        player.update(dt);
        camera.update(dt);
    };

    loop.postUpdate = function(dt) {
        pointer.clearMovements();
        dayNightCycle.update(dt);
    };

    loop.render = function (dt) {
        renderer.render(dt);
    };

    loop.start();
};

module.exports = init;
