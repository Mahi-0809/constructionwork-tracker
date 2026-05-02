import React, { useState, useEffect } from 'react';
import {
  getTasks,
  createTask,
  deleteTask,
  updateTaskStatus
} from '../../services/taskService';
import './Tasks.css';

// Kanban columns — each status maps to a column
const COLUMNS = [
  { key: 'todo',        label: 'To Do',      color: '#888' },
  { key: 'in_progress', label: 'In Progress', color: '#2196f3' },
  { key: 'blocked',     label: 'Blocked',     color: '#f44336' },
  { key: 'done',        label: 'Done',        color: '#4caf50' },
];

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await getTasks();
    if (!error) setTasks(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const { error } = await createTask(formData);

    if (error) {
      setFormError(error.message);
    } else {
      setFormData({ title: '', description: '', priority: 'medium', due_date: '' });
      setShowForm(false);
      fetchTasks();
    }

    setFormLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    const { error } = await deleteTask(id);
    if (!error) setTasks(tasks.filter(t => t.id !== id));
  };

  const handleStatusChange = async (id, status) => {
    const { error } = await updateTaskStatus(id, status);
    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    }
  };

  // Filter tasks by status for each column
  const getTasksByStatus = (status) => {
    return tasks.filter(t => t.status === status);
  };

  // Check if task is overdue
  const isOverdue = (due_date) => {
    if (!due_date) return false;
    return new Date(due_date) < new Date();
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1 className="tasks-title">Tasks</h1>
          <p className="tasks-subtitle">{tasks.length} total tasks</p>
        </div>
        <button
          className="add-task-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {/* New task form */}
      {showForm && (
        <div className="task-form-card">
          <h2 className="form-title">Create New Task</h2>
          <form onSubmit={handleSubmit} className="task-form">

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Inspect foundation pillars"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="What needs to be done?"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
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
              {formLoading ? 'Creating...' : 'Create Task'}
            </button>
          </form>
        </div>
      )}

      {/* Kanban board */}
      {loading ? (
        <p className="tasks-loading">Loading tasks...</p>
      ) : (
        <div className="kanban-board">
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.key);

            return (
              <div key={column.key} className="kanban-column">
                {/* Column header */}
                <div
                  className="kanban-column-header"
                  style={{ borderTopColor: column.color }}
                >
                  <span className="kanban-column-title">{column.label}</span>
                  <span
                    className="kanban-column-count"
                    style={{ backgroundColor: column.color }}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                {/* Task cards in this column */}
                <div className="kanban-cards">
                  {columnTasks.length === 0 ? (
                    <p className="kanban-empty">No tasks</p>
                  ) : (
                    columnTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`task-card ${isOverdue(task.due_date) && task.status !== 'done' ? 'overdue' : ''}`}
                      >
                        {/* Priority badge */}
                        <span className={`task-priority ${task.priority}`}>
                          {task.priority}
                        </span>

                        <h3 className="task-card-title">{task.title}</h3>

                        {task.description && (
                          <p className="task-card-desc">{task.description}</p>
                        )}

                        {task.due_date && (
                          <p className={`task-due-date ${isOverdue(task.due_date) && task.status !== 'done' ? 'overdue-text' : ''}`}>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                            {isOverdue(task.due_date) && task.status !== 'done' && ' (Overdue)'}
                          </p>
                        )}

                        {/* Move task to different status */}
                        <div className="task-card-actions">
                          <select
                            className="task-status-select"
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="blocked">Blocked</option>
                            <option value="done">Done</option>
                          </select>

                          <button
                            className="task-delete-btn"
                            onClick={() => handleDelete(task.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tasks;