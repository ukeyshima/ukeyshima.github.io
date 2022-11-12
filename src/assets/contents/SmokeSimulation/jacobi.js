class Jacobi {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['pressureTexture', 'divergenceTexture', 'alpha', 'inverseBeta'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'jacobiProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.jacobiProgram.attLocations).map((key) => webgl2.webglPrograms.jacobiProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(pressureFrameBuffer, divergenceFrameBuffer, outputFrameBuffer, cellSize, inverseBeta) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.jacobiProgram.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, outputFrameBuffer.f);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, pressureFrameBuffer.t);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE1);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, divergenceFrameBuffer.t);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.jacobiProgram.uniLocations.pressureTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.jacobiProgram.uniLocations.divergenceTexture, 1);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.jacobiProgram.uniLocations.alpha, -cellSize * cellSize);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.jacobiProgram.uniLocations.inverseBeta, inverseBeta);
    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
