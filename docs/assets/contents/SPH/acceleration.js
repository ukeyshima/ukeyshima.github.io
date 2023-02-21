class Acceleration {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['velocityTexture', 'positionTexture', 'densityTexture', 'pressureTexture', 'gridIndexTexture', 'gridIndexReferenceTexture', 'gridNum', 'simAreaCenter', 'simAreaSize', 'smoothLen', 'viscosity'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'acceleration',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.acceleration.attLocations).map((key) => webgl2.webglPrograms.acceleration.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(accelerationFrameBuffer, velocityTexture, positionTexture, densityTexture, pressureTexture, gridIndexTexture, gridIndexReferenceTexture, gridNum, simAreaCenter, simAreaSize, smoothLen, viscosity) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.acceleration.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, accelerationFrameBuffer);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, velocityTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE1);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, positionTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE2);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, densityTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE3);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, pressureTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE4);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, gridIndexTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE5);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, gridIndexReferenceTexture);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.acceleration.uniLocations.velocityTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.acceleration.uniLocations.positionTexture, 1);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.acceleration.uniLocations.densityTexture, 2);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.acceleration.uniLocations.pressureTexture, 3);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.acceleration.uniLocations.gridIndexTexture, 4);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.acceleration.uniLocations.gridIndexReferenceTexture, 5);
    this.webgl2.gl.uniform3iv(this.webgl2.webglPrograms.acceleration.uniLocations.gridNum, gridNum);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.acceleration.uniLocations.simAreaCenter, simAreaCenter);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.acceleration.uniLocations.simAreaSize, simAreaSize);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.acceleration.uniLocations.smoothLen, smoothLen);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.acceleration.uniLocations.viscosity, viscosity);

    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
