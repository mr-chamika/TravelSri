import { View, Text, TouchableOpacity } from 'react-native';
import NotifyModal from './Notifi';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { router } from 'expo-router';

const Menu = require('../assets/images/profile-pic.jpeg');
const Notify = require('../assets/images/top bar/notify1.png');

cssInterop(Image, { className: "style" });

interface TopbarProps {
    notifying: () => void;
    on: boolean;
}

export default function TopbarX({ notifying, on }: TopbarProps) {
    return (
        <View className='bg-[#F2F5FA] h-[64px] items-center justify-center px-2'>
            <View className='justify-between flex-row w-full px-1'>
                <TouchableOpacity onPress={() => router.push('/views/profile')}>
                    <View className='w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg'>
                        <Image className='w-[40px] h-[40px] rounded-full' source={Menu} />
                    </View>
                </TouchableOpacity>

                <View className='w-[180px] h-[40px] justify-center items-center'>
                    <Text className='text-lg font-bold'>TravelSri</Text>
                </View>

                <TouchableOpacity onPress={notifying}>
                    <View className='w-10 h-10 bg-[#FEFA17] rounded-full items-center justify-center shadow-lg'>
                        <Image className='w-[45px] h-[45px]' source={Notify} />
                    </View>
                </TouchableOpacity>
            </View>

            <NotifyModal
                isVisible={on}
                onClose={notifying}
            />
        </View>
    );
}