import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Medicines from "./components/Medicines";
import Orders from "./components/OrdersMade";
import Sales from "./components/Sales";
import Payments from "./components/Payments";

const App = () => {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          {" "}
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/" element={<Home />} />
        </Routes>{" "}
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
