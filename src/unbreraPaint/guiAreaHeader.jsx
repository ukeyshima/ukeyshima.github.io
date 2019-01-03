import React from 'react';
import { inject, observer } from 'mobx-react';

@inject(({ state }) => ({
  guiAreaPositionX: state.guiAreaPosition.x,
  guiAreaPositionY: state.guiAreaPosition.y,
  updateGuiAreaPosition: state.updateGuiAreaPosition
}))
@observer
export default class GuiAreaHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0
    };
  }
  handleMouseAndTouchDown = e => {
    document.body.addEventListener('mousemove', this.handleMouseAndTouchMove);
    document.body.addEventListener('touchmove', this.handleMouseAndTouchMove);
    document.body.addEventListener('mouseup', this.handleMouseAndTouchUp);
    document.body.addEventListener('touchend', this.handleMouseAndTouchUp);
    this.setState({
      x: 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX,
      y: 'changedTouches' in e ? e.changedTouches[0].pageY : e.pageY
    });
  };
  handleMouseAndTouchMove = e => {
    this.props.updateGuiAreaPosition(
      this.props.guiAreaPositionX +
        ('changedTouches' in e ? e.changedTouches[0].pageX : e.pageX) -
        this.state.x,
      this.props.guiAreaPositionY +
        ('changedTouches' in e ? e.changedTouches[0].pageY : e.pageY) -
        this.state.y
    );
    this.setState({
      x: 'changedTouches' in e ? e.changedTouches[0].pageX : e.pageX,
      y: 'changedTouches' in e ? e.changedTouches[0].pageY : e.pageY
    });
  };
  handleMouseAndTouchUp = () => {
    document.body.removeEventListener(
      'mousemove',
      this.handleMouseAndTouchMove
    );
    document.body.removeEventListener(
      'touchmove',
      this.handleMouseAndTouchMove
    );
    document.body.removeEventListener('mouseup', this.handleMouseAndTouchUp);
    document.body.removeEventListener('touchend', this.handleMouseAndTouchUp);
  };
  render() {
    return (
      <div
        touch-action='none'
        onMouseDown={this.handleMouseAndTouchDown}
        onTouchStart={this.handleMouseAndTouchDown}
        style={this.props.style}
      />
    );
  }
}
