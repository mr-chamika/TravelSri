import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { cssInterop } from 'nativewind';
import { Image } from 'expo-image';

cssInterop(Image, { className: "style" });

const router = useRouter();

const OPTIONS = ["Colombo", "Kandy", "Galle", "Matara", "Nuwara Eliya", "Anuradhapura", "Polonnaruwa", "Jaffna", "Trincomalee"];

const but = require('../../../assets/images/tabbar/create/location/drop.png');
const mark = require('../../../assets/images/tabbar/create/location/mark.png');
const pic = require('../../../assets/images/tabbar/towert.png');

export default function Dropdown() {
    const [selected, setSelected] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(true);
    const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

    // Put selected location at top of list if selected
    const sortedOptions = useMemo(() => {
        if (!selected) return OPTIONS;
        return [selected, ...OPTIONS.filter((opt) => opt !== selected)];
    }, [selected]);

    const handleSelect = (option: string) => {
        setSelected(option);
        setModalVisible(false);
    };

    const toggleCardSelection = (index: number) => {
        setSelectedCardIndex(prev => (prev === index ? null : index));
    };

    useFocusEffect(
        useCallback(() => {
            // We re-open the modal ONLY if the user hasn't successfully submitted the form yet.
            // `confirmedDate` is a good proxy for submission status.
            if (!selected) {
                setModalVisible(true);
            }
        }, [selected])
    );

    return (
        <View className="bg-[#F2F5FA] relative gap-y-8 h-full">
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
                        if (!selected) return; // prevent closing modal without selection
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
                                    {[0, 1, 2, 3].map((_, index) => (
                                        <TouchableOpacity
                                            key={index}
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
                                                source={pic}
                                            />
                                            <View>
                                                <Text className="mt-1 text-[20px] text-center">
                                                    Matara to Colombo
                                                </Text>
                                                <Text className="mt-1 text-[15px] text-center">
                                                    1 day
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>

                        </View>
                        <View className="p-4 border-t border-gray-200 bg-white justify-center">
                            <Text className="text-center font-bold text-lg">Total: 1000 LKR</Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}
