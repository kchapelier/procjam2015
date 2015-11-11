var rng = require('migl-rng'),
    zeros = require('zeros');

var groundGeometryData = function groundGeometryData (seed, offsetX, offsetZ, groundSegments) {
    var random = rng.create(seed);

    var ndarrayMap2 = zeros([groundSegments + 1, groundSegments + 1]),
        x,
        y,
        z,
        offsetedX, offsetedZ;

    offsetX = offsetX * groundSegments;
    offsetZ = offsetZ * groundSegments;

    for (x = 0; x < ndarrayMap2.shape[0]; x++) {
        offsetedX = x + offsetX;
        for (z = 0; z < ndarrayMap2.shape[1]; z++) {
            offsetedZ = z + offsetZ;
            var dist = Math.abs(random.perlin2(offsetedZ/ 400, offsetedX/ 400));

            var y = (random.perlin2(offsetedX/ 100, offsetedZ/100) * random.perlin2(offsetedX/ 66, offsetedZ/66) + random.perlin2(offsetedX/ 33, offsetedZ/33)) * 2000;
            y += Math.pow(random.perlin3(dist + y / 500, offsetedX/ 90, offsetedZ/1000) * random.perlin2(offsetedX/ 760, offsetedZ/76) , 3) * 10000;
            ndarrayMap2.set(x, z, y / Math.pow(2, 0.5 + dist));
        }
    }

    return ndarrayMap2.data;
};

module.exports = groundGeometryData;
