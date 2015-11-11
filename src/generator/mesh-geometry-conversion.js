var THREE = require('three');

var convertToGeometry = function convertToGeometry (data, widthBlocks, heightBlocks, depthBlocks, normalPerturb, random) {
    var geometry = new THREE.Geometry(),
        mesh = data.mesh,
        shape = data.shape,
        mWidth = widthBlocks * shape[0] / 2,
        mDepth = depthBlocks * shape[2] / 2,
        slantedX = 0, //random() * 40 - 20,
        slantedZ = 0, //random() * 40 - 20,
        vertex,
        face,
        i;

    for(i = 0; i < mesh.vertices.length; ++i) {
        vertex = mesh.vertices[i];
        geometry.vertices.push(new THREE.Vector3(
            vertex[1] * slantedX + (vertex[0]) * widthBlocks - mWidth,
            (vertex[1]) * heightBlocks,
            vertex[1] * slantedZ + (vertex[2]) * depthBlocks - mDepth
        ));
    }

    for(i = 0; i < mesh.faces.length; ++i) {
        face = mesh.faces[i];
        geometry.faces.push(new THREE.Face3(
            face[0],
            face[1],
            face[2]
        ));
    }

    geometry.mergeVertices();
    geometry.computeFaceNormals();

    if (normalPerturb !== 0) {
        for (i = 0; i < geometry.faces.length; i++) {
            geometry.faces[i].normal.x += (random() - 0.5) * normalPerturb;
            geometry.faces[i].normal.y += (random() - 0.5) * normalPerturb;
            geometry.faces[i].normal.z += (random() - 0.5) * normalPerturb;
        }

        geometry.normalsNeedUpdate = true;
    }

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return geometry;
};

module.exports = convertToGeometry;
