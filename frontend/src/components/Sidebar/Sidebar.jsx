import React, { useState } from 'react';
import './Sidebar.css';

// Navigation items — we'll expand these as we build more pages
const navItems = [
  { icon: '📊', label: 'Dashboard' },
  { icon: '📋', label: 'Daily Logs' },
  { icon: '🦺', label: 'Safety Checks' },
  { icon: '🚨', label: 'Incidents' },
  { icon: '🔧', label: 'Equipment' },
  { icon: '✅', label: 'Tasks' },
  { icon: '📄', label: 'Reports' },
];

function Sidebar() {
  // Track which menu item is currently active
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li
            key={item.label}
            // Add 'active' class if this item is selected
            className={`sidebar-item ${activeItem === item.label ? 'active' : ''}`}
            onClick={() => setActiveItem(item.label)}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;