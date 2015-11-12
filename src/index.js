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

    var chunks = {};

    var generator = new Generator(seed, function (error, chunk) {
        chunks[x+','+z] = chunk;

        renderer.addToScene(chunk.building);
        collisionObjects.push(chunk.building);
        renderer.addToScene(chunk.ground);
        collisionObjects.push(chunk.ground);
        renderer.addToScene(chunk.particles);
        //collisionObjects.push(meshes[1]);
    });

    for (var x = 0; x < 1; x++) {
        for (var z = 0; z < 1; z++) {
            generator.generate(x, z);
            chunks[x+','+z] = true;
        }
    }

    var radiusVisibility = 2;
    // TODO use von-neumann neighbourhood instead of moore neighbourhood here

    var updateWorld = function (player) {
        var posX = (Math.floor(0.5 + player.position.x / 6400)),
            posY = (Math.floor(0.5 + player.position.z / 6400));

        //console.log(posX, posY, !!chunks[x+','+y])

        for (var x = posX - radiusVisibility; x <= posX + radiusVisibility; x++) {
            for (var y = posY - radiusVisibility; y <= posY + radiusVisibility; y++) {
                if (!chunks[x+','+y]) {
                    generator.generate(x, y);
                    chunks[x+','+y] = true;
                }
            }
        }


    };



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

        updateWorld(player);
    };

    loop.render = function (dt) {
        renderer.render(dt);
    };

    loop.start();
};

module.exports = init;
