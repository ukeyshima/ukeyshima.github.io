import React from 'react';
import { inject, observer } from 'mobx-react';
import { FaSquareFull } from 'react-icons/fa';

@inject(({ state }, props) => {
  return {
    rectEvent: state.rectEvent
  };
})
export default class RectPropertyArea extends React.Component {
  handleClick = () => {
    this.props.rectEvent();
  };
  render() {
    return (
      <div
        style={this.props.style}
        onClick={this.handleClick}
        onTouchStart={this.handleClick}
      >
        <FaSquareFull />
      </div>
    );
  }
}
