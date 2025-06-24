import { Tabs } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, View, Text, StatusBar, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, } from "react-native-reanimated";
import Topbar from "../../components/Topbar";

const HomeA = require("../../assets/images/home2.png");
const UserA = require("../../assets/images/user2.png");
const Car = require("../../assets/images/tabbar/car_r.png");
const Locat = require("../../assets/images/tabbar/create1.png");
const MenuX = require("../../assets/images/top bar/menu x.png");

export default function _Layout() {
    const [show, setShow] = useState(false);
    const translateX = useSharedValue(-1000);
    const opacity = useSharedValue(0);

    const menuStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

    return (
        <SafeAreaView className="flex-1 bg-[#F2F0EF] edges={['top','left','right']}">
            <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />
            <Topbar />

            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#FEFA17",
                        borderRadius: 23,
                        marginHorizontal: 15,
                        marginBottom: 20,
                        height: 65,
                        paddingTop: 13,
                        borderColor: "#FEFA17",
                        position: "absolute",
                    },
                    tabBarItemStyle: {
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 10,
                        height: 40,
                        width: 50,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-2 ${focused ? "bg-white" : "bg-transparent"} rounded-full`}>
                                <Image source={HomeA} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="carRental"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-2 ${focused ? "bg-white" : "bg-transparent"} rounded-full`}>
                                <Image source={Car} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="create"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-2 ${focused ? "bg-white" : "bg-transparent"} rounded-full`}>
                                <Image source={Locat} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-2 ${focused ? "bg-white" : "bg-transparent"} rounded-full`}>
                                <Image source={UserA} />
                            </View>
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}
