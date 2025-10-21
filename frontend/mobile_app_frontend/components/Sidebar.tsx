import { Text, View, TouchableOpacity } from 'react-native'
import { Href, useFocusEffect, useRouter } from 'expo-router'
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

cssInterop(Image, { className: "style" });

const Profile = require('../assets/images/sideTabs/image.png')
const group = require('../assets/images/sideTabs/grp.png')
const equipments = require('../assets/images/sideTabs/equips.png')
const hotel = require('../assets/images/sideTabs/bed.png')
const guide = require('../assets/images/sideTabs/guid.png')
const translator = require('../assets/images/sideTabs/translator.png')
const vehicle = require('../assets/images/tabbar/carr.png')

interface MyToken {
    sub: string;
    roles: string[];
    username: string;
    email: string;
    id: string
}

interface User {

    address: string;
    agreeTerms: boolean;
    businessRegPic1: string | null
    businessRegPic2: string | null
    country: string;
    dob: string;
    email: string;
    firstName: string;
    gender: string;
    identitypic1: string;
    identitypic2: string;
    lastName: string;
    locpic: string;
    mobileNumber: string;
    nicPassport: string;
    pp: string;
    role: string;
    status: string;
    username: string;
    whatsappNumber: string;

}

interface TopbarProps {
    close: () => void;
}

export default function Sidebar({ close }: TopbarProps) {

    const [user, setUser] = useState<User | null>(null)
    const [date, setDate] = useState(new Date())


    const router = useRouter();

    const handleNavigation = (path: Href) => {

        // setTimeout(() => {
        //     router.push(path);
        // }, 200);
        router.push(path);
        close();

    };

    useEffect(() => {

        const getAll = async () => {

            const keys = await AsyncStorage.getItem("token");

            if (keys) {

                const x: MyToken = jwtDecode(keys)
                try {

                    const res = await fetch(`http://192.168.1.150:8080/user/profile?email=${x.email}`)
                    //const res = await fetch(`https://travelsri-backend.onrender.com/user/profile?email=${x.email}`)

                    const data = await res.json()

                    //console.log(data.user)
                    setUser(data.user)


                } catch (err) {

                    console.log(err)

                }


            }

        }
        getAll()


    }, [])

    useFocusEffect(
        useCallback(() => {
            setDate(new Date());
        }, [])
    );

    return (

        <View className='flex-1 h-full'>

            <View className='items-center'>
                <View className='w-[250px] h-[250px] mt-5'>

                    <Image className="w-full h-full rounded-full border-4 border-gray-200" source={{ uri: `data:image/jpeg;base64,${user?.pp}` }} />

                </View>

            </View>

            <View className='flex-1 justify-center'>
                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/groupTravel') }}>
                    <Image source={group} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Group Travel</Text>
                </TouchableOpacity>
                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/carRental') }}>
                    <Image source={vehicle} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Vehicle Booking</Text>
                </TouchableOpacity>

                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/equipmentHire') }}>
                    <Image source={equipments} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Equipments Hiring</Text>
                </TouchableOpacity>

                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/hotelBooking') }}>
                    <Image source={hotel} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Hotel Booking</Text>
                </TouchableOpacity>

                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/guideHire') }}>
                    <Image source={guide} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Guide Hiring</Text>
                </TouchableOpacity>

                <TouchableOpacity className='my-7 flex flex-row gap-24 w-80' onPress={() => { handleNavigation('/sideTabs/translator') }}>
                    <Image source={translator} className='justify-center items-center w-[35px] h-[35px]'></Image>
                    <Text className='flex justify-start items-center text-[20px] font-black w-96'>Translator</Text>
                </TouchableOpacity>

            </View>

            <View className='items-center p-1'>

                <Text className='text-[14px]'>{date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                <Text className='text-[14px]'>{date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>

            </View>

        </View>

    )

}