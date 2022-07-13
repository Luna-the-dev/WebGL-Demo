/**
 * Name: Christian Norris
 * Student ID: ccnorris
 * Program Assignment: Program 3
 * Date: 5/9/21
 */

//////////////////////////////////////////
//           GLOBAL VARIABLES           //
//////////////////////////////////////////

// Shaders (GLSL)
let VSHADER=`
  precision mediump float;
  attribute vec3 a_Position;
  attribute vec3 a_Normal;

  uniform vec3 u_Color;

  uniform mat4 u_ModelMatrix;
  uniform mat4 u_NormalMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;

  varying vec3 v_Normal;
  varying vec4 v_WorldPos;

  void main() {
    // Mapping obj coord system to world coord system
    v_WorldPos = u_ModelMatrix * vec4(a_Position, 1.0);
    v_Normal = normalize(u_NormalMatrix * vec4(a_Normal, 0.0)).xyz; // Normal
    
    gl_Position = u_ProjMatrix * u_ViewMatrix * v_WorldPos;
  }
`;

let FSHADER=`
  precision mediump float;
  uniform vec3 u_Color;
  varying vec4 v_Color;

  uniform vec3 u_eyePosition;

  uniform vec3 u_ambientColor;
  uniform vec3 u_diffuseColor1;
  uniform vec3 u_diffuseColor2;
  uniform vec3 u_specularColor1;
  uniform vec3 u_specularColor2;
  uniform float u_specularAlpha;
  uniform vec3 u_lightPosition;
  uniform vec3 u_lightDirection;

  varying vec3 v_Normal;
  varying vec4 v_WorldPos;

  vec3 calcAmbient() {
    return u_ambientColor * u_Color;
  }

  vec3 calcDiffuse(vec3 l, vec3 n, vec3 lColor) {
    float nDotL = max(dot(l, n), 0.0);
    return lColor * u_Color * nDotL;
  }

  vec3 calcSpecular(vec3 r, vec3 v, vec3 specColor) {
    float rDotV = max(dot(r, v), 0.0);
    float rDotVPowAlpha = pow(rDotV, u_specularAlpha);
    return specColor * u_Color * rDotVPowAlpha;
  }

  void main() {
    vec3 l1 = normalize(u_lightPosition - v_WorldPos.xyz); // Point light
    vec3 l2 = normalize(u_lightDirection);                 // Directional light
    vec3 v  = normalize(u_eyePosition - v_WorldPos.xyz);   // View direction
    vec3 r1 = reflect(l1, v_Normal);                       // Reflected point light
    vec3 r2 = reflect(l2, v_Normal);                       // Reflected directional light

    // Smooth shading (Phong)
    vec3 ambient  = calcAmbient();
    vec3 diffuse1 = calcDiffuse(l1, v_Normal, u_diffuseColor1); // Diffuse for point light
    vec3 diffuse2 = calcDiffuse(l2, v_Normal, u_diffuseColor2); // Diffuse for directional light
    vec3 specular1 = calcSpecular(r1, v, u_specularColor1);     // Specular for point light
    vec3 specular2 = calcSpecular(r2, v, u_specularColor2);     // Specular for directional light
    
    gl_FragColor = vec4(ambient + (diffuse1 + diffuse2) + (specular1 + specular2), 1.0);
  }
`;

// models in the world
let models = [];
let modelMatrix    = new Matrix4();
let normalMatrix   = new Matrix4();

let lightModels = [];

// light source
let lightPosition  = new Vector3([0.0, 0.0, 1.0]);
let lightDirection = new Vector3([1.0, 1.0, -1.0])
let lightRotation  = new Matrix4().setRotate(0.5, 0, 1, 0);

// Uniform locations
let u_ModelMatrix    = null;
let u_NormalMatrix   = null;
let u_ViewMatrix     = null;
let u_ProjMatrix     = null;

let u_Color          = null;
let u_diffuseColor1  = null;
let u_diffuseColor2  = null;
let u_ambientColor   = null;
let u_specularColor1 = null;
let u_specularColor2 = null;
let u_specularAlpha  = null;
let u_lightPosition  = null;
let u_eyePosition    = null;

const DIFFUSE_COLOR = [0.8, 0.8, 0.8];
const SPECULAR_COLOR = [0.5, 0.5, 0.5];

//////////////////////////////////////////
//          UTILITY FUNCTIONS           //
//////////////////////////////////////////

/**
 * initializes a buffer
 * @param {String} attributeName name of the attribute
 * @param {Number} n tells the GPU to read array in n by n coords
 * @returns the shader buffer
 */
function initBuffer(attributeName, n) {
  let shaderBuffer = gl.createBuffer();
  if(!shaderBuffer) {
      console.log("Can't create buffer.")
      return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, shaderBuffer);

  let shaderAttribute = gl.getAttribLocation(gl.program, attributeName);
  gl.vertexAttribPointer(shaderAttribute, n, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(shaderAttribute);

  return shaderBuffer;
}

// initializes the models on program start
function initialModels() {
  let orangePortal = addModel('cylinder', [1.0, 0.3, 0.0], 25, true);
  orangePortal.setTranslate(-0.64, 0, 0);
  orangePortal.setScale(0.5, 0.615, 0.2);
  orangePortal.setRotate(0.0, -85, 0.0);

  let innerPortal1 = addModel('cylinder', [0.1, 0.1, 0.1], 25, false);
  innerPortal1.setTranslate(-0.64, 0, 0);
  innerPortal1.setScale(0.4, 0.5, 0.202);
  innerPortal1.setRotate(0.0, -85, 0.0);

  let bluePortal = addModel('cylinder', [0.0, 0.5, 0.7], 25, true);
  bluePortal.setTranslate(0.64, 0.0, 0.0);
  bluePortal.setScale(0.5, 0.615, 0.2);
  bluePortal.setRotate(0.0, 85, 0.0);

  let innerPortal2 = addModel('cylinder', [0.1, 0.1, 0.1], 25, false);
  innerPortal2.setTranslate(0.64, 0.0, 0.0);
  innerPortal2.setScale(0.4, 0.5, 0.202);
  innerPortal2.setRotate(0.0, 85, 0.0);

  let head = addModel('sphere', [0.8, 0.8, 0.8], 15, true);
  head.setTranslate(-0.37, 0.3, 0.0);
  head.setScale(0.12, 0.12, 0.12);
  head.setRotate(0.0, 0.0, 0.0);

  let bodyO = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  bodyO.setTranslate(-0.49, 0.03, 0.0);
  bodyO.setScale(0.135, 0.165, 0.39);
  bodyO.setRotate(90.0, 156.0, 0.0);

  let arm1O = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  arm1O.setTranslate(-0.31, 0.02, -0.05);
  arm1O.setScale(0.05, 0.05, 0.26);
  arm1O.setRotate(90.0, 15.0, 0.0);

  let arm2O = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  arm2O.setTranslate(-0.213, -0.06, -0.05);
  arm2O.setScale(0.05, 0.05, 0.2);
  arm2O.setRotate(90.0, 100.0, 0.0);

  let elbowO = addModel('sphere', [0.8, 0.8, 0.8], 13, true);
  elbowO.setTranslate(-0.287, -0.075, -0.06);
  elbowO.setScale(0.052, 0.052, 0.052);
  elbowO.setRotate(0.0, 0.0, 0.0);

  let handO = addModel('sphere', [0.8, 0.8, 0.8], 13, true);
  handO.setTranslate(-0.123, -0.04335, -0.05);
  handO.setScale(0.05, 0.05, 0.05);
  handO.setRotate(0.0, 0.0, 0.0);

  let leg1O = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  leg1O.setTranslate(-0.4, -0.25, -0.05);
  leg1O.setScale(0.05, 0.05, 0.26);
  leg1O.setRotate(90.0, 35.0, 0.0);

  let leg2O = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  leg2O.setTranslate(-0.345, -0.45, -0.05);
  leg2O.setScale(0.05, 0.05, 0.26);
  leg2O.setRotate(90.0, -5.0, 0.0);

  let footO = addModel('sphere', [0.8, 0.8, 0.8], 13, true);
  footO.setTranslate(-0.356, -0.565, -0.05);
  footO.setScale(0.05, 0.05, 0.05);
  footO.setRotate(0.0, 0.0, 0.0);

  let bodyB = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  bodyB.setTranslate(0.54, 0.03, 0.0);
  bodyB.setScale(0.135, 0.165, 0.39);
  bodyB.setRotate(90.0, 156.0, 0.0);

  let arm1B = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  arm1B.setTranslate(0.45, 0.25, -0.05);
  arm1B.setScale(0.05, 0.05, 0.26);
  arm1B.setRotate(90.0, 70.0, 0.0);

  let arm2B = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  arm2B.setTranslate(0.3, 0.235, -0.05);
  arm2B.setScale(0.05, 0.05, 0.2);
  arm2B.setRotate(90.0, -45.0, 0.0);

  let elbowB = addModel('sphere', [0.8, 0.8, 0.8], 13, true);
  elbowB.setTranslate(0.35, 0.28, -0.06);
  elbowB.setScale(0.052, 0.052, 0.052);
  elbowB.setRotate(0.0, 0.0, 0.0);

  let handB = addModel('sphere', [0.8, 0.8, 0.8], 13, true);
  handB.setTranslate(0.235, 0.17, -0.05);
  handB.setScale(0.05, 0.05, 0.05);
  handB.setRotate(0.0, 0.0, 0.0);

  let leg1B = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  leg1B.setTranslate(0.31, -0.205, -0.05);
  leg1B.setScale(0.05, 0.05, 0.26);
  leg1B.setRotate(90.0, -45.0, 0.0);

  let leg2B = addModel('cylinder', [0.8, 0.8, 0.8], 25, true);
  leg2B.setTranslate(0.18, -0.21, -0.05);
  leg2B.setScale(0.05, 0.05, 0.26);
  leg2B.setRotate(90.0, 50.0, 0.0);

  let kneeB = addModel('sphere', [0.8, 0.8, 0.8], 13, true);
  kneeB.setTranslate(0.248, -0.27, -0.079);
  kneeB.setScale(0.052, 0.052, 0.052);
  kneeB.setRotate(0.0, 0.0, 0.0);

  let footB = addModel('sphere', [0.8, 0.8, 0.8], 13, true);
  footB.setTranslate(0.092, -0.135, -0.05);
  footB.setScale(0.05, 0.05, 0.05);
  footB.setRotate(0.0, 0.0, 0.0);

}

let bounce = false; // used for secret
let bounceNum = 0.0; // used for secret
// delete all models from the scene
function deleteAllModels() {
  // resetting light cause of the secret
  lightDirection = new Vector3([1.0, 1.0, -1.0]);
  bounce = false; // resetting bounce for the secret
  lightPosition.elements = [0, 0, 1]; // resetting point light distance for secret

  // resetting the camera position
  camera.moveForward(0.5);

  // resetting the screen background for secret
  gl.clearColor(0.7, 0.7, 0.7, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  models = [];

  let select = document.getElementById('model-select');
  let length = select.options.length;
  for (i = length-1; i >= 0; i--) {
    select.options[i] = null;
  }
}

/**
 * creates a new cylinder and adds it to the scene
 * @param {String} shapeType 'cylinder', 'sphere', or 'cube'
 * @param {Array} color 3-element array of r-g-b values from 0 to 1
 * @param {Number} n number of sides to the cylinder
 * @param {Boolean} smoothShading true if smooth shaded, false if flat shaded
 * @returns the new model that was created
 */
 function addModel(shapeType, color, n, smoothShading) {
  let model = null;
  switch (shapeType) {
    case 'cube':
      model = new Cube(color, smoothShading);
      break;
    case 'sphere':
      model = new Sphere(color, n, smoothShading);
      break;
    case 'cylinder':
      model = new Cylinder(color, n, smoothShading);
      break;
  }

  if (model) {
    // create a new model
    models.push(model);

    // Add an option in the selector
    let selector = document.getElementById('model-select');
    let modelOption = document.createElement('option');
    modelOption.text = shapeType[0].toUpperCase() + shapeType.slice(1) + ' ' + models.length;
    modelOption.value = models.length - 2;
    selector.add(modelOption);

    // Activate the model we just created
    selector.value = modelOption.value;
  }

  return model;
}

// draws a frame in real time
function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // rotate point light
  if (rotateLight) {
    lightPosition = lightRotation.multiplyVector3(lightPosition);
    gl.uniform3fv(u_lightPosition, lightPosition.elements);
    PLSphere.setTranslate(...lightPosition.elements);
  }

  if (cameraAnimation) {
    cameraAnimation = false;
    animateCamera();
  }
  if (nodAnimation) {
    nodAnimation = false;
    animateNod();
  }

  gl.uniform3fv(u_eyePosition, camera.eye.elements); // Update eye position in the shader
  gl.uniformMatrix4fv(u_ViewMatrix, false, camera.viewMatrix.elements); // Update View matrix in the shader
  gl.uniformMatrix4fv(u_ProjMatrix, false, camera.projMatrix.elements); // Update Projection matrix in the shader

  // draw point light model if PL is turned on
  if (lightModels[0] !== undefined) lightModels[0].drawModel(drawWireframe);

  // true if secret is active
  if (bounce === true) {
    // draw all models
    for(let model of models) {
      model.setTranslate(model.translate[0], model.translate[1] + (Math.sin(bounceNum) / 600), model.translate[2]);
      model.drawModel(drawWireframe);
    }
    bounceNum += 0.015
  } else {
    // draw all models
    for(let model of models) {
      model.drawModel(drawWireframe);
    }
  }

  // recursively call function
  requestAnimationFrame(draw);
}

//////////////////////////////////////////
//            EVENT LISTENERS           //
//////////////////////////////////////////

// get keystrokes for camera movement
window.addEventListener('keydown', e => {
  let speed = 0.1;

  switch (e.code) {
    case 'KeyW':
      camera.moveForward(speed);
      break;
    case 'KeyA':
      camera.moveSideways(-speed);
        break;
    case 'KeyS':
      camera.moveForward(-speed);
      break;
    case 'KeyD':
      camera.moveSideways(speed);
      break;
    case 'KeyQ':
      camera.moveVertically(-speed);
      break;
    case 'KeyE':
      camera.moveVertically(speed);
      break;
    case 'KeyC':
      if (disableCamAnim) break;
       cameraAnimation = !cameraAnimation;
      break;
    case 'KeyN':
      if (disableNod) break;
      nodAnimation = !nodAnimation;
      break;
  }
});

// get mouse click for camera rotation
let mousedown = false;
window.addEventListener('mousedown', e => {
  if (e.button === 2) {
    mousedown = true;
  }
});

// get mouse click for camera rotation
window.addEventListener('mouseup', e => {
  if (e.button === 2) {
    mousedown = false;
  }
});

// get mouse movement for camera rotation
window.addEventListener('mousemove', e => {
  if (mousedown === true) {
    camera.rotateCamera(e.movementY/5, e.movementX/5)
  }
});

// disables context menu on right click
window.addEventListener('contextmenu', e => {
  e.preventDefault();
  return false; 
});

// get scroll wheel for camera zoom
window.addEventListener('wheel', e => {
  if (e.wheelDelta > 0) camera.zoom(0.95);
  else camera.zoom(1.05);
});

//////////////////////////////////////////
//            EVENT HANDLERS            //
//////////////////////////////////////////

let cameraAnimation = false;
let disableCamAnim = false;
let resetCamAnim = false;
async function animateCamera() {
// prevents user from spamming this and messing up the animation
  disableCamAnim = true;

  // if true, multiplies all camera movements by -1 to reset it back
  r = resetCamAnim ? -1 : 1;

  for (let i = 0; i < 50; i += 1) {
    ( (i) => {
      setTimeout( () => {
          camera.moveVertically(0.05 * r);
          camera.moveSideways(0.05 * r);
          camera.pan(1 * r);
          camera.tilt(-0.5 * r);
      }, 10 * (i+1));
    })(i);
  }

  // waiting until animation finishes before letting user press it again
  await new Promise(r => setTimeout(r, 500));
  disableCamAnim = false;
  resetCamAnim = !resetCamAnim;
}

let nodAnimation = false;
let disableNod = false;
async function animateNod() {
  // prevents user from spamming this and messing up the nod
  disableNod = true;
  let count = 0;

  for (let i = 0; i < 116; i += 1) {
    ( (i) => {
      setTimeout( () => {
          camera.tilt(Math.sin(count) * 0.5);
          count += 0.1
      }, 10 * (i+1));
    })(i);
  }

  // waiting until nod finishes before letting user press it again
  await new Promise(r => setTimeout(r, 1160));
  disableNod = false;
}

// adds a new model specified by the user. calls addmodel with properties from the webpage
function handleAddModel() {
  // get the type of shape from the webpage
  let shape = document.getElementById('model-create').value;

  // set smooth shading to default of true
  let smoothShading = true

  // get the number of sides
  let n = parseInt(document.getElementById('num-of-sides').value);
  if (n < 3) {
    console.log('Model must have at least 3 sides.');
    return;
  }
  if (isNaN(n)) n = 13; // default to n=13 if nothing was specified by the user

  // get the color of the cylinder and format it as rgb from 0 to 1 for webgl
  let color = document.getElementById('model-color').value;
  let rgb = [parseInt(color[1]+color[2], 16), parseInt(color[3]+color[4], 16), parseInt(color[5]+color[6], 16)];
  for (let i = 0; i < 3; ++i) rgb[i] = rgb[i] / 255;

  // add the cylinder to the world
  addModel(shape, rgb, n, smoothShading);
}

let pointLight = true;
// turns point light on/off
function togglePointLight() {
  if (pointLight) {
    gl.uniform3f(u_diffuseColor1, 0.0, 0.0, 0.0);
    gl.uniform3f(u_specularColor1, 0.0, 0.0, 0.0);
    lightModels = [];
  } else {
    gl.uniform3f(u_diffuseColor1, ...DIFFUSE_COLOR);
    gl.uniform3f(u_specularColor1, ...SPECULAR_COLOR);
    // create sphere for point light
    PLSphere = new Sphere([1.0, 1.0, 1.0], 13)
    PLSphere.setScale(0.075, 0.075, 0.075);
    PLSphere.setTranslate(...lightPosition.elements);
    lightModels.push(PLSphere);
  }

  pointLight = !pointLight;
}

let directionalLight = true;
// turns directional light on/off
function toggleDirectionalLight() {
  if (directionalLight) {
    gl.uniform3f(u_diffuseColor2, 0.0, 0.0, 0.0);
    gl.uniform3f(u_specularColor2, 0.0, 0.0, 0.0);
  } else {
    gl.uniform3f(u_diffuseColor2, ...DIFFUSE_COLOR);
    gl.uniform3f(u_specularColor2, ...SPECULAR_COLOR);
  }

  directionalLight = !directionalLight;
}

let cameraPerspective = true;
function toggleCameraMode() {
  if (cameraPerspective) {
    camera.projMatrix.setOrtho(-1, 1, -1, 1, camera.near, camera.far);
  } else {
    camera.projMatrix.setPerspective(camera.fov, canvas.width/canvas.height, camera.near, camera.far);
  }

  cameraPerspective = !cameraPerspective;
}

// toggling draw mode
let drawWireframe = false;
function toggleDrawMode() {
  drawWireframe = !drawWireframe;
}

// toggles between smooth and flat shading
function toggleShaderMode() {
  // Get the selected model
  let selector = document.getElementById('model-select');
  let selectedModel = models[parseInt(selector.value)+1];

  if (selectedModel.smoothShading === undefined) {
    alert('This model only has one shading mode.')
    return -1;
  }

  // change the shader mode
  selectedModel.setShading(!selectedModel.smoothShading);
}

const MAX_TRANSLATE = 100;
/**
 * translates the cylinder upon user input
 * @param {Number} value number between -100 and 100
 * @param {String} dimension 'x', 'y', or 'z'
 */
function onChangeTranslate(value, dimension) {
  // Get the selected model
  let selector = document.getElementById('model-select');
  let selectedModel = models[parseInt(selector.value)+1];

  // translate along x-axis
  if (dimension === 'x') {
    selectedModel.translate[0] = value/MAX_TRANSLATE;
    return;
  }

  // translate along y-axis
  if (dimension === 'y') {
    selectedModel.translate[1] = value/MAX_TRANSLATE;
    return;
  }

  // translate along z-axis
  selectedModel.translate[2] = value/MAX_TRANSLATE;
  return;
}

/**
 * rotates the cylinder upon user input
 * @param {Number} value number between 0 and 360
 * @param {String} dimension 'x', 'y', or 'z'
 */
function onChangeRotate(value, dimension) {
  // Get the selected model
  let selector = document.getElementById('model-select');
  let selectedModel = models[parseInt(selector.value)+1];

  // rotate along x-axis
  if (dimension === 'x') {
    selectedModel.rotate[0] = value;
    return;
  }

  // rotate along y-axis
  if (dimension === 'y') {
    selectedModel.rotate[1] = value;
    return;
  }

  // rotate along z-axis
  selectedModel.rotate[2] = value;
  return;
}

const MAX_SCALE = 200;
/**
 * scales the cylinder upon user input
 * @param {Number} value number between 1 and 200
 * @param {String} dimension 'x', 'y', 'z', or 'all'
 */
function onChangeScale(value, dimension) {
  // Get the selected model
  let selector = document.getElementById('model-select');
  let selectedModel = models[parseInt(selector.value)+1];

  // scale along x-axis
  if (dimension === 'x') {
    selectedModel.scale[0] = value/MAX_SCALE;
    return;
  }

  // translate along y-axis
  if (dimension === 'y') {
    selectedModel.scale[1] = value/MAX_SCALE;
    return;
  }

  // translate along z-axis
  if (dimension === 'z') {
    selectedModel.scale[2] = value/MAX_SCALE;
    return;
  }

  let scale = selectedModel.scale;
  scale.forEach((elem, i, scale) => scale[i] = value/MAX_SCALE);
}

let rotateLight = true
// toggles point light rotation
function toggleRotateLight() {
  rotateLight = !rotateLight;
}

function onTranslateLight(value, dimension) {
  // translate along x-axis
  if (dimension === 'x') {
    lightPosition.elements[0] = value/MAX_TRANSLATE;
    gl.uniform3fv(u_lightPosition, lightPosition.elements);
    lightModels[0].translate[0] = value/MAX_TRANSLATE;
    return;
  }

  // translate along y-axis
  if (dimension === 'y') {
    lightPosition.elements[1] = value/MAX_TRANSLATE;
    gl.uniform3fv(u_lightPosition, lightPosition.elements);
    lightModels[0].translate[1] = value/MAX_TRANSLATE;
    return;
  }

  // translate along z-axis
  lightPosition.elements[2] = value/MAX_TRANSLATE;
  gl.uniform3fv(u_lightPosition, lightPosition.elements);
  lightModels[0].translate[2] = value/MAX_TRANSLATE;
  return;
}

//////////////////////////////////////////
//             MAIN FUNCTION            //
//////////////////////////////////////////

// sets up all of the necessary things for the program to run
function main() {
  // retrieve <canvas> element
  canvas = document.getElementById('viewer');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return;
  }

  // get the rendering context for webgl
  gl = canvas.getContext('webgl');
  if(!gl) {
    console.log('Failed to get webgl context');
    return -1;
  }

  // enables 3d depth for multiple objects
  gl.enable(gl.DEPTH_TEST);

  // clearing the screen
  gl.clearColor(0.7, 0.7, 0.7, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // compiling shaders and sending them to gpu
  if(!initShaders(gl, VSHADER, FSHADER)) {
    console.log('Failed to initialize shaders');
    return -1;
  }

  // Retrieve uniforms from shaders
  u_ModelMatrix    = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  u_NormalMatrix   = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  u_ViewMatrix     = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  u_ProjMatrix     = gl.getUniformLocation(gl.program, 'u_ProjMatrix');

  u_Color          = gl.getUniformLocation(gl.program, 'u_Color');
  u_ambientColor   = gl.getUniformLocation(gl.program, 'u_ambientColor');
  u_diffuseColor1  = gl.getUniformLocation(gl.program, 'u_diffuseColor1');
  u_diffuseColor2  = gl.getUniformLocation(gl.program, 'u_diffuseColor2');
  u_specularColor1 = gl.getUniformLocation(gl.program, 'u_specularColor1');
  u_specularColor2 = gl.getUniformLocation(gl.program, 'u_specularColor2');
  u_specularAlpha  = gl.getUniformLocation(gl.program, 'u_specularAlpha');
  u_lightPosition  = gl.getUniformLocation(gl.program, 'u_lightPosition');
  u_lightDirection = gl.getUniformLocation(gl.program, 'u_lightDirection');
  u_eyePosition    = gl.getUniformLocation(gl.program, 'u_eyePosition');

  // initializing buffers
  vertexBuffer = initBuffer('a_Position', 3);
  normalBuffer = initBuffer('a_Normal', 3);
  indexBuffer = gl.createBuffer();
  if(!indexBuffer) {
      console.log("Can't create buffer.")
      return -1;
  }

  // Set light data
  gl.uniform3f(u_ambientColor, 0.2, 0.2, 0.2);
  gl.uniform3f(u_diffuseColor1, ...DIFFUSE_COLOR);   // point light
  gl.uniform3f(u_diffuseColor2, ...DIFFUSE_COLOR);   // directional light
  gl.uniform3f(u_specularColor1, ...SPECULAR_COLOR); // point light
  gl.uniform3f(u_specularColor2, ...SPECULAR_COLOR); // directional light

  gl.uniform1f(u_specularAlpha, 32.0);

  gl.uniform3fv(u_lightPosition, lightPosition.elements);
  gl.uniform3fv(u_lightDirection, lightDirection.elements);

  // Set camera data
  camera = new Camera([0, 0, 2]);

  // create sphere for point light
  PLSphere = new Sphere([1.0, 1.0, 1.0], 13)
  PLSphere.setScale(0.075, 0.075, 0.075);
  PLSphere.setTranslate(...lightPosition.elements);
  lightModels.push(PLSphere);


  // create initial models on program start
  initialModels();

  // handles input for the program's secret
  secretListener();

  // hide the dropdown pokemon menu for the secret
  let dropdown = document.getElementById('secret');
  dropdown.style.display = 'none';

  // start drawing the cylinder
  draw();
}