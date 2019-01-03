import React from 'react';

export default class WorkDescription extends React.Component {
  render() {
    return <div className='workDescription'>{this.props.description}</div>;
  }
}
