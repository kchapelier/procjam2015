# procjam2015

## TODO for Sunday 2015-11-08

- [ ] Test day and night cycle (combine moving Directional Light, changing HemisphereLight and changing Fog color).
- [X] Create a player entity.
- [ ] Implement jump and player collision with the mesh.
- [X] Encapsulate the generation code and the mesh creation code as two separate async functions.
  - Mesh creation cannot be made into a web worker as it depends on THREE.js.
- [ ] Try to get a better style of generation for the tower, possibly multiple generation style.

## TODO for .. later ?

- [ ] Convert the generation code into a web worker.
- [ ] Try making a fake volumetric fog by hacking the material, see [ShaderLib.js](https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib.js) and [fog_fragment.glsl](https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/fog_fragment.glsl)
