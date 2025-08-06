import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface StatsCardProps {
  value: string | number;
  label: string;
  backgroundColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
}

const StatsCard: React.FC<StatsCardProps> = ({
  value,
  label,
  backgroundColor = '#8B5CF6',
  textColor = 'black',
  style,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      <Text style={[styles.value, { color: textColor }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: textColor }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    marginBottom:15
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    textAlign: 'center',
    // opacity: 0.9,
  },
});

export default StatsCard;
