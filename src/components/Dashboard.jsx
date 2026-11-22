import React from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';

export default function Dashboard({ metrics, tasks }) {
  const { totalTasks, completedTasks, pendingTasks, completionRate } = metrics;

  // Calculate high priority pending tasks
  const highPriorityPending = tasks.filter(t => !t.completed && t.priority === 'High').length;

  // Calculate overdue or tasks due today
  const todayStr = new Date().toISOString().split('T')[0];
  const dueSoonCount = tasks.filter(t => !t.completed && t.dueDate && t.dueDate <= todayStr).length;

  return (
    <section className="dashboard-section" aria-label="Dashboard Overview">
      <div className="dashboard-grid">
        {/* Total Tasks Card */}
        <div className="metric-card metric-total">
          <div className="metric-card-content">
            <div className="metric-info">
              <span className="metric-label">Total Tasks</span>
              <h2 className="metric-value">{totalTasks}</h2>
              <span className="metric-caption">All registered coursework</span>
            </div>
            <div className="metric-icon-wrapper icon-blue">
              <ListTodo size={24} />
            </div>
          </div>
          <div className="metric-footer">
            <BookOpen size={13} />
            <span>Across all enrolled subjects</span>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="metric-card metric-pending">
          <div className="metric-card-content">
            <div className="metric-info">
              <span className="metric-label">Pending Tasks</span>
              <h2 className="metric-value">{pendingTasks}</h2>
              <span className="metric-caption">
                {highPriorityPending > 0 ? (
                  <span className="text-warning-bold">{highPriorityPending} high priority</span>
                ) : (
                  'In progress & queued'
                )}
              </span>
            </div>
            <div className="metric-icon-wrapper icon-amber">
              <Clock size={24} />
            </div>
          </div>
          <div className="metric-footer">
            {dueSoonCount > 0 ? (
              <span className="text-danger flex-center-gap">
                <AlertCircle size={13} /> {dueSoonCount} due today or overdue
              </span>
            ) : (
              <span>All deadlines on schedule</span>
            )}
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="metric-card metric-completed">
          <div className="metric-card-content">
            <div className="metric-info">
              <span className="metric-label">Completed Tasks</span>
              <h2 className="metric-value">{completedTasks}</h2>
              <span className="metric-caption">Successfully finished</span>
            </div>
            <div className="metric-icon-wrapper icon-emerald">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="metric-footer">
            <TrendingUp size={13} />
            <span>Verified and recorded</span>
          </div>
        </div>

        {/* Productivity & Progress Card */}
        <div className="metric-card metric-progress">
          <div className="metric-card-content">
            <div className="metric-info">
              <span className="metric-label">Completion Rate</span>
              <h2 className="metric-value">{completionRate}%</h2>
              <span className="metric-caption">Overall student progress</span>
            </div>
            <div className="metric-icon-wrapper icon-purple">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionRate}%` }}
              role="progressbar"
              aria-valuenow={completionRate}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
