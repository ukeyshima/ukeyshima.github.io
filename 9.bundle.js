(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{169:function(e,t,n){"use strict";n.r(t);n(4),n(5),n(6);var o=n(0),r=n.n(o),i=(n(23),n(440)),u=n.n(i),a=n(443),p=n.n(a);function c(e){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function l(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e,t){return!t||"object"!==c(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function f(e){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e,t){return(d=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var h,y=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),s(this,f(t).apply(this,arguments))}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&d(e,t)}(t,r.a.Component),n=t,(o=[{key:"render",value:function(){return r.a.createElement("div",{style:{height:37,padding:5,margin:10}},r.a.createElement("div",{style:{margin:"auto",width:140,height:37}},r.a.createElement("div",{style:{backgroundImage:"url(".concat(p.a,")"),width:37,height:37,backgroundSize:"cover",float:"left"}}),r.a.createElement("div",{style:{fontSize:25,margin:"0 0 0 15px",float:"left"}},"BillBill")))}}])&&l(n.prototype,o),i&&l(n,i),t}(),b=n(12),m=n(200);function g(e){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function w(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function v(e,t){return!t||"object"!==g(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function O(e){return(O=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function E(e,t){return(E=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var S,j=Object(b.b)(function(e,t){var n=e.state;return{updateGroupeNum:n.updateGroupeNum,groupe:n.groupes[t.num],removeGroupe:n.removeGroupe,calculate:n.calculate}})(h=Object(b.c)(h=function(e){function t(){var e,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,r=new Array(o),i=0;i<o;i++)r[i]=arguments[i];return(n=v(this,(e=O(t)).call.apply(e,[this].concat(r)))).handleChange=function(e){n.props.updateGroupeNum(n.props.num,Math.floor(e.target.value)),n.props.calculate()},n.handleClick=function(){n.props.removeGroupe(n.props.num),n.props.calculate()},n}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&E(e,t)}(t,r.a.Component),n=t,(o=[{key:"render",value:function(){return r.a.createElement("div",null,r.a.createElement(m.FaMinusSquare,{onClick:this.handleClick,style:{float:"left",color:"rgb(175,254,255)",margin:5,width:14,height:14}}),r.a.createElement("div",{style:{float:"left"}},"グループ".concat(this.props.num+1)),r.a.createElement("div",null,": ".concat(this.props.groupe.bill,"円")),r.a.createElement("div",null,r.a.createElement("input",{pattern:"\\d*",type:"number",style:{textAlign:"right",width:83.5,margin:"0 0 0 24px"},onChange:this.handleChange,value:this.props.groupe.num}),"人"))}}])&&w(n.prototype,o),i&&w(n,i),t}())||h)||h;function x(e){return(x="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function k(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function P(e,t){return!t||"object"!==x(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function z(e){return(z=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function _(e,t){return(_=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var R,M=Object(b.b)(function(e,t){var n=e.state;return{groupes:n.groupes,windowSize:n.windowSize,updateGroupeRate:n.updateGroupeRate,calculate:n.calculate,rateBox:n.rateBox}})(S=Object(b.c)(S=function(e){function t(){var e,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,r=new Array(o),i=0;i<o;i++)r[i]=arguments[i];return(n=P(this,(e=z(t)).call.apply(e,[this].concat(r)))).handleMouseDown=function(e){n.frontElement=document.getElementById("rate".concat(n.props.num-1)),n.frontElementBoundingRect=n.frontElement.getBoundingClientRect(),n.currentElement=document.getElementById("rate".concat(n.props.num)),n.currentElementBoundingRect=n.currentElement.getBoundingClientRect(),n.barStartX="changedTouches"in e?e.changedTouches[0].pageX:e.pageX,n.rate=n.props.rate,n.frontRate=n.props.groupes[n.props.num-1].rate,window.addEventListener("mousemove",n.handleMouseMoveOrTouchMove),window.addEventListener("mouseup",n.handleMouseUpOrTouchEnd),window.addEventListener("touchmove",n.handleMouseMoveOrTouchMove),window.addEventListener("touchend",n.handleMouseUpOrTouchEnd)},n.handleMouseMoveOrTouchMove=function(e){var t="changedTouches"in e?e.changedTouches[0].pageX:e.pageX;if(t>n.frontElementBoundingRect.left+2&&t<n.currentElementBoundingRect.right){var o=(t-n.barStartX)/(n.props.windowSize.width-70-n.props.groupes.length-1);n.props.updateGroupeRate(n.props.num-1,n.frontRate+o),n.props.updateGroupeRate(n.props.num,n.rate-o),n.props.calculate()}},n.handleMouseUpOrTouchEnd=function(){window.removeEventListener("mousemove",n.handleMouseMoveOrTouchMove),window.removeEventListener("mouseup",n.handleMouseUpOrTouchEnd),window.removeEventListener("touchmove",n.handleMouseMoveOrTouchMove),window.removeEventListener("touchend",n.handleMouseUpOrTouchEnd)},n}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&_(e,t)}(t,r.a.Component),n=t,(o=[{key:"render",value:function(){var e=this;return r.a.createElement(r.a.Fragment,null,0!==this.props.num&&r.a.createElement("div",{style:{float:"left",width:1,height:38,cursor:"col-resize"}}),0!==this.props.num&&r.a.createElement("div",{id:"inVisibleBar".concat(this.props.num),onMouseDown:this.handleMouseDown,onTouchStart:this.handleMouseDown,style:{position:"absolute",left:this.props.rateBox.getBoundingClientRect().left+this.props.groupes.slice(0,this.props.num).reduce(function(t,n){return t+n.rate*(e.props.windowSize.width-70-e.props.groupes.length-1)},0)-15,width:31,height:38,backgroundColor:"rgba(0,0,0,0)",cursor:"col-resize"}}),r.a.createElement("div",{id:"rate".concat(this.props.num),style:{backgroundColor:"rgb(".concat(Math.floor(175-this.props.num/this.props.groupes.length*19),",").concat(Math.floor(254-this.props.num/this.props.groupes.length*96),",").concat(Math.floor(255-this.props.num/this.props.groupes.length*10),")"),float:"left",width:(this.props.windowSize.width-70-this.props.groupes.length-1)*this.props.rate,height:38}}))}}])&&k(n.prototype,o),i&&k(n,i),t}())||S)||S;function T(e){return(T="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function C(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function G(e,t){return!t||"object"!==T(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function B(e){return(B=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function A(e,t){return(A=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var D,L,W,U,N,X,F,I,q,H,J,V,$,K,Q,Y=Object(b.b)(function(e){var t=e.state;return{totalAmount:t.totalAmount,updateTotalAmount:t.updateTotalAmount,groupes:t.groupes,addGroupe:t.addGroupe,updateWindowSize:t.updateWindowSize,windowSize:t.windowSize,calculate:t.calculate,change:t.change,updateRateBox:t.updateRateBox}})(R=Object(b.c)(R=function(e){function t(){var e,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,r=new Array(o),i=0;i<o;i++)r[i]=arguments[i];return(n=G(this,(e=B(t)).call.apply(e,[this].concat(r)))).windowResize=function(){n.props.updateWindowSize(window.innerWidth,window.innerHeiight)},n.addGroupe=function(){n.props.addGroupe()},n.totalAmountUpdate=function(e){n.props.updateTotalAmount(Math.floor(e.target.value)),n.props.calculate()},n}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&A(e,t)}(t,r.a.Component),n=t,(o=[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.windowResize),this.props.calculate(),this.props.updateRateBox(this.rateBox)}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.windowResize)}},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement("div",{style:{height:50,margin:10}},r.a.createElement(m.FaPlusSquare,{onClick:this.addGroupe,style:{margin:"5px 5px 5px 0",borderRadius:5,boxShadow:"5px 5px 20px #bbb",float:"left",height:40,width:40,textAlign:"center"}}),r.a.createElement("div",{ref:function(t){return e.rateBox=t},style:{margin:"5px 0 5px 5px",backgroundColor:"#fff",width:this.props.windowSize.width-72,height:38,float:"left",boxShadow:"5px 5px 20px #bbb",padding:1}},this.props.groupes.map(function(e,t){return r.a.createElement(M,{key:t,num:t,rate:e.rate})}))),r.a.createElement("div",{style:{margin:10,backgroundColor:"#fff",color:"#000",borderRadius:5,padding:10,boxShadow:"5px 5px 20px #bbb"}},r.a.createElement("div",{style:{margin:"0 0 0 24px"}},"総額"),r.a.createElement("div",null,r.a.createElement("input",{pattern:"\\d*",type:"number",onChange:this.totalAmountUpdate,value:this.props.totalAmount,style:{width:83.5,margin:"0 0 0 24px",textAlign:"right"}}),"円"),this.props.groupes.map(function(e,t){return r.a.createElement(j,{key:t,num:t})}),r.a.createElement("div",null,r.a.createElement("div",{style:{margin:"0 0 0 24px"}},"お釣り: ",this.props.change,"円"))))}}])&&C(n.prototype,o),i&&C(n,i),t}())||R)||R,Z=(n(34),n(96),n(33),n(1)),ee=n(248),te=n.n(ee);function ne(e,t,n,o){n&&Object.defineProperty(e,t,{enumerable:n.enumerable,configurable:n.configurable,writable:n.writable,value:n.initializer?n.initializer.call(o):void 0})}function oe(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function re(e,t,n,o,r){var i={};return Object.keys(o).forEach(function(e){i[e]=o[e]}),i.enumerable=!!i.enumerable,i.configurable=!!i.configurable,("value"in i||i.initializer)&&(i.writable=!0),i=n.slice().reverse().reduce(function(n,o){return o(e,t,n)||n},i),r&&void 0!==i.initializer&&(i.value=i.initializer?i.initializer.call(r):void 0,i.initializer=void 0),void 0===i.initializer&&(Object.defineProperty(e,t,i),i=null),i}var ie=(D=Z.d.bound,L=Z.d.bound,W=Z.d.bound,U=Z.d.bound,N=Z.d.bound,X=Z.d.bound,F=Z.d.bound,I=Z.d.bound,q=Z.d.bound,J=re((H=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),ne(this,"windowSize",J,this),ne(this,"groupes",V,this),ne(this,"rateBox",$,this),ne(this,"totalAmount",K,this),ne(this,"change",Q,this)}var t,n,o;return t=e,(n=[{key:"updateWindowSize",value:function(e,t){this.windowSize.width=e,this.windowSize.height=t}},{key:"updateGroupeNum",value:function(e,t){this.groupes[e].num=t}},{key:"updateGroupeRate",value:function(e,t){this.groupes[e].rate=t}},{key:"addGroupe",value:function(){var e=this.groupes.length,t=this.groupes[e-1];this.groupes[e-1].rate=t.rate/2,this.groupes.push({rate:t.rate,num:1,bill:0})}},{key:"updateRateBox",value:function(e){this.rateBox=e}},{key:"updateTotalAmount",value:function(e){this.totalAmount=e}},{key:"updateChange",value:function(e){this.change=e}},{key:"removeGroupe",value:function(e){this.groupes.length>1&&(0===e?this.groupes[e+1].rate+=this.groupes[e].rate:this.groupes[e-1].rate+=this.groupes[e].rate,this.groupes=this.groupes.filter(function(t,n){return n!==e}))}},{key:"calculate",value:function(){var e=this.groupes.map(function(e){return e.num}),t=this.groupes.map(function(e){return e.rate}),n=this.totalAmount/e.reduce(function(e,n,o){return e+n*t[o]},0),o=t.map(function(e){return e*n}),r=o.map(function(e){var t=[];return t[0]=-e%100,t[1]=100+t[0],t}),i=e.reduce(function(e,t,n){var o=[];return e.forEach(function(e){r[n].forEach(function(n){var r=te.a.cloneDeep(e.frac);r.push(n),o.push({res:e.res+t*n,frac:r})})}),o},[{res:0,frac:[]}]).filter(function(e){return e.res>=0}),u=i.reduce(function(e,t){return e.res>t.res?t:e},i[0]),a=0;this.groupes.forEach(function(e,t){e.bill=u.frac[t]+o[t],a+=e.bill*e.num}),this.updateChange(a-this.totalAmount)}}])&&oe(t.prototype,n),o&&oe(t,o),e}()).prototype,"windowSize",[Z.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return{width:window.innerWidth,feight:window.innerHeight}}}),re(H.prototype,"updateWindowSize",[D],Object.getOwnPropertyDescriptor(H.prototype,"updateWindowSize"),H.prototype),V=re(H.prototype,"groupes",[Z.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return[{rate:.7,num:1,bill:0},{rate:.3,num:1,bill:0}]}}),re(H.prototype,"updateGroupeNum",[L],Object.getOwnPropertyDescriptor(H.prototype,"updateGroupeNum"),H.prototype),re(H.prototype,"updateGroupeRate",[W],Object.getOwnPropertyDescriptor(H.prototype,"updateGroupeRate"),H.prototype),re(H.prototype,"addGroupe",[U],Object.getOwnPropertyDescriptor(H.prototype,"addGroupe"),H.prototype),$=re(H.prototype,"rateBox",[Z.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return document.createElement("div")}}),re(H.prototype,"updateRateBox",[N],Object.getOwnPropertyDescriptor(H.prototype,"updateRateBox"),H.prototype),K=re(H.prototype,"totalAmount",[Z.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),re(H.prototype,"updateTotalAmount",[X],Object.getOwnPropertyDescriptor(H.prototype,"updateTotalAmount"),H.prototype),Q=re(H.prototype,"change",[Z.n],{configurable:!0,enumerable:!0,writable:!0,initializer:function(){return 0}}),re(H.prototype,"updateChange",[F],Object.getOwnPropertyDescriptor(H.prototype,"updateChange"),H.prototype),re(H.prototype,"removeGroupe",[I],Object.getOwnPropertyDescriptor(H.prototype,"removeGroupe"),H.prototype),re(H.prototype,"calculate",[q],Object.getOwnPropertyDescriptor(H.prototype,"calculate"),H.prototype),H);function ue(e){return(ue="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function ae(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function pe(e,t){return!t||"object"!==ue(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}function ce(e){return(ce=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function le(e,t){return(le=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}n.d(t,"default",function(){return fe});var se={state:new ie},fe=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),pe(this,ce(t).apply(this,arguments))}var n,o,i;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&le(e,t)}(t,r.a.Component),n=t,(o=[{key:"componentDidMount",value:function(){u.a.use()}},{key:"componentWillUnmount",value:function(){u.a.unuse()}},{key:"render",value:function(){return r.a.createElement(b.a,se,r.a.createElement(r.a.Fragment,null,r.a.createElement(y,null),r.a.createElement(Y,null)))}}])&&ae(n.prototype,o),i&&ae(n,i),t}()},296:function(e,t,n){"use strict";e.exports=function(e,t){return"string"!=typeof e?e:(/^['"].*['"]$/.test(e)&&(e=e.slice(1,-1)),/["'() \t\n]/.test(e)||t?'"'+e.replace(/"/g,'\\"').replace(/\n/g,"\\n")+'"':e)}},297:function(e,t){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},440:function(e,t,n){var o,r=0,i=n(441),u={hmr:!0};u.insertInto=void 0,"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(t.locals=i.locals),t.use=t.ref=function(){return r++||(o=n(60)(i,u)),t},t.unuse=t.unref=function(){r>0&&!--r&&(o(),o=null)}},441:function(e,t,n){t=e.exports=n(59)(!1);var o=n(296)(n(442));t.push([e.i,"html {\n  background: linear-gradient(135deg, #affeff, #9c9ef5);\n  height: 100%; }\n\n@font-face {\n  font-family: Regular;\n  src: url("+o+"); }\n\nbody {\n  font-family: Regular;\n  color: #fff;\n  margin: 0; }\n",""])},442:function(e,t,n){e.exports=n.p+"7ed4b9a7daaf1d1c71903a92059434fb.otf"},443:function(e,t,n){e.exports=n.p+"d1d977f8e175ec08a04de4c3c1ae67ed.png"}}]);