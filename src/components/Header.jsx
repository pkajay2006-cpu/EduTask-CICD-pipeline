import React from 'react';
import { GraduationCap, GitBranch, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Header({ onReset, totalTasks, completedTasks }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-group">
          <div className="logo-badge">
            <GraduationCap className="logo-icon" size={28} />
          </div>
          <div>
            <div className="title-row">
              <h1 className="brand-title">EduTask</h1>
              <span className="version-pill">v1.0.0</span>
            </div>
            <p className="brand-subtitle">
              Student Task Manager &bull; Continuous Integration &amp; Deployment Pipeline
            </p>
          </div>
        </div>

        <div className="header-actions">
          <div className="date-badge">
            <Sparkles size={14} className="sparkle-icon" />
            <span>{today}</span>
          </div>

          <div className="pipeline-indicator" title="Continuously tested and deployed via GitHub Actions">
            <GitBranch size={15} />
            <span>CI/CD Active</span>
            <span className="live-dot"></span>
          </div>

          <button
            type="button"
            className="btn-secondary btn-icon"
            onClick={onReset}
            title="Reset sample student tasks"
            aria-label="Reset sample student tasks"
          >
            <RefreshCw size={15} />
            <span className="btn-label">Reset Sample Data</span>
          </button>
        </div>
      </div>
    </header>
  );
}
