import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Login } from "./pages/Login";
import { Option } from "./pages/Option";

export function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/escolher-trilha" component={Option} />
      </Switch>
    </Router>
  );
}
