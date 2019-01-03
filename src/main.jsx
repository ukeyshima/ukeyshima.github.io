import React from 'react';
import ReactDOM from 'react-dom';
import Portfolio from './portfolio.jsx';
import State from './store.js';
import { Provider, inject, observer } from 'mobx-react';

const stores = {
  state: new State()
};

ReactDOM.render(
  <Provider {...stores}>
    <Portfolio />
  </Provider>,
  document.getElementById('root')
);
