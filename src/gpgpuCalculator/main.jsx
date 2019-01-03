import React from 'react';
import CreateCanvas from './createCanvas.jsx';
import style from './style.scss';

class Result extends React.Component {  
  render() {
    return (
      <p
        {...this.props}
        style={{
          height: window.innerHeight * 0.2,
          width: window.innerWidth,
          margin: 0,
          padding: 0,
          fontSize: 100,
          backgroundColor: 'rgb(41,41,49)',
          color: '#fff',
          textAlign: 'right',
          fontFamily: 'MS Sans Serif'
        }}
      >
        {this.props.result}
      </p>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: ''
    };
  }
  updateState(result) {
    this.setState({
      result: result
    });
  }
  handleResize(w, h) {
    this.refs.createCanvas.handleResize(w, h * 0.8);
  }
  render() {
    return (
      <div {...this.props}>
        <Result result={this.state.result} />
        <CreateCanvas
          ref='createCanvas'
          style={{
            width: this.props.style.width,
            height: this.props.style.height * 0.8
          }}
          updatestate={this.updateState.bind(this)}
          resultstyle={{
            width: window.innerWidth,
            height: window.innerHeight * 0.2
          }}
        />
      </div>
    );
  }
}

export default class GpgpuCalculator extends React.Component {
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
    this.refs.calculator.handleResize(width, height);
    this.setState({
      width: width,
      height: height
    });
  }
  render() {
    return (
      <Calculator
        ref='calculator'
        style={{
          width: this.state.width,
          height: this.state.height
        }}
      />
    );
  }
}
