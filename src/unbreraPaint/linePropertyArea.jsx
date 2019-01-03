import React from 'react';
import { inject, observer } from 'mobx-react';
import { FaSlash } from 'react-icons/fa';

@inject(({ state }, props) => {
  return {
    lineEvent: state.lineEvent
  };
})
export default class LinePropertyArea extends React.Component {
  handleClick = () => {
    this.props.lineEvent();
  };
  render() {
    return (
      <div
        style={this.props.style}
        onClick={this.handleClick}
        onTouchStart={this.handleClick}
      >
        <FaSlash />
      </div>
    );
  }
}
