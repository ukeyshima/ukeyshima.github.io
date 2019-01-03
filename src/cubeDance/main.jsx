import React from 'react';
import CreateCanvas from './createCanvas.jsx';
import style from './style.scss';

export default class Cube extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  componentDidMount() {
    style.use();
    this.tempHandleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.tempHandleResize);
  }
  componentWillUnmount() {
    style.unuse();
    window.removeEventListener('resize', this.tempHandleResize);
  }
  handleResize(e) {
    const width = e.target.innerWidth;
    const height = e.target.innerHeight;
    this.refs.createCanvas.handleResize(width, height);
    this.setState({
      width: width,
      height: height
    });
  }
  render() {
    return (
      <CreateCanvas
        ref='createCanvas'
        style={{
          width: this.state.width,
          height: this.state.height
        }}
      />
    );
  }
}
