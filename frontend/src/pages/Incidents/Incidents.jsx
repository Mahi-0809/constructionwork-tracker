import React, { useState, useEffect } from 'react';
import {
  getIncidents,
  createIncident,
  deleteIncident,
  updateIncidentStatus
} from '../../services/incidentService';
import IncidentCard from '../../components/IncidentCard/IncidentCard';
import './Incidents.css';

function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    location: ''
  });

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    const { data, error } = await getIncidents();
    if (error) {
      setError('Failed to load incidents.');
    } else {
      setIncidents(data);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const { error } = await createIncident(formData);

    if (error) {
      setFormError(error.message);
    } else {
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        location: ''
      });
      setShowForm(false);
      fetchIncidents();
    }

    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this incident report?')) return;
    const { error } = await deleteIncident(id);
    if (error) {
      alert('Failed to delete incident.');
    } else {
      setIncidents(incidents.filter(i => i.id !== id));
    }
  };

  const handleStatusChange = async (id, status) => {
    const { error } = await updateIncidentStatus(id, status);
    if (error) {
      alert('Failed to update status.');
    } else {
      // Update status in local state without refetching
      setIncidents(incidents.map(i =>
        i.id === id ? { ...i, status } : i
      ));
    }
  };

  // Count incidents by status for the summary bar
  const openCount = incidents.filter(i => i.status === 'open').length;
  const investigatingCount = incidents.filter(i => i.status === 'investigating').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;

  return (
    <div className="incidents">
      <div className="incidents-header">
        <div>
          <h1 className="incidents-title">Incidents</h1>
          <p className="incidents-subtitle">{incidents.length} total incidents</p>
        </div>
        <button
          className="add-incident-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Report Incident'}
        </button>
      </div>

      {/* Summary bar */}
      {incidents.length > 0 && (
        <div className="incidents-summary">
          <div className="summary-item open">
            <span className="summary-count">{openCount}</span>
            <span className="summary-label">Open</span>
          </div>
          <div className="summary-item investigating">
            <span className="summary-count">{investigatingCount}</span>
            <span className="summary-label">Investigating</span>
          </div>
          <div className="summary-item resolved">
            <span className="summary-count">{resolvedCount}</span>
            <span className="summary-label">Resolved</span>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="incident-form-card">
          <h2 className="form-title">Report New Incident</h2>
          <form onSubmit={handleSubmit} className="incident-form">

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Worker slipped on wet surface"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Describe what happened in detail..."
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Severity</label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Floor 3, Stairwell B"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            {formError && <p className="form-error">{formError}</p>}

            <button
              type="submit"
              className="submit-btn"
              disabled={formLoading}
            >
              {formLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>
      )}

      {/* Incidents list */}
      {loading ? (
        <p className="incidents-loading">Loading incidents...</p>
      ) : error ? (
        <p className="incidents-error">{error}</p>
      ) : incidents.length === 0 ? (
        <div className="incidents-empty">
          <p>No incidents reported. Stay safe!</p>
        </div>
      ) : (
        <div className="incidents-grid">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Incidents;