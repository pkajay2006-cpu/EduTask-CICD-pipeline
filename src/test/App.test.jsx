import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Student Task Manager - App & CI/CD Automated Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the header and dashboard metrics correctly', () => {
    render(<App />);

    // Brand and Header
    expect(screen.getByText('EduTask')).toBeInTheDocument();
    expect(screen.getByText(/Student Task Manager/i)).toBeInTheDocument();

    // Dashboard Metric Labels
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completion Rate')).toBeInTheDocument();

    // Initial tasks metric values (5 initial tasks: 2 completed, 3 pending => 40% completion)
    expect(screen.getByRole('heading', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '40%' })).toBeInTheDocument();
  });

  it('allows user to open the form and add a new task', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click trigger to open form
    const openFormBtn = screen.getByRole('button', { name: /Add New Student Task/i });
    await user.click(openFormBtn);

    // Verify form opened
    expect(screen.getByRole('heading', { name: 'Add New Task' })).toBeInTheDocument();

    // Fill in task details
    const titleInput = screen.getByLabelText(/Task Title/i);
    await user.type(titleInput, 'Design Cloud Architecture Diagram');

    const subjectSelect = screen.getByLabelText(/Subject \/ Course/i);
    await user.selectOptions(subjectSelect, 'Cloud & DevOps');

    // Click High Priority
    const highPriorityBtn = screen.getByRole('radio', { name: /High/i });
    await user.click(highPriorityBtn);

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitBtn);

    // Verify new task appears in list
    expect(screen.getByText('Design Cloud Architecture Diagram')).toBeInTheDocument();

    // Verify dashboard metrics updated (now 6 total, 4 pending, 2 completed)
    expect(screen.getByRole('heading', { name: '6' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '4' })).toBeInTheDocument();
  });

  it('validates that empty task titles cannot be submitted', async () => {
    const user = userEvent.setup();
    render(<App />);

    const openFormBtn = screen.getByRole('button', { name: /Add New Student Task/i });
    await user.click(openFormBtn);

    // Submit without title
    const submitBtn = screen.getByRole('button', { name: /Create Task/i });
    await user.click(submitBtn);

    // Error message should appear
    expect(screen.getByRole('alert')).toHaveTextContent(/Task title is required/i);

    // Total tasks should remain 5
    expect(screen.getByRole('heading', { name: '5' })).toBeInTheDocument();
  });

  it('toggles task completion status and updates counters', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initial: 3 pending, 2 completed
    expect(screen.getByRole('heading', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2' })).toBeInTheDocument();

    // Toggle "Complete Binary Search Tree Implementation" (which is pending)
    const toggleBtn = screen.getByRole('button', {
      name: /Mark "Complete Binary Search Tree Implementation" as completed/i
    });
    await user.click(toggleBtn);

    // Now pending should be 2, completed should be 3
    expect(screen.getByRole('heading', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '3' })).toBeInTheDocument();

    // Toggle back to pending
    const toggleBackBtn = screen.getByRole('button', {
      name: /Mark "Complete Binary Search Tree Implementation" as pending/i
    });
    await user.click(toggleBackBtn);

    // Restores to 3 pending, 2 completed
    expect(screen.getByRole('heading', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2' })).toBeInTheDocument();
  });

  it('deletes a task when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Submit SQL Normalization Assignment')).toBeInTheDocument();

    const deleteBtn = screen.getByRole('button', {
      name: /Delete task "Submit SQL Normalization Assignment"/i
    });
    await user.click(deleteBtn);

    // Should no longer exist in the document
    expect(screen.queryByText('Submit SQL Normalization Assignment')).not.toBeInTheDocument();

    // Total tasks should now be 4
    expect(screen.getByRole('heading', { name: '4' })).toBeInTheDocument();
  });

  it('filters tasks by status: Pending, Completed, All', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click "Pending" tab
    const pendingTab = screen.getByRole('tab', { name: 'Pending' });
    await user.click(pendingTab);

    // Pending tasks should be visible
    expect(screen.getByText('Complete Binary Search Tree Implementation')).toBeInTheDocument();
    // Completed tasks should NOT be visible
    expect(screen.queryByText('Submit SQL Normalization Assignment')).not.toBeInTheDocument();

    // Click "Completed" tab
    const completedTab = screen.getByRole('tab', { name: 'Completed' });
    await user.click(completedTab);

    // Completed tasks should be visible
    expect(screen.getByText('Submit SQL Normalization Assignment')).toBeInTheDocument();
    // Pending tasks should NOT be visible
    expect(screen.queryByText('Complete Binary Search Tree Implementation')).not.toBeInTheDocument();

    // Click "All" tab
    const allTab = screen.getByRole('tab', { name: 'All' });
    await user.click(allTab);

    expect(screen.getByText('Complete Binary Search Tree Implementation')).toBeInTheDocument();
    expect(screen.getByText('Submit SQL Normalization Assignment')).toBeInTheDocument();
  });

  it('filters tasks by search input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByLabelText(/Search tasks/i);
    await user.type(searchInput, 'Binary Search');

    expect(screen.getByText('Complete Binary Search Tree Implementation')).toBeInTheDocument();
    expect(screen.queryByText('Submit SQL Normalization Assignment')).not.toBeInTheDocument();
    expect(screen.queryByText('Read Chapter 4: CPU Scheduling Algorithms')).not.toBeInTheDocument();
  });

  it('persists changes to localStorage', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Toggle a task
    const toggleBtn = screen.getByRole('button', {
      name: /Mark "Complete Binary Search Tree Implementation" as completed/i
    });
    await user.click(toggleBtn);

    const storedData = localStorage.getItem('edutask_student_tasks_v1');
    expect(storedData).not.toBeNull();
    const parsed = JSON.parse(storedData);
    const updatedTask = parsed.find(t => t.title === 'Complete Binary Search Tree Implementation');
    expect(updatedTask.completed).toBe(true);
  });
});
