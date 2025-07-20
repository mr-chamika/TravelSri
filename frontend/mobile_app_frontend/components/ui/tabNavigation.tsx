import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ColorValue } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TabNavigationProps {
  selectedTab: 'requests' | 'calendar';
  onTabChange: (tab: 'requests' | 'calendar') => void;
  gradientColors?: readonly [ColorValue, ColorValue, ...ColorValue[]];
  pendingCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  selectedTab,
  onTabChange,
  pendingCount,
  gradientColors = ['rgba(254, 250, 23, 1)', 'rgba(255, 215, 0, 0.9)', 'rgba(255, 196, 0, 0.8)'],
}) => {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'requests' && styles.activeTabButton
          ]}
          onPress={() => onTabChange('requests')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'requests' ? styles.activeTabText : styles.inactiveTabText
          ]}>
            Booking Requests ({pendingCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'calendar' && styles.activeTabButton
          ]}
          onPress={() => onTabChange('calendar')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'calendar' ? styles.activeTabText : styles.inactiveTabText
          ]}>
            Calendar
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabRow: {
    flexDirection: 'row',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#2563EB',
  },
  inactiveTabText: {
    color: '#6B7280',
  },
});

export default TabNavigation;
