import React, { useState, useEffect } from 'react';
import { getLogs } from '../../services/logService';
import { getIncidents } from '../../services/incidentService';
import { getTasks } from '../../services/taskService';
import { getEquipment } from '../../services/equipmentService';
import { getMaterials } from '../../services/materialService';
import { getSafetyChecks } from '../../services/safetyService';
import './Reports.css';

function Reports() {
  // Store data from all modules
  const [logs, setLogs] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [safetyChecks, setSafetyChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch data from every module at once
  const fetchAllData = async () => {
    setLoading(true);

    // Run all fetches in parallel — faster than one by one
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

    if (!logsRes.error)      setLogs(logsRes.data);
    if (!incidentsRes.error) setIncidents(incidentsRes.data);
    if (!tasksRes.error)     setTasks(tasksRes.data);
    if (!equipmentRes.error) setEquipment(equipmentRes.data);
    if (!materialsRes.error) setMaterials(materialsRes.data);
    if (!safetyRes.error)    setSafetyChecks(safetyRes.data);

    setLoading(false);
  };

  // --- Computed values ---

  // Tasks breakdown
  const tasksTodo        = tasks.filter(t => t.status === 'todo').length;
  const tasksInProgress  = tasks.filter(t => t.status === 'in_progress').length;
  const tasksBlocked     = tasks.filter(t => t.status === 'blocked').length;
  const tasksDone        = tasks.filter(t => t.status === 'done').length;
  const tasksCompletion  = tasks.length
    ? Math.round((tasksDone / tasks.length) * 100)
    : 0;

  // Incidents breakdown
  const incidentsOpen        = incidents.filter(i => i.status === 'open').length;
  const incidentsInvestigating = incidents.filter(i => i.status === 'investigating').length;
  const incidentsResolved    = incidents.filter(i => i.status === 'resolved').length;
  const criticalIncidents    = incidents.filter(i => i.severity === 'critical').length;

  // Equipment breakdown
  const equipmentAvailable   = equipment.filter(e => e.status === 'available').length;
  const equipmentInUse       = equipment.filter(e => e.status === 'in_use').length;
  const equipmentMaintenance = equipment.filter(e => e.status === 'maintenance').length;

  // Low stock materials
  const lowStockMaterials = materials.filter(
    m => (m.quantity_available - m.quantity_used) <= m.minimum_stock
  );

  // Safety checks breakdown
  const safetyPass    = safetyChecks.filter(s => s.result === 'pass').length;
  const safetyFail    = safetyChecks.filter(s => s.result === 'fail').length;
  const safetyPartial = safetyChecks.filter(s => s.result === 'partial').length;
  const safetyPassRate = safetyChecks.length
    ? Math.round((safetyPass / safetyChecks.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="reports-loading">
        <p>Loading report data...</p>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1 className="reports-title">Site Report</h1>
        <p className="reports-subtitle">
          Overview as of {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Top summary cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <p className="summary-card-value">{logs.length}</p>
          <p className="summary-card-label">Total Logs</p>
        </div>
        <div className="summary-card">
          <p className="summary-card-value">{incidents.length}</p>
          <p className="summary-card-label">Total Incidents</p>
        </div>
        <div className="summary-card">
          <p className="summary-card-value">{tasksCompletion}%</p>
          <p className="summary-card-label">Tasks Complete</p>
        </div>
        <div className="summary-card">
          <p className="summary-card-value">{safetyPassRate}%</p>
          <p className="summary-card-label">Safety Pass Rate</p>
        </div>
      </div>

      <div className="reports-grid">

        {/* Tasks section */}
        <div className="report-card">
          <h2 className="report-card-title">Tasks Overview</h2>
          <div className="report-progress-bar-wrapper">
            <div className="report-progress-bar">
              <div
                className="report-progress-fill green"
                style={{ width: `${tasksCompletion}%` }}
              />
            </div>
            <span className="report-progress-label">{tasksCompletion}% complete</span>
          </div>
          <div className="report-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-dot gray"></span>
              <span>To Do</span>
              <span className="breakdown-count">{tasksTodo}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot blue"></span>
              <span>In Progress</span>
              <span className="breakdown-count">{tasksInProgress}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot red"></span>
              <span>Blocked</span>
              <span className="breakdown-count">{tasksBlocked}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot green"></span>
              <span>Done</span>
              <span className="breakdown-count">{tasksDone}</span>
            </div>
          </div>
        </div>

        {/* Incidents section */}
        <div className="report-card">
          <h2 className="report-card-title">Incidents Overview</h2>
          {criticalIncidents > 0 && (
            <div className="report-alert">
              {criticalIncidents} critical incident{criticalIncidents > 1 ? 's' : ''} need attention
            </div>
          )}
          <div className="report-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-dot red"></span>
              <span>Open</span>
              <span className="breakdown-count">{incidentsOpen}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot orange"></span>
              <span>Investigating</span>
              <span className="breakdown-count">{incidentsInvestigating}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot green"></span>
              <span>Resolved</span>
              <span className="breakdown-count">{incidentsResolved}</span>
            </div>
          </div>
        </div>

        {/* Safety checks section */}
        <div className="report-card">
          <h2 className="report-card-title">Safety Checks</h2>
          <div className="report-progress-bar-wrapper">
            <div className="report-progress-bar">
              <div
                className="report-progress-fill green"
                style={{ width: `${safetyPassRate}%` }}
              />
            </div>
            <span className="report-progress-label">{safetyPassRate}% pass rate</span>
          </div>
          <div className="report-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-dot green"></span>
              <span>Pass</span>
              <span className="breakdown-count">{safetyPass}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot orange"></span>
              <span>Partial</span>
              <span className="breakdown-count">{safetyPartial}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot red"></span>
              <span>Fail</span>
              <span className="breakdown-count">{safetyFail}</span>
            </div>
          </div>
        </div>

        {/* Equipment section */}
        <div className="report-card">
          <h2 className="report-card-title">Equipment Status</h2>
          <div className="report-breakdown">
            <div className="breakdown-item">
              <span className="breakdown-dot green"></span>
              <span>Available</span>
              <span className="breakdown-count">{equipmentAvailable}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot blue"></span>
              <span>In Use</span>
              <span className="breakdown-count">{equipmentInUse}</span>
            </div>
            <div className="breakdown-item">
              <span className="breakdown-dot orange"></span>
              <span>Maintenance</span>
              <span className="breakdown-count">{equipmentMaintenance}</span>
            </div>
          </div>
        </div>

        {/* Low stock materials section */}
        <div className="report-card report-card-wide">
          <h2 className="report-card-title">
            Low Stock Materials
            {lowStockMaterials.length > 0 && (
              <span className="low-stock-count">{lowStockMaterials.length} items</span>
            )}
          </h2>
          {lowStockMaterials.length === 0 ? (
            <p className="report-all-good">All materials are well stocked.</p>
          ) : (
            <div className="low-stock-list">
              {lowStockMaterials.map(m => {
                const remaining = m.quantity_available - m.quantity_used;
                return (
                  <div key={m.id} className="low-stock-item">
                    <div>
                      <p className="low-stock-name">{m.name}</p>
                      <p className="low-stock-detail">
                        {remaining} {m.unit} remaining
                        (minimum: {m.minimum_stock} {m.unit})
                      </p>
                    </div>
                    <span className="low-stock-badge">Reorder</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent logs section */}
        <div className="report-card report-card-wide">
          <h2 className="report-card-title">Recent Daily Logs</h2>
          {logs.length === 0 ? (
            <p className="report-all-good">No logs recorded yet.</p>
          ) : (
            <div className="recent-logs-list">
              {/* Show only latest 5 logs */}
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="recent-log-item">
                  <div>
                    <p className="recent-log-title">{log.title}</p>
                    <p className="recent-log-date">{log.log_date} — {log.location}</p>
                  </div>
                  <span className={`log-status-badge ${log.status}`}>
                    {log.status}
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

export default Reports;