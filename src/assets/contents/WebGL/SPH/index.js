class Index {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['positionTexture', 'simAreaCenter', 'simAreaSize', 'gridNum'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'indexProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.indexProgram.attLocations).map((key) => webgl2.webglPrograms.indexProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(paramsFrameBuffer, indexFrameBuffer, simAreaCenter, simAreaSize, gridNum) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.indexProgram.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, indexFrameBuffer.f);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, paramsFrameBuffer.ts[1]);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.indexProgram.uniLocations.positionTexture, 0);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.indexProgram.uniLocations.simAreaCenter, simAreaCenter);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.indexProgram.uniLocations.simAreaSize, simAreaSize);
    this.webgl2.gl.uniform3iv(this.webgl2.webglPrograms.indexProgram.uniLocations.gridNum, gridNum);
    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
