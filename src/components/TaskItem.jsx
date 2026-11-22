import React, { useState } from 'react';
import { Check, Trash2, Calendar, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

const SUBJECT_COLORS = {
  'Data Structures': 'tag-blue',
  'Database Systems': 'tag-purple',
  'Operating Systems': 'tag-amber',
  'Cloud & DevOps': 'tag-cyan',
  'Linear Algebra': 'tag-emerald',
  'Mathematics': 'tag-emerald',
  'Computer Science': 'tag-indigo',
  'Software Engineering': 'tag-rose'
};

export default function TaskItem({ task, onToggle, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  // Format due date relative to today
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString + 'T00:00:00');

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)}d overdue`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Due today', isDueSoon: true };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', isDueSoon: true };
    } else {
      return {
        text: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        isOverdue: false
      };
    }
  };

  const dueInfo = formatDueDate(task.dueDate);
  const tagClass = SUBJECT_COLORS[task.subject] || 'tag-gray';

  return (
    <li className={`task-item ${task.completed ? 'task-completed' : ''}`}>
      <div className="task-item-main">
        {/* Toggle Checkbox */}
        <button
          type="button"
          className={`task-checkbox ${task.completed ? 'checkbox-checked' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
        >
          {task.completed && <Check size={14} strokeWidth={3} />}
        </button>

        {/* Task Content */}
        <div className="task-content">
          <div className="task-title-line">
            <span className={`task-title ${task.completed ? 'text-strikethrough' : ''}`}>
              {task.title}
            </span>
          </div>

          <div className="task-meta-row">
            {/* Subject badge */}
            <span className={`task-badge ${tagClass}`}>{task.subject}</span>

            {/* Priority badge */}
            <span className={`priority-indicator priority-${task.priority.toLowerCase()}`}>
              <span className={`priority-dot dot-${task.priority.toLowerCase()}`}></span>
              {task.priority}
            </span>

            {/* Due date badge */}
            {dueInfo && (
              <span
                className={`task-due-badge ${
                  dueInfo.isOverdue && !task.completed
                    ? 'due-overdue'
                    : dueInfo.isDueSoon && !task.completed
                    ? 'due-soon'
                    : ''
                }`}
              >
                {dueInfo.isOverdue && !task.completed ? (
                  <AlertCircle size={12} />
                ) : (
                  <Calendar size={12} />
                )}
                <span>{dueInfo.text}</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="task-actions">
          {task.description && (
            <button
              type="button"
              className="btn-icon-subtle"
              onClick={() => setShowDetails(!showDetails)}
              aria-label={showDetails ? 'Hide task details' : 'Show task details'}
              title={showDetails ? 'Hide details' : 'Show details'}
            >
              {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}

          <button
            type="button"
            className="btn-icon-danger"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task "${task.title}"`}
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable description */}
      {showDetails && task.description && (
        <div className="task-details-pane">
          <p className="task-description-text">{task.description}</p>
        </div>
      )}
    </li>
  );
}
