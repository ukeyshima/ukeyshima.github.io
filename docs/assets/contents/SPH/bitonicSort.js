class BitonicSort {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['indexTexture', 'inc', 'dir'];
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

  execute(indexFrameBuffer, N) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.bitonicSortProgram.program);
    let inc = 0;
    for (let i = 0; i < N; i++) {
      inc = 1 << i;
      for (let j = 0; j <= i; j++) {
        this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, indexFrameBuffer.write.f);
        this.webgl2.gl.bindVertexArray(this.vao);
        this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
        this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, indexFrameBuffer.read.t);
        this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.bitonicSortProgram.uniLocations.indexTexture, 0);
        this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.bitonicSortProgram.uniLocations.inc, inc);
        this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.bitonicSortProgram.uniLocations.dir, 2 << i);
        this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);
        this.webgl2.gl.bindFramebuffer(this.webgl2.gl.FRAMEBUFFER, null);
        inc = inc >> 1;
        [indexFrameBuffer.read, indexFrameBuffer.write] = [indexFrameBuffer.write, indexFrameBuffer.read];
      }
    }
  }
}
