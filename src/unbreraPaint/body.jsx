import React from 'react';
import { inject, observer } from 'mobx-react';
import PropertyArea from './propertyArea.jsx';
import DrawArea from './drawArea.jsx';
import GuiArea from './guiArea.jsx';
import GestureArea from './gestureArea.jsx';

@inject(({ state }, props) => {
  return {
    headerHeight: state.headerHeight,
    windowWidth: state.windowWidth,
    windowHeight: state.windowHeight,
    windowResize: state.windowResize,
    drawAreaWidth: state.drawAreaWidth,
    propertyAreaWidth: state.propertyAreaWidth,
    guiAreaWidth: state.guiAreaWidth
  };
})
export default class Body extends React.Component {
  componentDidMount() {
    this.props.windowResize();
    window.addEventListener('resize', this.props.windowResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.props.windowResize);
  }
  render() {
    return (
      <div
        touch-action='none'
        style={{
          width: this.props.windowWidth,
          height: this.props.windowHeight - this.props.headerHeight,
          backgroundColor: '#222'
        }}
      >
        <PropertyArea
          style={{
            width: this.props.propertyAreaWidth,
            height: this.props.windowHeight - this.props.headerHeight,
            backgroundColor: '#aaa',
            float: 'left'
          }}
        />
        <GuiArea />
        <GestureArea />
        <DrawArea />
      </div>
    );
  }
}
