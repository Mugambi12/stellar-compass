import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import Navbar from "./components/Navbar";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Updated import
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
        <Routes>
          {" "}
          {/* Updated */}
          <Route path="/medicines" element={<Medicines />} /> {/* Updated */}
          <Route path="/orders" element={<Orders />} /> {/* Updated */}
          <Route path="/sales" element={<Sales />} /> {/* Updated */}
          <Route path="/payments" element={<Payments />} /> {/* Updated */}
          <Route path="/" element={<Home />} /> {/* Updated */}
        </Routes>{" "}
        {/* Updated */}
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
