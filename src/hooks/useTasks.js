import { useState, useEffect } from 'react';
import { initialTasks } from '../data/initialTasks';

const STORAGE_KEY = 'edutask_student_tasks_v1';

export function useTasks() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Failed to load tasks from localStorage', e);
    }
    return initialTasks;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);

  const addTask = ({ title, subject, priority, dueDate, description }) => {
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      subject: subject?.trim() || 'General',
      priority: priority || 'Medium',
      dueDate: dueDate || '',
      description: description?.trim() || '',
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed));
  };

  const resetToDefault = () => {
    setTasks(initialTasks);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    tasks,
    addTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    resetToDefault,
    metrics: {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate
    }
  };
}
