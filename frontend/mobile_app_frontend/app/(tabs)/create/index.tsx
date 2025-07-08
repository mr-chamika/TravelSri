import React, { useState, useMemo, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';
import AsyncStorage from "@react-native-async-storage/async-storage";

cssInterop(Image, { className: "style" });

const router = useRouter();

const OPTIONS = ["Colombo", "Kandy", "Galle", "Matara", "Nuwara Eliya", "Anuradhapura", "Polonnaruwa", "Jaffna", "Trincomalee"];

const but = require('../../../assets/images/tabbar/create/location/drop.png');
const mark = require('../../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../../assets/images/tabbar/towert.png');

const routes = [
    { id: '1', from: 'Matara', to: 'Colombo', duration: 1, thumbnail: pic },
    { id: '2', from: 'Uthuwankanda', to: 'Kurunegala', duration: 1, thumbnail: pic },
    { id: '3', from: 'Colombo', to: 'Hanthana', duration: 1, thumbnail: pic },
    { id: '4', from: 'Galle', to: 'Jaffna', duration: 3, thumbnail: pic }
];

export default function Dropdown() {
    const [selected, setSelected] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(true);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
    const [hasMadeInitialSelection, setHasMadeInitialSelection] = useState(false);

    // Put selected location at top of list if selected
    const sortedOptions = useMemo(() => {
        if (!selected) return OPTIONS;
        return [selected, ...OPTIONS.filter((opt) => opt !== selected)];
    }, [selected]);

    const handleSelect = useCallback(async (option: string) => {
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

    const toggleCardSelection = useCallback(async (index: number) => {
        setSelectedCardIndex(prev => {
            if (prev === index) {
                AsyncStorage.setItem('selectedRouteId', '').catch(error => {
                    console.error('Error clearing selectedRouteId in AsyncStorage:', error);
                });
                return null;
            } else {
                return index;
            }
        });
    }, []);

    useFocusEffect(
        useCallback(() => {
            const loadSelection = async () => {
                try {
                    const savedSelection = await AsyncStorage.getItem('selectedLocation');
                    const initialSelection = await AsyncStorage.getItem('hasMadeInitialSelection');
                    const savedRouteId = await AsyncStorage.getItem('route');
                    // --- Explicitly reset local state before attempting to load from storage ---
                    setSelected(null);
                    setHasMadeInitialSelection(false);
                    setModalVisible(true); // Default to showing modal
                    setSelectedCardIndex(null); // Reset selected route card

                    if (savedSelection && initialSelection === 'true') {
                        setSelected(savedSelection);
                        setHasMadeInitialSelection(true);
                        setModalVisible(false);
                    }

                    if (savedRouteId) {
                        const index = routes.findIndex(route => route.id === savedRouteId);
                        if (index !== -1) {
                            setSelectedCardIndex(index);
                        }
                    }
                } catch (error) {
                    console.error('Error loading selection from AsyncStorage (index):', error);
                    // On error, also ensure a full reset
                    setSelected(null);
                    setHasMadeInitialSelection(false);
                    setModalVisible(true);
                    setSelectedCardIndex(null);
                }
            };
            loadSelection();
        }, [])
    );

    // useEffect(() => {
    //     const loadSelection = async () => {
    //         try {
    //             const savedSelection = await AsyncStorage.getItem('selectedLocation');
    //             const initialSelection = await AsyncStorage.getItem('hasMadeInitialSelection');
    //             const savedRouteId = await AsyncStorage.getItem('route');
    //             // --- Explicitly reset local state before attempting to load from storage ---
    //             setSelected(null);
    //             setHasMadeInitialSelection(false);
    //             setModalVisible(true); // Default to showing modal
    //             setSelectedCardIndex(null); // Reset selected route card

    //             if (savedSelection && initialSelection === 'true') {
    //                 setSelected(savedSelection);
    //                 setHasMadeInitialSelection(true);
    //                 setModalVisible(false);
    //             }

    //             if (savedRouteId) {
    //                 const index = routes.findIndex(route => route.id === savedRouteId);
    //                 if (index !== -1) {
    //                     setSelectedCardIndex(index);
    //                 }
    //             }
    //         } catch (error) {
    //             console.error('Error loading selection from AsyncStorage (index):', error);
    //             // On error, also ensure a full reset
    //             setSelected(null);
    //             setHasMadeInitialSelection(false);
    //             setModalVisible(true);
    //             setSelectedCardIndex(null);
    //         }
    //     };
    //     loadSelection();
    // }, []);

    useFocusEffect(
        useCallback(() => {
            const getSelectedRoute = async () => {
                await AsyncStorage.setItem('total', '0');
                const routeId = await AsyncStorage.getItem('route');
                if (routeId) {
                    const index = routes.findIndex(route => route.id === routeId);
                    if (index !== -1) {
                        setSelectedCardIndex(index);
                    }
                }
            };
            getSelectedRoute();
            if (!hasMadeInitialSelection) {
                setModalVisible(true);
            }
        }, [hasMadeInitialSelection])
    );

    return (
        <View className="bg-[#F2F5FA] relative gap-y-0 h-full">
            {/* <TouchableOpacity onPress={

                async () => {
                    try {
                        const keys = await AsyncStorage.getAllKeys();
                        await AsyncStorage.multiRemove(keys);
                        alert(keys);
                    } catch (e) {
                        alert(`Error clearing AsyncStorage:, ${e}`);
                    }

                }}><View className="bg-black m-3 px-5 py-2 w-24 h-10 rounded-lg"><Text className="text-white text-center">Reset</Text></View></TouchableOpacity> */}
            <View className="h-full">
                {/* Location selector button */}
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

                {/* Modal for location selection */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        if (!selected) // prevent closing modal without selection
                            setModalVisible(false);
                    }}
                >
                    <View className="flex-1 justify-center items-center bg-black/50 px-6">
                        <View className="w-full max-w-md bg-white rounded-2xl p-5 shadow-lg max-h-[70%]">
                            <TouchableOpacity onPress={() => { setModalVisible(false); if (!selected) router.back() }}>
                                {(!selected) ? <Text> Back</Text> : <Text> Cancel</Text>}
                            </TouchableOpacity>
                            <Text className="text-xl font-bold mb-4 text-center">Select a Location</Text>
                            <FlatList
                                data={sortedOptions}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => handleSelect(item)}
                                        className="px-4 py-3 border-b border-gray-200"
                                    >
                                        <Text className="text-gray-700 text-center text-lg">{item}</Text>
                                    </TouchableOpacity>
                                )}
                                showsVerticalScrollIndicator={true}
                                style={{ maxHeight: 320 }}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Only show main content if a location is selected */}
                {selected && (
                    <>
                        <View>
                            {/* Scrollable cards */}
                            <ScrollView
                                className="w-full h-[80%]"
                                contentContainerClassName="flex-row flex-wrap justify-center items-start gap-3 pt-5 pb-5"
                                showsVerticalScrollIndicator={false}
                            >
                                <View className="items-center gap-5">
                                    {routes.map((route, index) => (
                                        (route.from == selected || route.to == selected) &&
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => router.push(`/views/route/${route.id}`)}
                                            className="bg-gray-200 w-[350px] h-[165px] items-center rounded-[20px] ml-3"
                                        >
                                            <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                                                <Text className="bg-gray-100 rounded-md px-2">Travel #{index + 1}</Text>
                                                <TouchableOpacity
                                                    onPress={() => toggleCardSelection(index)}
                                                    className="bg-gray-100 w-5 h-5 rounded-full justify-center items-center"
                                                >
                                                    {selectedCardIndex === index && (
                                                        <Image className="w-4 h-4" source={mark} />
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                            <Image
                                                className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                                                source={route.thumbnail}
                                            />
                                            <View>
                                                <Text className="mt-1 text-[20px] text-center">
                                                    {route.from} to {route.to}
                                                </Text>
                                                <Text className="mt-1 text-[15px] text-center">
                                                    {route.duration} day
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}
