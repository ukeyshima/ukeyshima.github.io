class UpdateParams {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['velocityTexture', 'positionTexture', 'gridIndexTexture', 'time', 'deltaTime', 'paramsResolution', 'gridIndexResolution', 'gridNum', 'maxSpeed', 'maxForce', 'separationRadius', 'alignmentRadius', 'cohesionRadius', 'separationWeight', 'alignmentWeight', 'cohesionWeight', 'simAreaCenter', 'simAreaSize', 'wallWeight'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'updateParamsProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.updateParamsProgram.attLocations).map((key) => webgl2.webglPrograms.updateParamsProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(paramsFrameBufferRead, paramsFrameBufferWrite, gridIndexFrameBuffer, time, deltaTime, paramsResolution, gridIndexResolution, gridNum, maxSpeed, maxForce, separationRadius, alignmentRadius, cohesionRadius, separationWeight, alignmentWeight, cohesionWeight, simAreaCenter, simAreaSize, wallWeight) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.updateParamsProgram.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, paramsFrameBufferWrite.f);
    this.webgl2.gl.drawBuffers([webgl2.gl.COLOR_ATTACHMENT0, webgl2.gl.COLOR_ATTACHMENT1]);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, paramsFrameBufferRead.ts[0]);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE1);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, paramsFrameBufferRead.ts[1]);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE2);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, gridIndexFrameBuffer.t);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.velocityTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.positionTexture, 1);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.gridIndexTexture, 2);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.time, time);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.deltaTime, deltaTime);
    this.webgl2.gl.uniform2fv(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.paramsResolution, paramsResolution);
    this.webgl2.gl.uniform2fv(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.gridIndexResolution, gridIndexResolution);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.gridNum, gridNum);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.maxSpeed, maxSpeed);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.maxForce, maxForce);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.separationRadius, separationRadius);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.alignmentRadius, alignmentRadius);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.cohesionRadius, cohesionRadius);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.separationWeight, separationWeight);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.alignmentWeight, alignmentWeight);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.cohesionWeight, cohesionWeight);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.simAreaCenter, simAreaCenter);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.simAreaSize, simAreaSize);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.updateParamsProgram.uniLocations.wallWeight, wallWeight);

    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
