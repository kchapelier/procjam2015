"use strict";

//TODO make this into a web worker at some point

var voxel = voxel = require("voxel"),
    rng = require('migl-rng'),
    Poisson = require('poisson-disk-sampling'),
    CellularAutomata = require('cellular-automata');

var getMeshFromVoxel = function getMeshFromVoxel (ndarray) {
    // the lo and hi arrays are modified by the generate function, so we need to make sure we don't pass them by reference
    var voxelData = voxel.generate([0, 0, 0], [ndarray.shape[0], ndarray.shape[1], ndarray.shape[2]], function (x, y, z) {
        return !!ndarray.get(x, y, z);
    });

    // the dimensions in the voxel data are flipped but the meshers expect the dimensions to be in the initial order (not the values ?)
    return voxel.meshers.monotone(voxelData.data, [voxelData.shape[2], voxelData.shape[1], voxelData.shape[0]]);
};

var generateType1 = function (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0);

    cell.fillWithDistribution([[0,6], [1,94]], random);

    cell.setOutOfBoundValue(1)
        .apply('E 6..26/1..9 moore', 5)
        .apply('E 2,4,6/0 von-neumann', 1)
        .apply('E 26/0,24..26 moore', 4)
        .setOutOfBoundValue(0)
        .apply('E 3..26/26 moore', 1)
        .apply('E 12..26/26 moore', 7);

    return cell.currentArray;
};

var generateType2 = function (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0),
        sampling = new Poisson(shape, 20, 30, 30, random),
        innerTypes = [[2,1], [5,3], [2,3]],
        i;

    var innerType = innerTypes[(random() * innerTypes.length) | 0];

    sampling.fill();

    for (i = 0; i < sampling.samplePoints.length; i++) {
        cell.currentArray.set(
            sampling.samplePoints[i][0] | 0,
            sampling.samplePoints[i][1] | 0,
            sampling.samplePoints[i][2] | 0,
            1
        );
    }

    cell.setOutOfBoundValue(1)
        .apply('E 6..26/1..9', innerType[0]) // 2 or 5
        .setOutOfBoundValue('wrap')
        .apply('E 2,4,6/0 von-neumann', innerType[1]) // 1 or 3
        .apply('ES26/B0,24..26', 8)
        .setOutOfBoundValue(0)
        .apply('ES3..26/B26', 1)
        .apply('ES12..26/B26', 6);

    return cell.currentArray;
};

var generateType3 = function generateType3 (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0),
        sampling = new Poisson(shape, 13, 18, 10, random);

    cell.fillWithDistribution([[0, 1999], [1, 1]], random); // a little bit of random

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
        .apply('E 3..6/5..6 von-neumann', 3)
        .apply('E 26/B0,24..26 moore', 3)
        .setOutOfBoundValue(0)
        .apply('E 7..26/8..18 axis 3', 4)
        .apply('E 3..6/5..6 axis 1', 10);

    return cell.currentArray;
};


var generateType4 = function generateType4 (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0),
        sampling = new Poisson(shape, 25, 38, 30, random);

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
        .apply('E 0..2/1,3 corner 3', 7)
        .apply('E 0..2/1,3 corner 2', 5)
        .apply('E 0..2/1,3 corner 1', 1)
        .apply('E 9..24/16,26 moore', 4)
        .apply('E 26/0,23,26 moore', 8)
        .apply('E 2..6/6 von-neumann', 2);

    return cell.currentArray;
};

var generateType5 = function generateType5 (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0),
        sampling = new Poisson(shape, 27, 30, 40, random);

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
        .apply('E /1,9 moore', 1)
        .apply('E 3,6,12/1,9,14 moore', 4)
        .apply('E 1..6/6 von-neumann', 1)
        .apply('E 26/0 moore', 4)
        .apply('E 20..26/12,15,20..26 moore', 2)
        .setOutOfBoundValue(0)
        .apply('E 1..6/4..6 von-neumann', 1)
        .setOutOfBoundValue(1)
        .apply('E 0..26/13..14 moore', 4);

    return cell.currentArray;
};

var generationTypes = [generateType1, generateType2, generateType3, generateType4, generateType5];

var generateGeometryData = function generateGeometryData (seed, width, height, depth, callback) {
    var random = rng.create(seed),
        shape = [width,height,depth],
        type = (random.random() * generationTypes.length) | 0;

    var ndarray = generationTypes[type](shape, random);

    /*
    cell.setOutOfBoundValue(1);
    cell.setRule('E 6..26/1..9');
    cell.iterate(3);

    cell.setOutOfBoundValue('wrap');
    cell.setRule('E 2,4,6/0 von-neumann');
    cell.iterate(2);

    cell.setRule('ES26/B0,24..26');
    cell.iterate(8);

    cell.setOutOfBoundValue(0);
    cell.setRule('ES3..26/B26');
    cell.iterate(3);
    */

    callback(null, {
        mesh: getMeshFromVoxel(ndarray),
        shape: shape
    });
};

module.exports = generateGeometryData;
