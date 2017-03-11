"use strict";

//TODO fix normal seams at the edges

var computeVertexNormals = require('../utils/meshes/compute-vertex-normals');

var generatePlaneGeometry = function generatePlaneGeometry (width, height, widthSegments, heightSegments, heightmap, offset) {
    var width_half = width / 2,
        height_half = height / 2,
        gridX = widthSegments,
        gridY = heightSegments,
        gridX1 = gridX + 1,
        gridY1 = gridY + 1,
        segment_width = width / gridX,
        segment_height = height / gridY,
        ix, iy, y, x, idx,
        a, b, c, d;

    //lengths
    var vertexNumber = gridX * gridY,
        indexLength = 6 * gridX * gridY * 2,
        vertexLength = 3 * gridX1 * gridY1 * 4,
        normalLength = 3 * gridX1 * gridY1 * 4,
        uvLength = 2 * gridX1 * gridY1 * 4;

    // buffers
    var arrayBuffer = new ArrayBuffer(indexLength + vertexLength + normalLength + uvLength),
        indices = new Uint16Array(arrayBuffer, 0, indexLength / 2),
        vertices = new Float32Array(arrayBuffer, indexLength, vertexLength / 4),
        normals = new Float32Array(arrayBuffer, indexLength + vertexLength, normalLength / 4),
        uvs = new Float32Array(arrayBuffer, indexLength + vertexLength + normalLength, uvLength / 4);

    // generate vertices, normals and uvs
    for (iy = 0; iy < gridY1; iy++) {
        y = iy * segment_height - height_half;

        for (ix = 0; ix < gridX1; ix++) {
            x = ix * segment_width - width_half;
            idx = iy * gridX1 + ix;

            vertices[3 * idx] = x;
            vertices[3 * idx + 1] = heightmap[(iy + offset) * (gridX1 + offset * 2) + ix + offset];
            vertices[3 * idx + 2] = y;

            uvs[2 * idx] = ix / gridX * 32;
            uvs[2 * idx + 1] = 1 - iy / gridY * 32;
        }
    }

    // set indices
    for (iy = 0; iy < gridY; iy++) {
        for (ix = 0; ix < gridX; ix++) {
            a = ix + gridX1 * iy;
            b = ix + gridX1 * (iy + 1);
            c = (ix + 1) + gridX1 * (iy + 1);
            d = (ix + 1) + gridX1 * iy;
            idx = iy * gridX + ix;

            // faces
            indices[6 * idx] = a;
            indices[6 * idx + 1] = b;
            indices[6 * idx + 2] = d;
            indices[6 * idx + 3] = b;
            indices[6 * idx + 4] = c;
            indices[6 * idx + 5] = d;
        }
    }

    // compute normals
    computeVertexNormals.fromHeightMap(heightmap, gridX1, gridY1, normals);

    return {
        indices: indexLength,
        buffer: arrayBuffer
    };
};

var prepareBufferGeometry = function prepareBufferGeometry (data, segmentSize, groundSegments, offset) {
    var simpleGeometry = generatePlaneGeometry(groundSegments * segmentSize, groundSegments * segmentSize, groundSegments, groundSegments, data, offset);

    return simpleGeometry;

};

var groundGeometryData = function groundGeometryData (rng, offsetX, offsetZ, chunkSize, groundSegments) {
    var segmentSize = chunkSize / groundSegments,
        // the algorithm was originally written for segmentSize of 100, we don't want the result to be dramatically different depending on the segmentSize
        ratioGeneration = segmentSize / 100,
        width = groundSegments + 3,
        typedArray = new Float32Array(width * width),
        x,
        y,
        z,
        dist,
        offsettedX, offsettedZ;

    offsetX = offsetX * groundSegments;
    offsetZ = offsetZ * groundSegments;

    for (x = 0; x < width; x++) {
        offsettedX = (x + offsetX) * ratioGeneration;
        for (z = 0; z < width; z++) {
            offsettedZ = (z + offsetZ) * ratioGeneration;

            dist = Math.abs(rng.perlin2(offsettedZ / 400, offsettedX / 400));

            y = (rng.perlin2(offsettedX/ 100, offsettedZ/100) * rng.perlin2(offsettedX/ 66, offsettedZ/66) + rng.perlin2(offsettedX/ 33, offsettedZ/33)) * 2000;
            y += Math.pow(rng.perlin3(dist + y / 500, offsettedX/ 90, offsettedZ/1000) * rng.perlin2(offsettedX/ 760, offsettedZ/76) , 3) * 10000;
            typedArray[x + z * width] = y / Math.pow(2, 0.5 + dist);
        }
    }

    return prepareBufferGeometry(typedArray, segmentSize, groundSegments, 1);
};

module.exports = groundGeometryData;
