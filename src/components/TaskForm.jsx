import React, { useState } from 'react';
import { PlusCircle, Calendar, Tag, AlertTriangle, FileText, X } from 'lucide-react';

const COMMON_SUBJECTS = [
  'Computer Science',
  'Data Structures',
  'Database Systems',
  'Operating Systems',
  'Mathematics',
  'Cloud & DevOps',
  'Software Engineering',
  'General'
];

export default function TaskForm({ onAddTask }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [customSubject, setCustomSubject] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const finalSubject = subject === '__other__' ? customSubject.trim() || 'General' : subject;

    onAddTask({
      title,
      subject: finalSubject,
      priority,
      dueDate,
      description
    });

    // Reset form
    setTitle('');
    setCustomSubject('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setError('');
    setIsOpen(false);
  };

  return (
    <div className="task-form-wrapper">
      {!isOpen ? (
        <button
          type="button"
          className="btn-primary btn-add-trigger"
          onClick={() => setIsOpen(true)}
          aria-expanded="false"
        >
          <PlusCircle size={18} />
          <span>Add New Student Task</span>
        </button>
      ) : (
        <form className="task-form" onSubmit={handleSubmit} noValidate>
          <div className="task-form-header">
            <h3>Add New Task</h3>
            <button
              type="button"
              className="btn-ghost-close"
              onClick={() => {
                setIsOpen(false);
                setError('');
              }}
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          {error && (
            <div className="form-error-alert" role="alert">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title <span className="text-required">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              className={`form-input ${error ? 'input-invalid' : ''}`}
              placeholder="e.g. Implement Dijkstra's Algorithm in Java"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="task-subject" className="form-label">
                <Tag size={13} /> Subject / Course
              </label>
              <select
                id="task-subject"
                className="form-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {COMMON_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
                <option value="__other__">+ Custom Subject...</option>
              </select>
              {subject === '__other__' && (
                <input
                  type="text"
                  className="form-input mt-2"
                  placeholder="Enter subject name..."
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                />
              )}
            </div>

            <div className="form-group">
              <label htmlFor="task-due-date" className="form-label">
                <Calendar size={13} /> Due Date
              </label>
              <input
                id="task-due-date"
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Priority Level</label>
            <div className="priority-selector" role="radiogroup" aria-label="Priority">
              {['Low', 'Medium', 'High'].map((p) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={priority === p}
                  className={`priority-chip priority-${p.toLowerCase()} ${
                    priority === p ? 'priority-selected' : ''
                  }`}
                  onClick={() => setPriority(p)}
                >
                  <span className={`priority-dot dot-${p.toLowerCase()}`}></span>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">
              <FileText size={13} /> Description &amp; Notes (Optional)
            </label>
            <textarea
              id="task-description"
              className="form-textarea"
              rows={2}
              placeholder="Add assignment details, reference links or requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setIsOpen(false);
                setError('');
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <PlusCircle size={16} />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
