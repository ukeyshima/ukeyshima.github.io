class Buoyancy {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['velocityTexture', 'temperatureTexture', 'densityTexture', 'timeStep', 'ambientTemperature', 'sigma', 'kappa', 'buoyancyDirection'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'buoyancyProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.buoyancyProgram.attLocations).map((key) => webgl2.webglPrograms.buoyancyProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(velocityFrameBuffer, temperatureFrameBuffer, densityFrameBuffer, outputFrameBuffer, timeStep, ambientTemperature, smokeBuoyancy, smokeWeight, mouse) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.buoyancyProgram.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, outputFrameBuffer.f);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, velocityFrameBuffer.t);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE1);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, temperatureFrameBuffer.t);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE2);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, densityFrameBuffer.t);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.buoyancyProgram.uniLocations.velocityTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.buoyancyProgram.uniLocations.temperatureTexture, 1);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.buoyancyProgram.uniLocations.densityTexture, 2);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.buoyancyProgram.uniLocations.timeStep, timeStep);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.buoyancyProgram.uniLocations.ambientTemperature, ambientTemperature);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.buoyancyProgram.uniLocations.sigma, smokeBuoyancy);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.buoyancyProgram.uniLocations.kappa, smokeWeight);
    this.webgl2.gl.uniform2fv(this.webgl2.webglPrograms.buoyancyProgram.uniLocations.buoyancyDirection, mouse[2] == 0 ? [0, 1] : [mouse[0], mouse[1]]);
    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
