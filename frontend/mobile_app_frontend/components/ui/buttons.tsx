import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'rounded-lg items-center justify-center flex-row';
  
  const variantClasses = {
    primary: disabled ? 'bg-gray-400' : 'bg-blue-600',
    secondary: disabled ? 'bg-gray-300' : 'bg-gray-500',
    outline: `border-2 ${disabled ? 'border-gray-300' : 'border-blue-600'} bg-transparent`
  };
  
  const sizeClasses = {
    sm: 'py-2 px-4',
    md: 'py-3 px-6',
    lg: 'py-4 px-8'
  };

  const getTextColor = () => {
    if (disabled) return 'text-gray-500';
    if (variant === 'outline') return 'text-blue-600';
    return 'text-white';
  };

  return (
    <TouchableOpacity 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' ? '#2563eb' : '#ffffff'} 
          className="mr-2"
        />
      )}
      <Text className={`font-semibold ${getTextColor()}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};