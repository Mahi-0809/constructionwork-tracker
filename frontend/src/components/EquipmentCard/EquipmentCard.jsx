import React from 'react';
import './EquipmentCard.css';

function EquipmentCard({ equipment, onDelete, onStatusChange }) {
  return (
    <div className="equipment-card">
      <div className="equipment-card-header">
        <div>
          <h3 className="equipment-name">{equipment.name}</h3>
          <p className="equipment-type">{equipment.type}</p>
        </div>
        {/* Condition badge */}
        <span className={`equipment-condition ${equipment.condition}`}>
          {equipment.condition}
        </span>
      </div>

      {equipment.notes && (
        <p className="equipment-notes">{equipment.notes}</p>
      )}

      <div className="equipment-card-footer">
        {/* Status dropdown */}
        <select
          className={`equipment-status-select ${equipment.status}`}
          value={equipment.status}
          onChange={(e) => onStatusChange(equipment.id, e.target.value)}
        >
          <option value="available">Available</option>
          <option value="in_use">In Use</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <button
          className="equipment-delete-btn"
          onClick={() => onDelete(equipment.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default EquipmentCard;