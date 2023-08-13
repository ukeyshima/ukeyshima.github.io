struct VertexInput {
  @location(0) position : vec3<f32>,
  @location(1) color : vec3<f32>
};

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) vertexColor : vec4<f32>
};

@vertex
fn main(input : VertexInput) -> VertexOutput {
  var output : VertexOutput;
  output.Position = vec4<f32>(input.position, 1.0);
  output.vertexColor = vec4<f32>(input.color, 1.0);
  return output;
}