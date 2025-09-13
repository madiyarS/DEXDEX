import React from 'react';

const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  disabled = false,
  className = '',
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  ...props
}) => {
  const baseInputStyles = 'w-full px-4 py-3 border rounded-xl text-lg focus:ring-2 focus:border-transparent transition-colors duration-200';
  
  const inputStyles = error
    ? 'border-red-300 focus:ring-red-500 bg-red-50'
    : 'border-gray-200 focus:ring-purple-500 bg-white hover:border-gray-300';

  const disabledStyles = disabled
    ? 'bg-gray-100 cursor-not-allowed opacity-60'
    : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div 
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              onLeftIconClick ? 'cursor-pointer hover:text-gray-600' : ''
            }`}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            ${baseInputStyles} 
            ${inputStyles} 
            ${disabledStyles}
            ${leftIcon ? 'pl-12' : ''}
            ${rightIcon ? 'pr-12' : ''}
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div 
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
              onRightIconClick ? 'cursor-pointer hover:text-gray-600' : ''
            }`}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};