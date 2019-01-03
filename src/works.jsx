import React from 'react';
import json from './assets/main.json';
import ThumbnailWrapper from './thumbnailWrapper.jsx';
import Header from './header.jsx';
import style from './style.scss';

export default class Works extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thumbnails: []
    };
  }
  async componentDidMount() {
    style.use();
    const thumbnails = await Promise.all(
      json.map(e => {
        return import(`./assets/img/${e.name}.png`);
      })
    );
    this.setState({
      thumbnails: thumbnails
    });
  }
  componentWillUnmount() {
    style.unuse();
  }
  render() {
    return (
      <React.Fragment>
        <Header />
        <div className='works'>
          {this.state.thumbnails.map((e, i) => {
            return (
              <ThumbnailWrapper
                name={json[i].name}
                description={json[i].description}
                relation={json[i].relation}
                img={e.default}
              />
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}
