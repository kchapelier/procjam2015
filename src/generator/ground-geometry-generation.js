var rng = require('migl-rng'),
    zeros = require('zeros');

var THREE = require('three');

var prepareBufferGeometry = function prepareBufferGeometry (data, segmentSize, groundSegments) {
    var groundGeometry = new THREE.PlaneGeometry(groundSegments * segmentSize, groundSegments * segmentSize, groundSegments, groundSegments);

    groundGeometry.rotateX(-Math.PI / 2);

    for (var x = 0; x <= groundSegments; x++) {
        for (var z = 0; z <= groundSegments; z++) {
            var i = x * (groundSegments + 1) + z;

            groundGeometry.vertices[i].y = data[z * (groundSegments + 1) + x];
        }
    }

    groundGeometry.computeFaceNormals();
    groundGeometry.computeVertexNormals();
    groundGeometry.normalsNeedUpdate = true;

    return new THREE.BufferGeometry().fromGeometry(groundGeometry);
};

var groundGeometryData = function groundGeometryData (seed, offsetX, offsetZ, chunkSize, groundSegments) {
    var random = rng.create(seed);

    var segmentSize = chunkSize / groundSegments,
        ndarrayMap2 = zeros([groundSegments + 1, groundSegments + 1]),
        x,
        y,
        z,
        dist,
        offsettedX, offsettedZ;

    var ratioGeneration = segmentSize / 100; // the algorithm was originally written for segmentSize of 100, we don't want the result to be dramatically different depending on the segmentSize

    offsetX = offsetX * groundSegments;
    offsetZ = offsetZ * groundSegments;

    for (x = 0; x < ndarrayMap2.shape[0]; x++) {
        offsettedX = (x + offsetX) * ratioGeneration;
        for (z = 0; z < ndarrayMap2.shape[1]; z++) {
            offsettedZ = (z + offsetZ) * ratioGeneration;

            dist = Math.abs(random.perlin2(offsettedZ / 400, offsettedX / 400));

            y = (random.perlin2(offsettedX/ 100, offsettedZ/100) * random.perlin2(offsettedX/ 66, offsettedZ/66) + random.perlin2(offsettedX/ 33, offsettedZ/33)) * 2000;
            y += Math.pow(random.perlin3(dist + y / 500, offsettedX/ 90, offsettedZ/1000) * random.perlin2(offsettedX/ 760, offsettedZ/76) , 3) * 10000;
            ndarrayMap2.set(x, z, y / Math.pow(2, 0.5 + dist));
        }
    }

    var bufferGeometry = prepareBufferGeometry(ndarrayMap2.data, segmentSize, groundSegments);

    return {
        position: bufferGeometry.attributes.position.array,
        normal: bufferGeometry.attributes.normal.array
    };
};

module.exports = groundGeometryData;
