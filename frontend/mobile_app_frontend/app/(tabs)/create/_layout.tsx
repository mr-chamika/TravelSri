import { Tabs } from "expo-router";
import { View, Text } from 'react-native'
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'

cssInterop(Image, { className: "style" });

const pin = require('../../../assets/images/tabbar/create/pin.png')
const bed = require('../../../assets/images/tabbar/create/bed.png')
const guide = require('../../../assets/images/tabbar/create/guid.png')
const equips = require('../../../assets/images/tabbar/create/equips.png')
const car = require('../../../assets/images/tabbar/create/carr.png')

export default function CreateLayout() {
    return (
        //<SafeAreaView className="flex-1 bg-[#F2F0EF]" edges={['top', 'left', 'right']}>
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: 'white',
                    height: 80, // Add explicit height
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e0e0e0',

                },
                tabBarItemStyle: {

                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 10,
                },
                tabBarPosition: 'top'
                // Remove tabBarPosition as it's not supported
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"}`}>
                            <Image className="w-7 h-7" source={pin} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="hotels"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"}`}>
                            <Image className="w-7 h-7" source={bed} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="guide"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"}`}>
                            <Image className="w-7 h-7" source={guide} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="equipments"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"}`}>
                            <Image className="w-7 h-7" source={equips} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="car"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View className={`p-8 ${focused ? "bg-[#FEFA17]" : "bg-transparent"}`}>
                            <Image className="w-7 h-7" source={car} />
                        </View>
                    ),
                }}
            />
        </Tabs>
        //</SafeAreaView>
    );
}
