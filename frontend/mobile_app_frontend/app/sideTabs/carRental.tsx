import { Text, KeyboardAvoidingView, Platform, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Calendar } from 'react-native-calendars';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { jwtDecode } from 'jwt-decode';

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}

cssInterop(Image, { className: "style" });

const pic = require('../../assets/images/tabbar/tuktuk.png');
const bus = require('../../assets/images/tabbar/bus.png');
const ac = require('../../assets/images/tabbar/ac.png');
const car = require('../../assets/images/tabbar/car.png');
const mini = require('../../assets/images/tabbar/mini.png');
const sport = require('../../assets/images/tabbar/sport.png');
const p = require('../../assets/images/user2.png');
const t = require('../../assets/images/tag.png');
const mark = require('../../assets/images/mark.png');

interface Book {
    dates: string[];
    start: string;
    end: string;
    language: string;
    oneWay: boolean;
    time: string
}

interface Cat {
    _id: string,
    image: string,
    members: number,
    title: string,
    price: number
}

interface Car {
    _id: string;
    price: number;
}

export default function App() {
    const router = useRouter();

    const timeOptions = [
        '12:00 AM', '12:30 AM', '01:00 AM', '01:30 AM', '02:00 AM', '02:30 AM',
        '03:00 AM', '03:30 AM', '04:00 AM', '04:30 AM', '05:00 AM', '05:30 AM',
        '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
        '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
        '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
        '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM',
        '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM', '11:00 PM', '11:30 PM'
    ];

    const locations = ['Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Jaffna', 'Matara', 'Anuradhapura'];
    const languages = ['English', 'Korean', 'Russian', 'Japanese', 'Sinhala', 'Tamil'];

    // State management
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [language, setLanguage] = useState('');
    const [isOneway, setOneWay] = useState(false);
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [bookingData, setBookingData] = useState<Book | null>(null);
    const [time, setTime] = useState('');
    const [categories, setCategories] = useState<Cat[]>([]);

    // Dropdown states
    const [showStartDropdown, setShowStartDropdown] = useState(false);
    const [showEndDropdown, setShowEndDropdown] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    // Fetch vehicle categories
    const fetchCategories = async () => {
        try {
            const res = await fetch(`http://localhost:8080/traveler/vehicles-all`)
            const data = await res.json()

            if (data.length > 0) {
                const minimalCars = data.map((car: Car) => ({
                    id: car._id,
                    price: car.price,
                }));
                await AsyncStorage.setItem('cars', JSON.stringify(minimalCars))
                setCategories(data)
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    // Calendar date selection
    const onDayPress = (day: { dateString: string }) => {
        const date = day.dateString;
        setSelectedDates((currentDates) => {
            if (currentDates.includes(date)) {
                return currentDates.filter((d) => d !== date);
            } else {
                return [...currentDates, date];
            }
        });
    };

    const markedDates = useMemo(() => {
        if (!Array.isArray(selectedDates)) {
            return {};
        }
        return selectedDates.reduce((acc, date) => {
            acc[date] = { selected: true, selectedColor: '#007BFF' };
            return acc;
        }, {} as { [key: string]: { selected: boolean; selectedColor: string } });
    }, [selectedDates]);

    // Handle booking form submission
    const handleSubmit = async () => {
        if (selectedDates.length === 0 || !startLocation.trim() || !endLocation.trim() || !language.trim() || !time) {
            alert('Please fill in all fields before submitting.');
            return;
        }

        const newBooking = {
            dates: selectedDates,
            start: startLocation,
            end: endLocation,
            language: language,
            time: time,
            oneWay: isOneway,
        };

        setBookingData(newBooking);
        setModalVisible(false);
        setIsBookingComplete(true);

        try {
            await AsyncStorage.setItem('vehicleBookingData', JSON.stringify(newBooking));
            await AsyncStorage.setItem('vehicleBookingComplete', 'true');
            await AsyncStorage.setItem('vehicleBookingSession', Date.now().toString());
        } catch (error) {
            alert(`Error saving your booking. Please try again. Error: ${error}`);
        }
    };

    // Navigate to vehicle list with category and booking data
    const handleCategoryNavigation = async (categoryId: string) => {
        if (!isBookingComplete) {
            alert('Please complete your booking details first by clicking "Book Vehicle"');
            return;
        }

        try {
            await AsyncStorage.setItem('selectedVehicleCategory', categoryId);
            // Navigate to solo vehicle list with the selected category
            router.push(`/views/car/solo/list/${categoryId}`);
        } catch (error) {
            console.error('Error setting car category:', error);
        }
    };

    // Display formatted dates
    const displayDates = (Array.isArray(selectedDates) && selectedDates.length > 0)
        ? selectedDates
            .sort()
            .map(date => new Date(date).toDateString())
            .join(', ')
        : '';

    // Initialize booking modal
    const initializeBooking = () => {
        setSelectedDates([]);
        setStartLocation('');
        setEndLocation('');
        setLanguage('');
        setTime('');
        setOneWay(false);
        setIsBookingComplete(false);
        setBookingData(null);
        setModalVisible(true);
    };

    // Load existing booking data
    const loadBookingData = useCallback(async () => {
        try {
            const sessionExists = await AsyncStorage.getItem('vehicleBookingSession');
            const bookingCompleteStatus = await AsyncStorage.getItem('vehicleBookingComplete');

            if (sessionExists && bookingCompleteStatus === 'true') {
                const savedBooking = await AsyncStorage.getItem('vehicleBookingData');
                if (savedBooking) {
                    const parsedBooking: Book = JSON.parse(savedBooking);
                    setBookingData(parsedBooking);
                    setSelectedDates(parsedBooking.dates);
                    setStartLocation(parsedBooking.start);
                    setEndLocation(parsedBooking.end);
                    setLanguage(parsedBooking.language);
                    setTime(parsedBooking.time);
                    setOneWay(parsedBooking.oneWay);
                    setIsBookingComplete(true);
                }
            }
        } catch (error) {
            console.error('Error loading booking data:', error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadBookingData();
        }, [loadBookingData])
    );

    return (
        <View className='bg-[#F2F5FA] h-full'>
            {/* Booking Details Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="h-full justify-center items-center bg-black/50">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        className="w-[93%] h-[97%]"
                    >
                        <View className="flex-1 bg-white my-4 p-6 rounded-2xl shadow-lg">
                            <View className='w-full'>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                                <Text className="text-xl font-bold mb-8 text-center">Vehicle Booking Details</Text>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                                {/* Calendar */}
                                <View className='border border-gray-200 rounded-lg mb-4'>
                                    <Calendar
                                        onDayPress={onDayPress}
                                        markedDates={markedDates}
                                        minDate={new Date().toISOString().split('T')[0]}
                                        theme={{
                                            todayTextColor: '#007BFF',
                                            arrowColor: '#007BFF',
                                        }}
                                    />
                                </View>

                                {/* Location Inputs */}
                                <View className="w-full gap-4">
                                    <View className='flex-row justify-between gap-2'>
                                        <View className='flex-1 z-40'>
                                            <Text className="text-sm font-medium text-gray-600 mb-1">Start Location</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setShowStartDropdown(!showStartDropdown);
                                                    setShowEndDropdown(false);
                                                    setShowLanguageDropdown(false);
                                                }}
                                                className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                            >
                                                <Text className={`text-sm ${startLocation ? 'text-black' : 'text-gray-400'}`}>
                                                    {startLocation || 'Select Start Location'}
                                                </Text>
                                            </TouchableOpacity>
                                            {showStartDropdown && (
                                                <View className="absolute top-[70px] bg-white border border-gray-300 rounded-xl z-50 max-h-40 w-full">
                                                    <ScrollView>
                                                        {locations.map((loc, index) => (
                                                            loc !== endLocation && (
                                                                <TouchableOpacity
                                                                    key={index}
                                                                    onPress={() => {
                                                                        setStartLocation(loc);
                                                                        setShowStartDropdown(false);
                                                                    }}
                                                                    className={`px-4 py-2 ${startLocation === loc ? 'bg-blue-100' : ''}`}
                                                                >
                                                                    <Text className="text-base">{loc}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>

                                        <View className='flex-1 z-30'>
                                            <Text className="text-sm font-medium text-gray-600 mb-1">End Location</Text>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setShowEndDropdown(!showEndDropdown);
                                                    setShowStartDropdown(false);
                                                    setShowLanguageDropdown(false);
                                                }}
                                                className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                            >
                                                <Text className={`text-sm ${endLocation ? 'text-black' : 'text-gray-400'}`}>
                                                    {endLocation || 'Select End Location'}
                                                </Text>
                                            </TouchableOpacity>
                                            {showEndDropdown && (
                                                <View className="absolute top-[70px] bg-white border border-gray-300 rounded-xl z-40 max-h-40 w-full">
                                                    <ScrollView>
                                                        {locations.map((loc, index) => (
                                                            loc !== startLocation && (
                                                                <TouchableOpacity
                                                                    key={index}
                                                                    onPress={() => {
                                                                        setEndLocation(loc);
                                                                        setShowEndDropdown(false);
                                                                    }}
                                                                    className={`px-4 py-2 ${endLocation === loc ? 'bg-blue-100' : ''}`}
                                                                >
                                                                    <Text className="text-base">{loc}</Text>
                                                                </TouchableOpacity>
                                                            )
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    {/* Language Selection */}
                                    <View className='z-20'>
                                        <Text className="text-sm font-medium text-gray-600 mb-1">Language Preference</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowLanguageDropdown(!showLanguageDropdown);
                                                setShowStartDropdown(false);
                                                setShowEndDropdown(false);
                                            }}
                                            className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                                        >
                                            <Text className={`text-base ${language ? 'text-black' : 'text-gray-400'}`}>
                                                {language || 'Select Language'}
                                            </Text>
                                        </TouchableOpacity>
                                        {showLanguageDropdown && (
                                            <View className="absolute top-[70px] left-0 right-0 bg-white border border-gray-300 rounded-xl z-30 max-h-40">
                                                <ScrollView>
                                                    {languages.map((l, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            onPress={() => {
                                                                setLanguage(l);
                                                                setShowLanguageDropdown(false);
                                                            }}
                                                            className={`px-4 py-2 ${language === l ? 'bg-blue-100' : ''}`}
                                                        >
                                                            <Text className="text-base">{l}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}
                                    </View>

                                    {/* Time Selection */}
                                    <View>
                                        <Text className="text-sm font-medium text-gray-600 mb-1">Pickup Time</Text>
                                        <View className="border border-gray-300 rounded-xl py-1">
                                            <Picker
                                                selectedValue={time}
                                                onValueChange={(itemValue) => setTime(itemValue)}
                                                style={{ height: 50 }}
                                            >
                                                <Picker.Item label="Select..." value="" />
                                                {timeOptions.map((timeOption, index) => (
                                                    <Picker.Item key={index} label={timeOption} value={timeOption} />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>

                                    {/* One-way Trip Checkbox */}
                                    <View className="flex-row items-center pt-2 gap-4">
                                        <Text className="text-base text-gray-800">One-Way Trip</Text>
                                        <TouchableOpacity
                                            onPress={() => setOneWay(prevState => !prevState)}
                                            className={`w-6 h-6 rounded border-2 justify-center items-center mr-2 ${isOneway ? 'bg-blue-500 border-blue-500' : 'border-gray-400'}`}
                                        >
                                            {isOneway && <Text className="text-white font-bold">✓</Text>}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>

                            {/* Submit Button */}
                            <View className="w-full pt-4">
                                <TouchableOpacity
                                    onPress={handleSubmit}
                                    className="bg-[#FEFA17] py-3 rounded-xl"
                                >
                                    <Text className="text-black text-center font-semibold">Save Booking Details</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* Main Content */}
            <View className="flex-1">
                {/* Header */}
                <View className="flex-row justify-between items-center p-4">
                    <Text className='text-xl font-bold'>Select a Vehicle Category</Text>
                    <TouchableOpacity
                        onPress={initializeBooking}
                        className="bg-[#FEFA17] px-4 py-2 rounded-lg"
                    >
                        <Text className="font-semibold">Book Vehicle</Text>
                    </TouchableOpacity>
                </View>

                {/* Booking Summary */}
                {isBookingComplete && bookingData && (
                    <View className="bg-white mx-4 mb-4 p-4 rounded-lg shadow">
                        <View className="flex-row justify-between items-center mb-2">
                            <Text className="text-lg font-semibold">Booking Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                                <Text className="text-blue-600 font-medium">Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <Text className="text-sm text-gray-600">
                            📅 {displayDates}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            📍 {bookingData.start} → {bookingData.end}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            🗣️ {bookingData.language} | ⏰ {bookingData.time}
                        </Text>
                        <Text className="text-xs text-blue-600 mt-2">
                            Now select a vehicle category below
                        </Text>
                    </View>
                )}

                {/* Vehicle Categories */}
                <ScrollView
                    className="flex-1"
                    contentContainerClassName="flex-row flex-wrap justify-center items-start gap-10 py-6"
                    showsVerticalScrollIndicator={false}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category._id}
                            onPress={() => handleCategoryNavigation(category._id)}
                            className={`${!isBookingComplete ? 'opacity-50' : ''}`}
                            disabled={!isBookingComplete}
                        >
                            <View className="bg-[#d9d9d98e] w-[160px] h-[200px] items-center py-5 rounded-2xl">
                                <Image
                                    className="w-[150px] h-[100px]"
                                    source={{ uri: `data:image/jpeg;base64,${category.image}` }}
                                />
                                <View className='pt-2'>
                                    <View className='flex-row items-center gap-4'>
                                        <Image className="w-[15px] h-[15px]" source={p} />
                                        <Text className="text-md italic text-center">
                                            {category.members} Members
                                        </Text>
                                    </View>
                                    <View className='flex-row items-center gap-4 my-1'>
                                        <Image className="w-[15px] h-[15px]" source={t} />
                                        <Text className="text-md italic text-center">
                                            {category.title}
                                        </Text>
                                    </View>
                                </View>
                                <View className="rounded-md bg-black justify-center w-32 h-5 items-center">
                                    <Text className="text-white font-semibold text-[12px]">
                                        {category.price}.00 LKR/1km
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Instructions */}
                {!isBookingComplete && (
                    <View className="bg-yellow-50 mx-4 mb-4 p-4 rounded-lg border border-yellow-200">
                        <Text className="text-yellow-800 text-center font-medium">
                            Please click "Book Vehicle" to enter your trip details first
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}