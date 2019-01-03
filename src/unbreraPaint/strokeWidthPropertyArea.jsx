import React from 'react';
import { inject, observer } from 'mobx-react';

@inject(({ state }, props) => {
  return {
    updateStrokeWidth: state.updateStrokeWidth,
    strokeWidth: state.strokeWidth
  };
})
export default class StrokeWidthPropertyArea extends React.Component {
  handleChange = e => {
    const event = e.nativeEvent;
    this.props.updateStrokeWidth(event.target.value);
  };
  render() {
    return (
      <div style={this.props.style}>
        <input
          touch-action='auto'
          type='range'
          min='1'
          max='100'
          step='1'
          value={this.props.strokeWidth}
          style={{
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            backgroundColor: '#000',
            height: 2,
            width: '90%',
            outline: 0,
            position: 'absolute',
            top: '50%',
            left: '5%',
            margin: 0
          }}
          onChange={this.handleChange}
          onInput={this.handleChange}
        />
      </div>
    );
  }
}
