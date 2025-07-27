import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageSourcePropType,
    Dimensions, // 1. Import Dimensions
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';


cssInterop(Image, { className: "style" });


// 2. Get the full screen width and height
const { width, height } = Dimensions.get('window');

// Define the type for a single slide object
interface ISlide {
    key: string;
    title: string;
    text: string;
    image: ImageSourcePropType;
}

// Data for the tutorial slides
const slides: ISlide[] = [
    {
        key: '1',
        title: 'Navigate With Ease',
        text: 'Use the bottom bar to switch between your Home (🏠), Transport (🚗),Create Trips (🗺️), and Profile (👤).',
        image: require('../assets/images/screenshots/image_fe66aa.png'),
    },
    {
        key: '2',
        title: 'Design a Trip For You',
        text: 'Want a unique experience? Tap the Route Icon to create a fully personalized trip from scratch.',
        image: require('../assets/images/screenshots/createview.png'),
    },
    {
        key: '3',
        title: 'Plan Your Perfect Trip',
        text: 'Use the top bar to Select destination, Book a hotel, Book a Guide, Hire Equipments and Book a Vehicle',
        image: require('../assets/images/screenshots/image_fe6a68.png'),
    },
    {
        key: '4',
        title: 'Your Travel Dashboard',
        text: 'Side bar shows the individual services offers by TravelSri',
        image: require('../assets/images/screenshots/side.png'),
    },
];

const OnboardingScreen: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const handleDone = async () => {
        try {
            await AsyncStorage.setItem('hasViewedOnboarding', 'true');
            router.replace('/(tabs)');
        } catch (err) {
            console.log('Error @handleDone: ', err);
            router.replace('/(tabs)');
        }
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            handleDone();
        }
    };

    const currentSlide = slides[currentIndex];

    return (
        <View className='h-full w-full'>
            <Image
                source={currentSlide.image}
                // 3. Apply explicit width and height to force full-screen coverage
                //style={{ width: width, height: height * 0.95 }}
                className='h-full w-full'
            />
            {/* This container holds all content at the bottom of the screen */}
            <View className={`absolute ${currentIndex == 0 || currentIndex == 1 ? 'top-0' : 'bottom-0'} w-full`}>
                {/* This View creates the dark card effect with padding */}
                <View className={`bg-black/80 ${currentIndex == 0 || currentIndex == 1 ? 'rounded-b-3xl' : 'rounded-t-3xl'} p-5 pb-8`}>
                    {/* Text Content */}
                    <Text className="text-3xl font-bold text-white text-center mb-2">
                        {currentSlide.title}
                    </Text>
                    <Text className="text-base text-white text-center leading-6 mb-8">
                        {currentSlide.text}
                    </Text>

                    {/* Footer section with buttons and dots */}
                    <View className="w-full flex-row justify-between items-center">
                        <TouchableOpacity className="p-4" onPress={handleDone}>
                            <Text className="text-gray-300 text-base">Skip</Text>
                        </TouchableOpacity>

                        <View className="flex-row">
                            {slides.map((_, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setCurrentIndex(index)}
                                    className="p-1"
                                >
                                    <View
                                        className={`w-2 h-2 rounded-full mx-1.5 ${currentIndex === index ? 'bg-[#fec200]' : 'bg-gray-400'
                                            }`}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            className="bg-[#fec200] rounded-full py-3 px-6"
                            onPress={handleNext}
                        >
                            <Text className="text-black text-base font-semibold">
                                {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </View>
    );
};

export default OnboardingScreen;