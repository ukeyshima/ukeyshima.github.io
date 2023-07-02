const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = [0, 0, 0];
const preMouse = [0, 0];

const webgl2 = new WebGL2(canvas, []);
webgl2.useTextureFloatExtension();
webgl2.useTextureFloatLinearExtension();

const timeStep = 0.125;
const impulseTemperature = 10;
const impulseDensity = 1;
const temperatureDissipation = 0.99;
const velocityDissipation = 0.99;
const densityDissipation = 0.98;
const ambientTemperature = 1;
const smokeBuoyancy = 1;
const smokeWeight = 0.05;
const cellSize = 1;
const gradientScale = 1;
const numJacobiIterations = 20;
const inverseBeta = 0.25;

const advection = new Advection(webgl2, document.getElementById('advectionFrag').textContent);
const buoyancy = new Buoyancy(webgl2, document.getElementById('buoyancyFrag').textContent);
const impulse = new Impulse(webgl2, document.getElementById('impulseFrag').textContent);
const divergence = new Divergence(webgl2, document.getElementById('divergenceFrag').textContent);
const jacobi = new Jacobi(webgl2, document.getElementById('jacobiFrag').textContent);
const subtractGradient = new SubtractGradient(webgl2, document.getElementById('subtractGradientFrag').textContent);
const rendering = new Rendering(webgl2, document.getElementById('renderingFrag').textContent);

let velocityFrameBufferRead;
let velocityFrameBufferWrite;
let temperatureFrameBufferRead;
let temperatureFrameBufferWrite;
let densityFrameBufferRead;
let densityFrameBufferWrite;
let pressureFrameBufferRead;
let pressureFrameBufferWrite;
let divergenceFrameBuffer;

let startTime;

const init = () => {
  velocityFrameBufferRead = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.RG32F, webgl2.gl.RG, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);
  velocityFrameBufferWrite = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.RG32F, webgl2.gl.RG, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);
  temperatureFrameBufferRead = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.R32F, webgl2.gl.RED, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);
  temperatureFrameBufferWrite = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.R32F, webgl2.gl.RED, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);
  densityFrameBufferRead = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.R32F, webgl2.gl.RED, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);
  densityFrameBufferWrite = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.R32F, webgl2.gl.RED, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);
  pressureFrameBufferRead = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.R32F, webgl2.gl.RED, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);
  pressureFrameBufferWrite = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.R32F, webgl2.gl.RED, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);
  divergenceFrameBuffer = webgl2.createFrameBuffer(canvas.width, canvas.height, webgl2.gl.R32F, webgl2.gl.RED, webgl2.gl.FLOAT, webgl2.gl.LINEAR, webgl2.gl.REPEAT);

  startTime = new Date().getTime();
};

const loop = () => {
  const time = (new Date().getTime() - startTime) / 1000;

  advection.execute(velocityFrameBufferRead, velocityFrameBufferRead, velocityFrameBufferWrite, timeStep, velocityDissipation);
  advection.execute(velocityFrameBufferRead, temperatureFrameBufferRead, temperatureFrameBufferWrite, timeStep, temperatureDissipation);
  advection.execute(velocityFrameBufferRead, densityFrameBufferRead, densityFrameBufferWrite, timeStep, densityDissipation);
  [velocityFrameBufferRead, velocityFrameBufferWrite] = [velocityFrameBufferWrite, velocityFrameBufferRead];
  [temperatureFrameBufferRead, temperatureFrameBufferWrite] = [temperatureFrameBufferWrite, temperatureFrameBufferRead];
  [densityFrameBufferRead, densityFrameBufferWrite] = [densityFrameBufferWrite, densityFrameBufferRead];

  buoyancy.execute(velocityFrameBufferRead, temperatureFrameBufferRead, densityFrameBufferRead, velocityFrameBufferWrite, timeStep, ambientTemperature, smokeBuoyancy, smokeWeight, mouse);
  [velocityFrameBufferRead, velocityFrameBufferWrite] = [velocityFrameBufferWrite, velocityFrameBufferRead];

  impulse.execute(temperatureFrameBufferRead, temperatureFrameBufferWrite, impulseTemperature, time);
  impulse.execute(densityFrameBufferRead, densityFrameBufferWrite, impulseDensity, time);
  [temperatureFrameBufferRead, temperatureFrameBufferWrite] = [temperatureFrameBufferWrite, temperatureFrameBufferRead];
  [densityFrameBufferRead, densityFrameBufferWrite] = [densityFrameBufferWrite, densityFrameBufferRead];

  divergence.execute(velocityFrameBufferRead, divergenceFrameBuffer, cellSize);

  for (let i = 0; i < numJacobiIterations; i++) {
    jacobi.execute(pressureFrameBufferRead, divergenceFrameBuffer, pressureFrameBufferWrite, cellSize, inverseBeta);
    [pressureFrameBufferRead, pressureFrameBufferWrite] = [pressureFrameBufferWrite, pressureFrameBufferRead];
  }

  subtractGradient.execute(velocityFrameBufferRead, pressureFrameBufferRead, velocityFrameBufferWrite, gradientScale);
  [velocityFrameBufferRead, velocityFrameBufferWrite] = [velocityFrameBufferWrite, velocityFrameBufferRead];

  rendering.execute(densityFrameBufferRead);

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

window.addEventListener('mousedown', (e) => {
  mouse[2] = 1;
  preMouse[0] = e.clientX;
  preMouse[1] = canvas.height - e.clientY;
});
window.addEventListener(`mousemove`, (e) => {
  mouse[0] = e.clientX - preMouse[0];
  mouse[1] = canvas.height - e.clientY - preMouse[1];
  preMouse[0] = e.clientX;
  preMouse[1] = canvas.height - e.clientY;
});
window.addEventListener('mouseup', () => (mouse[2] = 0));
