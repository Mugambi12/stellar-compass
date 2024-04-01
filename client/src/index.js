import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Medicines from "./components/Medicines";
import Orders from "./components/Orders";
import Sales from "./components/Sales";
import Payments from "./components/Payments";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Switch>
          <Route path="/medicines">
            <Medicines />
          </Route>
          <Route path="/orders">
            <Orders />
          </Route>
          <Route path="/sales">
            <Sales />
          </Route>
          <Route path="/payments">
            <Payments />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
