import React from "react";
import { Link } from "react-router-dom";
import { useAuth, logout } from "../auth";

const LoggedInLinks = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/orders">
          Orders
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/payments">
          Payments
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/medicines">
          Medicines
        </Link>
      </li>

      <li className="nav-item">
        <Link className="nav-link" to="/users">
          Users
        </Link>
      </li>

      <li className="nav-item mx-3">
        <Link
          className="nav-link btn btn-outline-primary btn-sm"
          to="/"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Link>
      </li>
    </>
  );
};

const LoggedOutLinks = () => {
  return (
    <>
      <li className="nav-item">
        <Link className="nav-link btn btn-outline-primary btn-sm" to="/">
          Login
        </Link>
      </li>

      <li className="nav-item">
        <Link
          className="nav-link btn btn-outline-success btn-sm"
          to="/register"
        >
          Register
        </Link>
      </li>
    </>
  );
};

const Navbar = () => {
  const [logged] = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="#">
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
