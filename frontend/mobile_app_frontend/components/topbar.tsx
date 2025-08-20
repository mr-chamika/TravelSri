import { View, Text, TouchableOpacity, Modal } from 'react-native'
import NotifyModal from './Notifi'
import { useEffect, useRef, useState } from 'react'

import { Image } from 'expo-image'
import { cssInterop } from 'nativewind'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'
import { Client } from '@stomp/stompjs'

const Menu = require('../assets/images/top bar/menu.png')
const Notify = require('../assets/images/top bar/notify1.png')
cssInterop(Image, { className: "style" });

interface TopbarProps {
    pressing: () => void;
    notifying: () => void;
    on: boolean
}

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}

export default function Topbar({ pressing, notifying, on }: TopbarProps) {

    const [mtoken, setMtoken] = useState('')
    const [alrt, setAlert] = useState(false)

    const isModalOnRef = useRef(on);
    useEffect(() => {
        isModalOnRef.current = on;
    }, [on]);

    useEffect(() => {

        const client = new Client({

            brokerURL: 'ws://localhost:8080/ws/websocket',
            reconnectDelay: 5000,
            onConnect: () => {

                console.log('Connected to public STOMP server');
                client.subscribe('/topic/messages', (message) => {

                    const handle = async () => {

                        const messageData = JSON.parse(message.body);

                        if (mtoken != messageData.to) {

                            if (!isModalOnRef.current) { setAlert(true); }

                        }
                    }

                    handle();

                })
            }

        })

        client.activate();

        return () => {

            client.deactivate();
        };

    }, [])


    useEffect(() => {

        const client = new Client({

            brokerURL: 'ws://localhost:8080/ws/websocket',
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to private STOMP server');

                client.subscribe(`/user/queue/notifications`, () => {

                    if (!isModalOnRef.current) { setAlert(true); }

                });
            },
            onStompError: (frame) => {

                console.error('Additional details: ' + frame.body)

            }

        })

        const connectAndSubscribePrivate = async () => {
            const keys = await AsyncStorage.getItem("token");
            if (keys) {

                const x: MyToken = jwtDecode(keys)
                setMtoken(x.id)

                client.connectHeaders = {
                    Authorization: `Bearer ${keys}`,
                };

                client.activate();

                console.log("Client is attempting to connect with these headers:", client.connectHeaders);

            }

        };
        connectAndSubscribePrivate();

        // Cleanup function
        return () => {
            // This part is fine and will handle cleanup when the component unmounts
            if (client) {

                client.deactivate();
                console.log("Private STOMP client disconnected.");

            }

        };
    }, []);


    return (

        <View className='bg-[#F2F5FA] h-[64px] items-center justify-center px-2'>

            <View className='justify-between flex-row w-full px-1'>
                <TouchableOpacity onPress={pressing}>
                    <View className='absolute w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg z-60' >

                        <Image className='w-[35px] h-[35px]' source={Menu} />

                    </View>
                </TouchableOpacity>
                <View className='w-[180px] h-[40px] justify-center items-center'>

                    <Text className='text-lg font-bold'>TravelSri</Text>

                </View>
                <TouchableOpacity onPress={() => { setAlert(false); notifying(); }}>
                    <View className={`w-[40px] h-[40px] bg-[#FEFA17] rounded-full items-center justify-center shadow-lg ${alrt ? 'border-2' : ''}`} >

                        <Image className='w-[35px] h-[35px]' source={Notify} />

                    </View>
                </TouchableOpacity>
            </View>
            <NotifyModal

                isVisible={on}
                onClose={notifying}

            />
        </View>




    );

}