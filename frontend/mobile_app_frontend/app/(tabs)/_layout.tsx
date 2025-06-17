import { Tabs } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { Image, View, Text, StatusBar } from "react-native"
const HomeA = require('../../assets/images/home2.png')
const UserA = require('../../assets/images/user2.png')
const Car = require('../../assets/images/tabbar/car_r.png')
const Locat = require('../../assets/images/tabbar/create1.png')
import Topbar from '../../components/Topbar'

export default function _Layout() {

    return (
        <SafeAreaView className="flex-1" edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor='#F2F0EF' />

            <Topbar />

            <Tabs screenOptions={{

                tabBarShowLabel: false,
                headerShown: false,

                tabBarStyle: {

                    backgroundColor: '#FEFA17',
                    borderRadius: 23,
                    marginHorizontal: 15,
                    marginBottom: 20,
                    height: 65,
                    paddingTop: 13,
                    borderColor: '#FEFA17',
                    position: 'absolute',

                },
                tabBarItemStyle: {

                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10',
                    height: 40,
                    width: 50

                },


            }}>

                <Tabs.Screen

                    name="index"
                    options={{

                        tabBarIcon: ({ focused }) => {
                            return (
                                <View className={`p-2 rounded-[20px] ${focused ? 'bg-white' : 'bg-transparent'}`}>
                                    <Image source={HomeA} />
                                </View>
                            )

                        },


                    }}

                />

                <Tabs.Screen

                    name="carRental"
                    options={{

                        tabBarIcon: ({ focused }) => {
                            return (

                                <View className={`p-2 rounded-[20px] ${focused ? 'bg-white' : 'bg-transparent'}`}>
                                    <Image
                                        source={Car}
                                    />
                                </View>
                            )

                        },
                    }}

                />

                <Tabs.Screen

                    name="create"
                    options={{

                        tabBarIcon: ({ focused }) => {
                            return (

                                <View className={`p-2 rounded-[20px] ${focused ? 'bg-white' : 'bg-transparent'}`}>
                                    <Image
                                        source={Locat}
                                    />
                                </View>
                            )

                        },
                    }}

                />

                <Tabs.Screen

                    name="profile"
                    options={{

                        tabBarIcon: ({ focused }) => {
                            return (
                                <View className={`p-2 rounded-[20px] ${focused ? 'bg-white' : 'bg-transparent'}`}>

                                    <Image source={UserA} />
                                </View>

                            )

                        },
                    }}

                />

            </Tabs>
        </SafeAreaView>
    )

}