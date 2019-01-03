import React from 'react';
import {
  BrowserRouter,
  HashRouter,
  Route,
  Link,
  Switch
} from 'react-router-dom';

export default class Thumbnail extends React.Component {
  render() { 
    return (
      <div
        className='thumbnail'
        style={{
          backgroundImage: `url(${this.props.img})`
        }}
      >
        <Link className='workLink' to={`/${this.props.name}`} />
      </div>
    );
  }
}
