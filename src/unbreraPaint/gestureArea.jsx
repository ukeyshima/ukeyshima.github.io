import React from 'react';
import { inject, observer } from 'mobx-react';
import GestureAreaHeader from './gestureAreaHeader.jsx';

@inject(({ state }) => ({
  gestureAreaPositionX: state.gestureAreaPosition.x,
  gestureAreaPositionY: state.gestureAreaPosition.y,
  gestureAreaWidth: state.gestureAreaWidth,
  gestureAreaHeight: state.gestureAreaHeight,
  undo: state.undo,
  redo: state.redo,
  unbra: state.unbra,
  rebra: state.rebra,
  headerHeight: state.headerHeight
}))
@observer
export default class GestureArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: null,
      mouseDown: false
    };
    this.eventNums = [];
  }
  componentDidMount() {
    const canvas = this.canvas;
    canvas.width = this.props.gestureAreaWidth;
    canvas.height = this.props.gestureAreaHeight;
    const context = canvas.getContext('2d');
    context.fillStyle = '#111';
    context.fillRect(0, 0, canvas.width, canvas.height);
    this.setState({
      context: context
    });
  }
  handleMouseDown = e => {
    const x =
      (e.hasOwnProperty('changedTouches')
        ? e.changedTouches[0].pageX
        : e.pageX) - this.props.gestureAreaPositionX;
    const y =
      (e.hasOwnProperty('changedTouches')
        ? e.changedTouches[0].pageY
        : e.pageY) - this.props.gestureAreaPositionY;
    this.x = [x];
    this.y = [y];
    this.setState({
      mouseDown: true
    });
    this.eventNums = [];
  };
  handleMouseMove = e => {
    if (this.state.mouseDown) {
      const context = this.state.context;
      const x =
        (e.hasOwnProperty('changedTouches')
          ? e.changedTouches[0].pageX
          : e.pageX) - this.props.gestureAreaPositionX;
      const y =
        (e.hasOwnProperty('changedTouches')
          ? e.changedTouches[0].pageY
          : e.pageY) - this.props.gestureAreaPositionY;
      context.strokeStyle = '#eee';
      context.lineWidth = 10;
      context.lineJoin = 'round';
      context.lineCap = 'round';
      this.x.push(x);
      this.y.push(y);
      context.beginPath();
      for (let i = 0; i < this.x.length - 1; i++) {
        context.moveTo(this.x[i], this.y[i]);
        context.lineTo(this.x[i + 1], this.y[i + 1]);
      }
      context.stroke();
      context.closePath();

      let eventNum;

      if (
        this.x[this.x.length - 1] - this.x[this.x.length - 2] >= 0 &&
        this.y[this.y.length - 1] - this.y[this.y.length - 2] >= 0
      ) {
        if (
          Math.abs(
            (this.y[this.y.length - 1] - this.y[this.y.length - 2]) /
              (this.x[this.x.length - 1] - this.x[this.x.length - 2])
          ) > 1
        ) {
          eventNum = 2;
        } else {
          eventNum = 1;
        }
      } else if (
        this.x[this.x.length - 1] - this.x[this.x.length - 2] < 0 &&
        this.y[this.y.length - 1] - this.y[this.y.length - 2] > 0
      ) {
        if (
          Math.abs(
            (this.y[this.y.length - 1] - this.y[this.y.length - 2]) /
              (this.x[this.x.length - 1] - this.x[this.x.length - 2])
          ) > 1
        ) {
          eventNum = 2;
        } else {
          eventNum = 3;
        }
      } else if (
        this.x[this.x.length - 1] - this.x[this.x.length - 2] <= 0 &&
        this.y[this.y.length - 1] - this.y[this.y.length - 2] <= 0
      ) {
        if (
          Math.abs(
            (this.y[this.y.length - 1] - this.y[this.y.length - 2]) /
              (this.x[this.x.length - 1] - this.x[this.x.length - 2])
          ) > 1
        ) {
          eventNum = 4;
        } else {
          eventNum = 3;
        }
      } else if (
        this.x[this.x.length - 1] - this.x[this.x.length - 2] > 0 &&
        this.y[this.y.length - 1] - this.y[this.y.length - 2] < 0
      ) {
        if (
          Math.abs(
            (this.y[this.y.length - 1] - this.y[this.y.length - 2]) /
              (this.x[this.x.length - 1] - this.x[this.x.length - 2])
          ) > 1
        ) {
          eventNum = 4;
        } else {
          eventNum = 1;
        }
      }

      this.eventNums.push(eventNum);

      if (this.eventNums.length % 10 === 0) {
        const eventNumsAverage =
          this.eventNums
            .slice(this.eventNums.length - 10, this.eventNums.length)
            .reduce((prev, curr) => {
              return prev + curr;
            }, 0) / 10;
        switch (Math.round(eventNumsAverage)) {
          case 1:
            this.props.redo();
            break;
          case 2:
            this.props.rebra();
            break;
          case 3:
            this.props.undo();
            break;
          case 4:
            this.props.unbra();
            break;
        }
      }
    }
  };
  handleMouseUp = () => {
    const context = this.state.context;
    context.fillStyle = '#111';
    context.fillRect(
      0,
      0,
      this.props.gestureAreaWidth,
      this.props.gestureAreaHeight
    );
    this.setState({
      mouseDown: false
    });
  };
  render() {
    return (
      <div
        touch-action='none'
        style={{
          width: this.props.gestureAreaWidth,
          height: this.props.gestureAreaHeight + this.props.headerHeight,
          position: 'absolute',
          top: this.props.gestureAreaPositionY,
          left: this.props.gestureAreaPositionX
        }}
      >
        <GestureAreaHeader
          touch-action='auto'
          style={{
            width: this.props.gestureAreaWidth,
            height: this.props.headerHeight,
            backgroundColor: '#ddd',
            position: 'absolute',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5
          }}
        />
        <canvas
          ref={e => {
            this.canvas = e;
          }}
          onMouseDown={this.handleMouseDown}
          onTouchStart={this.handleMouseDown}
          onMouseMove={this.handleMouseMove}
          onTouchMove={this.handleMouseMove}
          onMouseUp={this.handleMouseUp}
          onTouchEnd={this.handleMouseUp}
          style={{
            backgroundColor: '#fff',
            width: this.props.gestureAreaWidth,
            height: this.props.gestureAreaHeight,
            borderRadius: 5
          }}
        />
      </div>
    );
  }
}
