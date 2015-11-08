var THREE = require('three');

var convertToGeometry = function convertToGeometry (data, widthBlocks, heightBlocks, depthBlocks) {
    var geometry = new THREE.Geometry(),
        mesh = data.mesh,
        shape = data.shape,
        mWidth = widthBlocks * shape[0] / 2,
        mHeight = heightBlocks * shape[1] / 2,
        mDepth = depthBlocks * shape[2] / 2,
        vertex,
        face,
        i;

    for(i = 0; i < mesh.vertices.length; ++i) {
        vertex = mesh.vertices[i];
        geometry.vertices.push(new THREE.Vector3(
            (vertex[0]) * widthBlocks - mWidth,
            (vertex[1]) * heightBlocks - mHeight,
            (vertex[2]) * depthBlocks - mDepth
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

    //geometry.verticesNeedUpdate = true;
    //geometry.elementsNeedUpdate = true;
    //geometry.normalsNeedUpdate = true;

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    //geometry.computeBoundingBox();
    //geometry.computeBoundingSphere();

    return geometry;
};

module.exports = convertToGeometry;
