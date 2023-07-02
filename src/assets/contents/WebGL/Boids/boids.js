class Boids {
  constructor(webgl2, frag, vert, model, instanceNum) {
    this.webgl2 = webgl2;
    this.instanceNum = instanceNum;

    const modelVertexPosition = model.data.attributes.position.array;
    const instanceIndex = new Array(this.instanceNum).fill(0).map((e, i) => i);
    this.modelVertexIndex = model.data.index.array;

    const uniList = ['paramsResolution', 'positionTexture', 'velocityTexture', 'mMatrix', 'vpMatrix', 'simAreaSize', 'instanceNum', 'time'];
    const attList = [
      { array: modelVertexPosition, location: 'vertex', stride: 3 },
      { array: instanceIndex, location: 'instanceIndex', stride: 1 },
    ];

    this.webgl2.addPrograms([
      {
        name: 'boidsProgram',
        vsText: vert,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = this.webgl2.createVAO(
      Object.keys(this.webgl2.webglPrograms.boidsProgram.attLocations).map((key) => this.webgl2.webglPrograms.boidsProgram.attLocations[key]),
      [{ location: this.webgl2.webglPrograms.boidsProgram.attLocations.instanceIndex.location, stride: 1 }],
      this.modelVertexIndex
    );
  }

  execute(paramsFrameBuffer, outputFrameBuffer, paramsResolution, mMatrix, vpMatrix, simAreaSize, instanceNum, time) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.boidsProgram.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, outputFrameBuffer.f);
    this.webgl2.gl.drawBuffers([webgl2.gl.COLOR_ATTACHMENT0, webgl2.gl.COLOR_ATTACHMENT1]);
    this.webgl2.gl.clearColor(0.7, 0.5, 0.0, 1.0);
    this.webgl2.gl.clear(this.webgl2.gl.COLOR_BUFFER_BIT);

    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, paramsFrameBuffer.ts[0]);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE1);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, paramsFrameBuffer.ts[1]);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.boidsProgram.uniLocations.velocityTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.boidsProgram.uniLocations.positionTexture, 1);
    this.webgl2.gl.uniform2fv(this.webgl2.webglPrograms.boidsProgram.uniLocations.paramsResolution, paramsResolution);
    this.webgl2.gl.uniformMatrix4fv(this.webgl2.webglPrograms.boidsProgram.uniLocations.mMatrix, false, mMatrix);
    this.webgl2.gl.uniformMatrix4fv(this.webgl2.webglPrograms.boidsProgram.uniLocations.vpMatrix, false, vpMatrix);
    this.webgl2.gl.uniform3fv(this.webgl2.webglPrograms.boidsProgram.uniLocations.simAreaSize, simAreaSize);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.boidsProgram.uniLocations.instanceNum, instanceNum);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.boidsProgram.uniLocations.time, time);
    this.webgl2.gl.drawElementsInstanced(this.webgl2.gl.TRIANGLES, this.modelVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0, this.instanceNum);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
