"use strict";

var THREE = require('three'),
    GameLoop = require('migl-gameloop'),
    rng = require('migl-rng'),
    renderer = require('./renderer'),
    Camera = require('./camera'),
    camera = new Camera(85, renderer.screenWidth / renderer.screenHeight),
    pointer = require('./pointer'),
    input = require('./input'),
    fullscreen = require('./fullscreen'),
    converToGeometry = require('./utils/convert-to-geometry'),
    Poisson = require('poisson-disk-sampling'),
    CellularAutomata = require('cellular-automata'),
    Player = require('./entities/player');



var init = function init () {
    var element = document.getElementById('game'),
        r = rng.create('anothertest');

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



    var cell = new CellularAutomata([width,height,depth], 0);

    cell.fillWithDistribution([[0, 1999], [1, 1]], r.random); // a little bit of random

    var sampling = new Poisson([width,height,depth], 13, 18, 10, r.random);
    sampling.fill();

    for (var i = 0; i < sampling.samplePoints.length; i++) {
        cell.currentArray.set(
            sampling.samplePoints[i][0] | 0,
            sampling.samplePoints[i][1] | 0,
            sampling.samplePoints[i][2] | 0,
            1
        );
    }

    cell.setOutOfBoundValue(1)
        .apply('E 0..4,6/1,6 von-neumann', 7)
        .setOutOfBoundValue('wrap')
        .apply('E 0..26/8 moore', 30)
        .setOutOfBoundValue('wrap')
        .apply('E 3..6/5..6 von-neumann', 3);

    cell.setRule('ES26/B0,24..26');
    cell.iterate(3);

    cell.setOutOfBoundValue(0);
    cell.setRule('E 7..26/8..18 axis 3');
    cell.iterate(4);
    cell.setOutOfBoundValue(0);
    cell.setRule('E 3..6/5..6 axis 1');
    cell.iterate(10);

    var geometry = converToGeometry(cell.currentArray, 100, 100, 100);

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

    loop.render = function (dt) {
        renderer.render(dt);

        pointer.clearMovements();
    };

    loop.start();
};

module.exports = init;
