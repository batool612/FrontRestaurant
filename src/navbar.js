import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'; 

const Navbar = () => {
    const role = localStorage.getItem('role'); // Get role from localStorage

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Restaurant Management</h1>
      </div>
      <ul className="navbar-links">
        {role === 'user' && (
          <>
            <li>
              <Link to="/reservations">Reservations</Link>
            </li>
            <li>
              <Link to="/order">Order</Link>
            </li>
            <li>
              <Link to="/feedback">Feedback</Link>
            </li>
          </>
        )}
        {role === 'admin' && (
          <>
            <li>
              <Link to="/edit-menu">Edit Menu Items</Link>
            </li>
            <li>
              <Link to="/view-feedback">View Feedback</Link>
            </li>
            <li>
              <Link to="/manage-bookings">Manage Bookings</Link>
            </li>
          </>
        )}
        <li>
          <Link to="/login" onClick={() => localStorage.clear()}>
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
