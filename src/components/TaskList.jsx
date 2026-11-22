import React from 'react';
import TaskItem from './TaskItem';
import { CheckCircle, ClipboardList, SearchX } from 'lucide-react';

export default function TaskList({
  tasks,
  totalCount,
  onToggle,
  onDelete,
  hasActiveFilters
}) {
  if (totalCount === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrap">
          <ClipboardList size={36} className="text-muted" />
        </div>
        <h3 className="empty-state-title">No student tasks yet</h3>
        <p className="empty-state-desc">
          Your task list is clean! Use the button above to add assignments, exams, or reading tasks.
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrap">
          <SearchX size={36} className="text-muted" />
        </div>
        <h3 className="empty-state-title">No matching tasks found</h3>
        <p className="empty-state-desc">
          Try loosening your search terms or clearing active priority/status filters.
        </p>
      </div>
    );
  }

  return (
    <div className="task-list-section">
      <div className="task-list-header">
        <span className="task-count-label">
          Showing <strong>{tasks.length}</strong> of <strong>{totalCount}</strong> tasks
        </span>
      </div>

      <ul className="task-items-list" aria-label="Student Tasks List">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
