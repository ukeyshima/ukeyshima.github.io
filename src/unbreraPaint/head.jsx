import React from 'react';
import { inject, observer } from 'mobx-react';

@inject(({ state }, props) => {
  return {
    headerHeight: state.headerHeight,
    windowWidth: state.windowWidth
  };
})
@observer
export default class Head extends React.Component {
  render() {
    return (
      <div
        touch-action='none'
        style={{
          width: this.props.windowWidth,
          height: this.props.headerHeight,
          backgroundColor: '#ddd'
        }}
      />
    );
  }
}
