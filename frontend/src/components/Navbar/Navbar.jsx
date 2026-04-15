import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Construction Tracker
      </div>

      <div className="navbar-user">
        <span className="navbar-username">{user?.email}</span>
        <div className="navbar-avatar">
          {user?.email?.[0].toUpperCase()}
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;