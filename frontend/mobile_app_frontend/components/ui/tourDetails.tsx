import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';

// 1. Define the Guide type
export type Guide = {
  name: string;
  location: string;
  rating: string;
  phone: string;
  email: string;
  tourTitle: string;
  fromDate: string;
  toDate: string;
  status: string;
  duration: string;
  groupSize: string;
  vehicleAvailability: string;
  nationality: string;
  language: string;
  avatar: string;
  mapImage: string;
};

// 2. Define the component props type
type TourGuideProfileProps = {
  onAccept?: (guide: Guide) => void;
  onDecline?: (guide: Guide) => void;
};

export const TourGuideProfile: React.FC<TourGuideProfileProps> = ({
  onAccept,
  onDecline,
}) => {
  const guideData: Guide = {
    name: "Kriston Watshon",
    location: "England - Female",
    rating: "5.0",
    phone: "+64 145 5684 78",
    email: "KristonWatshon@Gmail.Com",
    tourTitle: "Temple of Tooth",
    fromDate: "06/25/2025",
    toDate: "06/25/2025",
    status: "No Current Schedule",
    duration: "1 Day",
    groupSize: "04",
    vehicleAvailability: "Available",
    nationality: "American",
    language: "English",
    avatar: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=KW",
    mapImage: "https://via.placeholder.com/400x200/10B981/FFFFFF?text=Map+View"
  };

  const handleAccept = () => {
    if (onAccept) onAccept(guideData);
    console.log('Guide accepted:', guideData.name);
  };

  const handleDecline = () => {
    if (onDecline) onDecline(guideData);
    console.log('Guide declined:', guideData.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.profileRow}>
            <Image
              source={{ uri: guideData.avatar }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {guideData.name}
              </Text>
              <Text style={styles.location}>
                {guideData.location}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>{guideData.rating}</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>{guideData.phone}</Text>
            </View>
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactText}>{guideData.email}</Text>
            </View>
          </View>
        </View>

        {/* Guide Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailsBadge}>
            <Text style={styles.detailsBadgeText}>Guide Details</Text>
          </View>

          {/* Map Placeholder */}
          <View style={styles.mapContainer}>
            <Image
              source={{ uri: guideData.mapImage }}
              style={styles.mapImage}
            />
            {/* Blue route line overlay */}
            <View style={styles.routeOverlay}>
              <View style={styles.routeLine}></View>
            </View>
          </View>

          {/* Tour Details */}
          <View style={styles.tourDetails}>
            <Text style={styles.tourTitle}>
              {guideData.tourTitle}
            </Text>

            <View style={styles.dateRow}>
              <View style={styles.dateColumn}>
                <Text style={styles.dateLabel}>From</Text>
                <Text style={styles.dateValue}>{guideData.fromDate}</Text>
              </View>
              <View style={styles.dateColumn}>
                <Text style={styles.dateLabel}>To</Text>
                <Text style={styles.dateValue}>{guideData.toDate}</Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusText}>{guideData.status}</Text>
              <Text style={styles.durationText}>{guideData.duration}</Text>
            </View>

            {/* Details Grid */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Group Size</Text>
                <Text style={styles.detailValue}>{guideData.groupSize}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Vehicle Availability</Text>
                <Text style={styles.detailValue}>{guideData.vehicleAvailability}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nationality</Text>
                <Text style={styles.detailValue}>{guideData.nationality}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Language Preference</Text>
                <Text style={styles.detailValue}>{guideData.language}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.acceptButton}
            onPress={handleAccept}
            activeOpacity={0.8}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.declineButton}
            onPress={handleDecline}
            activeOpacity={0.8}
          >
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Demo component for testing
export const TourGuideProfileDemo: React.FC = () => {
  const handleAccept = (guide: Guide) => {
    Alert.alert(`Accepted guide: ${guide.name}`);
  };

  const handleDecline = (guide: Guide) => {
    Alert.alert(`Declined guide: ${guide.name}`);
  };

  return (
    <View style={styles.demoContainer}>
      <TourGuideProfile 
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
    </View>
  );
};

export default TourGuideProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
  },
  ratingContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  rating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  contactInfo: {
    marginTop: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  contactText: {
    fontSize: 16,
    color: '#374151',
  },
  detailsSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  detailsBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  detailsBadgeText: {
    fontWeight: 'bold',
    color: '#111827',
  },
  mapContainer: {
    backgroundColor: '#dcfce7',
    height: 160,
    borderRadius: 8,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  routeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: {
    width: '75%',
    height: 4,
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  tourDetails: {
    marginTop: 16,
  },
  tourTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateColumn: {
    alignItems: 'center',
  },
  dateLabel: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 4,
  },
  dateValue: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 16,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statusText: {
    color: '#d97706',
    fontWeight: '500',
  },
  durationText: {
    fontWeight: '600',
    color: '#111827',
  },
  detailsGrid: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
    color: '#111827',
  },
  detailValue: {
    color: '#374151',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#fbbf24',
    paddingVertical: 16,
    borderRadius: 16,
    marginRight: 8,
  },
  acceptButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#111827',
    fontSize: 18,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#9ca3af',
    paddingVertical: 16,
    borderRadius: 16,
    marginLeft: 8,
  },
  declineButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 18,
  },
  demoContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
});
