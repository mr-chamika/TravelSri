import { Tabs } from "expo-router"
import { Image } from "react-native"
const Home = require('../../assets/images/home1.png')
const HomeA = require('../../assets/images/home2.png')
const User = require('../../assets/images/user1.png')
const UserA = require('../../assets/images/user2.png')
const Search = require('../../assets/images/search1.png')
const SearchA = require('../../assets/images/search2.png')

export default function _Layout() {

    return (

        <Tabs screenOptions={{

            tabBarShowLabel: false,
            headerShown: false,

            tabBarStyle: {

                backgroundColor: '#3e3d6b',
                borderRadius: 25,
                marginHorizontal: 15,
                marginBottom: 20,
                height: 60,
                //position: 'absolute',
                paddingTop: 9,
                borderColor: '#3e3d6b',
                position: 'absolute',

            },
            tabBarItemStyle: {

                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                height: 40,
                width: 50

            },


        }}>

            <Tabs.Screen

                name="index"
                options={{

                    tabBarIcon: ({ focused }) => {
                        return (

                            <Image source={focused ? HomeA : Home} />

                        )

                    },


                }}

            />
            <Tabs.Screen

                name="profile"
                options={{

                    tabBarIcon: ({ focused }) => {
                        return (

                            <Image source={focused ? UserA : User} />

                        )

                    },
                }}

            />
            <Tabs.Screen

                name="search"
                options={{

                    tabBarIcon: ({ focused }) => {
                        return (

                            <Image source={focused ? SearchA : Search} />

                        )

                    },
                }}

            />

        </Tabs>

    )

}