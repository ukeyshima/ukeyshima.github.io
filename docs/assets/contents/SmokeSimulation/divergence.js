class Divergence {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['velocityTexture', 'halfInverseCellSize'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'divergenceProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.divergenceProgram.attLocations).map((key) => webgl2.webglPrograms.divergenceProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(velocityFrameBuffer, outputFrameBuffer, cellSize) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.divergenceProgram.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, outputFrameBuffer.f);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, velocityFrameBuffer.t);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.divergenceProgram.uniLocations.velocityTexture, 0);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.divergenceProgram.uniLocations.halfInverseCellSize, 0.5 / cellSize);
    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
