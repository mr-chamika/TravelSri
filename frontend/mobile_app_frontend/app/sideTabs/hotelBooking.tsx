import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';

cssInterop(Image, { className: "style" });

const router = useRouter();

const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');

export default function HotelsWithNativeWindStyles() {
    const [confirmedDate, setConfirmedDate] = useState<string | null>(null);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(true);
    const [fine, setFine] = useState(false);

    const [adults, setAdults] = useState('');
    const [children, setChildren] = useState('');
    const [nights, setNights] = useState('');
    const [location, setLocation] = useState('');

    const [showDropdown, setShowDropdown] = useState(false);
    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];

    const starCounts = [1, 1, 1, 2, 5, 1, 0, 3];

    const toggleCardSelection = (index: number) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };

    const onDayPress = (day: { dateString: string }) => {
        setConfirmedDate(day.dateString);
    };

    const handleSubmit = () => {
        if (!confirmedDate || !location || !adults || !children || !nights) {
            alert('Please fill in all fields.');
            return;
        }
        setModalVisible(false);
        setFine(true)
    };

    const displayDate = confirmedDate ? new Date(confirmedDate).toDateString() : 'Not Set';


    useFocusEffect(
        useCallback(() => {
            // We re-open the modal ONLY if the user hasn't successfully submitted the form yet.
            // `confirmedDate` is a good proxy for submission status.
            if (!confirmedDate) {
                setModalVisible(true);
            }
        }, [confirmedDate])
    );


    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View>
                {/* Modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        if (!confirmedDate) return;
                        setModalVisible(false);
                    }}
                >
                    <View className="h-full justify-center items-center bg-black/50">
                        <View className="w-[95%] h-[95%] bg-white p-2 rounded-2xl   items-center" >
                            <ScrollView className='w-full h-full'>
                                <View className='w-full'>
                                    <TouchableOpacity onPress={() => { setModalVisible(false); if (!fine || !confirmedDate) router.back() }}>
                                        {(fine && confirmedDate) ? <Text> Cancel</Text> : <Text> Back</Text>}
                                    </TouchableOpacity>
                                    <Text className="text-xl font-bold mb-8 text-center">Enter Travel Details</Text>
                                </View>
                                <View className='w-full gap-6 h-full'>
                                    <Calendar
                                        className=' border-2 w-full'
                                        onDayPress={onDayPress}
                                        markedDates={{
                                            [confirmedDate || '']: { selected: true, marked: true, selectedColor: '#007BFF' }
                                        }}
                                        minDate={new Date().toISOString().split('T')[0]}
                                        theme={{
                                            todayTextColor: '#007BFF',
                                            arrowColor: '#007BFF',
                                        }}
                                    />

                                    {/* Dropdown for Location */}
                                    <View className="w-full relative z-20 h-48">
                                        <TouchableOpacity
                                            onPress={() => setShowDropdown(!showDropdown)}
                                            className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                        >
                                            <Text className={`text-base ${location ? 'text-black' : 'text-gray-400'}`}>
                                                {location || 'Select Location'}
                                            </Text>
                                        </TouchableOpacity>

                                        <View className="absolute top-[52px] left-0 right-0 bg-white rounded-xl z-30">
                                            {showDropdown && (
                                                <ScrollView className=' max-h-40 border border-gray-300'>
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
                                            )}
                                        </View>
                                    </View>

                                    {/* Other inputs */}
                                    <View className="w-full justify-evenly h-[25%]">
                                        <View className='flex-row gap-4 justify-center w-full'>
                                            <TextInput
                                                placeholder="# Adults"
                                                value={adults}
                                                onChangeText={(text) => {

                                                    const numericText = text.replace(/[^0-9]/g, '');
                                                    setAdults(numericText);

                                                }
                                                }
                                                keyboardType="numeric"
                                                className="border border-gray-300 rounded-xl px-4 py-2 text-base w-28"
                                            />
                                            <TextInput
                                                placeholder="# Children"
                                                value={children}
                                                onChangeText={(text) => {

                                                    const numericText = text.replace(/[^0-9]/g, '');
                                                    setChildren(numericText);
                                                }
                                                }
                                                keyboardType="numeric"
                                                className="border border-gray-300 rounded-xl px-4 py-2 text-base w-28"
                                            />
                                            <TextInput
                                                placeholder="# Nights"
                                                value={nights}
                                                onChangeText={(text) => {

                                                    const numericText = text.replace(/[^0-9]/g, '');
                                                    setNights(numericText);
                                                }
                                                }
                                                keyboardType="numeric"
                                                className="border border-gray-300 rounded-xl px-4 py-2 text-base w-28"
                                            />
                                        </View>
                                        <TouchableOpacity
                                            onPress={handleSubmit}
                                            className="bg-blue-600 py-3 rounded-xl mt-14"
                                        >
                                            <Text className="text-white text-center font-semibold">Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>

                {/* Main Content */}
                {confirmedDate && (
                    <>
                        <View className="flex-row justify-between items-center p-4">
                            <Text className="text-lg font-medium">{displayDate}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                                <Text className="font-semibold text-blue-600">Change</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="font-extrabold text-3xl text-center my-5">Hotel Booking</Text>
                        {/* <View className="px-4 space-y-1">
                            <Text className="text-sm">📍 Location: {location}</Text>
                            <Text className="text-sm">👤 Adults: {adults}</Text>
                            <Text className="text-sm">🧒 Children: {children}</Text>
                            <Text className="text-sm">🌙 Nights: {nights}</Text>
                        </View> */}

                        {/* Hotel Cards */}
                        <View >
                            <ScrollView
                                className="w-full h-[80%]"
                                contentContainerClassName="flex-row flex-wrap justify-center items-start gap-5 pt-5"
                                showsVerticalScrollIndicator={false}
                            >
                                {starCounts.map((starCount, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        className="bg-[#d9d9d952] w-[160px] h-[155px] items-center py-1 rounded-2xl "
                                        onPress={() => alert('Hotel Selected')}
                                    >
                                        <View className="w-full flex-row absolute justify-end px-3 pt-1 z-10">
                                            <TouchableOpacity
                                                className="w-6 h-6 rounded-full justify-center items-center bg-gray-200 mt-1"
                                                onPress={() => toggleCardSelection(index)}
                                            >
                                                {selectedCardIndex === index && (
                                                    <Image className='w-4 h-4' source={mark} />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        <Image
                                            className='w-[147px] h-[90px] rounded-xl'
                                            source={pic}
                                            contentFit="cover"
                                        />
                                        <View className="p-2">
                                            <Text className="text-lg font-semibold text-center">Bawana #{index + 1}</Text>
                                            <View className="flex-row justify-center mt-1">
                                                {[...Array(starCount)].map((_, i) => (
                                                    <Image key={i} className="w-3 h-3 mx-0.5" source={star} />
                                                ))}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </>
                )}

            </View>
        </View>
    );
}
