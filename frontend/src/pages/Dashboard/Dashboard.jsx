import React, { useState, useEffect } from 'react';
import { getLogs } from '../../services/logService';
import { getIncidents } from '../../services/incidentService';
import { getTasks } from '../../services/taskService';
import { getEquipment } from '../../services/equipmentService';
import { getMaterials } from '../../services/materialService';
import { getSafetyChecks } from '../../services/safetyService';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalLogs: 0,
    openIncidents: 0,
    equipmentInUse: 0,
    todaysLogs: 0,
    tasksDone: 0,
    totalTasks: 0,
    safetyPassRate: 0,
    lowStockCount: 0,
  });

  const [recentLogs, setRecentLogs] = useState([]);
  const [openIncidentsList, setOpenIncidentsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    // Fetch all data in parallel
    const [
      logsRes,
      incidentsRes,
      tasksRes,
      equipmentRes,
      materialsRes,
      safetyRes
    ] = await Promise.all([
      getLogs(),
      getIncidents(),
      getTasks(),
      getEquipment(),
      getMaterials(),
      getSafetyChecks()
    ]);

    const logs      = logsRes.data      || [];
    const incidents = incidentsRes.data || [];
    const tasks     = tasksRes.data     || [];
    const equipment = equipmentRes.data || [];
    const materials = materialsRes.data || [];
    const safety    = safetyRes.data    || [];

    // Today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Calculate all stats
    const todaysLogs = logs.filter(l => l.log_date === today).length;
    const openIncidents = incidents.filter(i => i.status === 'open').length;
    const equipmentInUse = equipment.filter(e => e.status === 'in_use').length;
    const tasksDone = tasks.filter(t => t.status === 'done').length;
    const safetyPass = safety.filter(s => s.result === 'pass').length;
    const safetyPassRate = safety.length
      ? Math.round((safetyPass / safety.length) * 100)
      : 0;
    const lowStockCount = materials.filter(
      m => (m.quantity_available - m.quantity_used) <= m.minimum_stock
    ).length;

    setStats({
      totalLogs: logs.length,
      openIncidents,
      equipmentInUse,
      todaysLogs,
      tasksDone,
      totalTasks: tasks.length,
      safetyPassRate,
      lowStockCount,
    });

    // Store recent logs and open incidents for activity feed
    setRecentLogs(logs.slice(0, 4));
    setOpenIncidentsList(incidents.filter(i => i.status === 'open').slice(0, 3));

    setLoading(false);
  };

  // Stat card definitions — values come from state now
  const statCards = [
    {
      label: "Today's Logs",
      value: stats.todaysLogs,
      sub: `${stats.totalLogs} total`,
      color: '#2196f3'
    },
    {
      label: 'Open Incidents',
      value: stats.openIncidents,
      sub: 'Needs attention',
      color: '#f44336'
    },
    {
      label: 'Equipment In Use',
      value: stats.equipmentInUse,
      sub: 'Currently active',
      color: '#ff9800'
    },
    {
      label: 'Tasks Complete',
      value: `${stats.tasksDone}/${stats.totalTasks}`,
      sub: 'Finished tasks',
      color: '#4caf50'
    },
    {
      label: 'Safety Pass Rate',
      value: `${stats.safetyPassRate}%`,
      sub: 'Checks passed',
      color: '#9c27b0'
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockCount,
      sub: 'Need reordering',
      color: '#e94560'
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">
          Site overview — {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Stat cards grid */}
      <div className="stats-grid">
        {statCards.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <div
              className="stat-color-bar"
              style={{ backgroundColor: stat.color }}
            />
            <div className="stat-body">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-sub">{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">

        {/* Recent logs */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Recent Logs</h2>
          {recentLogs.length === 0 ? (
            <p className="dashboard-empty">No logs yet.</p>
          ) : (
            <div className="dashboard-list">
              {recentLogs.map(log => (
                <div key={log.id} className="dashboard-list-item">
                  <div>
                    <p className="list-item-title">{log.title}</p>
                    <p className="list-item-sub">{log.log_date} — {log.location || 'No location'}</p>
                  </div>
                  <span className={`status-badge ${log.status}`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open incidents */}
        <div className="dashboard-card">
          <h2 className="dashboard-card-title">Open Incidents</h2>
          {openIncidentsList.length === 0 ? (
            <p className="dashboard-empty">No open incidents.</p>
          ) : (
            <div className="dashboard-list">
              {openIncidentsList.map(incident => (
                <div key={incident.id} className="dashboard-list-item">
                  <div>
                    <p className="list-item-title">{incident.title}</p>
                    <p className="list-item-sub">{incident.location || 'No location'}</p>
                  </div>
                  <span className={`severity-badge ${incident.severity}`}>
                    {incident.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;