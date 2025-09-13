import React from 'react';
import { CheckCircle, AlertTriangle, Info, X, AlertCircle } from 'lucide-react';

const Notification = ({ 
  notification, 
  onRemove, 
  position = 'top-right' 
}) => {
  const { id, message, type, timestamp } = notification;

  const typeStyles = {
    success: {
      bgColor: 'bg-green-500',
      icon: CheckCircle,
      iconColor: 'text-white'
    },
    error: {
      bgColor: 'bg-red-500',
      icon: AlertTriangle,
      iconColor: 'text-white'
    },
    warning: {
      bgColor: 'bg-yellow-500',
      icon: AlertCircle,
      iconColor: 'text-white'
    },
    info: {
      bgColor: 'bg-blue-500',
      icon: Info,
      iconColor: 'text-white'
    }
  };

  const config = typeStyles[type] || typeStyles.info;
  const IconComponent = config.icon;

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div 
      className={`
        fixed z-50 max-w-md w-full mx-4
        ${positionStyles[position]}
        animate-in slide-in-from-top-2 duration-300
      `}
    >
      <div className={`
        ${config.bgColor} text-white rounded-lg shadow-lg p-4
        flex items-center gap-3
        backdrop-blur-sm border border-white/20
      `}>
        <IconComponent size={20} className={config.iconColor} />
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium break-words">
            {message}
          </p>
          {timestamp && (
            <p className="text-xs opacity-80 mt-1">
              {new Date(timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onRemove(id)}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Container component for multiple notifications
export const NotificationContainer = ({ notifications, onRemove, position = 'top-right' }) => {
  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            zIndex: 1000 + index,
            ...(notifications.length > 1 && {
              transform: `translateY(${index * 10}px)`,
              opacity: 1 - (index * 0.1)
            })
          }}
        >
          <Notification
            notification={notification}
            onRemove={onRemove}
            position={position}
          />
        </div>
      ))}
    </>
  );
};

export default Notification;