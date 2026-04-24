import React, { useState } from 'react';
import './SafetyCheckCard.css';

function SafetyCheckCard({ check, onDelete }) {
  // Toggle showing full checklist
  const [expanded, setExpanded] = useState(false);

  // Count how many items were checked
  const checkedCount = check.checklist.filter(item => item.checked).length;
  const totalCount = check.checklist.length;

  return (
    <div className="safety-card">
      <div className="safety-card-header">
        <div>
          <h3 className="safety-card-area">{check.area}</h3>
          <p className="safety-card-date">{check.check_date}</p>
        </div>
        {/* Result badge */}
        <span className={`safety-result ${check.result}`}>
          {check.result}
        </span>
      </div>

      {/* Progress bar showing checked items */}
      <div className="safety-progress">
        <div className="safety-progress-label">
          <span>{checkedCount} of {totalCount} items passed</span>
        </div>
        <div className="safety-progress-bar">
          <div
            className="safety-progress-fill"
            style={{ width: `${(checkedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Expand to see full checklist */}
      <button
        className="safety-expand-btn"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Hide checklist' : 'View checklist'}
      </button>

      {expanded && (
        <ul className="safety-checklist">
          {check.checklist.map((item, index) => (
            <li
              key={index}
              className={`checklist-item ${item.checked ? 'checked' : 'unchecked'}`}
            >
              <span className="checklist-icon">
                {item.checked ? '✓' : '✗'}
              </span>
              {item.item}
            </li>
          ))}
        </ul>
      )}

      {check.notes && (
        <p className="safety-notes">Notes: {check.notes}</p>
      )}

      <div className="safety-card-footer">
        <button
          className="safety-delete-btn"
          onClick={() => onDelete(check.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default SafetyCheckCard;