"use strict";

var voxel = require('voxel'),
    Poisson = require('poisson-disk-sampling'),
    CellularAutomata = require('cellular-automata');

var computeVertexNormal = require('../utils/meshes/compute-vertex-normals');

var prepareBufferGeometry = function prepareBufferGeometry (voxelData, shape, widthBlocks, heightBlocks, depthBlocks, normalPerturb, rng) {
    var random = rng.random,
        width = 100,
        mWidth = widthBlocks * shape[0] / 2,
        mDepth = depthBlocks * shape[2] / 2,
        slantedX = random() * 50 - 25,
        slantedZ = random() * 50 - 25,
        vertex,
        face,
        i;

    var positions = new Float32Array(voxelData.faces.length * 9);
    var normals = new Float32Array(voxelData.faces.length * 9);

    for(i = 0; i < voxelData.faces.length; i++) {
        face = voxelData.faces[i];
        vertex = voxelData.vertices[face[0]];
        positions[i * 9] = vertex[1] * slantedX + vertex[0] * widthBlocks - mWidth;
        positions[i * 9 + 1] = vertex[1] * heightBlocks;
        positions[i * 9 + 2] = vertex[1] * slantedZ + vertex[2] * depthBlocks - mDepth;

        vertex = voxelData.vertices[face[1]];
        positions[i * 9 + 3] = vertex[1] * slantedX + vertex[0] * widthBlocks - mWidth;
        positions[i * 9 + 4] = vertex[1] * heightBlocks;
        positions[i * 9 + 5] = vertex[1] * slantedZ + vertex[2] * depthBlocks - mDepth;

        vertex = voxelData.vertices[face[2]];
        positions[i * 9 + 6] = vertex[1] * slantedX + vertex[0] * widthBlocks - mWidth;
        positions[i * 9 + 7] = vertex[1] * heightBlocks;
        positions[i * 9 + 8] = vertex[1] * slantedZ + vertex[2] * depthBlocks - mDepth;
    }

    computeVertexNormal(null, positions, normals);

    for (i = 0; i < normals.length; i+=9) {
        normals[i + 3] = normals[i + 6] = (normals[i] += (Math.random() - 0.5) * normalPerturb);
        normals[i + 4] = normals[i + 7] = (normals[i + 1] += (Math.random() - 0.5) * normalPerturb);
        normals[i + 5] = normals[i + 8] = (normals[i + 2] += (Math.random() - 0.5) * normalPerturb);
    }

    return {
        position: positions.buffer,
        normal: normals.buffer
    };

    /*
    for(i = 0; i < voxelData.vertices.length; ++i) {
        vertex = voxelData.vertices[i];
        geometry.vertices.push(new THREE.Vector3(
            vertex[1] * slantedX + (vertex[0]) * widthBlocks - mWidth,
            (vertex[1]) * heightBlocks,
            vertex[1] * slantedZ + (vertex[2]) * depthBlocks - mDepth
        ));
    }

    for(i = 0; i < voxelData.faces.length; ++i) {
        face = voxelData.faces[i];
        geometry.faces.push(new THREE.Face3(
            face[0],
            face[1],
            face[2]
        ));
    }

    geometry.rotateY((random() - 0.5) * Math.PI / 8);
    geometry.computeFaceNormals();

    for (i = 0; i < geometry.faces.length; i++) {
        geometry.faces[i].normal.x += (random() - 0.5) * normalPerturb;
        geometry.faces[i].normal.y += (random() - 0.5) * normalPerturb;
        geometry.faces[i].normal.z += (random() - 0.5) * normalPerturb;
    }

    geometry.normalsNeedUpdate = true;

    geometry = new THREE.BufferGeometry().fromGeometry(geometry);

    return {
        position: geometry.attributes.position.array,
        normal: geometry.attributes.normal.array
    };
    */
};

var getMeshFromVoxel = function getMeshFromVoxel (ndarray) {
    // the lo and hi arrays are modified by the generate function, so we need to make sure we don't pass them by reference
    var voxelData = voxel.generate([0, 0, 0], [ndarray.shape[0], ndarray.shape[1], ndarray.shape[2]], function (x, y, z) {
        return !!ndarray.get(x, y, z);
    });

    // the dimensions in the voxel data are flipped but the meshers expect the dimensions to be in the initial order (not the values ?)
    return voxel.meshers.monotone(voxelData.data, [voxelData.shape[2], voxelData.shape[1], voxelData.shape[0]]);
};

var generateType1 = function generateType1 (shape, rng) {
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

    return cell.array;
};

var generateType2 = function generateType2 (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0),
        sampling = new Poisson(shape, 20, 30, 30, random),
        innerTypes = [[2,1], [5,3], [2,3]],
        i;

    var innerType = innerTypes[(random() * innerTypes.length) | 0];

    sampling.fill();

    for (i = 0; i < sampling.samplePoints.length; i++) {
        cell.array.set(
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

    return cell.array;
};

var generateType3 = function generateType3 (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0),
        sampling = new Poisson(shape, 13, 18, 10, random);

    cell.fillWithDistribution([[0, 1999], [1, 1]], random); // a little bit of random

    sampling.fill();

    for (var i = 0; i < sampling.samplePoints.length; i++) {
        cell.array.set(
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

    return cell.array;
};


var generateType4 = function generateType4 (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0),
        sampling = new Poisson(shape, 25, 38, 30, random);

    sampling.fill();

    for (var i = 0; i < sampling.samplePoints.length; i++) {
        cell.array.set(
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

    return cell.array;
};

var generateType5 = function generateType5 (shape, rng) {
    var random = rng.random,
        cell = new CellularAutomata(shape, 0),
        sampling = new Poisson(shape, 27, 30, 40, random);

    sampling.fill();

    for (var i = 0; i < sampling.samplePoints.length; i++) {
        cell.array.set(
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

    return cell.array;
};

var generationTypes = [generateType1, generateType2, generateType3, generateType4, generateType5];

var generateGeometryData = function generateGeometryData (rng, x, y) {
    var width = 32,
        heightRate = ((Math.pow(Math.random(), 0.75) * 6) | 0),
        height = 16 + 32 * (heightRate < 3 ? 0 : heightRate),
        depth = 32,
        shape = [width,height,depth],
        type = (rng.random() * generationTypes.length) | 0;

    var ndarray = generationTypes[type](shape, rng),
        voxelData = getMeshFromVoxel(ndarray),
        bufferGeometry = prepareBufferGeometry(voxelData, shape, 100, 100, 100, 0.08, rng);

    return bufferGeometry;
};

module.exports = generateGeometryData;
