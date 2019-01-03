import React, {Component} from 'react';
import { Route, Switch } from "react-router-dom";
import config from './config.js';
const {menu} = config;

export default class Router extends Component {
  render() {
    return (
      <Router forceRefresh={true}>
        <Switch>
          {menu.map(v => <Route exact path={v.path} component={v.component} />)}
        </Switch>
      </Router>
    )
  }
}
