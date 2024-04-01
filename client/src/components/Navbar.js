import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Utibu Health
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item me-2">
              <Link
                className="nav-link active"
                aria-current="page"
                to="/medicines"
              >
                Medicines
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link active" to="/orders">
                Orders
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link active" to="/sales">
                Sales
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link active" to="/payments">
                Payments
              </Link>
            </li>
            <li className="nav-item me-2">
              <Link className="nav-link active" to="/">
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
