class GridIndex {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['resolution', 'instanceNum', 'indexResolution', 'indexTexture'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'gridIndexProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.gridIndexProgram.attLocations).map((key) => webgl2.webglPrograms.gridIndexProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(indexFrameBuffer, gridIndexFrameBuffer, resolution, instanceNum, indexResolution) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.gridIndexProgram.program);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, gridIndexFrameBuffer.f);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, indexFrameBuffer.t);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.gridIndexProgram.uniLocations.indexTexture, 0);
    this.webgl2.gl.uniform2fv(this.webgl2.webglPrograms.gridIndexProgram.uniLocations.resolution, resolution);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.gridIndexProgram.uniLocations.instanceNum, instanceNum);
    this.webgl2.gl.uniform2fv(this.webgl2.webglPrograms.gridIndexProgram.uniLocations.indexResolution, indexResolution);
    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
    this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
  }
}
