var THREE = require('three'),
    voxel = require("voxel");

var getMeshFromVoxel = function (ndarray) {
    // the lo and hi arrays are modified by the generate function, so we need to make sure we don't pass them by reference
    var voxelData = voxel.generate([0, 0, 0], [ndarray.shape[0], ndarray.shape[1], ndarray.shape[2]], function (x, y, z) {
        return !!ndarray.get(x, y, z);
    });

    // the dimensions in the voxel data are flipped but the meshers expect the dimensions to be in the initial order (not the values ?)
    return voxel.meshers.monotone(voxelData.data, [voxelData.shape[2], voxelData.shape[1], voxelData.shape[0]]);
};

var convertToGeometry = function (ndarray, widthBlocks, heightBlocks, depthBlocks) {
    var geometry = new THREE.Geometry(),
        bufferGeometry = new THREE.BufferGeometry(),
        mesh = getMeshFromVoxel(ndarray);

    var mWidth = ((ndarray.shape[0] / 2)) * widthBlocks,
        mHeight = ((ndarray.shape[1] / 2)) * heightBlocks,
        mDepth = ((ndarray.shape[2] / 2)) * depthBlocks;

    var vertex,
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
