const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  webgl2.gl.viewport(0, 0, canvas.width, canvas.height);
});

const mouse = [0, 0, 0];

window.addEventListener('mousedown', () => (mouse[2] = 1));
window.addEventListener(`mousemove`, (e) => {
  (mouse[0] = e.clientX), (mouse[1] = canvas.height - e.clientY);
});
window.addEventListener('mouseup', () => (mouse[2] = 0));

const webgl2 = new WebGL2(canvas, [
  {
    name: 'initialProgram',
    vsText: WebGL2.defaultVertexShader,
    fsText: document.getElementById('initialFrag').textContent,
    uniList: ['resolution'],
    attList: [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }],
  },
  {
    name: 'mainProgram',
    vsText: WebGL2.defaultVertexShader,
    fsText: document.getElementById('mainFrag').textContent,
    uniList: ['tex'],
    attList: [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }],
  },
  {
    name: 'renderingProgram',
    vsText: WebGL2.defaultVertexShader,
    fsText: document.getElementById('renderingFrag').textContent,
    uniList: ['tex', 'resolution'],
    attList: [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }],
  },
]);

const initialVAO = webgl2.createVAO(
  Object.keys(webgl2.webglPrograms.initialProgram.attLocations).map((key) => webgl2.webglPrograms.initialProgram.attLocations[key]),
  [],
  WebGL2.planeVertexIndex
);

const mainVAO = webgl2.createVAO(
  Object.keys(webgl2.webglPrograms.mainProgram.attLocations).map((key) => webgl2.webglPrograms.mainProgram.attLocations[key]),
  [],
  WebGL2.planeVertexIndex
);

const renderingVAO = webgl2.createVAO(
  Object.keys(webgl2.webglPrograms.renderingProgram.attLocations).map((key) => webgl2.webglPrograms.renderingProgram.attLocations[key]),
  [],
  WebGL2.planeVertexIndex
);

let frameBuffer1;
let frameBuffer2;

const init = () => {
  frameBuffer1 = webgl2.createFrameBuffer(canvas.width / 4, canvas.height / 4, webgl2.gl.RG32I, webgl2.gl.RG_INTEGER, webgl2.gl.INT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE);
  frameBuffer2 = webgl2.createFrameBuffer(canvas.width / 4, canvas.height / 4, webgl2.gl.RG32I, webgl2.gl.RG_INTEGER, webgl2.gl.INT, webgl2.gl.NEAREST, webgl2.gl.CLAMP_TO_EDGE);
  webgl2.gl.useProgram(webgl2.webglPrograms.initialProgram.program);
  webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, frameBuffer2.f);
  webgl2.gl.bindVertexArray(initialVAO);
  webgl2.gl.uniform2fv(webgl2.webglPrograms.initialProgram.uniLocations.resolution, [canvas.width / 4, canvas.height / 4]);
  webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
  webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);
};

window.addEventListener('resize', () => init());

const loop = () => {
  webgl2.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  webgl2.gl.clear(webgl2.gl.COLOR_BUFFER_BIT);

  webgl2.gl.useProgram(webgl2.webglPrograms.mainProgram.program);
  webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, frameBuffer1.f);
  webgl2.gl.bindVertexArray(mainVAO);
  webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
  webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, frameBuffer2.t);
  webgl2.gl.uniform1i(webgl2.webglPrograms.mainProgram.uniLocations.tex, 0);
  webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
  webgl2.gl.bindFramebuffer(webgl2.gl.FRAMEBUFFER, null);

  [frameBuffer1, frameBuffer2] = [frameBuffer2, frameBuffer1];

  webgl2.gl.useProgram(webgl2.webglPrograms.renderingProgram.program);
  webgl2.gl.bindVertexArray(renderingVAO);
  webgl2.gl.activeTexture(webgl2.gl.TEXTURE0);
  webgl2.gl.bindTexture(webgl2.gl.TEXTURE_2D, frameBuffer1.t);
  webgl2.gl.uniform1i(webgl2.webglPrograms.renderingProgram.uniLocations.tex, 0);
  webgl2.gl.uniform2fv(webgl2.webglPrograms.renderingProgram.uniLocations.resolution, [canvas.width, canvas.height]);
  webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);

  webgl2.gl.flush();

  requestAnimationFrame(loop);
};

init();
loop();
