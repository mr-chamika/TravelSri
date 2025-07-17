import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import AsyncStorage from "@react-native-async-storage/async-storage";

cssInterop(Image, { className: "style" });

const router = useRouter();
//const OPTIONS = ["Colombo", "Kandy", "Galle", "Matara", "Nuwara Eliya", "Anuradhapura", "Polonnaruwa", "Jaffna", "Trincomalee"];
const but = require('../../../assets/images/tabbar/create/location/drop.png');
const mark = require('../../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../../assets/images/tabbar/towert.png');

/* const routes = [
    { id: '1', from: 'Matara', to: 'Colombo', duration: 1, thumbnail: pic },
    { id: '2', from: 'Uthuwankanda', to: 'Kurunegala', duration: 1, thumbnail: pic },
    { id: '3', from: 'Colombo', to: 'Hanthana', duration: 1, thumbnail: pic },
    { id: '4', from: 'Galle', to: 'Jaffna', duration: 3, thumbnail: pic }
];
 */

interface Route {

    _id: string,
    from: string,
    to: string,
    duration: number,
    thumbnail: string

}

export default function Dropdown() {
    const [selected, setSelected] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState<string | null>(null);
    const [hasMadeInitialSelection, setHasMadeInitialSelection] = useState(false);
    const [routes, setRoutes] = useState<Route[]>([])
    const [options, setOptions] = useState<string[]>([])

    useEffect(() => {
        if (routes.length > 0) {
            const uniqueLocations = [...new Set(routes.map(route => route.to))];
            setOptions([...uniqueLocations]);
        }
    }, [routes]);

    const sortedOptions = useMemo(() => {
        if (!selected) return options;
        const otherOptions = options.filter((opt) => opt !== selected && opt !== "Select Location...");
        return [selected, ...otherOptions];
    }, [selected, options]);

    const handleSelect = useCallback(async (option: string) => {
        if (option === "Select Location") {
            setSelected(null);
            setModalVisible(false);
            return;
        }
        setSelected(option);
        setHasMadeInitialSelection(true);
        setModalVisible(false);
        try {
            await AsyncStorage.setItem('selectedLocation', option);
            await AsyncStorage.setItem('hasMadeInitialSelection', 'true');
        } catch (error) {
            console.error('Error saving selection to AsyncStorage:', error);
        }
    }, []);

    const toggleCardSelection = useCallback(async (index: string) => {
        const newIndex = selectedCardIndex === index ? null : index;
        setSelectedCardIndex(newIndex);
        try {

            const routeIdToSave = newIndex !== null ? newIndex : '';
            await AsyncStorage.setItem('selectedRouteId', routeIdToSave);
        } catch (error) {
            console.error('Error saving selectedCardIndex to AsyncStorage:', error);
        }
    }, [selectedCardIndex]);

    useFocusEffect(
        useCallback(() => {
            const loadStateFromStorage = async () => {
                try {
                    const [savedLocation, initialSelection, savedRouteId] = await Promise.all([
                        AsyncStorage.getItem('selectedLocation'),
                        AsyncStorage.getItem('hasMadeInitialSelection'),
                        AsyncStorage.getItem('selectedRouteId')
                    ]);

                    if (savedLocation && initialSelection === 'true') {
                        setSelected(savedLocation);
                        setHasMadeInitialSelection(true);
                        setModalVisible(false);
                    } else {
                        setModalVisible(true);
                    }

                    if (savedRouteId && routes.length > 0) {
                        const x = routes.find(route => route._id === savedRouteId);
                        if (x != null) {

                            setSelectedCardIndex(x?._id !== null ? x?._id : null);

                        }
                    } else {
                        setSelectedCardIndex(null);
                    }
                } catch (error) {

                    setSelected(null);
                    setHasMadeInitialSelection(false);
                    setModalVisible(true);
                    setSelectedCardIndex(null);
                }
            };

            loadStateFromStorage();
        }, [routes])
    );

    useEffect(() => {
        const getRoutes = async () => {

            try {

                const res = await fetch('http://localhost:8080/traveler/routes-allshow')

                if (res) {

                    const data: Route[] = await res.json()
                    console.log(data)
                    setRoutes(data)

                }

            } catch (err) {

                console.log(`Error from routes getting : ${err}`)

            }

        }
        getRoutes()
    }, [])

    return (
        <View className="bg-[#F2F5FA] relative gap-y-0 h-full">
            <View className="h-full">

                {selected && (
                    <View className="w-full px-4 mt-6">
                        <TouchableOpacity
                            className="bg-[#d9d9d952] px-4 py-3 rounded-lg flex-row justify-between items-center"
                            onPress={() => setModalVisible(true)}
                        >
                            <Text className="font-semibold text-lg text-black">{selected}</Text>
                            <Image className="w-5 h-5" source={but} />
                        </TouchableOpacity>
                    </View>
                )}

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        if (hasMadeInitialSelection) setModalVisible(false);
                    }}
                >
                    <View className="flex-1 justify-center items-center bg-black/50 px-6">
                        <View className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg max-h-[70%]">
                            <TouchableOpacity onPress={() => {
                                if (hasMadeInitialSelection) {
                                    setModalVisible(false);
                                } else {
                                    router.back();
                                    setModalVisible(false);
                                }
                            }}>
                                <Text>{hasMadeInitialSelection ? "Cancel" : "Back"}</Text>
                            </TouchableOpacity>
                            <Text className="text-xl font-bold mb-4 text-center">Select a Location</Text>
                            <FlatList
                                data={sortedOptions}
                                keyExtractor={(item, index) => `${item}`}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(`${item}`)}
                                        className="px-4 py-3 border-b border-gray-200"
                                    >
                                        <Text className="text-gray-700 text-center text-lg">{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Only show main content if a location is selected */}
                {selected && (
                    <ScrollView
                        className="w-full h-[80%]"
                        contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 pt-5 pb-5"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="items-center gap-5">
                            {routes.map((route, index) => (
                                (/* route.from === selected ||  */route.to === selected) &&

                                <TouchableOpacity

                                    key={route._id}
                                    onPress={() => router.push(`/views/route/${route._id}`)}
                                    className="bg-gray-200 w-[350px] h-[165px] items-center rounded-[20px] ml-3"
                                >

                                    <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                                        <Text className="bg-gray-100 rounded-md px-2">Route #{index + 1}</Text>
                                        <TouchableOpacity

                                            onPress={() => toggleCardSelection(route._id)}
                                            className="bg-gray-100 w-5 h-5 rounded-full justify-center items-center"
                                        >
                                            {selectedCardIndex === route._id && (
                                                <Image className="w-4 h-4" source={mark} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                    <Image
                                        className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                                        source={{ uri: `data:image/jpeg;base64,${route.thumbnail}` }}
                                    />
                                    <View>
                                        <Text className="mt-1 text-[20px] text-center">{route.from} to {route.to}</Text>
                                        <Text className="mt-1 text-[15px] text-center">{route.duration} day</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </View>
        </View>
    );
} 