"use strict";

var THREE = require('three'),
    GameLoop = require('migl-gameloop'),
    rng = require('migl-rng'),
    renderer = require('./renderer'),
    Camera = require('./camera'),
    camera = new Camera(70, renderer.screenWidth / renderer.screenHeight),
    pointer = require('./pointer'),
    input = require('./input'),
    fullscreen = require('./fullscreen'),
    generateGeometryData = require('./utils/generate-geometry-data'),
    converToGeometry = require('./utils/convert-to-geometry'),
    DayNightCycle = require('./utils/day-night-cycle'),
    Player = require('./entities/player'),
    physics = require('./physics');

var init = function init () {
    var seed = window.location.hash.replace(/#/g, '') || (new Date()).toISOString();

    console.log('seed', seed);

    var element = document.getElementById('game');

    element.addEventListener('click', function () {
        fullscreen.requestFullscreen(element);
        pointer.requestPointerLock(document, element);
    });

    renderer.infectDom(element);
    renderer.useCamera(camera);

    var gravity = new THREE.Vector3(0, -1.2, 0);

    var material = new THREE.MeshPhongMaterial({
        color: 0x202020,
        specular: 0xE0E0E0,
        shininess: 11,
        shading: THREE.SmoothShading,
        metal: true
    });

    /*
    // axis and center of the scene for reference
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(3000,10,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,3000,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,10,3000), new THREE.MeshNormalMaterial()));

     */

    var sun = new THREE.Mesh(new THREE.SphereGeometry(40000,60,70), new THREE.MeshBasicMaterial({ color: 0xF5F5D0, fog: false }));
    renderer.addToScene(sun);

    var collisionObjects = [];

    var checkCollision = function checkCollision (entity) {
        physics.applyConstraints(entity, collisionObjects);
    };

    var ground = new THREE.Mesh(new THREE.BoxGeometry(100000,1,100000), material);

    collisionObjects.push(ground);

    renderer.addToScene(ground);

    var width = 32,
        height = 128,
        depth = 32;

    generateGeometryData(seed, width, height, depth, function (error, data) {
        var geometry = converToGeometry(data, 100, 100, 100, 0.08, rng.create(seed).random);

        var cube = new THREE.Mesh(
            geometry,
            material
        );

        cube.position.set(0, height * 43, 0);

        renderer.addToScene(cube);
        collisionObjects.push(cube);
    });




    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.55 );
    directionalLight.position.set( 0.2, 1, 0.3 );

    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x111111, 1.5);


    renderer.addToScene(hemisphereLight);
    renderer.addToScene(directionalLight);

    var loop = new GameLoop(),
        player = new Player(camera, input, pointer),
        dayNightCycle = new DayNightCycle(renderer.renderer, renderer.scene.fog, directionalLight, hemisphereLight, sun);

    player.position.y = 1000;
    player.position.x = -3000;

    loop.update = function(dt) {
        input.update(dt);
        player.update(dt, gravity, checkCollision);
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
