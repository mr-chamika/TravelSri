import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';


cssInterop(Image, { className: "style" });


// const pic = require('../../assets/images/tabbar/tower.png')
const pic = require('../../assets/images/tabbar/towert.png')
const bg = require('../../assets/images/bg.jpg');
const t = require('../../assets/images/tabbar/tower.jpg')
const srch = require('../../assets/images/search1.png');

const placesCollection = [
  { id: '1', image: pic, title: 'Lotus Tower' },
  { id: '2', image: bg, title: 'Another Place' },
  { id: '3', image: t, title: 'Another Place' },
  { id: '4', image: pic, title: 'Lotus Tower' },
  { id: '5', image: bg, title: 'Another Place' },
  { id: '6', image: t, title: 'Another Place' },

];
const groupCollection = [
  { id: '1', image: pic, title: 'Matara to Colombo', duration: 2, date: '04 june 2020', stats: 'Confirm', price: 5000, max: 20, current: 3 },
  { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13 },
  { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10 },
  { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4 },
  { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10 },
  { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24 },

];

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string
}

export default function Index() {

  const router = useRouter();
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('')

  const handler = () => {

    console.log(search)

    fetch('http://192.168.215.38:3000/api/users', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: search })

    })
      .then((res) => res.json())
      .then(data => { console.log(data) })
      .catch(err => console.log(err))

  }


  useFocusEffect(
    useCallback(() => {

      const getAll = async () => {

        const keys = await AsyncStorage.getItem("token");
        if (keys) {

          const x: MyToken = jwtDecode(keys)
          console.log(x)
          setUsername(x.sub)

        }

      }
      getAll()
    }, [])
  );


  /* useFocusEffect(
    useCallback(() => {
      
        const getAll = async () => {
      
          const keys = await AsyncStorage.getAllKeys();
          alert(keys)
      
        }        getAll()
      const clear = async () => {

        try {
          const keysToRemove = [
    
            'bookingSession',
            'car',
            'cbookingComplete',
            'cbookings',
            'gbookingComplete',
            'gbookingSession',
            'gbookings',
            'guide',
            'hbookingComplete',
            'hbookingSession',
            'hbookings',
            'hotel',
            'total'
    
          ];
          await AsyncStorage.multiRemove(keysToRemove);
        } catch (e) {
          alert(`Error clearing AsyncStorage:, ${e}`);
        } 
    
        
        await AsyncStorage.removeItem('bookingSession'),
        await AsyncStorage.removeItem('car'),
        await AsyncStorage.removeItem('cbookingComplete'),
        await AsyncStorage.removeItem('cbookings'),
        await AsyncStorage.removeItem('gbookingComplete'),
        await AsyncStorage.removeItem('gbookingSession'),
        await AsyncStorage.removeItem('gbookings'),
        await AsyncStorage.removeItem('guide'),
        await AsyncStorage.removeItem('hbookingComplete'),
        await AsyncStorage.removeItem('hbookingSession'),
        await AsyncStorage.removeItem('hbookings'),
        await AsyncStorage.removeItem('hotel'),
        await AsyncStorage.removeItem('total')
        
        await AsyncStorage.clear();
      }

      clear();

    }, [])
  ); */


  return (
    <View className="bg-[#F2F5FA] justify-between h-full py-3">

      <View className="w-full items-center mt-1 ">

        <Text className="text-[22px] font-semibold text-gray-400">Good Morning {username} !</Text>

      </View>
      <View>

        <Text className="text-[22px] font-semibold m-3">My Plans</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5"
          contentContainerStyle={{ paddingRight: 40 }}
        >
          <View className=" flex-row gap-10">

            {placesCollection.map((item) => {

              return (
                <TouchableOpacity onPress={() => router.push(`/views/plan/${item.id}`)} className="w-[83px]" key={item.id}>
                  <Image
                    className="w-[83px] h-[190px] rounded-[23px] shadow-gray-400 shadow-lg"
                    source={item.image}
                  />
                  <Text className="mt-2 text-[10px] italic text-center">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              )

            })



            }


          </View>
        </ScrollView>
      </View>
      <View>

        <Text className="text-[22px] font-semibold mt-10 m-3">Group Travels</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-2"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {groupCollection.map((item, index) => {

            return (
              <View className="flex-row gap-10" key={index}>
                <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">
                  <View className="w-full flex-row absolute justify-between px-4 pt-3 z-10">
                    <Text className="bg-gray-100 rounded-md px-2">Travel #{index}</Text>
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
              </View>)
          })
          }
        </ScrollView>
      </View>

    </View>)
}

