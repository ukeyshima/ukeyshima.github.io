import React from "react";
import ReactDOM from "react-dom";
import PropertyArea from "./propertyArea.jsx";
import UndoManager from "./undoManager.js";
import DrawArea from "./drawArea.jsx";
import SizeChangeArea from "./sizeChangeArea.jsx";
import GuiArea from "./guiArea.jsx";
import PropTypes from "prop-types";

const headerHeight = 25;

class Head extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth
    };
    this.handleResize=this.handleResize.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
  handleResize() {
    this.setState({
      width: window.innerWidth
    });
  }
  render() {
    return (
      <div
        style={{
          width: this.state.width,
          height: headerHeight,
          backgroundColor: "#ddd"
        }}
      />
    );
  }
}

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.initialWidth = window.innerHeight;
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      drawAreaWidth: window.innerHeight - 25,
      guiAreaWidth: window.innerWidth - 120 - window.innerHeight - 5,
      sizeChangeFlag: false,
      sizeChangePrevious: 0,
      color: "rgba(0,0,0,1)",
      opacity: 1.0,
      strokeWidth: 20,
      brushEvent: true,
      rectEvent: false,
      circleEvent: false,
      colorPickerEvent: false,
      sizeRatio: 1.0,
      undoManager: new UndoManager()
    };
    this.handleResize=this.handleResize.bind(this);
  }
  componentDidMount() {
    const drawAreaWidth =
      this.state.drawAreaWidth < window.innerWidth - 125
        ? this.state.drawAreaWidth
        : window.innerWidth - 125;
    this.setState({
      drawAreaWidth: drawAreaWidth,
      guiAreaWidth: window.innerWidth - 120 - drawAreaWidth - 5
    });
    window.addEventListener("resize", this.handleResize);
  }
  componentWillUnmount() {    
    window.removeEventListener("resize", this.handleResize);
  }
  handleResize() {
    const drawAreaWidth =
      this.state.drawAreaWidth < window.innerWidth - 125
        ? this.state.drawAreaWidth
        : window.innerWidth - 125;
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      drawAreaWidth: drawAreaWidth,
      guiAreaWidth: window.innerWidth - 120 - drawAreaWidth - 5
    });
  }
  handleMouseDown(e) {
    e.preventDefault();
    const event = e.nativeEvent;
    this.setState({
      sizeChangeFlag: true,
      sizeChangePrevious: event.clientX
    });
  }
  handleMouseMove(e) {
    e.preventDefault();
    const event = e.nativeEvent;
    if (this.state.sizeChangeFlag) {
      const sizeChangeIndex = event.clientX - this.state.sizeChangePrevious;
      const drawAreaWidthPrevious = this.state.drawAreaWidth;
      const guiAreaWidthPrevious = this.state.guiAreaWidth;
      this.setState({
        drawAreaWidth: drawAreaWidthPrevious + sizeChangeIndex,
        guiAreaWidth: guiAreaWidthPrevious - sizeChangeIndex,
        sizeChangePrevious: event.clientX
      });
      this.refs.drawArea.updateSizeRatio(
        drawAreaWidthPrevious + sizeChangeIndex,
        drawAreaWidthPrevious + sizeChangeIndex
      );
      this.refs.propertyArea.updateSizeRatio(
        (drawAreaWidthPrevious + sizeChangeIndex) / this.initialWidth
      );
    }
  }
  handleChangeColor(value) {
    this.setState({
      color: `rgba(${value[0]},${value[1]},${value[2]},${this.state.opacity})`
    });
  }
  handleReadColor(value) {
    this.setState({
      color: `rgba(${value[0]},${value[1]},${value[2]},${this.state.opacity})`
    });
    this.refs.propertyArea.handleReadColor(value);
  }
  handleChangeOpacity(value) {
    this.setState({
      opacity: value[3],
      color: `rgba(${value[0]},${value[1]},${value[2]},${value[3]})`
    });
  }
  handleChangeSizeRatio(value) {
    this.setState({
      sizeRatio: value
    });
  }
  handleMouseUp(e) {
    e.preventDefault();
    this.setState({
      sizeChangeFlag: false
    });
  }
  handleChangeStrokeWidth(value) {
    this.setState({
      strokeWidth: Number(value)
    });
  }
  handleBrushEvent() {
    this.setState({
      brushEvent: true,
      rectEvent: false,
      circleEvent: false,
      lineEvent: false,
      colorPickerEvent: false
    });
  }
  handleRectEvent() {
    this.setState({
      brushEvent: false,
      rectEvent: true,
      circleEvent: false,
      lineEvent: false,
      colorPickerEvent: false
    });
  }
  handleCircleEvent() {
    this.setState({
      brushEvent: false,
      rectEvent: false,
      circleEvent: true,
      lineEvent: false,
      colorPickerEvent: false
    });
  }
  handleLineEvent() {
    this.setState({
      brushEvent: false,
      rectEvent: false,
      circleEvent: false,
      lineEvent: true,
      colorPickerEvent: false
    });
  }
  handleColorPickerEvent() {
    this.setState({
      brushEvent: false,
      rectEvent: false,
      circleEvent: false,
      lineEvent: false,
      colorPickerEvent: true
    });
  }
  handleClearEvent() {
    this.refs.drawArea.clearEvent();
  }
  updateUndoManager(undoManager) {
    this.setState({
      undoManager: undoManager
    });
  }
  updateCommandText(text) {
    this.refs.guiArea.updateCommandText(text);
  }
  updateRender(stack) {
    this.refs.drawArea.updateRender(stack);
  }
  render() {
    return (
      <div
        style={{
          width: this.state.width,
          height: this.state.height - 25,
          backgroundColor: "#222"
        }}
        onMouseMove={this.handleMouseMove.bind(this)}
        onMouseUp={this.handleMouseUp.bind(this)}
      >
        <PropertyArea
          ref="propertyArea"
          style={{
            width: 120,
            height: this.state.height - headerHeight,
            backgroundColor: "#aaa",
            float: "left"
          }}
          changecolor={this.handleChangeColor.bind(this)}
          changeopacity={this.handleChangeOpacity.bind(this)}
          changestrokewidth={this.handleChangeStrokeWidth.bind(this)}
          changebrushevent={this.handleBrushEvent.bind(this)}
          changerectevent={this.handleRectEvent.bind(this)}
          changecircleevent={this.handleCircleEvent.bind(this)}
          changelineevent={this.handleLineEvent.bind(this)}
          changecolorpickerevent={this.handleColorPickerEvent.bind(this)}
          changeclearevent={this.handleClearEvent.bind(this)}
        />
        <DrawArea
          ref="drawArea"
          style={{
            width: this.state.drawAreaWidth,
            height: this.state.drawAreaWidth
          }}
          color={this.state.color}
          strokewidth={this.state.strokeWidth}
          brushevent={this.state.brushEvent}
          rectevent={this.state.rectEvent}
          circleevent={this.state.circleEvent}
          lineevent={this.state.lineEvent}
          colorpickerevent={this.state.colorPickerEvent}
          changesizeratio={this.handleChangeSizeRatio.bind(this)}
          updateundomanager={this.updateUndoManager.bind(this)}
          updatecommandtext={this.updateCommandText.bind(this)}
          readcolor={this.handleReadColor.bind(this)}
        />
        <SizeChangeArea
          style={{
            width: 5,
            height: this.state.height - headerHeight,
            backgroundColor: "#e38",
            float: "left",
            cursor: "col-resize"
          }}
          sizechangestart={this.handleMouseDown.bind(this)}
        />
        <GuiArea
          ref="guiArea"
          undomanager={this.state.undoManager}
          updaterender={this.updateRender.bind(this)}
          style={{
            width: this.state.guiAreaWidth,
            height: this.state.height - headerHeight,
            backgroundColor: "rgba(0,0,0,0)"
          }}
        />
      </div>
    );
  }
}

class UnbreraPaint extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <React.Fragment>
        <Head />
        <Body />
        <p
          id="title"
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            fontSize: "100px",
            margin: 0
          }}
        >
          {location.hash.split("/")[1]}
        </p>
      </React.Fragment>
    );
  }
}

export default UnbreraPaint;
