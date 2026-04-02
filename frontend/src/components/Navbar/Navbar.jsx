import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      {/* Left side: app name/logo */}
      <div className="navbar-brand">
        🏗️ Construction Tracker
      </div>

      {/* Right side: user info placeholder */}
      <div className="navbar-user">
        <span className="navbar-username">Site Manager</span>
        <div className="navbar-avatar">SM</div>
      </div>
    </nav>
  );
}

export default Navbar;