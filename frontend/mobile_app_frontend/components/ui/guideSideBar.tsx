import React from 'react';
import { Text, View, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, FileText, Activity, User } from 'lucide-react-native';

cssInterop(Image, { className: "style" });

const Profile = require('../../assets/images/profile/image.png');
const { width } = Dimensions.get('window');

interface SidebarProps {
  close: () => void;
}

export default function Sidebar({ close }: SidebarProps) {
  const router = useRouter();

  // Animation for smooth opening/closing - start from left edge
  const slideAnim = new Animated.Value(-width * 0.8); // Start off-screen to the left

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0, // Slide in to the right position
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path as any); // Type assertion to handle the routing
    close(); // Close the sidebar after navigation
  };

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: -width * 0.8, // Slide out to the left
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      close(); // Close after animation completes
    });
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: width * 0.8, // 80% of screen width
        backgroundColor: 'white', // White background for the entire sidebar
        transform: [{ translateX: slideAnim }],
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
          width: 2,
          height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      }}
    >
      <SafeAreaView className="flex-1">
        {/* Header - Profile Section */}
        <View className="items-center mt-8">
          <View className="w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-gray-200">
            <Image className="w-full h-full" source={Profile} />
          </View>
          <Text className="text-[20px] font-bold text-gray-800 mt-4">John Doe</Text>
          <Text className="text-[14px] text-gray-500">Tour Guide</Text>
        </View>

        {/* Navigation Links */}
        <View className="flex-1 justify-center px-8">
          <TouchableOpacity
            className="my-6 flex-row items-center gap-4"
            onPress={() => handleNavigation('/pastBookings')}
          >
            <Calendar size={24} color="#374151" />
            <Text className="text-[18px] font-medium text-gray-800">Past Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="my-6 flex-row items-center gap-4"
            onPress={() => handleNavigation('/quotations')}
          >
            <FileText size={24} color="#374151" />
            <Text className="text-[18px] font-medium text-gray-800">Quotations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="my-6 flex-row items-center gap-4"
            onPress={() => handleNavigation('/guideActivity')}
          >
            <Activity size={24} color="#374151" />
            <Text className="text-[18px] font-medium text-gray-800">Activity Log</Text>
          </TouchableOpacity>
        </View>

        {/* Footer - Date and Time */}
        <View className="items-center pb-8">
          <Text className="text-[14px] text-gray-500">Tuesday, 01 January 2001</Text>
          <Text className="text-[14px] text-gray-500">12:00 AM</Text>
        </View>

        {/* Close Button */}
        <TouchableOpacity
          className="absolute top-12 right-4 p-2 bg-gray-200 rounded-full"
          onPress={handleClose}
        >
          <Text className="text-[16px] font-bold text-gray-800">×</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
}