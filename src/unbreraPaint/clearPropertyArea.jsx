import React from 'react';
import { inject, observer } from 'mobx-react';
import { FaCuttlefish } from 'react-icons/fa';

@inject(({ state }, props) => {
  return {
    clearEvent: state.clearEvent
  };
})
export default class ClearPropertyArea extends React.Component {
  handleClick = () => {
    this.props.clearEvent();
  };
  render() {
    return (
      <div
        style={this.props.style}
        onClick={this.handleClick}
        onTouchStart={this.handleClick}
      >
        <FaCuttlefish />
      </div>
    );
  }
}
