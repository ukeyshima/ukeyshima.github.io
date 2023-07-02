class Matrix4x4 {
  static identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

  static multiply(a, b) {
    return [
      a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
      a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
      a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
      a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],

      a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
      a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
      a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
      a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],

      a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
      a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
      a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
      a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],

      a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
      a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
      a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
      a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15],
    ];
  }

  static transpose(a) {
    return [a[0], a[4], a[8], a[12], a[1], a[5], a[9], a[13], a[2], a[6], a[10], a[14], a[3], a[7], a[11], a[15]];
  }

  static translate(v) {
    return [1, 0, 0, v[0], 0, 1, 0, v[1], 0, 0, 1, v[2], 0, 0, 0, 1];
  }

  static scale(s) {
    return [s[0], 0, 0, 0, 0, s[1], 0, 0, 0, 0, s[2], 0, 0, 0, 0, 1];
  }

  static rotationX(t) {
    return [1, 0, 0, 0, 0, Math.cos((t * Math.PI) / 180), -Math.sin((t * Math.PI) / 180), 0, 0, Math.sin((t * Math.PI) / 180), Math.cos((t * Math.PI) / 180), 0, 0, 0, 0, 1];
  }

  static rotationY(t) {
    return [Math.cos((t * Math.PI) / 180), 0, Math.sin((t * Math.PI) / 180), 0, 0, 1, 0, 0, -Math.sin((t * Math.PI) / 180), 0, Math.cos((t * Math.PI) / 180), 0, 0, 0, 0, 1];
  }

  static rotationZ(t) {
    return [Math.cos((t * Math.PI) / 180), -Math.sin((t * Math.PI) / 180), 0, 0, Math.sin((t * Math.PI) / 180), Math.cos((t * Math.PI) / 180), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  static lookAt(at, target, up) {
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[0] * b[2] - a[2] * b[0], a[0] * b[1] - a[1] * b[0]];
    const length = (a) => Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
    const normalize = (a) => [a[0] / length(a), a[1] / length(a), a[2] / length(a)];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

    const zAxis = normalize([target[0] - at[0], target[1] - at[1], target[2] - at[2]]);
    const xAxis = normalize(cross(up, zAxis));
    const yAxis = normalize(cross(xAxis, zAxis));

    return [xAxis[0], xAxis[1], xAxis[2], dot(xAxis, at), yAxis[0], yAxis[1], yAxis[2], dot(yAxis, at), zAxis[0], zAxis[1], zAxis[2], dot(zAxis, at), 0, 0, 0, 1];
  }

  static orthographic(height, aspect, near, far) {
    const right = height * aspect;
    const left = -height * aspect;
    const top = height;
    const bottom = -height;

    return [2 / (right - left), 0, 0, -(right + left) / (right - left), 0, 2 / (top - bottom), 0, -(top + bottom) / (top - bottom), 0, 0, -2 / (far - near), -(far + near) / (far - near), 0, 0, 0, 1];
  }

  static perspective(fov, aspect, near, far) {
    const f = Math.tan((fov * Math.PI) / 180 / 2);

    return [1 / (aspect * f), 0, 0, 0, 0, 1 / f, 0, 0, 0, 0, -(far + near) / (far - near), -(2 * far * near) / (far - near), 0, 0, -1, 0];
  }
}
