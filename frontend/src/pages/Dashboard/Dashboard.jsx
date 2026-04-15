import React from 'react';
import './Dashboard.css';

const stats = [
  { label: 'Active Tasks',     value: '12', color: '#4caf50' },
  { label: 'Open Incidents',   value: '3',  color: '#f44336' },
  { label: 'Equipment In Use', value: '8',  color: '#2196f3' },
  { label: "Today's Logs",     value: '5',  color: '#ff9800' },
];

function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">Welcome back, Site Manager</p>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div
              className="stat-icon"
              style={{ backgroundColor: stat.color + '20', color: stat.color }}
            >
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <h2 className="section-title">Recent Activity</h2>
        <div className="activity-placeholder">
          <p>No recent activity yet. Start by adding a daily log.</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;