class Integrate {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['velocityTexture', 'positionTexture', 'accelerationTexture', 'simAreaCenter', 'simAreaSize', 'gravity', 'wallStiffness', 'timeStep'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'integrate',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.integrate.attLocations).map((key) => webgl2.webglPrograms.integrate.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(positionVelocityFrameBuffer, velocityTexture, positionTexture, accelerationTexture, simAreaCenter, simAreaSize, gravity, wallStiffness, timeStep) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.integrate.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, positionVelocityFrameBuffer);
    this.webgl2.gl.drawBuffers([this.webgl2.gl.COLOR_ATTACHMENT0, this.webgl2.gl.COLOR_ATTACHMENT1]);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, velocityTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE1);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, positionTexture);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE2);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, accelerationTexture);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.integrate.uniLocations.velocityTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.integrate.uniLocations.positionTexture, 1);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.integrate.uniLocations.accelerationTexture, 2);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.integrate.uniLocations.simAreaCenter, simAreaCenter);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.integrate.uniLocations.simAreaSize, simAreaSize);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.integrate.uniLocations.gravity, gravity);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.integrate.uniLocations.wallStiffness, wallStiffness);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.integrate.uniLocations.timeStep, timeStep);

    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
