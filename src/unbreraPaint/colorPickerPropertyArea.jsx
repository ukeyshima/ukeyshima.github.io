import React from 'react';
import { inject, observer } from 'mobx-react';
import { FaEyeDropper } from 'react-icons/fa';

@inject(({ state }, props) => {
  return {
    colorPickerEvent: state.colorPickerEvent
  };
})
export default class ColorPickerPropertyArea extends React.Component {
  handleClick = () => {
    this.props.colorPickerEvent();
  };
  render() {
    return (
      <div
        style={this.props.style}
        onClick={this.handleClick}
        onTouchStart={this.handleClick}
      >
        <FaEyeDropper />
      </div>
    );
  }
}
