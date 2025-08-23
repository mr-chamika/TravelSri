import { Text, View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Modal, TextInput, Platform, FlatList } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import { Alert } from 'react-native';

cssInterop(Image, { className: "style" });

const router = useRouter();

const cross = require('../../assets/images/cross.png');
const mark = require('../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../assets/images/tabbar/create/location/h.png');
const star = require('../../assets/images/tabbar/create/hotel/stars.png');
const tele = require('../../assets/images/tabbar/create/guide/telephones.png')
const pin = require('../../assets/images/tabbar/create/pin.png')
const xp = require('../../assets/images/xp.png')

// Replace with your Spring Boot backend URL for Guides
const SPRING_BACKEND_URL = __DEV__
    ? 'http://localhost:8080'  // Development - Spring Boot API
    : 'https://your-spring-backend.com'; // Production

interface Guide {
    _id: string;
    firstName: string;
    lastName: string;
    description: string;
    location: string;
    experience: number;
    stars: number;
    reviewCount: number;
    dailyRate: number;
    currency: string;
    pp: string;
    verified: string; // "done", "pending", "rejected"
    identified: string; // "done", "pending", "rejected"
    specialization: string;
    responseTime: string;
    ResponseRate: number;
    bio: string;
    mobileNumber: string;
    languages: string[];
    guideType: string; // "visit" or "travel"
}

interface BookingDetails {
    dates: string[];
    destination: string;
    type: string;
    language: string;
}

// Static list of popular Sri Lankan destinations
const popularDestinations = [
    'Kandy',
    'Galle',
    'Ella',
    'Sigiriya',
    'Nuwara Eliya',
    'Yala National Park',
    'Anuradhapura',
    'Polonnaruwa',
    'Mirissa',
    'Hikkaduwa',
    'Dambulla',
    'Bentota',
    'Negombo',
    'Trincomalee',
    'Arugam Bay',
    'Haputale',
    'Bandarawela',
    'Kitulgala',
    'Pinnawala',
    'Horton Plains',
    'Adam\'s Peak',
    'Colombo',
    'Jaffna',
    'Tangalle',
    'Unawatuna'
];

const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 'Chinese (Mandarin)', 'Chinese (Cantonese)', 'Japanese', 'Korean', 'Arabic',
    'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Croatian', 'Serbian', 'Slovak', 'Slovenian', 'Estonian', 'Latvian', 'Lithuanian', 'Greek', 'Turkish', 'Albanian', 'Macedonian', 'Bosnian', 'Montenegrin', 'Maltese', 'Irish', 'Welsh', 'Scottish Gaelic', 'Basque', 'Catalan', 'Galician', 'Icelandic', 'Faroese', 'Luxembourgish', 'Romansh', 'Corsican', 'Sardinian', 'Friulian', 'Ladin', 'Occitan', 'Breton', 'Cornish', 'Manx',
    'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Assamese', 'Nepali', 'Sinhala', 'Dhivehi', 'Kashmiri', 'Sanskrit', 'Pali', 'Sindhi', 'Konkani', 'Manipuri', 'Bodo', 'Santali', 'Maithili', 'Dogri', 'Bhojpuri', 'Magahi', 'Awadhi', 'Chhattisgarhi', 'Rajasthani', 'Haryanvi', 'Bhili', 'Gondi', 'Khasi', 'Garo', 'Mizo', 'Tripuri', 'Balochi', 'Brahui', 'Pashto', 'Dari', 'Hazaragi',
    'Thai', 'Vietnamese', 'Indonesian', 'Malay', 'Tagalog', 'Cebuano', 'Ilocano', 'Hiligaynon', 'Waray', 'Bikol', 'Kapampangan', 'Pangasinan', 'Maranao', 'Maguindanao', 'Tausug', 'Burmese', 'Khmer', 'Lao', 'Javanese', 'Sundanese', 'Batak', 'Minangkabau', 'Acehnese', 'Balinese', 'Sasak', 'Tetum', 'Shan', 'Karen', 'Mon', 'Kachin', 'Chin', 'Rakhine', 'Rohingya', 'Hmong', 'Mien', 'Akha', 'Lisu', 'Wa', 'Dai', 'Zhuang', 'Uyghur', 'Kazakh', 'Kyrgyz', 'Tajik', 'Turkmen', 'Uzbek', 'Mongolian',
    'Tibetan', 'Dzongkha', 'Sherpa', 'Tamang', 'Gurung', 'Magar', 'Tharu', 'Newari', 'Limbu', 'Rai', 'Sunuwar', 'Yolmo', 'Lepcha', 'Bhutia', 'Monpa', 'Tshangla', 'Lhokpu', 'Gongduk', 'Chali', 'Lish', 'Toto', 'Koch', 'Rabha', 'Dimasa', 'Karbi', 'Tiwa', 'Deori', 'Sonowal Kachari', 'Thengal Kachari', 'Hajong', 'Hmar', 'Paite', 'Vaiphei', 'Simte', 'Zou', 'Gangte', 'Kom', 'Aimol', 'Anal', 'Chothe', 'Koireng', 'Lamkang', 'Maram', 'Monsang', 'Moyon', 'Purum', 'Ralte', 'Tarao', 'Tangkhul', 'Thadou', 'Chiru', 'Kharam', 'Koirao', 'Thangal',
    'Hebrew', 'Persian (Farsi)', 'Kurdish', 'Azerbaijani', 'Armenian', 'Georgian', 'Chechen', 'Ingush', 'Ossetian', 'Abkhazian', 'Adyghe', 'Kabardian', 'Lezgian', 'Avar', 'Dargin', 'Lak', 'Tabasaran', 'Agul', 'Rutul', 'Tsakhur', 'Kryz', 'Budukh', 'Khinalugh', 'Udi', 'Tsova-Tush', 'Mingrelian', 'Laz', 'Svan', 'Assyrian', 'Aramaic', 'Coptic', 'Maltese Arabic', 'Moroccan Arabic', 'Egyptian Arabic', 'Levantine Arabic', 'Gulf Arabic', 'Iraqi Arabic', 'Sudanese Arabic', 'Tunisian Arabic', 'Algerian Arabic', 'Libyan Arabic', 'Yemeni Arabic', 'Hassaniya Arabic',
    'Swahili', 'Hausa', 'Yoruba', 'Igbo', 'Amharic', 'Oromo', 'Tigrinya', 'Somali', 'Malagasy', 'Zulu', 'Xhosa', 'Afrikaans', 'Shona', 'Ndebele', 'Sesotho', 'Setswana', 'Sepedi', 'Xitsonga', 'Tshivenda', 'Siswati', 'Chichewa', 'Bemba', 'Nyanja', 'Tonga', 'Lozi', 'Kaonde', 'Luvale', 'Lunda', 'Kikongo', 'Lingala', 'Tshiluba', 'Kinyarwanda', 'Kirundi', 'Luganda', 'Runyankole', 'Rukiga', 'Lusoga', 'Lugbara', 'Acholi', 'Langi', 'Alur', 'Kakwa', 'Madi', 'Dinka', 'Nuer', 'Shilluk', 'Bari', 'Kuku', 'Mundari', 'Toposa', 'Turkana', 'Pokot', 'Karamojong', 'Teso', 'Kumam', 'Sebei', 'Pokomo', 'Mijikenda', 'Luo', 'Kalenjin', 'Kamba', 'Meru', 'Embu', 'Kikuyu', 'Maasai', 'Samburu', 'Rendille', 'Borana', 'Gabra', 'Burji', 'Konso', 'Gedeo', 'Sidama', 'Wolayta', 'Gamo', 'Gofa', 'Dawro', 'Kafa', 'Sheko', 'Dizin', 'Suri', 'Mursi', 'Hamer', 'Banna', 'Karo', 'Kwegu', 'Nyangatom', 'Daasanach', 'Arbore', 'Tsamai'
];

export default function Guide() {
    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [isModalVisible, setModalVisible] = useState(true);
    const [fine, setFine] = useState(false);
    const [lan, setLan] = useState('');
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [destination, setDestination] = useState('');
    const [bookingType, setBookingType] = useState('visit');

    // Guide data states
    const [guides, setGuides] = useState<Guide[]>([]);
    const [isLoadingGuides, setIsLoadingGuides] = useState(false);
    const [guideError, setGuideError] = useState<string | null>(null);

    // Destination search states (simplified - no external API)
    const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
    const [filteredDestinations, setFilteredDestinations] = useState<string[]>([]);

    // Date picker states
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Language dropdown states
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [languageSearch, setLanguageSearch] = useState('');

    const filteredLanguages = languages.filter(lang => 
        lang.toLowerCase().includes(languageSearch.toLowerCase())
    );

    // Simple destination search (local filtering)
    const searchDestinations = (input: string) => {
        if (input.length < 2) {
            setFilteredDestinations([]);
            setShowDestinationSuggestions(false);
            return;
        }

        const filtered = popularDestinations.filter(dest => 
            dest.toLowerCase().includes(input.toLowerCase())
        );
        
        setFilteredDestinations(filtered);
        setShowDestinationSuggestions(filtered.length > 0);
    };

    // Debounced destination search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (destination) {
                searchDestinations(destination);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [destination]);

    const handleDestinationSelect = (selectedDestination: string) => {
        setDestination(selectedDestination);
        setShowDestinationSuggestions(false);
        setFilteredDestinations([]);
    };

    const handleDestinationChange = (text: string) => {
        setDestination(text);
        if (text.length < 2) {
            setShowDestinationSuggestions(false);
            setFilteredDestinations([]);
        }
    };

    // Fetch filtered guides from Spring Boot backend
    const fetchFilteredGuides = async (filters: BookingDetails) => {
        setIsLoadingGuides(true);
        setGuideError(null);
        
        try {
            // Build query parameters for filtering
            const queryParams = new URLSearchParams();
            
            // Extract location from destination
            const cleanLocation = filters.destination.trim();
            
            // Add filters
            if (cleanLocation) {
                queryParams.append('location', cleanLocation);
            }
            if (filters.language) {
                queryParams.append('language', filters.language);
            }
            if (filters.type) {
                queryParams.append('type', filters.type);
            }
            
            // Add verified status filter
            queryParams.append('verified', 'done');
            
            console.log('API URL:', `${SPRING_BACKEND_URL}/api/guide/search?${queryParams.toString()}`);
            
            const response = await fetch(
                `${SPRING_BACKEND_URL}/api/guide/search?${queryParams.toString()}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    signal: AbortSignal.timeout(10000), // 10 second timeout
                }
            );

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const guidesData = await response.json();
            console.log('Guides data:', guidesData);
            setGuides(guidesData);
            
        } catch (error: unknown) {
            console.error('Error fetching guides:', error);
            if (error instanceof Error) {
                setGuideError(`Failed to load guides: ${error.message}`);
            } else {
                setGuideError('Failed to load guides. Please try again.');
            }
            setGuides([]);
        } finally {
            setIsLoadingGuides(false);
        }
    };

    // Generate calendar days for compact date picker
    const generateCalendarDays = (month: Date) => {
        const year = month.getFullYear();
        const monthIndex = month.getMonth();
        const firstDay = new Date(year, monthIndex, 1);
        const lastDay = new Date(year, monthIndex + 1, 0);
        const today = new Date();
        
        const days = [];
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(year, monthIndex, i);
            const dateString = date.toISOString().split('T')[0];
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today && !isToday;
            
            days.push({
                day: i,
                dateString,
                isToday,
                isPast,
                isSelected: selectedDates.includes(dateString)
            });
        }
        return days;
    };

    const selectDate = (dateString: string, isPast: boolean) => {
        if (isPast) return;
        
        setSelectedDates((currentDates) => {
            if (currentDates.includes(dateString)) {
                return currentDates.filter((d) => d !== dateString);
            } else {
                return [...currentDates, dateString];
            }
        });
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            if (direction === 'prev') {
                newMonth.setMonth(prev.getMonth() - 1);
            } else {
                newMonth.setMonth(prev.getMonth() + 1);
            }
            return newMonth;
        });
    };

    // Handle form submission and fetch guides
    const handleSubmit = () => {
        if (selectedDates.length === 0 || !destination.trim() || !lan.trim()) {
            alert('Please fill in all fields.');
            return;
        }

        const book: BookingDetails = {
            dates: selectedDates,
            destination: destination,
            type: bookingType,
            language: lan
        };

        setBookingDetails(book);
        setModalVisible(false);
        setFine(true);
        
        // Fetch filtered guides based on user selections
        fetchFilteredGuides(book);
    };

    const displayDates = selectedDates
        .sort()
        .map(date => new Date(date).toDateString())
        .join(', ');

    useFocusEffect(
        useCallback(() => {
            if (selectedDates.length === 0) {
                setModalVisible(true);
            }
        }, [selectedDates])
    );

    // Guide Card Component
    const GuideCard = ({ guide }: { guide: Guide }) => {
        // Calculate total cost based on selected dates
        const numberOfDays = selectedDates.length;
        const totalCost = guide.dailyRate * numberOfDays;

        const handleGuideCardPress = () => {
            // Ensure bookingDetails exists before navigation
            if (!bookingDetails) {
                console.error('Booking details not available');
                return;
            }

            console.log('Navigating with params:', {
                id: guide._id,
                guideData: JSON.stringify(guide),
                bookingDetails: JSON.stringify(bookingDetails),
                selectedDates: JSON.stringify(selectedDates),
                numberOfDays: numberOfDays.toString(),
                totalCost: totalCost.toString()
            });

            // Navigate to guide detail page
            router.push({
                pathname: `../views/guide/solo/[id]`,
                params: { 
                    id: guide._id,
                    // Pass the complete guide data
                    guideData: JSON.stringify(guide),
                    // Pass booking details
                    bookingDetails: JSON.stringify(bookingDetails),
                    // Pass individual params for easier access
                    destination: bookingDetails.destination,
                    selectedDates: JSON.stringify(selectedDates),
                    language: bookingDetails.language,
                    type: bookingDetails.type,
                    numberOfDays: numberOfDays.toString(),
                    totalCost: totalCost.toString(),
                    dailyRate: guide.dailyRate.toString()
                }
            });
        };

        return (
            <TouchableOpacity 
                className="bg-white rounded-3xl shadow-lg border border-gray-50 mb-6 overflow-hidden"
                onPress={handleGuideCardPress}
                style={{ 
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 8,
                }}
            >
                {/* Header Section with Profile and Rating */}
                <View className="p-5 pb-0">
                    <View className="flex-row items-start">
                        {/* Profile Picture with Status */}
                        <View className="mr-4 relative">
                            <Image 
                                source={{ uri: guide.pp || 'https://via.placeholder.com/80' }}
                                className="w-20 h-20 rounded-2xl"
                                contentFit="cover"
                            />
                            {/* Verification Badge */}
                            {guide.verified === 'done' && (
                                <View className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full items-center justify-center border-2 border-white">
                                    <Text className="text-white text-xs font-bold">✓</Text>
                                </View>
                            )}
                        </View>

                        {/* Guide Info Header */}
                        <View className="flex-1">
                            <View className="flex-row items-start justify-between mb-1">
                                <View className="flex-1 mr-2">
                                    <Text className="text-xl font-bold text-gray-900 mb-1">
                                        {guide.firstName} {guide.lastName}
                                    </Text>
                                    <Text className="text-sm text-gray-500 font-medium">
                                        {guide.specialization || "Professional Guide"}
                                    </Text>
                                </View>
                                
                                {/* Rating Badge */}
                                <View className="bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1 flex-row items-center">
                                    <Text className="text-yellow-600 text-lg mr-1">⭐</Text>
                                    <Text className="text-yellow-700 font-bold text-sm">
                                        {guide.stars.toFixed(1)}
                                    </Text>
                                    <Text className="text-yellow-600 text-xs ml-1">
                                        ({guide.reviewCount})
                                    </Text>
                                </View>
                            </View>

                            {/* Location and Experience Row */}
                            <View className="flex-row items-center mt-2">
                                <View className="flex-row items-center mr-4">
                                    <Text className="text-yellows-500 text-base mr-1">📍</Text>
                                    <Text className="text-sm text-gray-600 font-medium">{guide.location}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-purple-500 text-base mr-1">🎖️</Text>
                                    <Text className="text-sm text-gray-600 font-medium">
                                        {guide.experience}y exp
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Description Section */}
                <View className="px-5 py-3">
                    <Text className="text-gray-700 text-sm leading-5" numberOfLines={2}>
                        {guide.description || guide.bio || "Experienced local guide ready to show you the best of Sri Lanka!"}
                    </Text>
                </View>

                {/* Languages Section */}
                {guide.languages && guide.languages.length > 0 && (
                    <View className="px-5 pb-3">
                        <Text className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">
                            Languages
                        </Text>
                        <View className="flex-row flex-wrap">
                            {guide.languages.slice(0, 4).map((language, index) => (
                                <View 
                                    key={index}
                                    className="bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-full mr-2 mb-2"
                                >
                                    <Text className="text-black-700 text-xs font-medium">{language}</Text>
                                </View>
                            ))}
                            {guide.languages.length > 4 && (
                                <View className="bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
                                    <Text className="text-gray-600 text-xs font-medium">
                                        +{guide.languages.length - 4} more
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {/* Pricing Section */}
                <View className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                    <View className="flex-row justify-between items-center">
                        {/* Guide Type */}
                        <View className="flex-1">
                            <View className="bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-xl inline-block self-start">
                                <Text className="text-black-700 text-sm font-semibold capitalize">
                                    {guide.guideType} Guide
                                </Text>
                            </View>
                        </View>
                        
                        {/* Pricing Details */}
                        <View className="items-end">
                            {/* Total Cost - Prominent */}
                            <View className="items-end mb-1">
                                <Text className="text-3xl font-bold text-green-600">
                                    ${totalCost}
                                </Text>
                                <Text className="text-gray-500 text-xs font-medium">
                                    for {numberOfDays} day{numberOfDays > 1 ? 's' : ''}
                                </Text>
                            </View>
                            
                            {/* Daily Rate - Secondary */}
                            <View className="bg-green-50 border border-green-200 px-2 py-1 rounded-lg">
                                <Text className="text-green-700 text-xs font-medium">
                                    ${guide.dailyRate}/day
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Action Footer */}
                <View className="px-5 py-4 bg-gradient-to-r from-yellow-50 to-purple-50 border-t border-gray-100">
                    <View className="flex-row items-center justify-between">
                        {/* Duration Info */}
                        <View className="flex-row items-center">
                            <Text className="text-yellow-600 text-sm mr-1">📅</Text>
                            <Text className="text-Black-700 text-sm font-medium">
                                {numberOfDays} day{numberOfDays > 1 ? 's' : ''} selected
                            </Text>
                        </View>
                        
                        {/* Book Now Button */}
                        <TouchableOpacity className="bg-yellow-400 px-8 py-3 rounded-xl flex-row items-center shadow-sm">
                            <Text className="text-white text-sm mr-1">🎯</Text>
                            <Text className="text-black font-bold text-sm">Book Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className={`${Platform.OS === 'web' ? 'h-screen overflow-auto' : 'h-full'}`}>
            <View className='bg-[#F2F5FA] h-full'>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => {
                        if (selectedDates.length === 0) return;
                        setModalVisible(false);
                    }}
                >
                    <View className="flex-1 justify-center items-center bg-black/60">
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            className="w-[93%] h-[97%]"
                        >
                            <View className="flex-1 bg-white rounded-3xl shadow-2xl">
                                {/* Modern Header */}
                                <View className="px-6 py-5 border-b border-gray-100">
                                    <View className="flex-row items-center justify-between">
                                        <TouchableOpacity 
                                            onPress={() => { 
                                                setModalVisible(false); 
                                                if (!fine || selectedDates.length === 0) router.back(); 
                                            }}
                                            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                                        >
                                            <Text className="text-gray-600 font-medium">✕</Text>
                                        </TouchableOpacity>
                                        <Text className="text-xl font-bold text-gray-800">Guide Booking</Text>
                                        <View className="w-10" />
                                    </View>
                                </View>

                                <ScrollView
                                    className="flex-1"
                                    contentContainerStyle={{ padding: 24 }}
                                    keyboardShouldPersistTaps="handled"
                                    showsVerticalScrollIndicator={false}
                                >
                                    {/* Compact Date Selection Section */}
                                    <View className="mb-8">
                                        <View className="flex-row items-center mb-4">
                                            <View className="w-8 h-8 bg-yellow-100 rounded-full items-center justify-center mr-3">
                                                <Text className="text-yellow-600 font-bold text-sm">📅</Text>
                                            </View>
                                            <Text className="text-lg font-semibold text-gray-800">Select Your Dates</Text>
                                        </View>
                                        
                                        {/* Date Picker Toggle */}
                                        <TouchableOpacity
                                            onPress={() => setShowDatePicker(!showDatePicker)}
                                            className="bg-white rounded-2xl p-4 border-2 border-gray-200"
                                        >
                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-1">
                                                    {selectedDates.length === 0 ? (
                                                        <Text className="text-gray-400 text-base">Tap to select dates</Text>
                                                    ) : (
                                                        <View>
                                                            <Text className="text-sm text-gray-500 mb-1">Selected Dates</Text>
                                                            <Text className="text-base font-medium text-gray-800">
                                                                {selectedDates.length} day{selectedDates.length > 1 ? 's' : ''} selected
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <Text className="text-yellow-600 text-lg">{showDatePicker ? '▲' : '▼'}</Text>
                                            </View>
                                        </TouchableOpacity>

                                        {/* Compact Calendar */}
                                        {showDatePicker && (
                                            <View className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mt-3">
                                                {/* Month Navigation */}
                                                <View className="flex-row items-center justify-between mb-4">
                                                    <TouchableOpacity 
                                                        onPress={() => navigateMonth('prev')}
                                                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                                                    >
                                                        <Text className="text-yellow-600 font-bold">‹</Text>
                                                    </TouchableOpacity>
                                                    
                                                    <Text className="text-lg font-semibold text-gray-800">
                                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                    </Text>
                                                    
                                                    <TouchableOpacity 
                                                        onPress={() => navigateMonth('next')}
                                                        className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                                                    >
                                                        <Text className="text-yellow-600 font-bold">›</Text>
                                                    </TouchableOpacity>
                                                </View>

                                                {/* Days Grid */}
                                                <View className="flex-row flex-wrap justify-between">
                                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                                                        <View key={index} className="w-10 h-8 items-center justify-center">
                                                            <Text className="text-xs font-medium text-gray-500">{day}</Text>
                                                        </View>
                                                    ))}
                                                    
                                                    {generateCalendarDays(currentMonth).map((dateObj, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            onPress={() => selectDate(dateObj.dateString, dateObj.isPast)}
                                                            disabled={dateObj.isPast}
                                                            className={`w-10 h-10 items-center justify-center rounded-full m-0.5 ${
                                                                dateObj.isSelected 
                                                                    ? 'bg-yellow-500' 
                                                                    : dateObj.isToday 
                                                                        ? 'bg-yellow-100 border border-yellow-300' 
                                                                        : dateObj.isPast 
                                                                            ? 'bg-gray-100' 
                                                                            : 'bg-white hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            <Text className={`text-sm ${
                                                                dateObj.isSelected 
                                                                    ? 'text-white font-bold' 
                                                                    : dateObj.isPast 
                                                                        ? 'text-gray-300' 
                                                                        : 'text-gray-700'
                                                            }`}>
                                                                {dateObj.day}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                                
                                                {selectedDates.length > 0 && (
                                                    <View className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                                                        <Text className="text-sm font-medium text-yellow-700">
                                                            Selected: {selectedDates.map(date => 
                                                                new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                                            ).join(', ')}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>

                                    {/* Destination Input - Simplified without Google Places */}
                                    <View className="mb-6 relative z-20">
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                                                <Text className="text-green-600 font-bold text-sm">📍</Text>
                                            </View>
                                            <Text className="text-lg font-semibold text-gray-800">Destination</Text>
                                        </View>
                                        
                                        <View className="relative">
                                            <TextInput
                                                placeholder="Search for places in Sri Lanka..."
                                                placeholderTextColor="#9CA3AF"
                                                value={destination}
                                                onChangeText={handleDestinationChange}
                                                onFocus={() => {
                                                    if (destination.length >= 2 && filteredDestinations.length > 0) {
                                                        setShowDestinationSuggestions(true);
                                                    }
                                                }}
                                                className="bg-white rounded-2xl border-2 border-gray-200 px-4 py-4 text-base font-medium text-gray-800"
                                            />
                                        </View>

                                        {/* Local Destination Suggestions */}
                                        {showDestinationSuggestions && filteredDestinations.length > 0 && (
                                            <View className="absolute top-full left-0 right-0 bg-white rounded-2xl border border-gray-200 mt-2 shadow-lg z-30 max-h-60">
                                                <ScrollView 
                                                    showsVerticalScrollIndicator={false}
                                                    keyboardShouldPersistTaps="handled"
                                                >
                                                    {filteredDestinations.map((dest, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            onPress={() => handleDestinationSelect(dest)}
                                                            className="px-4 py-3 border-b border-gray-100"
                                                        >
                                                            <Text className="text-base font-medium text-gray-800">
                                                                {dest}
                                                            </Text>
                                                            <Text className="text-sm text-gray-500 mt-1">
                                                                {dest}, Sri Lanka
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}

                                        {/* Popular Places */}
                                        {!showDestinationSuggestions && destination.length < 2 && (
                                            <View className="mt-4">
                                                <Text className="text-sm font-medium text-gray-600 mb-3">Popular Destinations</Text>
                                                <View className="flex-row flex-wrap">
                                                    {popularDestinations.slice(0, 8).map((place, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            onPress={() => setDestination(place)}
                                                            className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 mr-2 mb-2"
                                                        >
                                                            <Text className="text-yellow-700 text-sm font-medium">
                                                                {place}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* Guide Type Selection */}
                                    <View className="mb-6">
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                                                <Text className="text-purple-600 font-bold text-sm">🎯</Text>
                                            </View>
                                            <Text className="text-lg font-semibold text-gray-800">Guide Type</Text>
                                        </View>
                                        
                                        <View className="flex-row space-x-3">
                                            <TouchableOpacity
                                                onPress={() => setBookingType('visit')}
                                                className={`flex-1 p-4 rounded-2xl border-2 ${
                                                    bookingType === 'visit' 
                                                        ? 'border-yellow-500 bg-yellow-50' 
                                                        : 'border-gray-200 bg-white'
                                                }`}
                                            >
                                                <Text className={`text-center font-semibold ${
                                                    bookingType === 'visit' ? 'text-yellow-700' : 'text-gray-600'
                                                }`}>
                                                    Local Guide
                                                </Text>
                                                <Text className={`text-center text-sm mt-1 ${
                                                    bookingType === 'visit' ? 'text-yellow-600' : 'text-gray-500'
                                                }`}>
                                                    Day trips & tours
                                                </Text>
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity
                                                onPress={() => setBookingType('travel')}
                                                className={`flex-1 p-4 rounded-2xl border-2 ${
                                                    bookingType === 'travel' 
                                                        ? 'border-yellow-500 bg-yellow-50' 
                                                        : 'border-gray-200 bg-white'
                                                }`}
                                            >
                                                <Text className={`text-center font-semibold ${
                                                    bookingType === 'travel' ? 'text-yellow-700' : 'text-gray-600'
                                                }`}>
                                                    Travel Guide
                                                </Text>
                                                <Text className={`text-center text-sm mt-1 ${
                                                    bookingType === 'travel' ? 'text-yellow-600' : 'text-gray-500'
                                                }`}>
                                                    Multi-day trips
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Language Selection */}
                                    <View className="mb-8 relative z-10">
                                        <View className="flex-row items-center mb-3">
                                            <View className="w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3">
                                                <Text className="text-orange-600 font-bold text-sm">🗣️</Text>
                                            </View>
                                            <Text className="text-lg font-semibold text-gray-800">Preferred Language</Text>
                                        </View>
                                        
                                        <TouchableOpacity
                                            onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                            className="bg-white rounded-2xl border-2 border-gray-200 px-4 py-4"
                                        >
                                            <View className="flex-row items-center justify-between">
                                                <Text className={`text-base ${lan ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                                                    {lan || 'Select preferred language'}
                                                </Text>
                                                <Text className="text-yellow-600 text-lg">
                                                    {showLanguageDropdown ? '▲' : '▼'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>

                                        {showLanguageDropdown && (
                                            <View className="absolute top-full left-0 right-0 bg-white rounded-2xl border border-gray-200 mt-2 shadow-lg z-20 max-h-64">
                                                <View className="p-3 border-b border-gray-100">
                                                    <TextInput
                                                        placeholder="Search languages..."
                                                        placeholderTextColor="#9CA3AF"
                                                        value={languageSearch}
                                                        onChangeText={setLanguageSearch}
                                                        className="bg-gray-50 rounded-xl px-3 py-2 text-sm"
                                                    />
                                                </View>
                                                
                                                <ScrollView 
                                                    showsVerticalScrollIndicator={false}
                                                    keyboardShouldPersistTaps="handled"
                                                >
                                                    {filteredLanguages.map((language, index) => (
                                                        <TouchableOpacity
                                                            key={index}
                                                            onPress={() => {
                                                                setLan(language);
                                                                setShowLanguageDropdown(false);
                                                                setLanguageSearch('');
                                                            }}
                                                            className={`px-4 py-3 border-b border-gray-50 ${
                                                                lan === language ? 'bg-yellow-50' : ''
                                                            }`}
                                                        >
                                                            <Text className={`text-base ${
                                                                lan === language ? 'text-yellow-700 font-medium' : 'text-gray-700'
                                                            }`}>
                                                                {language}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                            </View>
                                        )}
                                    </View>

                                    {/* Submit Button */}
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        className="bg-yellow-300 rounded-2xl py-4 shadow-lg"
                                    >
                                        <Text className="text-black text-center text-lg font-bold">
                                            Find Guides
                                        </Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>

                {/* Main Content - Guide Results */}
                {fine && (
                    <View className="flex-1">
                        {/* Header with booking summary */}
                        <View className="bg-white px-6 py-4 border-b border-gray-100">
                            <View className="flex-row items-center justify-between mb-3">
                                <TouchableOpacity 
                                    onPress={() => router.back()}
                                    className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                                >
                                    <Text className="text-gray-600 font-medium">←</Text>
                                </TouchableOpacity>
                                <Text className="text-lg font-bold text-gray-800">Available Guides</Text>
                                <TouchableOpacity 
                                    onPress={() => setModalVisible(true)}
                                    className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center"
                                >
                                    <Text className="text-yellow-600 font-medium">⚙️</Text>
                                </TouchableOpacity>
                            </View>
                            
                            {bookingDetails && (
                                <View className="bg-gray-50 rounded-xl p-3">
                                    <Text className="text-sm font-medium text-gray-700 mb-1">
                                        📍 {bookingDetails.destination}
                                    </Text>
                                    <Text className="text-sm text-gray-600">
                                        📅 {selectedDates.length} day{selectedDates.length > 1 ? 's' : ''} • 
                                        🗣️ {bookingDetails.language} • 
                                        🎯 {bookingDetails.type === 'visit' ? 'Local Guide' : 'Travel Guide'}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Guide Results */}
                        <ScrollView 
                            className="flex-1 px-6 py-4"
                            showsVerticalScrollIndicator={false}
                        >
                            {isLoadingGuides ? (
                                <View className="flex-1 items-center justify-center py-20">
                                    <Text className="text-gray-400 text-lg mb-2">🔄</Text>
                                    <Text className="text-gray-600 text-base">Finding guides...</Text>
                                </View>
                            ) : guideError ? (
                                <View className="flex-1 items-center justify-center py-20">
                                    <Text className="text-red-400 text-lg mb-2">⚠️</Text>
                                    <Text className="text-red-600 text-base text-center mb-4">{guideError}</Text>
                                    <TouchableOpacity 
                                        onPress={() => bookingDetails && fetchFilteredGuides(bookingDetails)}
                                        className="bg-yellow-600 px-6 py-3 rounded-xl"
                                    >
                                        <Text className="text-white font-medium">Try Again</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : guides.length === 0 ? (
                                <View className="flex-1 items-center justify-center py-20">
                                    <Text className="text-gray-400 text-lg mb-2">🔍</Text>
                                    <Text className="text-gray-600 text-base text-center mb-2">
                                        No guides found for your criteria
                                    </Text>
                                    <Text className="text-gray-500 text-sm text-center mb-4">
                                        Try adjusting your search filters
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={() => setModalVisible(true)}
                                        className="bg-yellow-600 px-6 py-3 rounded-xl"
                                    >
                                        <Text className="text-white font-medium">Modify Search</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View>
                                    <Text className="text-lg font-bold text-gray-800 mb-4">
                                        {guides.length} Guide{guides.length > 1 ? 's' : ''} Available
                                    </Text>
                                    
                                    {guides.map((guide) => (
                                        <GuideCard key={guide._id} guide={guide} />
                                    ))}
                                </View>
                            )}
                        </ScrollView>
                    </View>
                )}
            </View>
        </View>
    );
}