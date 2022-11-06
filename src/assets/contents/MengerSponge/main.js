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
  (mouse[0] = e.clientX), (mouse[1] = e.clientY);
});
window.addEventListener('mouseup', () => (mouse[2] = 0));

const webgl2 = new WebGL2(canvas, [
  {
    name: 'planeProgram',
    vsText: WebGL2.defaultVertexShader,
    fsText: document.getElementById('frag').textContent,
    uniList: ['iTime', 'iResolution', 'iMouse'],
    attList: [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }],
  },
]);

const vao = webgl2.createVAO(
  Object.keys(webgl2.webglPrograms.planeProgram.attLocations).map((key) => webgl2.webglPrograms.planeProgram.attLocations[key]),
  [],
  WebGL2.planeVertexIndex
);

const startTime = new Date().getTime();
const loop = () => {
  const time = (new Date().getTime() - startTime) / 1000;

  webgl2.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  webgl2.gl.clear(webgl2.gl.COLOR_BUFFER_BIT);

  webgl2.gl.useProgram(webgl2.webglPrograms.planeProgram.program);
  webgl2.gl.bindVertexArray(vao);
  webgl2.gl.uniform1f(webgl2.webglPrograms.planeProgram.uniLocations.iTime, time);
  webgl2.gl.uniform2fv(webgl2.webglPrograms.planeProgram.uniLocations.iResolution, [canvas.width, canvas.height]);
  webgl2.gl.uniform3fv(webgl2.webglPrograms.planeProgram.uniLocations.iMouse, mouse);
  webgl2.gl.drawElements(webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, webgl2.gl.UNSIGNED_SHORT, 0);
  webgl2.gl.flush();

  animationID = requestAnimationFrame(loop);
};

loop();
