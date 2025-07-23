import { Text, View, Image, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


const ProfilePic = require("../../assets/images/profile-pic.jpeg"); // Add this line

export default function Profile() {

    const router = useRouter()

    const ToggleSwitch = ({ isEnabled }: { isEnabled: boolean }) => (
        <View className={`w-12 h-6 rounded-full p-1 ${isEnabled ? 'bg-[#FEFA17]' : 'bg-gray-300'}`}>
            <View
                className={`w-4 h-4 rounded-full bg-white ${
                    isEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
            />
        </View>
    )

    return (
        <ScrollView className="flex-1 bg-[#F2F0EF]">
            <View className="w-full px-6 pt-5 pb-2 flex-row items-center">
  <TouchableOpacity
    className="rounded-full p-2 bg-gray-100"
    onPress={() => router.back()}
  >
    <Ionicons name="arrow-back" size={24} color="#000" />
  </TouchableOpacity>
</View>

            <View className="px-6 pt-6 pb-24">
                {/* Profile Picture and Name */}
                <View className="items-center mb-8">
                    <View className="w-24 h-24 rounded-full mb-4 overflow-hidden">
                        <Image 
                            source={ProfilePic}
                            className="w-16 h-16"
                            resizeMode="cover"
                        />
                    </View>
                    <Text className="text-xl font-semibold text-gray-800">Nirmal Uyanhewa</Text>
                </View>

                {/* Personal Details Section */}
                <View className="mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-medium text-gray-800">Personal Details</Text>
                        <TouchableOpacity className="bg-[#FEFA17] px-3 py-1 rounded-lg">
                            <Text className="text-black text-sm font-medium">Edit Details</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <View className="bg-gray-200 rounded-lg p-4 flex-row items-center justify-between">
                            <Text className="text-black font-medium text-base">Email</Text>
                            <Text className="text-black text-base">uyanhewa@gmail.com</Text>
                        </View>
                    </View>

                    {/* Phone */}
                    <View className="mb-4">
                        <View className="bg-gray-200 rounded-lg p-4 flex-row items-center justify-between">
                            <Text className="text-black font-medium text-base">Phone</Text>
                            <Text className="text-black text-base">0123456789</Text>
                        </View>
                    </View>

                    {/* Username */}
                    <View className="mb-6">
                        <View className="bg-gray-200 rounded-lg p-4 flex-row items-center justify-between">
                            <Text className="text-black font-medium text-base">Username</Text>
                            <Text className="text-black text-base">Nirmal Uyanhewa</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View>
                    <Text className="text-lg font-medium text-gray-800 mb-4">Settings</Text>

                    {/* Dark Mode */}
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-gray-800 text-base">Dark Mode</Text>
                        <ToggleSwitch isEnabled={false} />
                    </View>

                    {/* Visibility */}
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-gray-800 text-base">Visibility</Text>
                        <ToggleSwitch isEnabled={false} />
                    </View>

                    {/* Ask credential when login */}
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-gray-800 text-base">Ask credential when login</Text>
                        <ToggleSwitch isEnabled={false} />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}