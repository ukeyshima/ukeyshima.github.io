import React from "react";
import ColorPropertyArea from "./colorPropertyArea.jsx";
import StrokeWidthPropertyArea from "./strokeWidthPropertyArea.jsx";
import PreviewPropertyArea from "./previewPropertyArea.jsx";
import RectPropertyArea from "./rectPropertyArea.jsx";
import CirclePropertyArea from "./circlePropertyArea.jsx";
import LinePropertyArea from "./linePropertyArea.jsx";
import OpacityPropertyArea from "./opacityPropertyArea.jsx";
import ColorPickerPropertyArea from "./colorPickerPropertyArea.jsx";
import ClearPropertyArea from "./clearPropertyArea.jsx";

class PropertyArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "rgba(0,0,0,1.0)",
      opacity: 1.0,
      strokeWidth: 20,
      brushEvent: true,
      rectEvent: false,
      circleEvent: false,
      lineEvent: false,
      colorPickerEvent: false,
      previewBackground: "#eee",
      rectBackground: "#bbb",
      circleBackground: "#bbb",
      lineBackground: "#bbb",
      colorPickerBackground: "#bbb",
      clearBackground: "#bbb",
      sizeRatio: 1.0
    };
  }
  updateSizeRatio(nextSizeRatio) {
    this.setState({
      sizeRatio: nextSizeRatio
    });
    this.refs.previewPropertyArea.updateSizeRatio(nextSizeRatio);
  }
  handleChangeColor(value) {
    this.refs.opacityPropertyArea.updateColor(value);
    this.setState({
      color: `rgba(${value[0]},${value[1]},${value[2]},${this.state.opacity})`
    });
    this.props.changecolor(value);
  }
  handleReadColor(value) {
    this.refs.opacityPropertyArea.updateColor([value[0], value[1], value[2]]);
    this.setState({
      color: `rgba(${value[0]},${value[1]},${value[2]},${this.state.opacity})`
    });
  }
  handleChangeOpacity(value) {
    this.setState({
      opacity: value[3],
      color: `rgba(${value[0]},${value[1]},${value[2]},${value[3]})`
    });
    this.props.changeopacity(value);
  }
  handleChangeStrokeWidth(value) {
    this.props.changestrokewidth(value);
    this.setState({
      strokeWidth: Number(value)
    });
    this.refs.previewPropertyArea.updateStrokeWidth(Number(value));
  }
  handleBrushEvent() {
    this.props.changebrushevent();
    this.setState({
      brushEvent: true,
      rectEvent: false,
      circleEvent: false,
      lineEvent: false,
      colorPickerEvent: false,
      previewBackground: "#eee",
      rectBackground: "#bbb",
      circleBackground: "#bbb",
      lineBackground: "#bbb",
      colorPickerBackground: "#bbb",
      clearBackground: "#bbb"
    });
  }
  handleRectEvent() {
    this.props.changerectevent();
    this.setState({
      brushEvent: false,
      rectEvent: true,
      circleEvent: false,
      lineEvent: false,
      colorPickerEvent: false,
      previewBackground: "#bbb",
      rectBackground: "#eee",
      circleBackground: "#bbb",
      lineBackground: "#bbb",
      colorPickerBackground: "#bbb",
      clearBackground: "#bbb"
    });
  }
  handleCircleEvent() {
    this.props.changecircleevent();
    this.setState({
      brushEvent: false,
      rectEvent: false,
      circleEvent: true,
      lineEvent: false,
      colorPickerEvent: false,
      previewBackground: "#bbb",
      rectBackground: "#bbb",
      circleBackground: "#eee",
      lineBackground: "#bbb",
      colorPickerBackground: "#bbb",
      clearBackground: "#bbb"
    });
  }
  handleLineEvent() {
    this.props.changelineevent();
    this.setState({
      brushEvent: false,
      rectEvent: false,
      circleEvent: false,
      lineEvent: true,
      colorPickerEvent: false,
      previewBackground: "#bbb",
      rectBackground: "#bbb",
      circleBackground: "#bbb",
      lineBackground: "#eee",
      colorPickerBackground: "#bbb",
      clearBackground: "#bbb"
    });
  }
  handleColorPickerEvent() {
    this.props.changecolorpickerevent();
    this.setState({
      brushEvent: false,
      rectEvent: false,
      circleEvent: false,
      lineEvent: false,
      colorPickerEvent: true,
      previewBackground: "#bbb",
      rectBackground: "#bbb",
      circleBackground: "#bbb",
      lineBackground: "#bbb",
      colorPickerBackground: "#eee",
      clearBackground: "#bbb"
    });
  }
  handleClearEvent() {
    this.props.changeclearevent();
    this.setState({
      brushEvent: false,
      rectEvent: false,
      circleEvent: false,
      lineEvent: false,
      colorPickerEvent: false,
      previewBackground: "#bbb",
      rectBackground: "#bbb",
      circleBackground: "#bbb",
      lineBackground: "#bbb",
      colorPickerBackground: "#bbb",
      clearBackground: "#eee"
    });
  }
  render() {
    return (
      <div style={this.props.style}>
        <ColorPropertyArea
          style={{
            width: this.props.style.width,
            height: this.props.style.width,
            backgroundColor: "#000"
          }}
          handlechange={this.handleChangeColor.bind(this)}
        />
        <OpacityPropertyArea
          ref="opacityPropertyArea"
          style={{
            backgroundColor: "#222",
            width: this.props.style.width,
            height: 13,
            textAlign: "center",
            margin: 0,
            padding: 0
          }}
          handlechange={this.handleChangeOpacity.bind(this)}
          color={this.state.color}
        />
        <StrokeWidthPropertyArea
          style={{
            width: this.props.style.width,
            height: 30,
            textAlign: "center",
            position:"relative"
          }}
          handlechange={this.handleChangeStrokeWidth.bind(this)}
          sizeratio={this.state.sizeRatio}
        />
        <PreviewPropertyArea
          ref="previewPropertyArea"
          style={{
            position: "relative",
            width: this.props.style.width,
            height: this.props.style.width,
            backgroundColor: this.state.previewBackground
          }}
          color={this.state.color}
          brushevent={this.handleBrushEvent.bind(this)}
          sizeratio={this.state.sizeRatio}
        />
        <RectPropertyArea
          style={{
            margin: "3px 2px 1px 1px",
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.state.rectBackground,
            color: this.state.color,
            fontSize: 20,
            textAlign: "center",
            float: "left",
            lineHeight: 40 + "px"
          }}
          rectevent={this.handleRectEvent.bind(this)}
        />
        <CirclePropertyArea
          style={{
            margin: "3px 1px 1px 2px",
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.state.circleBackground,
            color: this.state.color,
            fontSize: 20,
            textAlign: "center",
            float: "left",
            lineHeight: 40 + "px"
          }}
          circleevent={this.handleCircleEvent.bind(this)}
        />
        <LinePropertyArea
          style={{
            margin: "2px 2px 1px 1px",
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.state.lineBackground,
            color: this.state.color,
            fontSize: 20,
            textAlign: "center",
            float: "left",
            lineHeight: 40 + "px",
          }}
          lineevent={this.handleLineEvent.bind(this)}
        />
        <ColorPickerPropertyArea
          style={{
            margin: "2px 1px 1px 2px",
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.state.colorPickerBackground,
            color: "#000",
            fontSize: 20,
            textAlign: "center",
            float: "left",
            lineHeight: 40 + "px"
          }}
          colorpickerevent={this.handleColorPickerEvent.bind(this)}
        />
        <ClearPropertyArea
          style={{
            margin: "2px 2px 1px 1px",
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.state.clearBackground,
            color: this.state.color,
            fontSize: 20,
            textAlign: "center",
            float: "left",
            lineHeight: 40 + "px"
          }}
          clearevent={this.handleClearEvent.bind(this)}
        />
      </div>
    );
  }
}

export default PropertyArea;
