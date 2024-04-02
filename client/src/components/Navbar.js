import React from "react";
import { Link } from "react-router-dom";
import { useAuth, logout } from "../auth";

const LoggedInLinks = () => {
  return (
    <>
      <li className="nav-item me-2">
        <Link className="nav-link active" aria-current="page" to="/users">
          Users
        </Link>
      </li>

      <li className="nav-item me-2">
        <Link className="nav-link active" aria-current="page" to="/medicines">
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
        <a
          className="nav-link active"
          href="/"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </a>
      </li>
    </>
  );
};

const LoggedOutLinks = () => {
  return (
    <>
      <li className="nav-item me-2">
        <Link className="nav-link active" to="/">
          Login
        </Link>
      </li>

      <li className="nav-item me-2">
        <Link className="nav-link active" to="/register">
          Register
        </Link>
      </li>
    </>
  );
};

const Navbar = () => {
  const [logged] = useAuth();

  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
      <div className="container-fluid mx-3">
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
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {logged ? <LoggedInLinks /> : <LoggedOutLinks />}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
