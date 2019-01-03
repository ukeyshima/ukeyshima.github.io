import React from 'react';
import Thumbnail from './thumbnail.jsx';
import WorkRepletion from './workRepletion.jsx';

export default class ThumbnailWrapper extends React.Component {
  render() {
    return (
      <div className='thumbnailWrapper'>
        <div className='thumbnailName'>{this.props.name}</div>
        <Thumbnail name={this.props.name} img={this.props.img} />
        <WorkRepletion
          description={this.props.description}
          relation={this.props.relation}
        />
      </div>
    );
  }
}
