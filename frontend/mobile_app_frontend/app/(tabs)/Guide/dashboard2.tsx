import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

// Import individual components
import StatsCard from '../../../components/ui/starCard';
import MenuItem from '../../../components/ui/menuItem';
import Header from '../../../components/ui/header';
import Topbar from '../../../components/topbar';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, } from "react-native-reanimated";
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import BookingScreen from './bookings';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Type definitions
interface Stats {
  activeBookings: string;
  rating: string;
  totalTours: string;
  earnings: string;
}

export type GuideStackParamList = {
  Home: undefined;
  bookings: undefined;
  Profile: undefined;
  Availability: undefined;
  Packages: undefined;
  Earnings: undefined;
};

type GuideNavigation = NativeStackNavigationProp<GuideStackParamList>;

const Stack = createNativeStackNavigator<GuideStackParamList>();

// Stats Grid Component
const StatsGrid = ({ stats }: { stats: Stats }) => (
  <View style={styles.statsGrid}>
    <StatsCard 
      value={stats.activeBookings} 
      label="Active Bookings" 
      backgroundColor="rgba(255, 196, 0, 0.8)"
    />
    <StatsCard 
      value={stats.rating} 
      label="Rating" 
      backgroundColor="rgba(255, 196, 0, 0.8)"
    />
    <StatsCard 
      value={stats.totalTours} 
      label="Total Tours" 
      backgroundColor="rgba(255, 196, 0, 0.8)"
    />
    <StatsCard 
      value={stats.earnings} 
      label="This Month" 
      backgroundColor="rgba(255, 215, 0, 0.9)"
    />
  </View>
);

// Menu List Component
interface MenuItemData {
  icon: string;
  title: string;
  subtitle: string;
  id: string;
}

interface MenuListProps {
  menuItems: MenuItemData[];
  onMenuItemPress: (item: MenuItemData) => void;
}

const MenuList = ({ menuItems, onMenuItemPress }: MenuListProps) => (
  <View style={styles.menuList}>
    {menuItems.map((item: MenuItemData, index: number) => (
      <MenuItem
        key={index}
        icon={item.icon}
        title={item.title}
        subtitle={item.subtitle}
        onPress={() => onMenuItemPress(item)}
        iconBackgroundColor="rgba(255, 196, 0, 0.8)"
      />
    ))}
  </View>
);

// Main Dashboard Component (Home Screen)
const TravelMateGuideHome = () => {
  const stats = {
    activeBookings: '12',
    rating: '4.9',
    totalTours: '47',
    earnings: '$2,340'
  };

  const navigation = useNavigation<GuideNavigation>();

  const menuItems = [
    {
      icon: '📋',
      title: 'Booking Requests',
      subtitle: '5 pending requests',
      id: 'bookings'
    },
    {
      icon: '👤',
      title: 'My Profile',
      subtitle: 'Manage your guide profile',
      id: 'profile'
    },
    {
      icon: '📅',
      title: 'Availability',
      subtitle: 'Set your working hours',
      id: 'availability'
    },
    {
      icon: '⭐',
      title: 'My Tour Packages',
      subtitle: 'Create and manage tours',
      id: 'packages'
    },
    {
      icon: '💰',
      title: 'Earnings',
      subtitle: 'View payment history',
      id: 'earnings'
    }
  ];

  const handleMenuItemPress = (item: MenuItemData) => {
    console.log(`Pressed: ${item.title}`);
    
    switch(item.id) {
      case 'bookings':
        console.log('Navigating to bookings screen...');
        navigation.navigate('bookings');
        break;
      case 'profile':
        console.log('Navigating to profile screen...');
        // navigation.navigate('Profile');
        break;
      case 'availability':
        console.log('Navigating to availability screen...');
        // navigation.navigate('Availability');
        break;
      case 'packages':
        console.log('Navigating to packages screen...');
        // navigation.navigate('Packages');
        break;
      case 'earnings':
        console.log('Navigating to earnings screen...');
        // navigation.navigate('Earnings');
        break;
      default:
        console.log('Unknown menu item:', item.id);
        break;
    }
  };

  const [selectedDate, setSelectedDate] = useState(8);
  const [show, setShow] = useState(false);
  
  const translateX = useSharedValue(-1000);
  const opacity = useSharedValue(0);

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const toggleMenu = () => {
    setShow(!show);
    if (!show) {
      translateX.value = withTiming(0, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(1, { duration: 400 });
    } else {
      translateX.value = withTiming(-1000, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0, { duration: 300 });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Topbar pressing={toggleMenu} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header 
          userName="Sunil"
          welcomeMessage="Ready to guide travelers today?"
          gradientColors={['rgba(254, 250, 23, 1)', 'rgba(255, 215, 0, 0.9)','rgba(255, 196, 0, 0.8)']}
        />
        
        <View style={styles.content}>
          <StatsGrid stats={stats} />
          <MenuList 
            menuItems={menuItems} 
            onMenuItemPress={handleMenuItemPress}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Navigator Component - This is what you should export and use in your main App
const TravelMateGuide = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerShown: false // Hide default header since you have custom Topbar
      }}
    >
      <Stack.Screen name="Home" component={TravelMateGuideHome} />
      <Stack.Screen name="bookings" component={BookingScreen} />
      {/* Add other screens here when ready */}
      {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Stack.Screen name="Availability" component={AvailabilityScreen} /> */}
      {/* <Stack.Screen name="Packages" component={PackagesScreen} /> */}
      {/* <Stack.Screen name="Earnings" component={EarningsScreen} /> */}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  menuList: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default TravelMateGuide;