class InitParams {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['simAreaCenter', 'simAreaSize'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'initParamsProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.initParamsProgram.attLocations).map((key) => webgl2.webglPrograms.initParamsProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(paramsFrameBuffer, simAreaCenter, simAreaSize) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.initParamsProgram.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, paramsFrameBuffer.f);
    this.webgl2.gl.drawBuffers([webgl2.gl.COLOR_ATTACHMENT0, webgl2.gl.COLOR_ATTACHMENT1]);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.initParamsProgram.uniLocations.simAreaCenter, simAreaCenter);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.initParamsProgram.uniLocations.simAreaSize, simAreaSize);
    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
