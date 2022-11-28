class Rendering {
  constructor(webgl2, frag) {
    this.webgl2 = webgl2;

    const uniList = ['tex', 'resolution', 'time'];
    const attList = [{ array: WebGL2.planeVertexPosition, location: 'position', stride: 3 }];

    this.webgl2.addPrograms([
      {
        name: 'renderingProgram',
        vsText: WebGL2.defaultVertexShader,
        fsText: frag,
        uniList: uniList,
        attList: attList,
      },
    ]);

    this.vao = this.webgl2.createVAO(
      Object.keys(this.webgl2.webglPrograms.renderingProgram.attLocations).map((key) => this.webgl2.webglPrograms.renderingProgram.attLocations[key]),
      [],
      WebGL2.planeVertexIndex
    );
  }

  execute(inputFrameBuffer, resolution, time) {
    this.webgl2.gl.useProgram(this.webgl2.webglPrograms.renderingProgram.program);
    this.webgl2.gl.bindVertexArray(this.vao);
    this.webgl2.gl.activeTexture(this.webgl2.gl.TEXTURE0);
    this.webgl2.gl.bindTexture(this.webgl2.gl.TEXTURE_2D, inputFrameBuffer.ts[0]);
    this.webgl2.gl.uniform1i(this.webgl2.webglPrograms.renderingProgram.uniLocations.tex, 0);
    this.webgl2.gl.uniform2fv(this.webgl2.webglPrograms.renderingProgram.uniLocations.resolution, resolution);
    this.webgl2.gl.uniform1f(this.webgl2.webglPrograms.renderingProgram.uniLocations.time, time);
    this.webgl2.gl.drawElements(this.webgl2.gl.TRIANGLES, WebGL2.planeVertexIndex.length, this.webgl2.gl.UNSIGNED_SHORT, 0);

    this.webgl2.gl.flush();
  }
}
