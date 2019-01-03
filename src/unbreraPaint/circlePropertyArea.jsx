import React from 'react';
import { inject, observer } from 'mobx-react';
import { FaCircle } from 'react-icons/fa';

@inject(({ state }, props) => {
  return {
    circleEvent: state.circleEvent
  };
})
export default class CirclePropertyArea extends React.Component {
  handleClick = () => {
    this.props.circleEvent();
  };
  render() {
    return (
      <div
        style={this.props.style}
        onClick={this.handleClick}
        onTouchStart={this.handleClick}
      >
        <FaCircle />
      </div>
    );
  }
}
