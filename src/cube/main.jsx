import React from "react";
import CreateCanvas from "./createCanvas.jsx";
import ReactDOM from "react-dom";


class Cube extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      width:window.innerWidth,
      height:window.innerHeight
    }    
  }
  componentDidMount() { 
    document.body.style.overflow="hidden";       
    this.tempHandleResize=this.handleResize.bind(this);
    window.addEventListener("resize", this.tempHandleResize);
  }
  componentWillUnmount() {            
    window.removeEventListener("resize", this.tempHandleResize);    
  }
  handleResize(e) {        
    const width=e.target.innerWidth;
    const height=e.target.innerHeight;
    this.refs.createCanvas.handleResize(width,height);
    this.setState({
      width:width,
      height:height
    })
  }
  render() {
    return (
      <React.Fragment>
      <CreateCanvas
      ref="createCanvas"
        style={{
          width: this.state.width,
          height: this.state.height
        }}
      />
      <p 
      id="title"
      style={{
        position:"absolute",
        bottom:"20px",
        left:"20px",
        fontSize:"100px",
        margin:0
      }}>
      {location.hash.split("/")[1]}
      </p>
    </React.Fragment>
    );
  }
}

export default Cube;