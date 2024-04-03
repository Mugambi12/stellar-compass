import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React from "react";
//import ReactDOM from "react-dom";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Medicines from "./components/Medicines";
import Orders from "./components/OrdersMade";
import Invoices from "./components/Invoices";
import Payments from "./components/Payments";
import Register from "./components/Register";
import Users from "./components/Users";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container-fluid p-0 m-0">
        {/* Routes for larger screens */}
        <div className="d-none d-md-block p-3">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
        {/* Routes for smaller screens */}
        <div className="d-md-none d-sm-block ">
          <Routes>
            <Route path="/users" element={<Users />} />
            <Route path="/medicines" element={<Medicines />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

// React 17's root API
//ReactDOM.render(<App />, document.getElementById("root"));

// React 18's new root API
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
