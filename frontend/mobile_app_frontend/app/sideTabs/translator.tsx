import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import { useRouter } from 'expo-router'
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';

cssInterop(Image, { className: "style" });

const mic = require('../../assets/images/sideTabs/mic.png')
const arrowUp = require('../../assets/images/sideTabs/arrowtr.png')
const arrowDown = require('../../assets/images/sideTabs/arrowt.png')

export default function Translator() {
    const router = useRouter()

    const locations = ['English', 'Tamil', 'Hindi', 'Russian', 'Japanese']
    const [showDropdown, setShowDropdown] = useState(false)
    const [location, setLocation] = useState('')

    const [isRotated, setIsRotated] = useState(false);

    // --- Bonus: A style for the disabled input ---
    const topInputStyle = isRotated ? 'bg-white' : 'bg-gray-200';
    const bottomInputStyle = !isRotated ? 'bg-white' : 'bg-gray-200';

    return (
        <View className=' w-full h-full bg-[#F2F5FA]'>

            <Text className="font-extrabold text-3xl text-center my-4">Translator</Text>

            <View className='w-full h-[40%] items-center'>
                <TouchableOpacity
                    onPress={() => { setShowDropdown(!showDropdown) }}
                    className="border border-gray-300 rounded-xl px-4 py-3 my-4 bg-white w-[95%]"
                >
                    <Text className={`text-base ${location ? 'text-black' : 'text-gray-400'}`}>
                        {location || 'Select Language'}
                    </Text>
                </TouchableOpacity>
                {showDropdown && (
                    <View className=" absolute top-[66px] bg-white border border-gray-300 rounded-xl z-30 max-h-40 w-[95%]">
                        <ScrollView>
                            {locations.map((loc, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setLocation(loc);
                                        setShowDropdown(false);
                                    }}
                                    className={`px-4 py-2 ${location === loc ? 'bg-blue-100' : ''}`}
                                >
                                    <Text className="text-base">{loc}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                )}
                {/* --- TOP TEXT INPUT --- */}
                <View className={`w-[90%] border-2 h-[60%] justify-between rounded-md ${topInputStyle}`}>
                    <TextInput
                        editable={isRotated}
                        className='p-3 text-black'
                        placeholder={isRotated ? 'Enter text...' : 'Translation...'}
                        placeholderTextColor="#8E8E8E"
                    />
                    <TouchableOpacity className='w-full items-end' onPress={() => alert('mic eka')}><Image className='w-5 h-5 m-2' source={mic} /></TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity onPress={() => setIsRotated(!isRotated)} className='pb-10 items-center'>
                <Image
                    source={isRotated ? arrowDown : arrowUp}
                    className='w-6 h-6'
                />
            </TouchableOpacity>

            <View className='w-full h-[60%] items-center'>
                <View className="border border-gray-300 rounded-xl px-4 py-3 my-4 bg-white w-[95%]">
                    <Text className={`text-base text-black`}>
                        {'Sinhala'}
                    </Text>
                </View>
                {/* --- BOTTOM TEXT INPUT --- */}
                <View className={`w-[90%] border-2 h-[40%] justify-between rounded-md ${bottomInputStyle}`}>
                    <TextInput
                        editable={!isRotated}
                        className='p-3 text-black'
                        placeholder={isRotated ? 'Translation...' : 'Enter text...'}
                        placeholderTextColor="#8E8E8E"
                    />
                    <TouchableOpacity className='w-full items-end' onPress={() => alert('mic eka')}><Image className='w-5 h-5 m-2' source={mic} /></TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => alert('Translating...')} className='rounded-xl justify-center bg-[#FEFA17] w-[95%] h-10 mt-10'>
                    <Text className='text-center font-extrabold'>Translate</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
}
