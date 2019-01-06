(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{1037:function(e,t){e.exports=function(){return["#version 300 es","layout (location=0)in vec3 position;","layout (location=1)in vec3 doubleAccel;","layout (location=2)in float number;","layout (location=3)in vec3 velocity; ","layout (location=4)in float existenceFrame;","layout (location=5)in vec3 accel;","uniform float pointSize;","uniform float frame;","uniform vec2 resolution;","out vec3 outPosition;","out vec3 outVelocity;","out float outExistenceFrame;","out vec3 outAccel;"," float rand(float co){","    return fract(sin(co*32.233) * 75.545);","}","void main(void){","    vec3 p=position.xyz;","   if(p.x>1.0||p.x<-1.0||p.y>1.0){","        vec3 a=vec3(0.0);","        a.x=doubleAccel.x>0.0?(-0.0018-(rand(number*0.01)*0.0001)):(0.0018+(rand(number*0.01)*0.0001));","        a.z=doubleAccel.z>0.0?(-0.0018-(rand(number*0.03)*0.0001)):(0.0018+(rand(number*0.03)*0.0001));","        outAccel=a;","        outExistenceFrame=0.0;","        vec3 v=vec3(0.0);","        v.x=a.x<0.0?0.048-(rand(number*0.02)*0.04):-0.048+(rand(number*0.02)*0.04);","        v.y=0.03-rand(number*0.01)*0.02;","        v.z=a.z<0.0?0.048-(rand(number*0.04)*0.04):-0.048+(rand(number*0.04)*0.04);","        outVelocity=v;","        outPosition=vec3((rand(number*0.06)*2.0-1.0)*0.1,-0.8+(rand(number*0.05)*2.0-1.0)*0.1,(rand(number*0.06)*2.0-1.0)*0.1);","    }else{","        outExistenceFrame=existenceFrame+1.0;","        outAccel=accel+doubleAccel;","        outVelocity=velocity+outAccel;","        outPosition=position+outVelocity;","    }","    gl_Position=vec4(outPosition,1.0);","    gl_PointSize=pointSize*rand(number*0.1)+existenceFrame/3.0;","}"].join("\n")}},1038:function(e,t){e.exports=function(){return["#version 300 es","    precision highp float;","    uniform vec2 resolution;","    uniform float frame;","    uniform sampler2D tex;","    out vec4 outColor;","    in float outExistenceFrame;","    in vec3 outPosition;","float rand(float co){","    return fract(sin(co*78.233) * 435.5453);","}","void main(void){","    vec2 p=(gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);","    vec4 smpColor=texture(tex, gl_PointCoord);","    smpColor.g=4.0*sqrt(0.001-pow(outPosition.x,2.0)*pow(outPosition.y+0.9,2.0));","    smpColor*=outExistenceFrame/20.0;","    smpColor.a*=1.0-outExistenceFrame/50.0;","    smpColor.a*=4.0*sqrt(0.5-pow(outPosition.x,2.0));","    if(smpColor.a==0.0)discard;","    else outColor=smpColor+rand(p.y*frame)*0.2;","}"].join("\n")}},1039:function(e,t,n){var r,o=0,a=n(1040);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(t.locals=a.locals),t.use=t.ref=function(){return o++||(r=n(62)(a,{hmr:!0})),t},t.unuse=t.unref=function(){o>0&&!--o&&(r(),r=null)}},1040:function(e,t,n){(e.exports=n(61)(!1)).push([e.i,"body {\n  margin: 0;\n  padding: 0;\n  overflow: hidden; }\n\n#root {\n  font-size: 0; }\n",""])},164:function(e,t,n){"use strict";n.r(t);n(8),n(9),n(10);var r=n(0),o=n.n(r),a=(n(94),n(213),n(37),n(92),n(93),n(1037)),i=n.n(a),u=n(1038),c=n.n(u);function f(e){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(){return(l=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function d(e,t){return!t||"object"!==f(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function b(e){return(b=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var m=function(e,t,n,r){var o=function(e,n){var r=t.createShader(n);if(t.shaderSource(r,e),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS))return r;alert(t.getShaderInfoLog(r)),console.log(t.getShaderInfoLog(r))},a=function(e){var n=t.createBuffer();return t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array(e),t.DYNAMIC_COPY),t.bindBuffer(t.ARRAY_BUFFER,null),n},i=function(e,n){var r=t.createProgram();return t.attachShader(r,e),t.attachShader(r,n),t.transformFeedbackVaryings(r,["outPosition","outVelocity","outExistenceFrame","outAccel"],t.SEPARATE_ATTRIBS),t.linkProgram(r),t.getProgramParameter(r,t.LINK_STATUS)?(t.useProgram(r),r):null}(o(n,t.VERTEX_SHADER),o(r,t.FRAGMENT_SHADER)),u=[];u[0]=t.getUniformLocation(i,"pointSize"),u[1]=t.getUniformLocation(i,"frame"),u[2]=t.getUniformLocation(i,"resolution");for(var c=new Array(3e3).fill(0),f=[],l=[],s=new Array(3e3).fill(0),d=new Array(3e3).fill(0),b=new Array(1e3).fill(0),h=0;h<1e3;h++)l[h]=h,f[3*h]=Math.random()>.5?258e-7-1e-6*Math.random():1e-6*Math.random()-258e-7,f[3*h+1]=5e-5*Math.random(),f[3*h+2]=Math.random()>.5?258e-7-1e-6*Math.random():1e-6*Math.random()-258e-7;var m=[],p=[],E=a(c);m[0]=t.getAttribLocation(i,"position"),p[0]=3;var v=a(f);m[1]=t.getAttribLocation(i,"doubleAccel"),p[1]=3;var R=a(l);m[2]=t.getAttribLocation(i,"number"),p[2]=1;var A=a(s);m[3]=t.getAttribLocation(i,"velocity"),p[3]=3;var F=a(b);m[4]=t.getAttribLocation(i,"existenceFrame"),p[4]=1;var y=a(d);m[5]=t.getAttribLocation(i,"accel"),p[5]=3;var _,B=[t.createBuffer(),t.createBuffer(),t.createBuffer(),t.createBuffer()],g=[t.createTransformFeedback(),t.createTransformFeedback(),t.createTransformFeedback(),t.createTransformFeedback()];t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,g[0]),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,g[1]),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,g[2]),t.bindTransformFeedback(t.TRANSFORM_FEEDBACK,g[3]),t.bindBuffer(t.ARRAY_BUFFER,B[0]),t.bufferData(t.ARRAY_BUFFER,3*Float32Array.BYTES_PER_ELEMENT*1e3,t.DYNAMIC_COPY),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBuffer(t.ARRAY_BUFFER,B[1]),t.bufferData(t.ARRAY_BUFFER,3*Float32Array.BYTES_PER_ELEMENT*1e3,t.DYNAMIC_COPY),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBuffer(t.ARRAY_BUFFER,B[2]),t.bufferData(t.ARRAY_BUFFER,1e3*Float32Array.BYTES_PER_ELEMENT,t.DYNAMIC_COPY),t.bindBuffer(t.ARRAY_BUFFER,null),t.bindBuffer(t.ARRAY_BUFFER,B[3]),t.bufferData(t.ARRAY_BUFFER,3*Float32Array.BYTES_PER_ELEMENT*1e3,t.DYNAMIC_COPY),t.bindBuffer(t.ARRAY_BUFFER,null),t.activeTexture(t.TEXTURE0),function(){var e=document.createElement("canvas");e.width=300,e.height=300;var n=e.getContext("2d");n.beginPath();var r=n.createRadialGradient(e.width/2,e.height/2,0,e.width/2,e.height/2,e.width/2);r.addColorStop(0,"rgba(255,10,0,0.8)"),r.addColorStop(.5,"rgba(200,100,0,0.2)"),r.addColorStop(.9,"rgba(100,100,000,0.1)"),r.addColorStop(1,"rgba(255,255,255,0.0)"),n.fillStyle=r,n.arc(e.width/2,e.height/2,e.width/2,0,2*Math.PI,!1),n.fill();var o=new Image;o.addEventListener("load",function(){var e=t.createTexture();t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,e),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,o),t.generateMipmap(t.TEXTURE_2D),t.bindTexture(t.TEXTURE_2D,null),_=e}),o.src=e.toDataURL("image/png",1)}(),t.enable(t.BLEND),t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE),t.clearColor(242/255,242/255,232/255,1);var T=0;return function(){var n,r;t.clear(t.COLOR_BUFFER_BIT),t.bindTexture(t.TEXTURE_2D,_),t.uniform1f(u[0],10+(e.width-150)/50),t.uniform1f(u[1],T),t.uniform2fv(u[2],[e.width,e.height]),n=m,r=p,[E,v,R,A,F,y].forEach(function(e,o,a){t.bindBuffer(t.ARRAY_BUFFER,e),t.enableVertexAttribArray(n[o]),t.vertexAttribPointer(n[o],r[o],t.FLOAT,!1,0,0)}),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,B[0]),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,1,B[1]),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,2,B[2]),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,3,B[3]),t.beginTransformFeedback(t.POINTS),t.drawArrays(t.POINTS,0,1e3),t.endTransformFeedback(),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,0,null),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,1,null),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,2,null),t.bindBufferBase(t.TRANSFORM_FEEDBACK_BUFFER,3,null);var o=E;E=B[0],B[0]=o;var a=A;A=B[1],B[1]=a;var i=F;F=B[2],B[2]=i;var c=y;y=B[3],B[3]=c,t.flush(),T++}},p=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=d(this,b(t).call(this,e))).requestId=0,n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(t,o.a.Component),n=t,(r=[{key:"componentDidMount",value:function(){this.updateCanvas()}},{key:"componentWillUnmount",value:function(){cancelAnimationFrame(this.requestId)}},{key:"updateCanvas",value:function(){var e=this;this.canvas.width=this.props.style.width,this.canvas.height=this.props.style.height,this.gl=this.canvas.getContext("webgl2");var t=m(this.canvas,this.gl,i()(),c()());!function n(){t(),e.requestId=requestAnimationFrame(n)}()}},{key:"handleResize",value:function(e,t){this.canvas.width=e,this.canvas.height=t,this.gl.viewport(0,0,e,t)}},{key:"render",value:function(){var e=this;return o.a.createElement("canvas",l({},this.props,{ref:function(t){e.canvas=t}}))}}])&&s(n.prototype,r),a&&s(n,a),t}(),E=n(1039),v=n.n(E);function R(e){return(R="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function A(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function F(e,t){return!t||"object"!==R(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _(e,t){return(_=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}n.d(t,"default",function(){return B});var B=function(e){function t(e){var n;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),(n=F(this,y(t).call(this,e))).state={width:window.innerWidth,height:window.innerHeight},n}var n,r,a;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_(e,t)}(t,o.a.Component),n=t,(r=[{key:"componentDidMount",value:function(){v.a.use(),this.tempHandleResize=this.handleResize.bind(this),window.addEventListener("resize",this.tempHandleResize)}},{key:"componentWillUnmount",value:function(){v.a.unuse(),window.removeEventListener("resize",this.tempHandleResize)}},{key:"handleResize",value:function(e){var t=e.target.innerWidth,n=e.target.innerHeight;this.refs.createCanvas.handleResize(t,n),this.setState({width:t,height:n})}},{key:"render",value:function(){return o.a.createElement(p,{ref:"createCanvas",style:{width:this.state.width,height:this.state.height}})}}])&&A(n.prototype,r),a&&A(n,a),t}()},213:function(e,t,n){var r=n(20);r(r.P,"Array",{fill:n(66)}),n(95)("fill")}}]);