import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import config from './router/config';
const {menu} = config;

const AppRouter = () => (
  <Router>
    <div>
      {menu.map( v => <Route path={v.path} exact component={v.component} />)}
    </div>
  </Router>
);

export default AppRouter;