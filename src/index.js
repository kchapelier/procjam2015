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

    /*
    // axis and center of the scene for reference
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(3000,10,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,3000,10), new THREE.MeshNormalMaterial()));
    renderer.addToScene(new THREE.Mesh(new THREE.BoxGeometry(10,10,3000), new THREE.MeshNormalMaterial()));

     */


    /*
    var radius = 2000,
        particles = 1000;

    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );
    var offsets = new Float32Array( particles );

    for ( var i = 0, i3 = 0; i < particles; i ++, i3 += 3 ) {

        positions[ i3 ] = ( Math.random() * 2 - 1 ) * radius;
        positions[ i3 + 1 ] = ( Math.pow(Math.random(), 2.5) * 2 - 1 ) * radius;
        positions[ i3 + 2 ] = ( Math.random() * 2 - 1 ) * radius;

        colors[ i3 ] = 0.9;
        colors[ i3 + 1 ] = 0.9;
        colors[ i3 + 2 ] = 0.7;

        offsets[ i ] = Math.random() * 100 * Math.PI;

    }

    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'toffset', new THREE.BufferAttribute( offsets, 1 ) );

    var particleSystem = new THREE.Points( geometry, materials.dust );

    particleSystem.position.y = 2000;

    renderer.addToScene( particleSystem );
    /**/






    var sun = new Sun();
    renderer.addToScene(sun.mesh);

    var collisionObjects = [];

    var checkCollision = function checkCollision (entity) {
        physics.applyConstraints(entity, collisionObjects);
    };

    /*
    var ground = new THREE.Mesh(new THREE.BoxGeometry(6400,1,6400), materials.ground);

    collisionObjects.push(ground);

    renderer.addToScene(ground);
    */

    var width = 32,
        height = 96,
        depth = 32;

    var generator = new Generator(seed, function (error, mesh, groundMesh) {
        renderer.addToScene(mesh);
        collisionObjects.push(mesh);
        renderer.addToScene(groundMesh);
        collisionObjects.push(groundMesh);
        //collisionObjects.push(meshes[1]);
    });

    for (var x = 0; x < 2; x++) {
        for (var z = 0; z < 2; z++) {
            generator.generate(x, z, width, height, depth);
        }
    }

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

    loop.update = function(dt) {
        materials.dust.uniforms.time.value += dt;

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
