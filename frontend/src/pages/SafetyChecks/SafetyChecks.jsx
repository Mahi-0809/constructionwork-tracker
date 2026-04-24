import React, { useState, useEffect } from 'react';
import {
  getSafetyChecks,
  createSafetyCheck,
  deleteSafetyCheck,
  defaultChecklist
} from '../../services/safetyService';
import SafetyCheckCard from '../../components/SafetyCheckCard/SafetyCheckCard';
import './SafetyChecks.css';

function SafetyChecks() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form state
  const [area, setArea] = useState('');
  const [checkDate, setCheckDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  // Checklist starts with default items — all unchecked
  const [checklist, setChecklist] = useState(defaultChecklist);

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    setLoading(true);
    const { data, error } = await getSafetyChecks();
    if (error) {
      setError('Failed to load safety checks.');
    } else {
      setChecks(data);
    }
    setLoading(false);
  };

  // Toggle a checklist item checked/unchecked
  const toggleChecklistItem = (index) => {
    const updated = checklist.map((item, i) =>
      i === index ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const { error } = await createSafetyCheck({
      area,
      check_date: checkDate,
      checklist,
      notes
    });

    if (error) {
      setFormError(error.message);
    } else {
      // Reset form
      setArea('');
      setNotes('');
      setChecklist(defaultChecklist);
      setShowForm(false);
      fetchChecks();
    }

    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this safety check?')) return;
    const { error } = await deleteSafetyCheck(id);
    if (error) {
      alert('Failed to delete.');
    } else {
      setChecks(checks.filter(c => c.id !== id));
    }
  };

  return (
    <div className="safety-checks">
      <div className="safety-header">
        <div>
          <h1 className="safety-title">Safety Checks</h1>
          <p className="safety-subtitle">{checks.length} checks recorded</p>
        </div>
        <button
          className="add-safety-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Check'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="safety-form-card">
          <h2 className="form-title">New Safety Check</h2>
          <form onSubmit={handleSubmit} className="safety-form">

            <div className="form-row">
              <div className="form-group">
                <label>Site Area</label>
                <input
                  type="text"
                  placeholder="e.g. Block A, Rooftop"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Interactive checklist */}
            <div className="form-group">
              <label>Checklist</label>
              <div className="form-checklist">
                {checklist.map((item, index) => (
                  <div
                    key={index}
                    className={`form-checklist-item ${item.checked ? 'checked' : ''}`}
                    onClick={() => toggleChecklistItem(index)}
                  >
                    <span className="form-check-box">
                      {item.checked ? '✓' : ''}
                    </span>
                    <span>{item.item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Notes (optional)</label>
              <textarea
                placeholder="Any additional observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {formError && <p className="form-error">{formError}</p>}

            <button
              type="submit"
              className="submit-btn"
              disabled={formLoading}
            >
              {formLoading ? 'Saving...' : 'Save Check'}
            </button>
          </form>
        </div>
      )}

      {/* Checks list */}
      {loading ? (
        <p className="safety-loading">Loading safety checks...</p>
      ) : error ? (
        <p className="safety-error">{error}</p>
      ) : checks.length === 0 ? (
        <div className="safety-empty">
          <p>No safety checks yet. Create your first one.</p>
        </div>
      ) : (
        <div className="safety-grid">
          {checks.map((check) => (
            <SafetyCheckCard
              key={check.id}
              check={check}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SafetyChecks;