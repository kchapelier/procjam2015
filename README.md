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

- [X] Add some shiny dust particles during the day, or at least see how it goes.
- [X] Convert the generation code into a web worker.
- [ ] Work on some music / soundscape.
  - Did not do much

## TODO for Wednesday 2015-11-11

- [X] Find something interesting to do with the ground, ease it into the tower ?
  - Perlin noise dunes, sigh I really wanted to avoid perlin and simplex noise this year.
- [X] Test generation multiple building in the same world
  - Now have a pool of web worker
- [ ] Post processing
  - Performances are already an issue as it is.

## TODO for Thursday 2015-11-12

- [ ] Work on some music / soundscape.
- [X] Dynamically load new chunks as needed
- [X] Generate the dust particles in the web workers
- [X] Early check on firefox and safari to see what's blocking
  - Works on firefox, there are some issue with the gamepad control mapping but that's not critical.
  - Doesn't work on Safari 7.1 (cannot get an higher version of Safari without an OS upgrade, IE-style), actually it mostly does but the perfomances are atrocious.

## TODO for Friday 2015-11-13

- [X] Optimization : Use a buffer geometry for the sand
- [X] Optimization : Use a buffer geometry for the building
- [X] Optimization : Try to offload even more computation to the web workers (i.e. all the attributes values for the building)
- [ ] Unload chunks after a while
- [ ] Optimization : Only test the physics for the chunk the player is currently in.
- [ ] Optimization : LOD on the ground ?

## TODO for .. later ?

- [ ] Nice to have : Sfx for walking on the sand and on the buildings
- [ ] Nice to have : Try making a fake volumetric fog by hacking the material, see [ShaderLib.js](https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib.js) and [fog_fragment.glsl](https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/fog_fragment.glsl)
- [ ] Nice to have : Try making the sand looks a little less soft and silky.
- [ ] Optimization : chunk the building in smaller parts to take advantage of the frustum culling ?
- [ ] Post-jam : A totally randomized generation
- [ ] Post-jam : An experimental build on Electron ? Fullscreen API and pointer lock API are supposedly supported. How about the Gamepad API ?
