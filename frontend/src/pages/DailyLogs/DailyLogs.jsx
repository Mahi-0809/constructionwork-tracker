import React, { useState, useEffect } from 'react';
import { getLogs, createLog, deleteLog } from '../../services/logService';
import LogCard from '../../components/LogCard/LogCard';
import './DailyLogs.css';

function DailyLogs() {
  // Store the list of logs fetched from database
  const [logs, setLogs] = useState([]);

  // Track loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Control whether the form is visible
  const [showForm, setShowForm] = useState(false);

  // Form field values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    log_date: new Date().toISOString().split('T')[0] // today's date
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch logs when the component first loads
  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await getLogs();

    if (error) {
      setError('Failed to load logs. Please try again.');
    } else {
      setLogs(data);
    }
    setLoading(false);
  };

  // Handle input changes for the form
  const handleChange = (e) => {
    setFormData({
      ...formData,           // keep existing values
      [e.target.name]: e.target.value  // update only the changed field
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const { error } = await createLog(formData);

    if (error) {
      setFormError(error.message);
    } else {
      // Reset form and hide it
      setFormData({
        title: '',
        description: '',
        location: '',
        log_date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      // Refresh the logs list
      fetchLogs();
    }

    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    // Ask for confirmation before deleting
    if (!window.confirm('Are you sure you want to delete this log?')) return;

    const { error } = await deleteLog(id);

    if (error) {
      alert('Failed to delete log.');
    } else {
      // Remove deleted log from state without refetching
      setLogs(logs.filter(log => log.id !== id));
    }
  };

  return (
    <div className="daily-logs">
      <div className="logs-header">
        <div>
          <h1 className="logs-title">Daily Logs</h1>
          <p className="logs-subtitle">{logs.length} logs recorded</p>
        </div>
        <button
          className="add-log-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Log'}
        </button>
      </div>

      {/* New log form — only visible when showForm is true */}
      {showForm && (
        <div className="log-form-card">
          <h2 className="form-title">Create New Log</h2>
          <form onSubmit={handleSubmit} className="log-form">

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Foundation work completed"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe what was done today..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Block A, Floor 2"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="log_date"
                  value={formData.log_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {formError && <p className="form-error">{formError}</p>}

            <button
              type="submit"
              className="submit-btn"
              disabled={formLoading}
            >
              {formLoading ? 'Saving...' : 'Save Log'}
            </button>
          </form>
        </div>
      )}

      {/* Logs list */}
      {loading ? (
        <p className="logs-loading">Loading logs...</p>
      ) : error ? (
        <p className="logs-error">{error}</p>
      ) : logs.length === 0 ? (
        <div className="logs-empty">
          <p>No logs yet. Create your first daily log.</p>
        </div>
      ) : (
        <div className="logs-grid">
          {logs.map((log) => (
            <LogCard
              key={log.id}
              log={log}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DailyLogs;