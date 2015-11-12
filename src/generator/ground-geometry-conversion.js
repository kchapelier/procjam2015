var THREE = require('three');

var convertToGeometry = function convertToGeometry (data, groundSegments) {
    var groundGeometry = new THREE.PlaneGeometry(groundSegments * 100, groundSegments * 100, groundSegments, groundSegments);

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

    return groundGeometry;
};

module.exports = convertToGeometry;
