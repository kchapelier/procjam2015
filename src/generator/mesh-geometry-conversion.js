var THREE = require('three');

var convertToGeometry = function convertToGeometry (data, widthBlocks, heightBlocks, depthBlocks, normalPerturb, random) {
    var mesh = data.mesh,
        shape = data.shape,
        mWidth = widthBlocks * shape[0] / 2,
        mDepth = depthBlocks * shape[2] / 2,
        slantedX = 0, //random() * 40 - 20,
        slantedZ = 0, //random() * 40 - 20,
        vertex,
        face,
        i;

    var vertices = [];

    for(i = 0; i < mesh.vertices.length; ++i) {
        vertex = mesh.vertices[i];
        vertices.push([
            vertex[1] * slantedX + (vertex[0]) * widthBlocks - mWidth,
            vertex[1] * heightBlocks,
            vertex[1] * slantedZ + (vertex[2]) * depthBlocks - mDepth
        ]);
    }

    var faces = [];

    for(i = 0; i < mesh.faces.length; ++i) {
        face = mesh.faces[i];
        faces.push([
            face[0],
            face[1],
            face[2]
        ]);
    }

    /* /
    var faceNumber = faces.length;


    var geometry = new THREE.BufferGeometry();

    var positions = new Float32Array( vertices.length * 3),
        colors = new Float32Array( vertices.length * 3)
        indices = new Uint32Array( faces.length * 3),
        faceNormals = [],
        normals = new Float32Array( faces.length * 3);

    for(i = 0; i < vertices.length; ++i) {
        vertex = vertices[i];
        positions[i * 3] = vertex[0];
        positions[i * 3 + 1] = vertex[1];
        positions[i * 3 + 2] = vertex[2];
    }

    for(i = 0; i < faces.length; ++i) {
        face = faces[i];
        indices[i * 3] = face[0];
        indices[i * 3 + 1] = face[1];
        indices[i * 3 + 2] = face[2];

        var vA = vertices[face[0]],
            vB = vertices[face[1]],
            vC = vertices[face[2]];

        //cb.subVectors( vC, vB );

        var sCBx = vC[0] - vB[0],
            sCBy = vC[1] - vB[1],
            sCBz = vC[2] - vB[2];

        //ab.subVectors( vA, vB );

        var sABx = vA[0] - vB[0],
            sABy = vA[1] - vB[1],
            sABz = vA[2] - vB[2];

        //cb.cross( ab );

        var nX = sCBy * sABz - sCBz * sABy,
            nY = sCBz * sABx - sCBx * sABz,
            nZ = sCBx * sABy - sCBy * sABx;

        //cb.normalize();

        nX = Math.random() - 0.5;
        nY = Math.random() - 0.5;
        nZ = Math.random() - 0.5;

        var length = Math.sqrt(nX * nX + nY * nY + nZ * nZ);

        nX = nX / length;
        nY = nY / length;
        nZ = nZ / length;

        normals[face[0] * 3] = nX;
        normals[face[0] * 3 + 1] = nY;
        normals[face[0] * 3 + 2] = nZ;
        normals[face[1] * 3] = nX;
        normals[face[1] * 3 + 1] = nY;
        normals[face[1] * 3 + 2] = nZ;
        normals[face[2] * 3] = nX;
        normals[face[2] * 3 + 1] = nY;
        normals[face[2] * 3 + 2] = nZ;
    }

    console.log(normals);

    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
    //geometry.setIndex(new THREE.BufferAttribute(indices, 3));

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    console.log(geometry);
    /*/

    var geometry = new THREE.Geometry();

    for(i = 0; i < vertices.length; ++i) {
        vertex = vertices[i];
        geometry.vertices.push(new THREE.Vector3(
            vertex[0],
            vertex[1],
            vertex[2]
        ));
    }

    for(i = 0; i < faces.length; ++i) {
        face = faces[i];
        geometry.faces.push(new THREE.Face3(
            face[0],
            face[1],
            face[2]
        ));
    }

    //geometry.mergeVertices();
    geometry.computeFaceNormals();

    if (normalPerturb !== 0) {
        for (i = 0; i < geometry.faces.length; i++) {
            geometry.faces[i].normal.x += (Math.random() - 0.5) * normalPerturb;
            geometry.faces[i].normal.y += (Math.random() - 0.5) * normalPerturb;
            geometry.faces[i].normal.z += (Math.random() - 0.5) * normalPerturb;
        }

        geometry.normalsNeedUpdate = true;
    }

    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    var bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

    console.log(bufferGeometry);

    return bufferGeometry;

};

module.exports = convertToGeometry;
