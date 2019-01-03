import React from 'react';
import { inject, observer } from 'mobx-react';

@inject(({ state }, props) => {
  return {
    sizeRatio: state.sizeRatio,
    previewPropertyAreaWidth: state.strokeWidth,
    previewStrokeWidth: state.previewStrokeWidth,
    color: state.color,
    brushEvent: state.brushEvent
  };
})
export default class PreviewStrokePropertyArea extends React.Component {
  handleClick = () => {
    this.props.brushEvent();
  };
  render() {
    return (
      <div
        style={this.props.style}
        onClick={this.handleClick}
        onTouchStart={this.handleClick}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: this.props.previewStrokeWidth,
            height: this.props.previewStrokeWidth,
            borderRadius: '50%',
            backgroundColor: this.props.color
          }}
        />
      </div>
    );
  }
}
