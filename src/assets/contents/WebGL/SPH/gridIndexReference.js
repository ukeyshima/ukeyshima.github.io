class GridIndexReference {
  constructor(webgl2, frag, vert, instanceNum) {
    this.webgl2 = webgl2;
    this.instanceNum = instanceNum;

    const uniList = ['gridIndexTexture', 'resolution', 'instanceNum'];
    const attList = [];

    this.webgl2.addPrograms([
      {
        name: 'gridIndexReferenceProgram',
        vsText: vert,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = this.webgl2.createVAO(
      Object.keys(this.webgl2.webglPrograms.gridIndexReferenceProgram.attLocations).map((key) => this.webgl2.webglPrograms.gridIndexReferenceProgram.attLocations[key]),
      [],
      1
    );
  }

  execute(gridIndexReferenceFrameBuffer, gridIndexTexture, resolution) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.gridIndexReferenceProgram.program);
    this.webgl2.gl.disable(this.webgl2.gl.DEPTH_TEST);
    this.webgl2.gl.enable(this.webgl2.gl.BLEND);
    this.webgl2.gl.blendFunc(this.webgl2.gl.ONE, this.webgl2.gl.ONE);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, gridIndexReferenceFrameBuffer);
    this.webgl2.gl.clearBufferfv(this.webgl2.gl.COLOR, 0, [0, 0, 0, 0]);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, gridIndexTexture);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.gridIndexReferenceProgram.uniLocations.gridIndexTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.gridIndexReferenceProgram.uniLocations.instanceNum, this.instanceNum);
    this.webgl2.gl.uniform2iv(this.webgl2.webglPrograms.gridIndexReferenceProgram.uniLocations.resolution, resolution);
    this.webgl2.gl.drawElementsInstanced(this.webgl2.gl.POINTS, 1, this.webgl2.gl.UNSIGNED_SHORT, 0, this.instanceNum);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
    this.webgl2.gl.disable(this.webgl2.gl.BLEND);
    this.webgl2.gl.enable(this.webgl2.gl.DEPTH_TEST);
  }
}
