import React from 'react';
import './IncidentCard.css';

function IncidentCard({ incident, onDelete, onStatusChange }) {
  return (
    <div className={`incident-card severity-border-${incident.severity}`}>
      <div className="incident-card-header">
        <div>
          <h3 className="incident-title">{incident.title}</h3>
          <p className="incident-date">
            {new Date(incident.incident_date).toLocaleDateString()}
          </p>
        </div>

        {/* Severity badge */}
        <span className={`incident-severity ${incident.severity}`}>
          {incident.severity}
        </span>
      </div>

      <p className="incident-desc">{incident.description}</p>

      {incident.location && (
        <p className="incident-location">Location: {incident.location}</p>
      )}

      <div className="incident-card-footer">
        {/* Status dropdown — lets user change status directly */}
        <select
          className={`incident-status-select ${incident.status}`}
          value={incident.status}
          onChange={(e) => onStatusChange(incident.id, e.target.value)}
        >
          <option value="open">Open</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>

        <button
          className="incident-delete-btn"
          onClick={() => onDelete(incident.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default IncidentCard;