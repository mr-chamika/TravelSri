import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BookingService from '../../../services/BookingService';

interface BookingStatsProps {
  guideId: string;
  onStatsPress?: (statType: string) => void;
}

interface BookingStats {
  totalBookings: number;
  pendingRequests: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: string;
}

export const BookingStatsComponent: React.FC<BookingStatsProps> = ({ 
  guideId, 
  onStatsPress 
}) => {
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [guideId]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await BookingService.getBookingStats(guideId);
      setStats(data);
    } catch (error) {
      console.error('Error loading booking stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string) => {
    return BookingService.formatCurrency(amount, 'LKR');
  };

  const renderStatCard = (
    title: string,
    value: number | string,
    icon: string,
    color: string,
    statType?: string
  ) => (
    <TouchableOpacity
      style={[styles.statCard, { borderLeftColor: color }]}
      onPress={() => onStatsPress && statType && onStatsPress(statType)}
    >
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.statValue}>{value}</Text>
      </View>
      <Text style={styles.statTitle}>{title}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Booking Overview</Text>
      
      <View style={styles.statsGrid}>
        {renderStatCard(
          'Pending Requests',
          stats.pendingRequests,
          'hourglass-empty',
          '#F59E0B',
          'pending'
        )}
        
        {renderStatCard(
          'Confirmed Bookings',
          stats.confirmedBookings,
          'event-available',
          '#10B981',
          'confirmed'
        )}
      </View>
      
      <View style={styles.statsGrid}>
        {renderStatCard(
          'Completed Services',
          stats.completedBookings,
          'done-all',
          '#059669',
          'completed'
        )}
        
        {renderStatCard(
          'Total Bookings',
          stats.totalBookings,
          'assessment',
          '#3B82F6',
          'all'
        )}
      </View>
      
      <View style={styles.earningsCard}>
        <View style={styles.earningsHeader}>
          <Icon name="attach-money" size={28} color="#059669" />
          <View style={styles.earningsContent}>
            <Text style={styles.earningsValue}>
              {formatCurrency(stats.totalEarnings)}
            </Text>
            <Text style={styles.earningsLabel}>Total Earnings</Text>
          </View>
        </View>
        
        {stats.cancelledBookings > 0 && (
          <View style={styles.cancelledInfo}>
            <Icon name="cancel" size={16} color="#EF4444" />
            <Text style={styles.cancelledText}>
              {stats.cancelledBookings} cancelled booking{stats.cancelledBookings > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={loadStats}
      >
        <Icon name="refresh" size={20} color="#3B82F6" />
        <Text style={styles.refreshText}>Refresh Statistics</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statTitle: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  earningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  earningsContent: {
    marginLeft: 16,
    flex: 1,
  },
  earningsValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#059669',
  },
  earningsLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  cancelledInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelledText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 6,
    fontWeight: '500',
  },
  refreshButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3B82F6',
    gap: 8,
  },
  refreshText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BookingStatsComponent;