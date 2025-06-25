import { Text, View, ScrollView, TouchableOpacity, Modal, TextInput, FlatList } from 'react-native';
import { useState, useCallback, useMemo } from 'react';
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
    const [selectedDates, setSelectedDates] = useState<{ [key: string]: { selected: boolean; selectedColor: string } }>({});
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [isModalVisible, setModalVisible] = useState(true);
    const [fine, setFine] = useState(false);

    const [adults, setAdults] = useState('');
    const [children, setChildren] = useState('');
    const [nights, setNights] = useState('');
    const [location, setLocation] = useState('');

    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna'];

    const starCounts = [1, 1, 1, 2, 5, 1, 0, 3, 1, 1, 2, 5, 1, 0, 3];

    const sortedLocations = useMemo(() => {
        if (!location) return locations;
        return [location, ...locations.filter((loc) => loc !== location)];
    }, [location]);

    const toggleCardSelection = (index: number) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };

    const onDayPress = (day: { dateString: string }) => {
        setSelectedDates((prev) => {
            const date = day.dateString;
            const updated = { ...prev };
            if (updated[date]) {
                delete updated[date];
            } else {
                updated[date] = { selected: true, selectedColor: '#007BFF' };
            }
            return updated;
        });
    };

    const handleSubmit = () => {
        if (Object.keys(selectedDates).length === 0 || !location || !adults || !children || !nights) {
            alert('Please fill in all fields.');
            return;
        }
        setModalVisible(false);
        setFine(true)
        alert(`location is ${location} for ${adults} adults,${children} children to ${nights} nights`)
    };

    const displayDates = Object.keys(selectedDates).sort().map(date => new Date(date).toDateString()).join(', ');

    const handleLocationSelect = (selectedLocation: string) => {
        setLocation(selectedLocation);
        setShowDropdown(false);
    };

    useFocusEffect(useCallback(() => {
        if (Object.keys(selectedDates).length === 0) {
            setModalVisible(true);
        }
    }, [selectedDates]));



    return (
        <View className='bg-[#F2F5FA] h-full'>
            <View>
                {/* Modal */}
                <Modal
                    visible={isModalVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => {
                        if (fine) {
                            setModalVisible(false);
                        }
                    }}
                >
                    <View className="h-full  bg-black/50 justify-center items-center">
                        <View className="w-[93%] h-[97%] bg-white rounded-2xl overflow-hidden">
                            {/* Header */}
                            <View className='w-full p-6 pb-4'>
                                <TouchableOpacity
                                    className="self-start mb-2"
                                    onPress={() => {
                                        if (fine) {
                                            setModalVisible(false);
                                        } else {
                                            router.back();
                                        }
                                    }}
                                >
                                    <Text className="text-black text-base">
                                        {!fine ? "Back" : "Cancel"}
                                    </Text>
                                </TouchableOpacity>
                                <Text className="text-xl font-bold text-center">Hotel Booking</Text>
                            </View>

                            {/* Scrollable Content */}
                            <View className="flex-1 px-6">
                                <View className='w-full'>
                                    {/* Calendar */}
                                    <View className="w-full">
                                        <Calendar
                                            className='border-2 w-full rounded-lg'
                                            onDayPress={onDayPress}
                                            markedDates={selectedDates}
                                            minDate={new Date().toISOString().split('T')[0]}
                                            theme={{
                                                todayTextColor: '#007BFF',
                                                arrowColor: '#007BFF',
                                                calendarBackground: '#ffffff',
                                            }}
                                            style={{ paddingBottom: 10 }}
                                        />
                                    </View>

                                    {/* Location Selection */}
                                    <View className="w-full">
                                        <TouchableOpacity
                                            onPress={() => setShowDropdown(!showDropdown)}
                                            className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                        >
                                            <Text className={`text-base ${location ? 'text-black' : 'text-gray-400'}`}>
                                                {location || 'Select Location'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Location Dropdown */}
                                    {showDropdown && (
                                        <View className="w-full bg-white rounded-xl border border-gray-200 mt-1">
                                            <FlatList
                                                data={sortedLocations}
                                                keyExtractor={(item) => item}
                                                style={{ maxHeight: 90 }}
                                                showsVerticalScrollIndicator={true}
                                                keyboardShouldPersistTaps="handled"
                                                nestedScrollEnabled={true}
                                                renderItem={({ item, index }) => (
                                                    <TouchableOpacity
                                                        onPress={() => handleLocationSelect(item)}
                                                        className={`px-4 py-3 ${location === item ? 'bg-blue-100' : ''} ${index < sortedLocations.length - 1 ? 'border-b border-gray-200' : ''}`}
                                                    >
                                                        <Text className="text-gray-700 text-center text-base">{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Fixed Bottom Section - Text Inputs and Button */}
                            <View className="w-full p-6 bg-white h-[25%]">
                                <View className="w-full gap-4 justify-between h-full">
                                    <View className='flex-row justify-between gap-3'>
                                        <TextInput

                                            placeholder="# Adults"
                                            placeholderTextColor="#8E8E8E"
                                            value={adults}
                                            onChangeText={(text) => {
                                                const numericText = text.replace(/[^0-9]/g, '');
                                                setAdults(numericText);
                                            }}
                                            keyboardType="numeric"
                                            className="border text-black border-gray-300 rounded-xl px-3 py-3 text-base flex-1"
                                        />
                                        <TextInput
                                            placeholder="# Children"
                                            placeholderTextColor="#8E8E8E"
                                            value={children}
                                            onChangeText={(text) => {
                                                const numericText = text.replace(/[^0-9]/g, '');
                                                setChildren(numericText);
                                            }}
                                            keyboardType="numeric"
                                            className="border text-black border-gray-300 rounded-xl px-3 py-3 text-base flex-1"
                                        />
                                        <TextInput
                                            placeholder="# Nights"
                                            placeholderTextColor="#8E8E8E"
                                            value={nights}
                                            onChangeText={(text) => {
                                                const numericText = text.replace(/[^0-9]/g, '');
                                                setNights(numericText);
                                            }}
                                            keyboardType="numeric"
                                            className="border text-black border-gray-300 rounded-xl px-3 py-3 text-base flex-1"
                                        />
                                    </View>

                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="bg-[#FEFA17] py-3 rounded-xl bottom-0"
                                    >
                                        <Text className="text-black text-center font-semibold text-base">Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Main Content */}
                {Object.keys(selectedDates).length > 0 && (
                    <>
                        <View className="flex-row justify-between items-center p-4">
                            <Text className="text-lg font-medium">{displayDates}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)} className="bg-gray-200 py-2 px-4 rounded-lg">
                                <Text className="font-semibold text-blue-600">Change</Text>
                            </TouchableOpacity>
                        </View>

                        {/* <View className="px-4 space-y-1">
                            <Text className="text-sm">📍 Location: {location}</Text>
                            <Text className="text-sm">👤 Adults: {adults}</Text>
                            <Text className="text-sm">🧒 Children: {children}</Text>
                            <Text className="text-sm">🌙 Nights: {nights}</Text>
                        </View> */}

                        {/* Hotel Cards */}
                        <View >
                            <ScrollView
                                className="w-full h-[90%]"
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
                                                className="w-6 h-6 rounded-full justify-center items-center border-2 bg-gray-200"
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
