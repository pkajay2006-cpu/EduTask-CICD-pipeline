import React from 'react';
import { Search, Filter, X, Trash2, ArrowUpDown } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  subjectFilter,
  setSubjectFilter,
  sortBy,
  setSortBy,
  subjects,
  completedCount,
  onClearCompleted
}) {
  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    subjectFilter !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setSubjectFilter('all');
  };

  return (
    <div className="filter-bar-container">
      {/* Search Input */}
      <div className="search-box-wrapper">
        <Search className="search-icon" size={16} />
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks, subjects, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tasks"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Filter and Sort Controls */}
      <div className="filter-controls-row">
        {/* Status Tabs */}
        <div className="status-tabs" role="tablist" aria-label="Filter tasks by status">
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'all'}
            className={`status-tab ${statusFilter === 'all' ? 'tab-active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'pending'}
            className={`status-tab ${statusFilter === 'pending' ? 'tab-active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={statusFilter === 'completed'}
            className={`status-tab ${statusFilter === 'completed' ? 'tab-active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </button>
        </div>

        {/* Dropdowns */}
        <div className="filter-dropdowns">
          {/* Priority filter */}
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>

          {/* Subject filter */}
          <select
            className="filter-select"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            aria-label="Filter by subject"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>

          {/* Sort order */}
          <div className="sort-group">
            <ArrowUpDown size={14} className="sort-icon" />
            <select
              className="filter-select sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tasks by"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="newest">Sort by Newest</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="filter-actions-right">
          {hasActiveFilters && (
            <button
              type="button"
              className="btn-filter-clear"
              onClick={clearAllFilters}
            >
              Clear Filters
            </button>
          )}

          {completedCount > 0 && (
            <button
              type="button"
              className="btn-clear-completed"
              onClick={onClearCompleted}
              title="Remove all completed tasks"
            >
              <Trash2 size={13} />
              <span>Clear Completed ({completedCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
