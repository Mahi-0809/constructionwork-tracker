import React from 'react';
import './LogCard.css';

function LogCard({ log, onDelete }) {
  return (
    <div className="log-card">
      <div className="log-card-header">
        <div>
          <h3 className="log-card-title">{log.title}</h3>
          <p className="log-card-date">{log.log_date}</p>
        </div>
        {/* Status badge — color changes based on status */}
        <span className={`log-status ${log.status}`}>
          {log.status}
        </span>
      </div>

      {/* Only show description if it exists */}
      {log.description && (
        <p className="log-card-desc">{log.description}</p>
      )}

      <div className="log-card-footer">
        {log.location && (
          <span className="log-location">Location: {log.location}</span>
        )}
        <button
          className="log-delete-btn"
          onClick={() => onDelete(log.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default LogCard;