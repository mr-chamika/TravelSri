import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';

const Menu = require('../assets/images/top bar/menu.png');
const Notify = require('../assets/images/top bar/notify1.png');
const logo = require('../assets/images/top bar/logo.png');

interface TopbarProps {
  pressing: () => void;
}

cssInterop(Image, { className: 'style' });

const Topbar = ({ pressing }: TopbarProps) => {
  return (
    <SafeAreaView className='' style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 , paddingBottom: 10,}}>
      <StatusBar backgroundColor="#FEFA17" barStyle="dark-content" />

      <View className='h-[50px] flex-row justify-between items-center px-2 '>
        {/* Menu Button */}
        <View className='w-[40px]'>
          <TouchableOpacity onPress={pressing}>
            <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg shadow-[#538EBB66] z-60'>
              <Image className='w-[30px] h-[30px]' source={Menu} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Center Logo + Text */}
        <View className='flex-1 flex-row items-center justify-center'>
          <Image className='w-[40px] h-[40px] mr-2' source={logo} />
          <Text className='text-lg font-bold text-black'>TravelSri</Text>
        </View>

        {/* Notification Icon */}
        <TouchableOpacity onPress={pressing}>
          <View className='w-[40px] h-[40px] items-center justify-center shadow-lg shadow-[#538EBB66]'>
            <Image className='w-[40px] h-[40px]' source={Notify} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Topbar;
