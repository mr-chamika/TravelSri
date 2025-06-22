import { Tabs } from "expo-router";
import { View, Text } from 'react-native'
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { SafeAreaView } from "react-native-safe-area-context";


cssInterop(Image, { className: "style" });

const pin = require('../../../assets/images/tabbar/create/pin.png')
const bed = require('../../../assets/images/tabbar/create/bed.png')
const guide = require('../../../assets/images/tabbar/create/guid.png')
const equips = require('../../../assets/images/tabbar/create/equips.png')
const car = require('../../../assets/images/tabbar/create/carr.png')

export default function CreateLayout() {
    return (
        <SafeAreaView className="flex-1 bg-[#F2F0EF]" edges={['top', 'left', 'right']}>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
                    tabBarStyle: {

                        backgroundColor: 'white',

                    },
                    tabBarItemStyle: {
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center"
                    },
                    tabBarPosition: 'top',
                }}
            >

                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"} mt-3`}>
                                <Image className="w-6 h-6" source={pin} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="hotels"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"} mt-3`}>
                                <Image className="w-6 h-6" source={bed} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="guide"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"} mt-3`}>
                                <Image className="w-6 h-6" source={guide} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="equipments"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"} mt-3`}>
                                <Image className="w-6 h-6" source={equips} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="car"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"} mt-3`}>
                                <Image className="w-6 h-6" source={car} />
                            </View>
                        ),
                    }}
                />

            </Tabs>
        </SafeAreaView>
    );
}