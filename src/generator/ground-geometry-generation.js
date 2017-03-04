"use strict";

//TODO fix normal seams at the edges

var normalizeNormals = function (normals) {
    var i, x, y, z, n;

    for ( i = 0; i < normals.length; i += 3 ) {
        x = normals[i];
        y = normals[i + 1];
        z = normals[i + 2];

        n = 1.0 / Math.sqrt( x * x + y * y + z * z );

        normals[i] *= n;
        normals[i + 1] *= n;
        normals[i + 2] *= n;
    }

};

var computeVertexNormals = function (indices, positions, normals) {
    var pA = [0,0,0],
        pB = [0,0,0],
        pC = [0,0,0],
        cb = [0,0,0],
        ab = [0,0,0],
        vA,
        vB,
        vC,
        cbx,
        cby,
        cbz,
        i;

    for (i = 0; i < indices.length; i += 3) {

        vA = indices[ i ] * 3;
        vB = indices[ i + 1 ] * 3;
        vC = indices[ i + 2 ] * 3;

        /*
         pA.fromArray( positions, vA );
         pB.fromArray( positions, vB );
         pC.fromArray( positions, vC );
         */

        pA[0] = positions[vA];
        pA[1] = positions[vA + 1];
        pA[2] = positions[vA + 2];

        pB[0] = positions[vB];
        pB[1] = positions[vB + 1];
        pB[2] = positions[vB + 2];

        pC[0] = positions[vC];
        pC[1] = positions[vC + 1];
        pC[2] = positions[vC + 2];

        /*
         cb.subVectors( pC, pB );
         ab.subVectors( pA, pB );
         */

        cb[0] = pC[0] - pB[0];
        cb[1] = pC[1] - pB[1];
        cb[2] = pC[2] - pB[2];

        ab[0] = pA[0] - pB[0];
        ab[1] = pA[1] - pB[1];
        ab[2] = pA[2] - pB[2];

        /*
         cb.cross( ab );
         */

        cbx = cb[0],
        cby = cb[1],
        cbz = cb[2];

        cb[0] = cby * ab[2] - cbz * ab[1];
        cb[1] = cbz * ab[0] - cbx * ab[2];
        cb[2] = cbx * ab[1] - cby * ab[0];

        normals[ vA ] += cb[0];
        normals[ vA + 1 ] += cb[1];
        normals[ vA + 2 ] += cb[2];

        normals[ vB ] += cb[0];
        normals[ vB + 1 ] += cb[1];
        normals[ vB + 2 ] += cb[2];

        normals[ vC ] += cb[0];
        normals[ vC + 1 ] += cb[1];
        normals[ vC + 2 ] += cb[2];

    }

    normalizeNormals(normals);
};

var generarePlaneGeometry = function generarePlaneGeometry (width, height, widthSegments, heightSegments, heightmap) {
    var width_half = width / 2;
    var height_half = height / 2;

    var gridX = Math.floor( widthSegments ) || 1;
    var gridY = Math.floor( heightSegments ) || 1;

    var gridX1 = gridX + 1;
    var gridY1 = gridY + 1;

    var segment_width = width / gridX;
    var segment_height = height / gridY;

    var ix, iy;

    // buffers
    var indices = new Uint16Array(6 * gridX * gridY),
        vertices = new Float32Array(3 * gridX1 * gridY1),
        normals = new Float32Array(3 * gridX1 * gridY1);
        //uvs = [];

    // generate vertices, normals and uvs

    for ( iy = 0; iy < gridY1; iy ++ ) {

        var y = iy * segment_height - height_half;

        for ( ix = 0; ix < gridX1; ix ++ ) {

            var x = ix * segment_width - width_half;

            vertices[3 * (iy * gridX1 + ix)] = x;
            vertices[3 * (iy * gridX1 + ix) + 1] = heightmap[iy * gridX1 + ix];
            vertices[3 * (iy * gridX1 + ix) + 2] = y;

            //vertices.push( x, 0, y );

            /*
            normals[3 * (iy * gridX1 + ix)] = 0;
            normals[3 * (iy * gridX1 + ix) + 1] = 1;
            normals[3 * (iy * gridX1 + ix) + 2] = 0;
            */

            //normals.push( 0, 1, 0 );

            /*
            uvs.push( ix / gridX );
            uvs.push( 1 - ( iy / gridY ) );
            */

        }

    }

    // indices

    for ( iy = 0; iy < gridY; iy ++ ) {

        for ( ix = 0; ix < gridX; ix ++ ) {

            var a = ix + gridX1 * iy,
                b = ix + gridX1 * ( iy + 1 ),
                c = ( ix + 1 ) + gridX1 * ( iy + 1 ),
                d = ( ix + 1 ) + gridX1 * iy;

            // faces
            indices[6 * (iy * gridX + ix)] = a;
            indices[6 * (iy * gridX + ix) + 1] = b;
            indices[6 * (iy * gridX + ix) + 2] = d;
            indices[6 * (iy * gridX + ix) + 3] = b;
            indices[6 * (iy * gridX + ix) + 4] = c;
            indices[6 * (iy * gridX + ix) + 5] = d;

            /*
            indices.push( a, b, d );
            indices.push( b, c, d );
            */
        }

    }

    // compute normals
    computeVertexNormals(indices, vertices, normals);

    // build geometry


    return {
        indices: indices,
        position: vertices,
        normal: normals
    };
};

var prepareBufferGeometry = function prepareBufferGeometry (data, segmentSize, groundSegments) {
    var width = groundSegments + 1;

    var simpleGeometry = generarePlaneGeometry(groundSegments * segmentSize, groundSegments * segmentSize, groundSegments, groundSegments, data);

    return simpleGeometry;

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

    return prepareBufferGeometry(typedArray, segmentSize, groundSegments);
};

module.exports = groundGeometryData;
