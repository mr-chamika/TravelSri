import React from 'react';
import { TextInput, View, Text, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '',
  ...props 
}) => {
  return (
    <View className={className}>
      {label && (
        <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      )}
      <TextInput
        className={`border border-gray-300 rounded-lg px-4 py-3 text-gray-900 ${
          error ? 'border-red-500' : 'focus:border-blue-500'
        }`}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};
