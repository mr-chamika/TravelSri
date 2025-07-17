import React from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageUploadProps {
  label: string;
  placeholder: string;
  imageUri: string | null;
  onPress: () => void;
  error?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  placeholder,
  imageUri,
  onPress,
  error,
  className = '',
}) => {
  return (
    <View className={className}>
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <TouchableOpacity
        onPress={onPress}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center min-h-[120px] ${
          error ? 'border-red-500' : ''
        }`}
      >
        {imageUri ? (
          <View className="items-center">
            <Image
              source={{ uri: imageUri }}
              className="w-20 h-20 rounded-lg mb-2"
              resizeMode="cover"
            />
            <Text className="text-gray-600 text-sm">Tap to change</Text>
          </View>
        ) : (
          <View className="items-center">
            <Ionicons name="cloud-upload-outline" size={32} color="#9CA3AF" />
            <Text className="text-gray-500 text-center mt-2">{placeholder}</Text>
          </View>
        )}
      </TouchableOpacity>
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
};