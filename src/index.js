"use strict";

var THREE = require('three'),
    GameLoop = require('migl-gameloop'),
    renderer = require('./renderer'),
    Camera = require('./camera'),
    camera = new Camera(70, renderer.screenWidth / renderer.screenHeight),
    pointer = require('./pointer'),
    input = require('./input'),
    fullscreen = require('./fullscreen'),
    Generator = require('./generator/generator'),
    DayNightCycle = require('./utils/day-night-cycle'),
    Player = require('./entities/player'),
    Sun = require('./entities/sun'),
    physics = require('./physics');

var World = require('./world');

var materials = require('./materials/materials');

var init = function init () {
    var seed = window.location.hash.replace(/#/g, '') || (new Date()).toISOString();



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

    // axis and center of the scene for reference
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(9000,10,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,9000,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,10,9000), new THREE.MeshNormalMaterial()));






    var sun = new Sun();
    renderer.addToScene(sun.mesh);

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.55 );
    directionalLight.position.set( 0.2, 1, 0.3 );

    var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x111111, 1.5);

    renderer.addToScene(hemisphereLight);
    renderer.addToScene(directionalLight);

    var loop = new GameLoop(),
        player = new Player(camera, input, pointer),
        dayNightCycle = new DayNightCycle(renderer.renderer, renderer.scene.fog, directionalLight, hemisphereLight, sun.mesh, materials.dust);

    player.position.y = 1000;
    player.position.x = -3000;

    var world = new World(seed, renderer, player, 2),
        collisionObjects = world.collisionObjects;

    var checkCollision = function checkCollision (entity) {
        physics.applyConstraints(entity, collisionObjects);
    };

    //loop.frameRate = 30;

    loop.update = function(dt) {
        materials.dust.uniforms.time.value += dt;

        input.update(dt);
        player.update(dt, gravity, checkCollision);
        camera.update(dt);
    };

    loop.postUpdate = function(dt) {
        world.update();
        pointer.clearMovements();
    };

    loop.render = function (dt) {
        renderer.render(dt);
        dayNightCycle.update(dt);
        world.postRender();
    };

    loop.start();
};

module.exports = init;
