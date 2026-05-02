import React, { useState, useEffect } from 'react';
import {
  getEquipment,
  createEquipment,
  deleteEquipment,
  updateEquipmentStatus
} from '../../services/equipmentService';
import {
  getMaterials,
  createMaterial,
  deleteMaterial,
  updateMaterialUsage
} from '../../services/materialService';
import EquipmentCard from '../../components/EquipmentCard/EquipmentCard';
import './Equipment.css';

function Equipment() {
  // Tab state — switch between equipment and materials
  const [activeTab, setActiveTab] = useState('equipment');

  // Equipment state
  const [equipment, setEquipment] = useState([]);
  const [equipmentLoading, setEquipmentLoading] = useState(true);
  const [showEquipmentForm, setShowEquipmentForm] = useState(false);
  const [equipmentForm, setEquipmentForm] = useState({
    name: '', type: '', condition: 'good',
    status: 'available', notes: ''
  });

  // Materials state
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(true);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    name: '', unit: '', quantity_available: '',
    minimum_stock: '', supplier: '', cost_per_unit: ''
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchEquipment();
    fetchMaterials();
  }, []);

  const fetchEquipment = async () => {
    setEquipmentLoading(true);
    const { data, error } = await getEquipment();
    if (!error) setEquipment(data);
    setEquipmentLoading(false);
  };

  const fetchMaterials = async () => {
    setMaterialsLoading(true);
    const { data, error } = await getMaterials();
    if (!error) setMaterials(data);
    setMaterialsLoading(false);
  };

  // Equipment handlers
  const handleEquipmentChange = (e) => {
    setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value });
  };

  const handleEquipmentSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    const { error } = await createEquipment(equipmentForm);
    if (error) {
      setFormError(error.message);
    } else {
      setEquipmentForm({ name: '', type: '', condition: 'good', status: 'available', notes: '' });
      setShowEquipmentForm(false);
      fetchEquipment();
    }
    setFormLoading(false);
  };

  const handleEquipmentDelete = async (id) => {
    if (!window.confirm('Delete this equipment?')) return;
    const { error } = await deleteEquipment(id);
    if (!error) setEquipment(equipment.filter(e => e.id !== id));
  };

  const handleEquipmentStatusChange = async (id, status) => {
    const { error } = await updateEquipmentStatus(id, status);
    if (!error) {
      setEquipment(equipment.map(e => e.id === id ? { ...e, status } : e));
    }
  };

  // Material handlers
  const handleMaterialChange = (e) => {
    setMaterialForm({ ...materialForm, [e.target.name]: e.target.value });
  };

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    const { error } = await createMaterial(materialForm);
    if (error) {
      setFormError(error.message);
    } else {
      setMaterialForm({ name: '', unit: '', quantity_available: '', minimum_stock: '', supplier: '', cost_per_unit: '' });
      setShowMaterialForm(false);
      fetchMaterials();
    }
    setFormLoading(false);
  };

  const handleMaterialDelete = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    const { error } = await deleteMaterial(id);
    if (!error) setMaterials(materials.filter(m => m.id !== id));
  };

  const handleUsageUpdate = async (id, currentUsed, available) => {
    const input = prompt('Enter new quantity used:');
    if (input === null) return;
    const quantity_used = parseFloat(input);
    if (isNaN(quantity_used) || quantity_used < 0 || quantity_used > available) {
      alert('Invalid quantity.');
      return;
    }
    const { error } = await updateMaterialUsage(id, quantity_used);
    if (!error) {
      setMaterials(materials.map(m => m.id === id ? { ...m, quantity_used } : m));
    }
  };

  return (
    <div className="equipment-page">
      <div className="equipment-page-header">
        <h1 className="equipment-page-title">Equipment & Materials</h1>
      </div>

      {/* Tabs */}
      <div className="equipment-tabs">
        <button
          className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
          onClick={() => setActiveTab('equipment')}
        >
          Equipment ({equipment.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => setActiveTab('materials')}
        >
          Materials ({materials.length})
        </button>
      </div>

      {/* Equipment Tab */}
      {activeTab === 'equipment' && (
        <div>
          <div className="tab-actions">
            <button
              className="add-btn"
              onClick={() => setShowEquipmentForm(!showEquipmentForm)}
            >
              {showEquipmentForm ? 'Cancel' : '+ Add Equipment'}
            </button>
          </div>

          {showEquipmentForm && (
            <div className="form-card">
              <h2 className="form-title">Add Equipment</h2>
              <form onSubmit={handleEquipmentSubmit} className="resource-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Excavator"
                      value={equipmentForm.name}
                      onChange={handleEquipmentChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <input
                      type="text"
                      name="type"
                      placeholder="e.g. Heavy Machinery"
                      value={equipmentForm.type}
                      onChange={handleEquipmentChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Condition</label>
                    <select
                      name="condition"
                      value={equipmentForm.condition}
                      onChange={handleEquipmentChange}
                      className="form-select"
                    >
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="out_of_service">Out of Service</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      name="status"
                      value={equipmentForm.status}
                      onChange={handleEquipmentChange}
                      className="form-select"
                    >
                      <option value="available">Available</option>
                      <option value="in_use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="Any additional notes..."
                    value={equipmentForm.notes}
                    onChange={handleEquipmentChange}
                  />
                </div>

                {formError && <p className="form-error">{formError}</p>}

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : 'Save Equipment'}
                </button>
              </form>
            </div>
          )}

          {equipmentLoading ? (
            <p className="resource-loading">Loading equipment...</p>
          ) : equipment.length === 0 ? (
            <div className="resource-empty">
              <p>No equipment added yet.</p>
            </div>
          ) : (
            <div className="resource-grid">
              {equipment.map((item) => (
                <EquipmentCard
                  key={item.id}
                  equipment={item}
                  onDelete={handleEquipmentDelete}
                  onStatusChange={handleEquipmentStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Materials Tab */}
      {activeTab === 'materials' && (
        <div>
          <div className="tab-actions">
            <button
              className="add-btn"
              onClick={() => setShowMaterialForm(!showMaterialForm)}
            >
              {showMaterialForm ? 'Cancel' : '+ Add Material'}
            </button>
          </div>

          {showMaterialForm && (
            <div className="form-card">
              <h2 className="form-title">Add Material</h2>
              <form onSubmit={handleMaterialSubmit} className="resource-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Material Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Cement"
                      value={materialForm.name}
                      onChange={handleMaterialChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit</label>
                    <input
                      type="text"
                      name="unit"
                      placeholder="e.g. bags, kg, litres"
                      value={materialForm.unit}
                      onChange={handleMaterialChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity Available</label>
                    <input
                      type="number"
                      name="quantity_available"
                      placeholder="e.g. 500"
                      value={materialForm.quantity_available}
                      onChange={handleMaterialChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Minimum Stock Alert</label>
                    <input
                      type="number"
                      name="minimum_stock"
                      placeholder="e.g. 50"
                      value={materialForm.minimum_stock}
                      onChange={handleMaterialChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Supplier</label>
                    <input
                      type="text"
                      name="supplier"
                      placeholder="e.g. ABC Suppliers"
                      value={materialForm.supplier}
                      onChange={handleMaterialChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cost per Unit (Rs)</label>
                    <input
                      type="number"
                      name="cost_per_unit"
                      placeholder="e.g. 350"
                      value={materialForm.cost_per_unit}
                      onChange={handleMaterialChange}
                    />
                  </div>
                </div>

                {formError && <p className="form-error">{formError}</p>}

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : 'Save Material'}
                </button>
              </form>
            </div>
          )}

          {materialsLoading ? (
            <p className="resource-loading">Loading materials...</p>
          ) : materials.length === 0 ? (
            <div className="resource-empty">
              <p>No materials added yet.</p>
            </div>
          ) : (
            <div className="materials-list">
              {materials.map((material) => {
                // Calculate stock percentage
                const remaining = material.quantity_available - material.quantity_used;
                const percentage = Math.max(
                  0,
                  Math.round((remaining / material.quantity_available) * 100)
                );
                // Flag low stock
                const isLow = remaining <= material.minimum_stock;

                return (
                  <div key={material.id} className={`material-row ${isLow ? 'low-stock' : ''}`}>
                    <div className="material-info">
                      <div>
                        <h3 className="material-name">{material.name}</h3>
                        <p className="material-supplier">{material.supplier}</p>
                      </div>
                      {isLow && (
                        <span className="low-stock-badge">Low Stock</span>
                      )}
                    </div>

                    <div className="material-stats">
                      <div className="material-stat">
                        <span className="stat-label">Available</span>
                        <span className="stat-val">{remaining} {material.unit}</span>
                      </div>
                      <div className="material-stat">
                        <span className="stat-label">Used</span>
                        <span className="stat-val">{material.quantity_used} {material.unit}</span>
                      </div>
                      <div className="material-stat">
                        <span className="stat-label">Cost/Unit</span>
                        <span className="stat-val">Rs {material.cost_per_unit}</span>
                      </div>
                    </div>

                    {/* Stock level bar */}
                    <div className="material-progress">
                      <div className="material-progress-bar">
                        <div
                          className={`material-progress-fill ${isLow ? 'low' : ''}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="material-percentage">{percentage}% remaining</span>
                    </div>

                    <div className="material-actions">
                      <button
                        className="update-usage-btn"
                        onClick={() =>
                          handleUsageUpdate(
                            material.id,
                            material.quantity_used,
                            material.quantity_available
                          )
                        }
                      >
                        Update Usage
                      </button>
                      <button
                        className="equipment-delete-btn"
                        onClick={() => handleMaterialDelete(material.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Equipment;