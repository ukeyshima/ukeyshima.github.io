import React from 'react';
import { inject, observer } from 'mobx-react';
import UndoManager from './undoManager.js';
import DrawAreaHeader from './drawAreaHeader.jsx';

const dist = (x1, y1, x2, y2) => {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

@inject(({ state }, props) => {
  return {
    undoManager: state.undoManager,
    updateUndoManager: state.updateUndoManager,
    undo: state.undo,
    redo: state.redo,
    unbra: state.unbra,
    rebra: state.rebra,
    updateUpdateRenderFunction: state.updateUpdateRenderFunction,
    strokeWidth: state.strokeWidth,
    sizeRatio: state.sizeRatio,
    color: state.color,
    updateColor: state.updateColor,
    flagBrush: state.flag.brush,
    flagRect: state.flag.rect,
    flagCircle: state.flag.circle,
    flagLine: state.flag.line,
    flagColorPicker: state.flag.colorPicker,
    flagClear: state.flag.clear,
    updateClearFunction: state.updateClearFunction,
    visualizeTreeUndo: state.visualizeTreeUndo,
    imgSize: state.imgSize,
    drawAreaWidth: state.drawAreaWidth,
    drawAreaPositionY: state.drawAreaPosition.y,
    drawAreaPositionX: state.drawAreaPosition.x,
    headerHeight: state.headerHeight
  };
})
@observer
export default class DrawArea extends React.Component {
  constructor(props) {
    super(props);
    this.initialWidth = this.props.drawAreaWidth;
    this.initialHeight = this.props.drawAreaWidth;
    this.state = {
      mousedown: false,
      prevCanvas: null,
      context: null,
      wrapperContext: null
    };
  }
  componentDidMount() {
    const canvas = this.canvas;
    const canvasWrapper = this.canvasWrapper;
    const context = canvas.getContext('2d');
    const wrapperContext = canvasWrapper.getContext('2d');
    canvas.width = this.props.drawAreaWidth;
    canvas.height = this.props.drawAreaWidth;
    canvasWrapper.width = this.props.drawAreaWidth;
    canvasWrapper.height = this.props.drawAreaWidth;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    this.setState({
      context: context,
      wrapperContext: wrapperContext
    });
    this.props.updateUndoManager(
      new UndoManager(
        canvas.toDataURL('image/png'),
        context.getImageData(0, 0, this.initialWidth, this.initialHeight)
      )
    );
    this.props.updateUpdateRenderFunction(this.updateRender);
    this.props.updateClearFunction(this.clear);
    window.addEventListener('keydown', this.handleKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }
  handleMouseDown = e => {
    const context = this.state.context;
    const x =
      ((e.hasOwnProperty('changedTouches')
        ? e.changedTouches[0].pageX
        : e.pageX) -
        this.props.drawAreaPositionX) /
      this.props.sizeRatio;
    const y =
      ((e.hasOwnProperty('changedTouches')
        ? e.changedTouches[0].pageY
        : e.pageY) -
        this.props.drawAreaPositionY -
        this.props.headerHeight) /
      this.props.sizeRatio;
    this.setState({
      mousedown: true
    });
    this.prevX = x;
    this.prevY = y;
    this.x = [x];
    this.y = [y];
    this.imageData = context.getImageData(
      0,
      0,
      this.initialWidth,
      this.initialHeight
    );
  };
  handleMouseMove = e => {
    const context = this.state.context;
    const wrapperContext = this.state.wrapperContext;
    const prevX = this.prevX;
    const prevY = this.prevY;
    const x =
      ((e.hasOwnProperty('changedTouches')
        ? e.changedTouches[0].pageX
        : e.pageX) -
        this.props.drawAreaPositionX) /
      this.props.sizeRatio;
    const y =
      ((e.hasOwnProperty('changedTouches')
        ? e.changedTouches[0].pageY
        : e.pageY) -
        this.props.drawAreaPositionY -
        this.props.headerHeight) /
      this.props.sizeRatio;
    if (this.state.mousedown) {
      context.strokeStyle = this.props.color;
      context.lineWidth = this.props.strokeWidth;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      if (this.props.flagBrush) {
        wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
        this.x.push(x);
        this.y.push(y);
        context.putImageData(this.imageData, 0, 0);
        context.beginPath();
        for (let i = 0; i < this.x.length - 1; i++) {
          context.moveTo(this.x[i], this.y[i]);
          context.lineTo(this.x[i + 1], this.y[i + 1]);
        }
        context.stroke();
        context.closePath();
      } else if (this.props.flagRect) {
        wrapperContext.fillStyle = this.props.color;
        wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
        wrapperContext.fillRect(prevX, prevY, x - prevX, y - prevY);
      } else if (this.props.flagCircle) {
        wrapperContext.fillStyle = this.props.color;
        wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
        wrapperContext.beginPath();
        wrapperContext.arc(
          prevX,
          prevY,
          dist(x, y, prevX, prevY),
          0,
          Math.PI * 2,
          true
        );
        wrapperContext.fill();
      } else if (this.props.flagLine) {
        wrapperContext.fillStyle = this.props.color;
        wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
        wrapperContext.strokeStyle = this.props.color;
        wrapperContext.lineWidth = this.props.strokeWidth;
        wrapperContext.beginPath();
        wrapperContext.moveTo(prevX, prevY);
        wrapperContext.lineTo(x, y);
        wrapperContext.stroke();
        wrapperContext.closePath();
      }
    } else {
      if (
        !this.props.flagRect &&
        !this.props.flagCircle &&
        !this.props.flagColorpicker
      ) {
        wrapperContext.fillStyle = this.props.color;
        wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
        wrapperContext.beginPath();
        wrapperContext.arc(
          x,
          y,
          this.props.strokewidth / 2,
          0,
          Math.PI * 2,
          true
        );
        wrapperContext.fill();
      }
    }
  };
  handleMouseUp = e => {
    const canvas = this.canvas;
    const context = this.state.context;
    const wrapperContext = this.state.wrapperContext;
    const prevX = this.prevX;
    const prevY = this.prevY;
    const x =
      ((e.hasOwnProperty('changedTouches')
        ? e.changedTouches[0].pageX
        : e.pageX) -
        this.props.drawAreaPositionX) /
      this.props.sizeRatio;
    const y =
      ((e.hasOwnProperty('changedTouches')
        ? e.changedTouches[0].pageY
        : e.pageY) -
        this.props.drawAreaPositionY -
        this.props.headerHeight) /
      this.props.sizeRatio;
    const undoManager = this.props.undoManager;
    wrapperContext.clearRect(0, 0, this.initialWidth, this.initialHeight);
    if (this.props.flagRect) {
      context.fillStyle = this.props.color;
      context.fillRect(prevX, prevY, x - prevX, y - prevY);
    } else if (this.props.flagCircle) {
      context.fillStyle = this.props.color;
      context.beginPath();
      context.arc(prevX, prevY, dist(x, y, prevX, prevY), 0, Math.PI * 2, true);
      context.fill();
    } else if (this.props.flagLine) {
      context.lineJoin = 'butt';
      context.lineCap = 'butt';
      context.strokeStyle = this.props.color;
      context.lineWidth = this.props.strokewidth;
      context.beginPath();
      context.moveTo(prevX, prevY);
      context.lineTo(x, y);
      context.stroke();
      context.closePath();
    } else if (this.props.flagColorPicker) {
      this.readColor(x, y);
    }
    undoManager.execute(
      null,
      canvas.toDataURL('image/png'),
      context.getImageData(0, 0, this.initialWidth, this.initialHeight)
    );
    this.props.updateUndoManager(undoManager);
    this.setState({
      mousedown: false
    });
    this.props.visualizeTreeUndo(
      undoManager.undoStack[0],
      undoManager.redoStack,
      this.props.imgSize,
      (undoManager.undoStack[0].stackWidth / 2) * ((this.props.imgSize / 2) * 3)
    );
  };
  readColor = (x, y) => {
    const context = this.state.context;
    this.props.updateColor(context.getImageData(x, y, 1, 1).data.slice(0, 3));
  };
  handleKeyDown = e => {
    if (
      (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
      (e.key === 'Z' && (e.ctrlKey || e.metaKey) && e.shiftKey)
    ) {
      this.props.redo();
    } else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      this.props.undo();
    } else if (
      (e.key === '¸' && e.altKey && e.shiftKey) ||
      (e.key === 'Z' && e.altKey && e.shiftKey)
    ) {
      this.props.rebra();
    } else if ((e.key === 'Ω' && e.altKey) || (e.key === 'z' && e.altKey)) {
      this.props.unbra();
    }
  };
  clear = () => {
    const canvas = this.canvas;
    const context = this.state.context;
    const undoManager = this.props.undoManager;
    context.fillStyle = this.props.color;
    context.fillRect(0, 0, this.initialWidth, this.initialHeight);
    this.props.undoManager.execute(
      null,
      canvas.toDataURL('image/png'),
      context.getImageData(0, 0, this.initialWidth, this.initialHeight)
    );
    this.props.updateUndoManager(undoManager);
  };
  updateRender = stack => {
    const context = this.state.context;
    const imageData = stack.state;
    context.putImageData(imageData, 0, 0);
  };
  render() {
    return (
      <div
        touch-action='none'
        style={{
          width: this.props.drawAreaWidth,
          height: this.props.drawAreaWidth + this.props.headerHeight,
          position: 'absolute',
          top: this.props.drawAreaPositionY,
          left: this.props.drawAreaPositionX
        }}
      >
        <DrawAreaHeader
          style={{
            width: this.props.drawAreaWidth,
            height: this.props.headerHeight,
            backgroundColor: '#ddd',
            position: 'absolute',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
          }}
        />
        <canvas
          style={{
            width: this.props.drawAreaWidth,
            height: this.props.drawAreaWidth,
            position: 'absolute',
            top: this.props.headerHeight,
            backgroundColor: '#fff',
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5
          }}
          ref={e => {
            this.canvas = e;
          }}
        />
        <canvas
          style={{
            width: this.props.drawAreaWidth,
            height: this.props.drawAreaWidth,
            position: 'absolute',
            top: this.props.headerHeight,
            backgroundColor: 'rgba(255,255,255,0)',
            borderBottomRadius: 5
          }}
          ref={e => {
            this.canvasWrapper = e;
          }}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onTouchMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onTouchEnd={this.handleMouseUp}
        />
      </div>
    );
  }
}
