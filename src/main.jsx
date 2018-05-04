import "./style/top.scss";
import React from "react";
import ReactDOM from "react-dom";
import CreateCanvas from "./autumn/createCanvas.jsx";
import { BrowserRouter, HashRouter, Route, Link } from "react-router-dom";
import json from "./data/data.json";
const data = (json => {
  return json.webgl.concat(json.webglRayMarching).concat(json.other);
})(json);
import ParticleFlame from "./particleFlame/main.jsx";
import Glitch from "./glitch/main.jsx";
import CameraGlitch from "./cameraGlitch/main.jsx";
import CubeMapping from "./cubeMapping/main.jsx";
import GpgpuCalculator from "./gpgpuCalculator/main.jsx";
import RotationCharacter from "./rotationCharacter/main.jsx";
import Autumn from "./autumn/main.jsx";
import ReflectionBall from "./reflectionBall/main.jsx";
import Cube from "./cube/main.jsx";
import Mountain from "./mountain/main.jsx";
import MandelBox from "./mandelBox/main.jsx";
import RandomizeHeight from "./randomizeHeight/main.jsx";
import RiverRipple from "./riverRipple/main.jsx";
import MonteCarlo from "./monteCarlo/main.jsx";
import UnbreraPaint from "./unbreraPaint/main.jsx";
const component = [
  ParticleFlame,
  Glitch,
  CameraGlitch,
  CubeMapping,
  GpgpuCalculator,
  RotationCharacter,
  Autumn,
  ReflectionBall,
  Cube,
  Mountain,
  MandelBox,
  RandomizeHeight,
  RiverRipple,
  MonteCarlo,
  UnbreraPaint
];
import particleFlameImg from "./image/particleFlame.png";
import glitchImg from "./image/glitch.png";
import cameraGlitchImg from "./image/cameraGlitch.png";
import cubeMappingImg from "./image/cubeMapping.png";
import gpgpuCalculatorImg from "./image/gpgpuCalculator.png";
import rotationCharacterImg from "./image/rotationCharacter.png";
import autumnImg from "./image/autumn.png";
import reflectionBallImg from "./image/reflectionBall.png";
import cubeImg from "./image/cube.png";
import mountainImg from "./image/mountain.png";
import mandelBoxImg from "./image/mandelBox.png";
import randomizeHeightImg from "./image/randomizeHeight.png";
import riverRippleImg from "./image/riverRipple.png";
import monteCarloImg from "./image/monteCarlo.png";
import unbreraPaintImg from "./image/unbreraPaint.png";
const img = [
  particleFlameImg,
  glitchImg,
  cameraGlitchImg,
  cubeMappingImg,
  gpgpuCalculatorImg,
  rotationCharacterImg,
  autumnImg,
  reflectionBallImg,
  cubeImg,
  mountainImg,
  mandelBoxImg,
  randomizeHeightImg,
  riverRippleImg,
  monteCarloImg,  
  unbreraPaintImg
];

const headerLinkData = [
  { text: "Twitter", href: "https://twitter.com/ukeyshima?lang=ja" },
  { text: "GitHub", href: "https://github.com/ukeyshima" },
  { text: "Qiita", href: "https://qiita.com/ukeyshima" },
  { text: "Shadertoy", href: "https://www.shadertoy.com/user/ukeyshima" },
  { text: "Sarahah", href: "https://ukeyshima.sarahah.com/" }
];
class HeaderLink extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          textAlign: "center",
          width: "100%",
          margin: 0
        }}
      >
        {this.props.data.map((e, i) => {
          return (
            <a
              style={{
                margin: "0 5px",
                padding: 0,
                fontSize: "25px",
                textDecoration: "none",
                color: "#000"
              }}
              key={i}
              href={e.href}
            >
              {e.text}
            </a>
          );
        })}
        <hr
          style={{
            width: "90vw",
            border: "1px #000 solid"
          }}
        />
      </div>
    );
  }
}
class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            fontSize: 50 + "px",
            fontFamily: "",
            fontWeight: 100,
            padding: 0,
            margin: "0px 0 20px",
            width: "100%"
          }}
        >
          <p style={{ margin: 0 }}>{this.props.children}</p>
        </div>
        <HeaderLink data={headerLinkData} />
      </div>
    );
  }
}

class WorkLink extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      style: {
        textAlign: "left",
        display: "block",
        width: "100%",
        height: "100%",
        textDecoration: "none",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        color: "rgba(242, 242, 242, 0.0)"
      }
    };
  }
  mouseOverHandler(e) {
    this.setState({
      style: {
        textAlign: "left",
        display: "block",
        width: "100%",
        height: "100%",
        textDecoration: "none",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "rgba(242, 242, 242, 1.0)"
      }
    });
  }
  mouseOutHandler(e) {
    this.setState({
      style: {
        textAlign: "left",
        display: "block",
        width: "100%",
        height: "100%",
        textDecoration: "none",
        backgroundColor: "rgba(0, 0, 0, 0.0)",
        color: "rgba(242, 242, 242, 0.0)"
      }
    });
  }
  render() {
    return (
      <div
        {...this.props}
        onMouseOver={e => this.mouseOverHandler(e)}
        onMouseOut={e => this.mouseOutHandler(e)}
      >
        <Link to={this.props.url} style={this.state.style}>
          <p
            style={{
              margin: "0 10px",
              padding: 0,
              fontSize: "30px"
            }}
          >
            {this.props.data.name}
          </p>
        </Link>
      </div>
    );
  }
}

class Works extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      json: data
    };
  }

  render() {
    return (
      <div
        style={{
          position: "absolute",
          margin: "0 auto",
          textAlign: "center",
          top: "150px"
        }}
      >
        {this.state.json.map((e, i, a) => {          
          return (
            <WorkLink
              style={{
                display: "inline-block",
                width: "288px",
                height: "180px",
                backgroundColor: "#000",
                margin: "3vw 1vw",
                border: "rgb(200, 200, 200) solid 2px",
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundImage: "url("+img[i]+")"
              }}
              url={e.name}
              key={e.name}
              data={e}
            />
          );
        })}
      </div>
    );
  }
}

class Top extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  componentDidMount() {
    document.body.style.overflow = "auto";
    this.tempHandleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.tempHandleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.tempHandleResize);
  }
  handleResize(e) {
    const width = e.target.innerWidth;
    const height = e.target.innerHeight;
    this.refs.createCanvas.handleResize(width, height);
    this.setState({
      width: width,
      height: height
    });
  }
  render() {
    return (
      <React.Fragment>
        <CreateCanvas
          ref="createCanvas"
          style={{
            position: "fixed",
            width: this.state.width,
            height: this.state.height,
            zIndex: -1
          }}
        />
        <Header>portfolio</Header>
        <Works />
      </React.Fragment>
    );
  }
}

ReactDOM.render(
  <HashRouter>
    <React.Fragment>
      <Route exact path="/" component={Top} />
      {data.map((e,i) => {        
        const componentName =
          e.name[0].toUpperCase() + e.name.slice(1, e.name.length);        
        return (
          <Route
            key={e.name}
            exact
            path={"/" + e.name}
            component={component[i]}
          />
        );
      })}
    </React.Fragment>
  </HashRouter>,
  document.getElementById("root")
);
