const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = [0, 0, 0];
const simAreaCenter = [0, 0, 0];
const simAreaSize = [(20 * canvas.width) / canvas.height, 20, 20];
const gridSize = [2, 2, 2];
const gridNum = [Math.ceil(simAreaSize[0] / gridSize[0]), Math.ceil(simAreaSize[1] / gridSize[1]), Math.ceil(simAreaSize[2] / gridSize[2])];
const instanceNum = Math.pow(2, 14);
const size = Math.sqrt(instanceNum);
const maxSpeed = 3;
const maxForce = 1;
const separationRadius = 2;
const alignmentRadius = 2;
const cohesionRadius = 2;
const separationWeight = 2.5;
const alignmentWeight = 3;
const cohesionWeight = 2;
const wallWeight = 1;

const mMatrix = Matrix4x4.multiply(Matrix4x4.rotationX(-90), Matrix4x4.scale([0.25, 0.25, 0.25]));
const vMatrix = Matrix4x4.lookAt([0, 0, 100], [0, 0, 0], [0, 1, 0]);
const pMatrix = Matrix4x4.orthographic(simAreaSize[1] / 2, canvas.width / canvas.height, 0.1, 1000);

const vpMatrix = Matrix4x4.multiply(pMatrix, vMatrix);

const webgl2 = new WebGL2(canvas, []);
webgl2.useTextureFloatExtension();
webgl2.useTextureFloatLinearExtension();

const initParams = new InitParams(webgl2, document.getElementById('initParamsFrag').textContent);
const index = new Index(webgl2, document.getElementById('indexFrag').textContent);
const bitonicSort = new BitonicSort(webgl2, document.getElementById('bitonicSortFrag').textContent);
const gridIndex = new GridIndex(webgl2, document.getElementById('gridIndexFrag').textContent);
const updateParams = new UpdateParams(webgl2, document.getElementById('updateParamsFrag').textContent);
const boids = new Boids(webgl2, document.getElementById('boidsFrag').textContent, document.getElementById('boidsVert').textContent, model, instanceNum * 2);
const rendering = new Rendering(webgl2, document.getElementById('renderingFrag').textContent);

let paramsFrameBufferRead;
let paramsFrameBufferWrite;
let indexFrameBufferRead;
let indexFrameBufferWrite;
let gridIndexFrameBuffer;
let boidsFrameBuffer;

let startTime;
let time;
let preTime;
let deltaTime;

const init = () => {
  paramsFrameBufferRead = webgl2.createFrameBufferMRT(size, size, [webgl2.gl.RGBA16F, webgl2.gl.RGBA16F], [webgl2.gl.RGBA, webgl2.gl.RGBA], [webgl2.gl.HALF_FLOAT, webgl2.gl.HALF_FLOAT], [webgl2.gl.NEAREST, webgl2.gl.NEAREST], [webgl2.gl.REPEAT, webgl2.gl.REPEAT], 2, false);
  paramsFrameBufferWrite = webgl2.createFrameBufferMRT(size, size, [webgl2.gl.RGBA16F, webgl2.gl.RGBA16F], [webgl2.gl.RGBA, webgl2.gl.RGBA], [webgl2.gl.HALF_FLOAT, webgl2.gl.HALF_FLOAT], [webgl2.gl.NEAREST, webgl2.gl.NEAREST], [webgl2.gl.REPEAT, webgl2.gl.REPEAT], 2, false);
  indexFrameBufferRead = webgl2.createFrameBuffer(size, size, webgl2.gl.RG16UI, webgl2.gl.RG_INTEGER, webgl2.gl.UNSIGNED_SHORT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false);
  indexFrameBufferWrite = webgl2.createFrameBuffer(size, size, webgl2.gl.RG16UI, webgl2.gl.RG_INTEGER, webgl2.gl.UNSIGNED_SHORT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false);
  gridIndexFrameBuffer = webgl2.createFrameBuffer(gridNum[0], gridNum[1] * gridNum[2], webgl2.gl.RG16I, webgl2.gl.RG_INTEGER, webgl2.gl.SHORT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false);
  boidsFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.RGBA, webgl2.gl.RGBA, webgl2.gl.UNSIGNED_BYTE, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false);

  startTime = new Date().getTime();
  preTime = 0;
  time = 0;

  initParams.execute(paramsFrameBufferWrite, simAreaCenter, simAreaSize);
  [paramsFrameBufferRead, paramsFrameBufferWrite] = [paramsFrameBufferWrite, paramsFrameBufferRead];
};

const loop = () => {
  preTime = time;
  time = (new Date().getTime() - startTime) / 1000;
  deltaTime = time - preTime;

  index.execute(paramsFrameBufferRead, indexFrameBufferWrite, [size, size], simAreaCenter, simAreaSize, gridNum);
  [indexFrameBufferRead, indexFrameBufferWrite] = [indexFrameBufferWrite, indexFrameBufferRead];

  bitonicSort.execute(indexFrameBufferRead, indexFrameBufferWrite, [size, size], instanceNum);
  [indexFrameBufferRead, indexFrameBufferWrite] = [indexFrameBufferWrite, indexFrameBufferRead];

  gridIndex.execute(indexFrameBufferRead, gridIndexFrameBuffer, [gridNum[0], gridNum[1] * gridNum[2]], instanceNum, [size, size]);

  updateParams.execute(paramsFrameBufferRead, paramsFrameBufferWrite, gridIndexFrameBuffer, indexFrameBufferRead, time, deltaTime, [size, size], [gridNum[0], gridNum[1] * gridNum[2]], gridNum, maxSpeed, maxForce, separationRadius, alignmentRadius, cohesionRadius, separationWeight, alignmentWeight, cohesionWeight, simAreaCenter, simAreaSize, wallWeight);
  [paramsFrameBufferRead, paramsFrameBufferWrite] = [paramsFrameBufferWrite, paramsFrameBufferRead];

  boids.execute(paramsFrameBufferRead, boidsFrameBuffer, [size, size], Matrix4x4.transpose(mMatrix), Matrix4x4.transpose(vpMatrix), simAreaSize, instanceNum, time);

  rendering.execute(boidsFrameBuffer, time);

  requestAnimationFrame(loop);
};

init();
loop();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  webgl2.gl.viewport(0, 0, canvas.width, canvas.height);
  init();
});

window.addEventListener('mousedown', () => {
  mouse[2] = 1;
});
window.addEventListener(`mousemove`, (e) => {
  mouse[0] = e.clientX;
  mouse[1] = canvas.height - e.clientY;
});
window.addEventListener('mouseup', () => {
  mouse[2] = 0;
});
