import React from "react";

class StrokeWidthPropertyArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 20
    };
    this.mouseDownFlag = false;
  }
  
  handleChange(e) {      
    const event = e.nativeEvent;
    this.setState({
      value: event.target.value
    });
    this.props.handlechange(event.target.value);
  }
  render() {
    return (
      <div style={this.props.style}>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={this.state.value}
          style={{
            WebkitAppearance: "none",
            MozAppearance: "none",
            backgroundColor: "#000",
            height: 2,
            width: "90%",
            outline: 0,
            position:"absolute",
            top:"50%",
            left:"5%",
            margin:0
          }}
          onChange={this.handleChange.bind(this)}
          onInput={this.handleChange.bind(this)}          
        />
      </div>
    );
  }
}

export default StrokeWidthPropertyArea;
