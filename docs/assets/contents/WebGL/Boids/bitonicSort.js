class BitonicSort {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['indexTexture', 'velocityTexture', 'positionTexture', 'resolution', 'mainBlockStep', 'subBlockStep'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'bitonicSortProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = webgl2.createVAO(
      Object.keys(webgl2.webglPrograms.bitonicSortProgram.attLocations).map((key) => webgl2.webglPrograms.bitonicSortProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(indexFrameBufferRead, indexFrameBufferWrite, resolution, instanceNum) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.bitonicSortProgram.program);
    for (let i = 0; i < Math.log2(instanceNum); i++) {
      for (let j = 0; j <= i; j++) {
        this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, indexFrameBufferWrite.f);
        this.webgl2.gl.bindVertexArray(this.vao);
        this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
        this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, indexFrameBufferRead.t);
        this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.bitonicSortProgram.uniLocations.indexTexture, 0);
        this.webgl2.gl.uniform2fv(this.webgl2.webglPrograms.bitonicSortProgram.uniLocations.resolution, resolution);
        this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.bitonicSortProgram.uniLocations.mainBlockStep, i);
        this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.bitonicSortProgram.uniLocations.subBlockStep, j);
        this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
        this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);

        [indexFrameBufferRead, indexFrameBufferWrite] = [indexFrameBufferWrite, indexFrameBufferRead];
      }
    }
    [indexFrameBufferRead, indexFrameBufferWrite] = [indexFrameBufferWrite, indexFrameBufferRead];
  }
}
