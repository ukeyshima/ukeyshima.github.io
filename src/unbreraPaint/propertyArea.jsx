import React from 'react';
import { inject, observer } from 'mobx-react';
import ColorPropertyArea from './colorPropertyArea.jsx';
import StrokeWidthPropertyArea from './strokeWidthPropertyArea.jsx';
import PreviewStrokePropertyArea from './previewStrokePropertyArea.jsx';
import RectPropertyArea from './rectPropertyArea.jsx';
import CirclePropertyArea from './circlePropertyArea.jsx';
import LinePropertyArea from './linePropertyArea.jsx';
import OpacityPropertyArea from './opacityPropertyArea.jsx';
import ColorPickerPropertyArea from './colorPickerPropertyArea.jsx';
import ClearPropertyArea from './clearPropertyArea.jsx';

@inject(({ state }, props) => {
  return {
    color: state.color,
    backgroundBrush: state.background.brush,
    backgroundRect: state.background.rect,
    backgroundCircle: state.background.circle,
    backgroundLine: state.background.line,
    backgroundColorPicker: state.background.colorPicker,
    backgroundClear: state.background.clear
  };
})
export default class PropertyArea extends React.Component {
  render() {
    return (
      <div style={this.props.style}>
        <ColorPropertyArea
          style={{
            width: this.props.style.width,
            height: this.props.style.width,
            backgroundColor: '#000'
          }}
        />
        <OpacityPropertyArea
          ref='opacityPropertyArea'
          style={{
            backgroundColor: '#222',
            width: this.props.style.width,
            height: 13,
            textAlign: 'center',
            margin: 0,
            padding: 0
          }}
        />
        <StrokeWidthPropertyArea
          style={{
            width: this.props.style.width,
            height: 30,
            textAlign: 'center',
            position: 'relative'
          }}
        />
        <PreviewStrokePropertyArea
          ref='previewPropertyArea'
          style={{
            position: 'relative',
            width: this.props.style.width,
            height: this.props.style.width,
            backgroundColor: this.props.backgroundBrush
          }}
        />
        <RectPropertyArea
          style={{
            margin: '3px 2px 1px 1px',
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.props.backgroundRect,
            color: this.props.color,
            fontSize: 20,
            textAlign: 'center',
            float: 'left',
            lineHeight: '225%'
          }}
        />
        <CirclePropertyArea
          style={{
            margin: '3px 1px 1px 2px',
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.props.backgroundCircle,
            color: this.props.color,
            fontSize: 20,
            textAlign: 'center',
            float: 'left',
            lineHeight: '225%'
          }}
        />
        <LinePropertyArea
          style={{
            margin: '2px 2px 1px 1px',
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.props.backgroundLine,
            color: this.props.color,
            fontSize: 20,
            textAlign: 'center',
            float: 'left',
            lineHeight: '225%'
          }}
        />
        <ColorPickerPropertyArea
          style={{
            margin: '2px 1px 1px 2px',
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.props.backgroundColorPicker,
            color: this.props.color,
            fontSize: 20,
            textAlign: 'center',
            float: 'left',
            lineHeight: '225%'
          }}
        />
        <ClearPropertyArea
          style={{
            margin: '2px 2px 1px 1px',
            width: this.props.style.width / 2 - 3,
            height: 40,
            backgroundColor: this.props.backgroundClear,
            color: this.props.color,
            fontSize: 20,
            textAlign: 'center',
            float: 'left',
            lineHeight: '225%'
          }}
        />
      </div>
    );
  }
}
