struct FragmentInput {
  @location(0) vertexColor : vec4<f32>
};

struct FragmentOutput {
  @location(0) fragmentColor : vec4<f32>
}

@fragment
fn main(input : FragmentInput) -> FragmentOutput {
  var output : FragmentOutput;
  output.fragmentColor = input.vertexColor;
  return output;
}