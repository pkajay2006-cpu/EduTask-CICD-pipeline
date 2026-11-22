import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import PipelineStatusBadge from './components/PipelineStatusBadge';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import { useTasks } from './hooks/useTasks';
import { GitBranch, ShieldCheck, Github } from 'lucide-react';
import './App.css';

export default function App() {
  const {
    tasks,
    addTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    resetToDefault,
    metrics
  } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // Extract unique subjects
  const subjects = useMemo(() => {
    const set = new Set();
    tasks.forEach(t => {
      if (t.subject) set.add(t.subject);
    });
    return Array.from(set).sort();
  }, [tasks]);

  // Priority weight for sorting
  const priorityWeight = { High: 3, Medium: 2, Low: 1 };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Status filter
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Subject filter
        if (subjectFilter !== 'all' && task.subject !== subjectFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchSubject = task.subject?.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          if (!matchTitle && !matchSubject && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        } else if (sortBy === 'priority') {
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        } else if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, subjectFilter, searchQuery, sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    subjectFilter !== 'all';

  return (
    <div className="app-layout">
      <Header
        onReset={resetToDefault}
        totalTasks={metrics.totalTasks}
        completedTasks={metrics.completedTasks}
      />

      <main className="main-container">
        {/* Architecture & CI/CD Pipeline Info */}
        <PipelineStatusBadge />

        {/* Real-time Task Metrics Dashboard */}
        <Dashboard metrics={metrics} tasks={tasks} />

        {/* Task Management Section */}
        <div className="task-workspace">
          <div className="workspace-header">
            <h2 className="section-title">Coursework &amp; Assignments</h2>
            <TaskForm onAddTask={addTask} />
          </div>

          <FilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            subjectFilter={subjectFilter}
            setSubjectFilter={setSubjectFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            subjects={subjects}
            completedCount={metrics.completedTasks}
            onClearCompleted={clearCompleted}
          />

          <TaskList
            tasks={filteredTasks}
            totalCount={tasks.length}
            onToggle={toggleTask}
            onDelete={deleteTask}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-brand">EduTask CI/CD Pipeline</span>
            <span className="footer-sep">&bull;</span>
            <span>React + Vite + GitHub Actions + GitHub Pages</span>
          </div>
          <div className="footer-right">
            <span className="footer-badge">
              <ShieldCheck size={14} className="text-emerald" /> Automated Quality Gates
            </span>
            <span className="footer-badge">
              <GitBranch size={14} className="text-indigo" /> Branch: <code>main</code>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
