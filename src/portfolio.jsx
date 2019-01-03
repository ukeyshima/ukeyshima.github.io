import React from 'react';
import { inject, observer } from 'mobx-react';
import {
  BrowserRouter,
  HashRouter,
  Route,
  Link,
  Switch
} from 'react-router-dom';

import Works from './works.jsx';
import About from './about.jsx';
import json from './assets/main.json';
import Loadable from 'react-loadable';
import Loading from './loading/main.jsx';

@inject(({ state }) => ({
  work: state.work,
  updateWork: state.updateWork
}))
@observer
export default class Portfolio extends React.Component {
  componentDidMount() {
    json.forEach((e, i) => {
      this.props.updateWork(
        i,
        Loadable({
          loader: () => import(`./${e.name}/main.jsx`),
          loading: Loading
        })
      );
    });
  }
  render() {
    return (
      <HashRouter>
        <React.Fragment>
          <Switch>
            <Route exact={true} path='/' component={Works} />
            <Route exact={true} path='/about' component={About} />
            {this.props.work.map((e, i) => {
              return (
                <Route
                  exact={true}
                  path={`/${json[i].name}`}
                  component={e}
                />
              );
            })}
          </Switch>
        </React.Fragment>
      </HashRouter>
    );
  }
}
