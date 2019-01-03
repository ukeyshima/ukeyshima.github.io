import React from 'react';
import Head from './head.jsx';
import Body from './body.jsx';
import { Provider, inject, observer } from 'mobx-react';
import State from './store.js';
import 'pepjs';
import style from './style.scss';

const stores = {
  state: new State()
};

export default class UnbreraPaint extends React.Component {
  componentDidMount() {
    style.use();
  }
  componentWillUnmount() {
    style.unuse();
  }
  render() {
    return (
      <Provider {...stores}>
        <React.Fragment>
          <Head />
          <Body />
        </React.Fragment>
      </Provider>
    );
  }
}
