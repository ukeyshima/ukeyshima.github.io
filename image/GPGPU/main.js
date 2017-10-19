window.onload=function(){
    let c=document.createElement("canvas");
    let gl=c.getContext("webgl2");
    let result="1.0";
    for(let i=0;i<1000000;i++){
    result+="*1.0";
    }
    result="4.3";
    function calculate(){
        let script="#version 300 es \n out float result;void main(void){ result="+result+";}";
        let vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, script);
        gl.compileShader(vertexShader);
       /* if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
            alert("vertexShader:"+gl.getShaderInfoLog(vertexShader));
            console.log(gl.getShaderInfoLog(vertexShader));
        }*/
        script="#version 300 es \n void main(void){}";
        let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, script);
        gl.compileShader(fragmentShader);
     /*   if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
            alert("fragmentShader:"+gl.getShaderInfoLog(fragmentShader));
            console.log(gl.getShaderInfoLog(fragmentShader));
        }*/
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.transformFeedbackVaryings(program, ["result"], gl.SEPARATE_ATTRIBS);
        gl.linkProgram(program);
        gl.useProgram(program);
      /*  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
        } else {
            alert("program_error");
        }*/
        const vTransformFeedback = gl.createBuffer();
        const transformFeedback = gl.createTransformFeedback();
    
        gl.bindBuffer(gl.ARRAY_BUFFER, vTransformFeedback);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT, gl.DYNAMIC_COPY);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindTransformFeedback(gl.TRANSFORM_FEEDBACK, transformFeedback);
        gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, vTransformFeedback);
        gl.beginTransformFeedback(gl.POINTS);
        gl.drawArrays(gl.POINTS, 0, 1);
        gl.endTransformFeedback();
        //gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
        var arrBuffer = new ArrayBuffer( Float32Array.BYTES_PER_ELEMENT);
        arrBuffer=new Float32Array(arrBuffer);
        gl.getBufferSubData(gl.TRANSFORM_FEEDBACK_BUFFER, 0, arrBuffer);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return arrBuffer[0];
    }
    function calculate2(){
        return eval(result);
    }
  //  console.log(result);
    let start=new Date().getTime();
    console.log(calculate());
    console.log(new Date().getTime()-start);
    start=new Date().getTime();
    console.log(calculate2());
    console.log(new Date().getTime()-start);
}