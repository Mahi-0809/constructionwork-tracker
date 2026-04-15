import React, { useState } from 'react';
import './Sidebar.css';

const navItems = [
  { label: 'Dashboard' },
  { label: 'Daily Logs' },
  { label: 'Safety Checks' },
  { label: 'Incidents' },
  { label: 'Equipment' },
  { label: 'Tasks' },
  { label: 'Reports' },
];

function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li
            key={item.label}
            className={`sidebar-item ${activeItem === item.label ? 'active' : ''}`}
            onClick={() => setActiveItem(item.label)}
          >
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;