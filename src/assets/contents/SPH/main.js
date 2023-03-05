const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const smoothLen = 0.2;
const pressureStiffness = 0.01;
const restDensity = 1000.0;
const mass = 8.0;
const viscosity = 0.4;
const timeStep = 0.01;
const wallStiffness = 10000;
const gravity = [0.0, -9.8, 0.0];

const mouse = [0, 0, 0];
const simAreaCenter = [0, 0, 0];
const simAreaSize = [4, 8, 4];
const gridSize = [smoothLen, smoothLen, smoothLen];
const gridNum = [Math.floor(simAreaSize[0] / gridSize[0]), Math.floor(simAreaSize[1] / gridSize[1]), Math.floor(simAreaSize[2] / gridSize[2])];
const N = 15;
const instanceNum = Math.pow(2, N);
const paramsTextureResolution = [Math.pow(2, Math.floor(N / 2)), Math.pow(2, N - Math.floor(N / 2))];
const sortedGridIndexTextureResolution = [gridNum[0] * gridNum[2], gridNum[1]];

const vMatrix = Matrix4x4.lookAt([3, 1.7, -5], [0, 0, 0], [0, 1, 0]);
const pMatrix = Matrix4x4.perspective(60, canvas.width / canvas.height, 0.1, 1000);
const vpMatrix = Matrix4x4.multiply(pMatrix, vMatrix);
const tVPMatrix = Matrix4x4.transpose(vpMatrix);

const webgl2 = new WebGL2(canvas, []);
webgl2.useTextureFloatExtension();

const initParams = new InitParams(webgl2, document.getElementById('initParamsFrag').textContent);
const index = new Index(webgl2, document.getElementById('indexFrag').textContent);
const bitonicSort = new BitonicSort(webgl2, document.getElementById('bitonicSortFrag').textContent);
const gridIndexReference = new GridIndexReference(webgl2, document.getElementById('gridIndexReferenceFrag').textContent, document.getElementById('gridIndexReferenceVert').textContent, instanceNum);
const density = new Density(webgl2, document.getElementById('densityFrag').textContent);
const pressure = new Pressure(webgl2, document.getElementById('pressureFrag').textContent);
const acceleration = new Acceleration(webgl2, document.getElementById('accelerationFrag').textContent);
const integrate = new Integrate(webgl2, document.getElementById('integrateFrag').textContent);
const rendering = new Rendering(webgl2, document.getElementById('renderingFrag').textContent, document.getElementById('renderingVert').textContent, instanceNum);

const frameBuffers = {};
const time = {};

const init = () => {
  time.start = new Date().getTime();
  time.pre = 0;
  time.now = 0;
  time.delta = 0;

  frameBuffers.velocityPosition = {
    read: webgl2.createFrameBufferMRT(paramsTextureResolution[0], paramsTextureResolution[1], [webgl2.gl.RGBA32F, webgl2.gl.RGBA32F], [webgl2.gl.RGBA, webgl2.gl.RGBA], [webgl2.gl.FLOAT, webgl2.gl.FLOAT], [webgl2.gl.NEAREST, webgl2.gl.NEAREST], [webgl2.gl.CLAMP_TO_EDGE, webgl2.gl.CLAMP_TO_EDGE], 2, false),
    write: webgl2.createFrameBufferMRT(paramsTextureResolution[0], paramsTextureResolution[1], [webgl2.gl.RGBA32F, webgl2.gl.RGBA32F], [webgl2.gl.RGBA, webgl2.gl.RGBA], [webgl2.gl.FLOAT, webgl2.gl.FLOAT], [webgl2.gl.NEAREST, webgl2.gl.NEAREST], [webgl2.gl.CLAMP_TO_EDGE, webgl2.gl.CLAMP_TO_EDGE], 2, false),
  };
  frameBuffers.gridIndex = {
    read: webgl2.createFrameBuffer(paramsTextureResolution[0], paramsTextureResolution[1], webgl2.gl.RG32I, webgl2.gl.RG_INTEGER, webgl2.gl.INT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false),
    write: webgl2.createFrameBuffer(paramsTextureResolution[0], paramsTextureResolution[1], webgl2.gl.RG32I, webgl2.gl.RG_INTEGER, webgl2.gl.INT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false),
  };
  frameBuffers.acceleration = webgl2.createFrameBuffer(paramsTextureResolution[0], paramsTextureResolution[1], webgl2.gl.RGBA32F, webgl2.gl.RGBA, webgl2.gl.FLOAT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false);
  frameBuffers.density = webgl2.createFrameBuffer(paramsTextureResolution[0], paramsTextureResolution[1], webgl2.gl.RGBA32F, webgl2.gl.RGBA, webgl2.gl.FLOAT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false);
  frameBuffers.pressure = webgl2.createFrameBuffer(paramsTextureResolution[0], paramsTextureResolution[1], webgl2.gl.RGBA32F, webgl2.gl.RGBA, webgl2.gl.FLOAT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false);
  frameBuffers.gridIndexReference = webgl2.createFrameBuffer(sortedGridIndexTextureResolution[0], sortedGridIndexTextureResolution[1], webgl2.gl.RGBA32F, webgl2.gl.RGBA, webgl2.gl.FLOAT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE, false);

  initParams.execute(frameBuffers.velocityPosition.write, simAreaCenter, simAreaSize);
  [frameBuffers.velocityPosition.read, frameBuffers.velocityPosition.write] = [frameBuffers.velocityPosition.write, frameBuffers.velocityPosition.read];
};

const loop = () => {
  time.pre = time.now;
  time.now = (new Date().getTime() - time.start) / 1000;
  time.delta = time.now - time.pre;

  webgl2.gl.viewport(0, 0, paramsTextureResolution[0], paramsTextureResolution[1]);
  index.execute(frameBuffers.velocityPosition.read, frameBuffers.gridIndex.read, simAreaCenter, simAreaSize, gridNum);

  webgl2.gl.viewport(0, 0, paramsTextureResolution[0], paramsTextureResolution[1]);
  bitonicSort.execute(frameBuffers.gridIndex, N);

  webgl2.gl.viewport(0, 0, sortedGridIndexTextureResolution[0], sortedGridIndexTextureResolution[1]);
  gridIndexReference.execute(frameBuffers.gridIndexReference.f, frameBuffers.gridIndex.read.t, sortedGridIndexTextureResolution);

  webgl2.gl.viewport(0, 0, paramsTextureResolution[0], paramsTextureResolution[1]);
  density.execute(frameBuffers.density.f, frameBuffers.velocityPosition.read.ts[1], frameBuffers.gridIndex.read.t, frameBuffers.gridIndexReference.t, gridNum, simAreaCenter, simAreaSize, smoothLen, mass);

  webgl2.gl.viewport(0, 0, paramsTextureResolution[0], paramsTextureResolution[1]);
  pressure.execute(frameBuffers.pressure.f, frameBuffers.density.t, pressureStiffness, restDensity);

  webgl2.gl.viewport(0, 0, paramsTextureResolution[0], paramsTextureResolution[1]);
  acceleration.execute(frameBuffers.acceleration.f, frameBuffers.velocityPosition.read.ts[0], frameBuffers.velocityPosition.read.ts[1], frameBuffers.density.t, frameBuffers.pressure.t, frameBuffers.gridIndex.read.t, frameBuffers.gridIndexReference.t, gridNum, simAreaCenter, simAreaSize, smoothLen, viscosity, gravity, wallStiffness);

  webgl2.gl.viewport(0, 0, paramsTextureResolution[0], paramsTextureResolution[1]);
  integrate.execute(frameBuffers.velocityPosition.write.f, frameBuffers.velocityPosition.read.ts[0], frameBuffers.velocityPosition.read.ts[1], frameBuffers.acceleration.t, timeStep);
  [frameBuffers.velocityPosition.read, frameBuffers.velocityPosition.write] = [frameBuffers.velocityPosition.write, frameBuffers.velocityPosition.read];

  webgl2.gl.viewport(0, 0, canvas.width, canvas.height);
  rendering.execute(frameBuffers.velocityPosition.read, frameBuffers.density.t, tVPMatrix);

  webgl2.gl.finish();

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
