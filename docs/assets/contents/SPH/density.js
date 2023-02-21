class Density {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['positionTexture', 'gridIndexTexture', 'gridIndexReferenceTexture', 'gridNum', 'simAreaCenter', 'simAreaSize', 'smoothLen', 'mass'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'density',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.density.attLocations).map((key) => webgl2.webglPrograms.density.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(densityFrameBuffer, positionTexture, gridIndexTexture, gridIndexReferenceTexture, gridNum, simAreaCenter, simAreaSize, smoothLen, mass) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.density.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, densityFrameBuffer);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, positionTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE1);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, gridIndexTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE2);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, gridIndexReferenceTexture);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.density.uniLocations.positionTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.density.uniLocations.gridIndexTexture, 1);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.density.uniLocations.gridIndexReferenceTexture, 2);
    this.webgl2.gl.uniform3iv(this.webgl2.webglPrograms.density.uniLocations.gridNum, gridNum);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.density.uniLocations.simAreaCenter, simAreaCenter);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.density.uniLocations.simAreaSize, simAreaSize);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.density.uniLocations.smoothLen, smoothLen);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.density.uniLocations.mass, mass);
    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
