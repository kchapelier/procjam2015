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
    physics = require('./physics'),
    sound = require('./sound');

var loadSounds = function loadSounds () {
    sound.load('music', 'procjam', 1, true, true);
};

var World = require('./world');

var materials = require('./materials/materials');

var options = {
    fullscreen: false,
    highFrameRate: false,
    particles: false,
    highDefGround: false,
    seed: (new Date()).toISOString()
};

var init = function init () {
    loadSounds();

    document.location.search.split(/[?&]/g).map(function(option) {
        option = option.split('=');

        switch (option[0]) {
            case 'fullscreen':
                options.fullscreen = !!option[1];
                break;
            case 'highFrameRate':
                options.highFrameRate = !!option[1];
                break;
            case 'particles':
                options.particles = !!option[1];
                break;
            case 'highDefGround':
                options.highDefGround = !!option[1];
                break;
            case 'seed':
                options.seed = !!option[1] ? option[1] : options.seed;
                break;
        }
    });

    var element = document.getElementById('game');

    element.addEventListener('click', function () {
        if (options.fullscreen) {
            fullscreen.requestFullscreen(element);
        }

        pointer.requestPointerLock(document, element);
    });

    renderer.infectDom(element);
    renderer.useCamera(camera);

    var loop,
        player = new Player(camera, input, pointer),
        gravity = new THREE.Vector3(0, -1.2, 0),
        directionalLight = new THREE.DirectionalLight( 0xffffff, 0.55),
        hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x111111, 1.5),
        sun = new Sun(),
        dayNightCycle = new DayNightCycle(renderer.renderer, renderer.scene.fog, directionalLight, hemisphereLight, sun.mesh, materials.dust);

    renderer.addToScene(sun.mesh);
    renderer.addToScene(hemisphereLight);
    renderer.addToScene(directionalLight);

    player.position.y = 1500;
    player.position.x = -3000;

    var loopStart = function loopStart () {
        var musicPlaying = sound.play('music');
        loop.start();
    };

    var world = new World(options.seed, renderer, player, 2, loopStart, options),
        collisionObjects = world.collisionObjects;

    var checkCollision = function checkCollision (entity) {
        physics.applyConstraints(entity, collisionObjects);
    };

    loop = new GameLoop({
        update: function(dt) {
            materials.dust.uniforms.time.value += dt;

            input.update(dt);
            player.update(dt, gravity, checkCollision);
            camera.update(dt);
        },
        postUpdate: function(dt) {
            world.update();
            pointer.clearMovements();
        },
        render: function (dt) {
            renderer.render();
            dayNightCycle.update(player, dt);
            world.postRender();
        }
    });

    if (!options.highFrameRate) {
        loop.setFrameRate(30);
    }
};

module.exports = init;
