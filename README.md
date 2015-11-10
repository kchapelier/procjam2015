# procjam2015

## TODO for Sunday 2015-11-08

- [X] Test day and night cycle (combine moving Directional Light, changing HemisphereLight and changing Fog color).
- [X] Create a player entity.
- [X] Implement jump and player collision with the mesh.
- [X] Encapsulate the generation code and the mesh creation code as two separate async functions.
  - Mesh creation cannot be made into a web worker as it depends on THREE.js.

## TODO for Monday 2015-11-09

- [X] Retrieve the seed from the url.
- [X] Make the day cycle affects the color of the sun.
- [ ] Make the sun a giant shader sprite always facing the user ?
  - Too much struggle against fov and culling
- [X] FOCUS on trying to get a better style of generation for the tower, possibly multiple generation styles.
  - Got five generation styles, that's a good start.

## TODO for Tuesday 2015-11-10

- [ ] Add some shiny dust particles during the day, or at least see how it goes.
- [ ] Convert the generation code into a web worker.
- [ ] Work on some music / soundscape.

## TODO for .. later ?

- [ ] Post processing ?
- [ ] A totally randomized generation
- [ ] An experimental build on Electron ? Fullscreen API and pointer lock API are supposedly supported.
- [ ] Try making a fake volumetric fog by hacking the material, see [ShaderLib.js](https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib.js) and [fog_fragment.glsl](https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/fog_fragment.glsl)
