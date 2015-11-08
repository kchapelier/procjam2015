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

var generateGeometryData = function generateGeometryData (seed, width, height, depth, callback) {
    var random = rng.create(seed).random,
        cell = new CellularAutomata([width,height,depth], 0),
        sampling = new Poisson([width,height,depth], 13, 18, 10, random);

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
        .apply('E 3..6/5..6 von-neumann', 3);

    cell.setRule('ES26/B0,24..26');
    cell.iterate(3);

    cell.setOutOfBoundValue(0);
    cell.setRule('E 7..26/8..18 axis 3');
    cell.iterate(4);
    cell.setOutOfBoundValue(0);
    cell.setRule('E 3..6/5..6 axis 1');
    cell.iterate(10);

    callback(null, {
        mesh: getMeshFromVoxel(cell.currentArray),
        shape: cell.shape
    });
};

module.exports = generateGeometryData;
