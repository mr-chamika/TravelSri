import { TextInput, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import { useState } from 'react';
import { useRouter } from 'expo-router';
import emailjs from '@emailjs/react-native'


cssInterop(Image, { className: "style" });

const pic = require('../../assets/images/tabbar/towert.png')
const rcnt = require('../../assets/images/tabbar/rcnt.png')


export default function Group() {

    const router = useRouter();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [des, setDes] = useState('')

    const groupCollectionold = [
        { id: '1', image: rcnt, title: 'Matara to Colombo', duration: 2, date: '04 june 2020', stats: 'Confirm', price: 5000, max: 20, current: 3 },
        { id: '2', image: rcnt, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13 },
        { id: '3', image: rcnt, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10 },
        { id: '4', image: rcnt, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4 },
        { id: '5', image: rcnt, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10 },
        { id: '6', image: rcnt, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24 },

    ];
    const groupCollection = [
        { id: '1', image: pic, title: 'Matara to Colombo', duration: 2, date: '04 june 2020', stats: 'Confirm', price: 5000, max: 20, current: 3 },
        { id: '2', image: pic, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13 },
        { id: '3', image: pic, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10 },
        { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4 },
        { id: '5', image: pic, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10 },
        { id: '6', image: pic, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24 },

    ];

    const validateEmail = (text: string) => {

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(text);
    };

    const handleSubmit = () => {

        if (!name || validateEmail(email) == false || !des) {

            alert("Fill all fields with valid format");


        } else {

            //alert(`You are ${name}. Your email is ${email} and saying ${des}`)
            alert('success')
            sendEmail()

        }

    }

    const sendEmail = () => {

        var emailTemplate = {

            to_name: 'Admin',
            email: email,
            message: des,
            from_name: name,
            to_email: 'travelsri2025@gmail.com'

        }

        emailjs
            .send(
                'service_h0e38l2',
                'template_sp7fntf',
                emailTemplate,
                {
                    publicKey: "Xav8YamG7K9e8q0nD"
                }
            )
            .then(
                (response) => {

                    setName('');
                    setEmail('');
                    setDes('');
                },
                (err) => {

                    alert('Error in sending email. Check logs')
                    console.log("EMAILJS FAILED:", JSON.stringify(err, null, 2));
                }
            );
    };

    return (
        <View className='w-full h-full bg-[#F2F5FA]'>

            <Text className="font-extrabold text-3xl text-center mt-6">Group Travels</Text>

            <ScrollView

                contentContainerClassName="flex-col justify-center pt-5"
            >
                <View className='w-full h-full gap-10'>

                    <View className='w-full'>
                        <Text className="text-[22px] font-semibold mt-5 m-3">Visited</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-2"
                            contentContainerClassName='items-center'
                        >
                            <View className="flex-row gap-10 items-center">
                                {groupCollectionold.map((item, i) => {

                                    return (

                                        <View key={i} className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">
                                            <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                                                <Text className="bg-gray-100 rounded-md px-2">Travel #{i + 1}</Text>
                                                <Text className="bg-gray-100 rounded-md px-2">{item.current}/{item.max}</Text>
                                            </View>
                                            <Image
                                                className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                                                source={item.image}
                                            />
                                            <View className="w-full">
                                                <Text className="mt-1 text-[20px] text-center">
                                                    {item.title}
                                                </Text>
                                                <View className=" flex-row justify-center">
                                                    <Text className="mt-1 text-[15px] text-center pl-1">
                                                        {item.max} Members |
                                                    </Text>
                                                    <Text className="mt-1 text-[15px] text-center pl-1">
                                                        {item.duration} day |
                                                    </Text>
                                                    <Text className="mt-1 text-[15px] text-center pl-1">
                                                        {item.date} |
                                                    </Text>
                                                    <Text className={`mt-1 text-[15px] text-center pl-1 `}>
                                                        {item.stats}
                                                    </Text>
                                                </View>

                                                <View className="w-full flex flex-row justify-between px-3 mt-3">
                                                    <Text className="mt-1 text-[20px] text-start font-bold">
                                                        {item.price}.00 LKR
                                                    </Text>
                                                    <TouchableOpacity className="rounded-md bg-black justify-center w-16 items-center" onPress={() => router.push(`/views/group/view/${item.id}`)}>
                                                        <Text className=" text-white font-semibold">VIEW</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>

                                    )

                                })}

                            </View>
                        </ScrollView>
                    </View>
                    <View>
                        <Text className="text-[22px] font-semibold mt-5 m-3">Comming Soon</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-2"
                            contentContainerClassName='items-center'
                        >
                            <View className="flex-row gap-10 items-center">

                                {groupCollection.map((item, i) => {

                                    return (

                                        <View key={i} className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">
                                            <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                                                <Text className="bg-gray-100 rounded-md px-2">Travel #{i + 1}</Text>
                                                <Text className="bg-gray-100 rounded-md px-2">{item.current}/{item.max}</Text>
                                            </View>
                                            <Image
                                                className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                                                source={item.image}
                                            />
                                            <View className="w-full">
                                                <Text className="mt-1 text-[20px] text-center">
                                                    {item.title}
                                                </Text>
                                                <View className=" flex-row justify-center">
                                                    <Text className="mt-1 text-[15px] text-center pl-1">
                                                        {item.max} Members |
                                                    </Text>
                                                    <Text className="mt-1 text-[15px] text-center pl-1">
                                                        {item.duration} day |
                                                    </Text>
                                                    <Text className="mt-1 text-[15px] text-center pl-1">
                                                        {item.date} |
                                                    </Text>
                                                    <Text className={`mt-1 text-[15px] text-center pl-1 ${item.stats == 'Confirm' ? 'text-green-400' : item.stats == 'Pending' ? 'text-yellow-400' : 'text-red-400'}`}>
                                                        {item.stats}
                                                    </Text>
                                                </View>

                                                <View className="w-full flex flex-row justify-between px-3 mt-3">
                                                    <Text className="mt-1 text-[20px] text-start font-bold">
                                                        {item.price}.00 LKR
                                                    </Text>
                                                    <TouchableOpacity className="rounded-md bg-black justify-center w-16 items-center" onPress={() => router.push(`/views/group/join/${item.id}`)}>
                                                        <Text className=" text-white font-semibold">JOIN</Text>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>
                                        </View>

                                    )

                                })}

                            </View>
                        </ScrollView>
                    </View>

                    <View>

                        <Text className="text-[22px] font-semibold mt-5 m-3">Request</Text>
                        <View className='items-center mb-5 gap-5'>

                            <TextInput className='text-black rounded-xl w-[300px] border-2 border-gray-200 p-4' placeholder='Enter Your Name' placeholderTextColor="#8E8E8E" onChangeText={setName} value={name} />
                            <TextInput className='text-black rounded-xl w-[300px] border-2 border-gray-200 p-4' placeholder='Enter Your Email' placeholderTextColor="#8E8E8E" onChangeText={setEmail} value={email} />
                            <TextInput multiline={true} className='text-black rounded-xl w-[300px] h-[200px] border-2 border-gray-200 p-4' placeholderTextColor="#8E8E8E" placeholder='Enter Your Description' style={{ textAlignVertical: 'top' }} onChangeText={setDes} value={des} />


                            <TouchableOpacity onPress={handleSubmit} className='w-[76%] h-10 bg-[#FEFA17] rounded-lg justify-center'>
                                <Text className='text-[20px] text-center'>Submit</Text>
                            </TouchableOpacity>

                        </View>

                    </View>


                </View>
            </ScrollView>
        </View>



    )

}