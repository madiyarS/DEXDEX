import { useState, useCallback, useRef } from 'react';
import { NOTIFICATION_TIMEOUT } from '../utils/constants.js';

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const timeoutRefs = useRef({});

  // Add notification
  const addNotification = useCallback((message, type = 'success', duration = NOTIFICATION_TIMEOUT) => {
    const id = Date.now() + Math.random();
    
    const notification = {
      id,
      message,
      type,
      timestamp: Date.now()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration
    if (duration > 0) {
      timeoutRefs.current[id] = setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    // Clear timeout if exists
    if (timeoutRefs.current[id]) {
      clearTimeout(timeoutRefs.current[id]);
      delete timeoutRefs.current[id];
    }
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    // Clear all timeouts
    Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = {};
    
    setNotifications([]);
  }, []);

  // Specific notification types
  const showSuccess = useCallback((message, duration) => {
    return addNotification(message, 'success', duration);
  }, [addNotification]);

  const showError = useCallback((message, duration) => {
    return addNotification(message, 'error', duration);
  }, [addNotification]);

  const showWarning = useCallback((message, duration) => {
    return addNotification(message, 'warning', duration);
  }, [addNotification]);

  const showInfo = useCallback((message, duration) => {
    return addNotification(message, 'info', duration);
  }, [addNotification]);

  // Get notification count by type
  const getNotificationCount = useCallback((type = null) => {
    if (type) {
      return notifications.filter(n => n.type === type).length;
    }
    return notifications.length;
  }, [notifications]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    getNotificationCount
  };
};