class Rendering {
  constructor(webgl2, frag, vert, instanceNum) {
    this.webgl2 = webgl2;
    this.instanceNum = instanceNum;

    const uniList = ['positionTexture', 'densityTexture', 'vpMatrix'];
    const attList = [];

    this.webgl2.addPrograms([
      {
        name: 'renderingProgram',
        vsText: vert,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = this.webgl2.createVAO(
      Object.keys(this.webgl2.webglPrograms.renderingProgram.attLocations).map((key) => this.webgl2.webglPrograms.renderingProgram.attLocations[key]),
      [],
      1
    );
  }

  execute(paramsFrameBuffer, densityTexture, vpMatrix) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.renderingProgram.program);
    this.webgl2.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.webgl2.gl.clear(this.webgl2.gl.COLOR_BUFFER_BIT);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, paramsFrameBuffer.ts[1]);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE1);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, densityTexture);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.renderingProgram.uniLocations.positionTexture, 0);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.renderingProgram.uniLocations.densityTexture, 1);
    this.webgl2.gl.uniformMatrix4fv(this.webgl2.webglPrograms.renderingProgram.uniLocations.vpMatrix, false, vpMatrix);
    this.webgl2.gl.drawElementsInstanced(this.webgl2.gl.POINTS, 1, this.webgl2.gl.UNSIGNED_SHORT, 0, this.instanceNum);
  }
}
