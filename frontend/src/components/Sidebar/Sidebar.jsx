import React from 'react';
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

// Accept activePage and setActivePage as props from App.jsx
function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li
            key={item.label}
            className={`sidebar-item ${activePage === item.label ? 'active' : ''}`}
            onClick={() => setActivePage(item.label)}
          >
            <span className="sidebar-label">{item.label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;