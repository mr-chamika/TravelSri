// app/_Layout.tsx
import { Tabs } from "expo-router";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, View, Text, StatusBar, TouchableOpacity, Modal } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

import Topbar from "../../components/TopbarX";


const HomeA = require("../../assets/images/home2.png");
const UserA = require("../../assets/images/tabbar/feedback.png");
const Car = require("../../assets/images/tabbar/carr.png");
const Locat = require("../../assets/images/tabbar/book.png");
const MenuX = require("../../assets/images/top bar/menu x.png");

export default function _Layout() {
    const [show, setShow] = useState(false);
    const [notify, setNotify] = useState(false);
    const translateX = useSharedValue(-1000);
    const opacity = useSharedValue(0);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const animationConfig = { duration: 300, easing: Easing.inOut(Easing.ease) };
        if (show) {
            translateX.value = withTiming(0, animationConfig);
            opacity.value = withTiming(1, { ...animationConfig, duration: 300 });
        } else {
            translateX.value = withTiming(-1000, animationConfig);
            opacity.value = withTiming(0, { ...animationConfig, duration: 300 });
        }
    }, [show]);

    const menuStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: opacity.value,
    }));

    const toggleMenu = () => {
        setShow(!show);
    };
    const toggling = () => {
        setNotify(!notify);
    };

    return (
                <View className="flex-1 bg-[#F2F0EF]">
            <StatusBar barStyle="dark-content" backgroundColor="#F2F0EF" />

            <View
                className="flex-1"
                style={{
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                }}
            >
                <Topbar notifying={toggling} on={notify} />


            <Tabs
                screenOptions={{
                        tabBarShowLabel: false,
                        headerShown: false,
                        tabBarStyle: {
                            backgroundColor: "#FEFA17",
                            height: 65,
                            paddingTop: 13,
                            borderColor: "#FEFA17",
                        },
                        tabBarItemStyle: {
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                            height: 40,
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
                    name="bookings"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-2 ${focused ? "bg-white" : "bg-transparent"} rounded-full`}>
                                <Image source={Locat} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="feedback"
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <View className={`p-2 ${focused ? "bg-white" : "bg-transparent"} rounded-full`}>
                                <Image source={UserA} />
                            </View>
                        ),
                    }}
                />
            </Tabs>
        </View>
        </View>
    );
}
