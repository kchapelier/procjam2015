//TODO remove threejs dependency
//TODO fix normal seams at the edges

var THREE = require('three');

var prepareBufferGeometry = function prepareBufferGeometry (data, segmentSize, groundSegments) {
    var width = groundSegments + 1,
        groundGeometry = new THREE.PlaneBufferGeometry(groundSegments * segmentSize, groundSegments * segmentSize, groundSegments, groundSegments);

    groundGeometry.rotateX(-Math.PI / 2);

    for (var x = 0; x < width; x++) {
        for (var z = 0; z < width; z++) {
            var i = x + z * width;

            groundGeometry.attributes.position.array[i*3+1] = data[i];
        }
    }

    groundGeometry.computeVertexNormals();

    return groundGeometry;
};

var groundGeometryData = function groundGeometryData (rng, offsetX, offsetZ, chunkSize, groundSegments) {
    var segmentSize = chunkSize / groundSegments,
        ratioGeneration = segmentSize / 100, // the algorithm was originally written for segmentSize of 100, we don't want the result to be dramatically different depending on the segmentSize
        width = groundSegments + 1,
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

    var bufferGeometry = prepareBufferGeometry(typedArray, segmentSize, groundSegments);

    return {
        indices: bufferGeometry.index.array,
        position: bufferGeometry.attributes.position.array,
        normal: bufferGeometry.attributes.normal.array
    };
};

module.exports = groundGeometryData;
