/**
 * Task Notification Component
 * Shows in-app notification when a new task is received
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import { FriendsService, type TaskRitual } from '../services/friendsService';
import { getCurrentUser } from '../services/firebase';

interface TaskNotificationProps {
  onTaskClick?: (task: TaskRitual) => void;
}

export const TaskNotification: React.FC<TaskNotificationProps> = ({ onTaskClick }) => {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    task: TaskRitual;
    creatorName: string;
  }>>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    // Subscribe to tasks and show notifications for new pending tasks
    const unsubscribe = FriendsService.subscribeToTasks((tasks) => {
      const pendingTasks = tasks.filter(
        t => t.assigneeId === currentUser.uid && t.status === 'pending'
      );
      
      // Check for new tasks (created within last 30 seconds)
      const now = Date.now();
      const newTasks = pendingTasks.filter(t => {
        const createdAt = t.createdAt instanceof Timestamp ? t.createdAt.toMillis() : t.createdAt;
        return now - createdAt < 30000; // 30 seconds
      });

      // Show notifications for new tasks
      newTasks.forEach(task => {
        setNotifications(prev => {
          if (prev.some(n => n.id === task.id)) return prev;
          return [...prev, {
            id: task.id,
            task,
            creatorName: 'Someone', // Could be fetched from user profile
          }];
        });

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== task.id));
        }, 10000);
      });
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = useCallback((taskId: string) => {
    void FriendsService.respondToTask(taskId, 'accepted');
    setNotifications(prev => prev.filter(n => n.id !== taskId));
  }, []);

  const handleDismiss = useCallback((taskId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== taskId));
  }, []);

  const handleClick = useCallback((task: TaskRitual) => {
    onTaskClick?.(task);
    setNotifications(prev => prev.filter(n => n.id !== task.id));
  }, [onTaskClick]);

  if (notifications.length === 0) return null;

  return (
    <div className="task-notification-container">
      {notifications.map(({ id, task }) => (
        <div key={id} className="task-notification">
          <div className="task-notification__header">
            <span className="task-notification__icon">📜</span>
            <span className="task-notification__title">New Task Assigned</span>
          </div>
          <div 
            className="task-notification__content"
            onClick={() => handleClick(task)}
            style={{ cursor: 'pointer' }}
          >
            <strong>{task.title}</strong>
            {task.description && (
              <p style={{ margin: '4px 0 0', opacity: 0.8 }}>{task.description}</p>
            )}
          </div>
          {task.hekaDate && (
            <div className="task-notification__date">
              Due: Arc {task.hekaDate.month + 1}, Day {task.hekaDate.day}, {task.hekaDate.year}
            </div>
          )}
          <div className="task-notification__actions">
            <button 
              className="btn btn--sm btn--primary"
              onClick={() => handleAccept(id)}
            >
              ✓ Accept
            </button>
            <button 
              className="btn btn--sm"
              onClick={() => handleDismiss(id)}
            >
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskNotification;
