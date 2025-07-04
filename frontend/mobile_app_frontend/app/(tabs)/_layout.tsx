// app/_Layout.tsx
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, View, Text, StatusBar, TouchableOpacity, Modal } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";

const HomeA = require("../../assets/images/home2.png");
const UserA = require("../../assets/images/user2.png");
const Car = require("../../assets/images/tabbar/carr.png");
const Locat = require("../../assets/images/tabbar/create1.png");
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
                <Topbar pressing={toggleMenu} notifying={toggling} on={notify} />

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
                                <View
                                    className={`p-2 rounded-full ${focused ? "bg-white" : "bg-transparent"
                                        }`}
                                >
                                    <Image source={HomeA} />
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="carRental"
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <View
                                    className={`p-2 rounded-full ${focused ? "bg-white" : "bg-transparent"
                                        }`}
                                >
                                    <Image source={Car} />
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="create"
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <View
                                    className={`p-2 rounded-full ${focused ? "bg-white" : "bg-transparent"
                                        }`}
                                >
                                    <Image source={Locat} />
                                </View>
                            ),
                        }}
                    />
                    <Tabs.Screen
                        name="profile"
                        options={{
                            tabBarIcon: ({ focused }) => (
                                <View
                                    className={`p-2 rounded-full ${focused ? "bg-white" : "bg-transparent"
                                        }`}
                                >
                                    <Image source={UserA} />
                                </View>
                            ),
                        }}
                    />
                </Tabs>
            </View>

            <Animated.View
                className="absolute w-full h-full bg-[#FEFA17] z-10"
                style={[
                    menuStyle,
                    {
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                        paddingLeft: insets.left,
                        paddingRight: insets.right,
                    },
                ]}
                pointerEvents={show ? "auto" : "none"}
            >
                <View className="h-10 w-[55%] flex flex-row justify-between mt-3 mx-3 items-center">
                    <TouchableOpacity onPress={toggleMenu}>
                        <View className="w-10 h-10 bg-[#FEFA17] rounded-full items-center justify-center shadow-lg z-60">
                            <Image source={MenuX} />
                        </View>
                    </TouchableOpacity>
                    <View className="justify-center items-center h-full flex-1">
                        <Text className="text-2xl font-bold">Menu</Text>
                    </View>
                </View>
                <View className="px-6 flex-1">
                    <Sidebar close={toggleMenu} />
                </View>
            </Animated.View>

        </View>

    );
}
