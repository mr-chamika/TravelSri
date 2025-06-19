import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'


cssInterop(Image, { className: "style" });


const pic = require('../../assets/images/tabbar/tower.png')
const bg = require('../../assets/images/bg.jpg');
const srch = require('../../assets/images/search1.png');


export default function Index() {

  const router = useRouter();
  const [search, setSearch] = useState('');

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

  return (
    <View className="bg-[#F2F5FA] flex flex-col gap-5 h-full">
      <View className="w-full items-center mt-1 ">

        <Text className="text-[22px] font-semibold text-gray-400">Good Morning Nirdha !</Text>

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
            <TouchableOpacity className="w-[83px]">
              <Image
                className="w-[83px] h-[190px] rounded-[23px] shadow-gray-400 shadow-lg"
                source={pic}
              />
              <Text className="mt-2 text-[10px] italic text-center">
                Lotus Tower
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[83px]">
              <Image
                className="w-[83px] h-[190px] rounded-[23px] shadow-gray-400 shadow-lg"
                source={pic}
              />
              <Text className="mt-2 text-[10px] italic text-center">
                Lotus Tower
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[83px]">
              <Image
                className="w-[83px] h-[190px] rounded-[23px] shadow-gray-400 shadow-lg"
                source={pic}
              />
              <Text className="mt-2 text-[10px] italic text-center">
                Lotus Tower
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-[83px]">
              <Image
                className="w-[83px] h-[190px] rounded-[23px] shadow-gray-400 shadow-lg"
                source={pic}
              />
              <Text className="mt-2 text-[10px] italic text-center">
                Lotus Tower
              </Text>
            </TouchableOpacity>

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
          <View className="flex-row gap-10">
            <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px] ml-3">
              <Image
                className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                source={pic}
              />
              <View>
                <Text className="mt-1 text-[20px] text-center">
                  Matara to Colombo
                </Text>
                <Text className="mt-1 text-[15px] text-center">
                  20 Members|1 day|25 nov 2025|Confirmed
                </Text>
              </View>
              <View className="w-full flex flex-row justify-between px-3 mt-3">
                <Text className="mt-1 text-[20px] text-start font-bold">
                  5000.00 LKR
                </Text>

                <TouchableOpacity className="rounded-md bg-black justify-center w-16 items-center" onPress={() => alert('menna ebuwa')}>
                  <Text className=" text-white font-semibold">JOIN</Text>
                </TouchableOpacity>

              </View>
            </View>
            <View className="bg-gray-200 w-[350px] h-[220px] items-center rounded-[20px]">
              <Image
                className="opacity-65 mt-2 flex justify-center w-[335px] h-[100px] rounded-[15px] shadow-gray-400 shadow-lg"
                source={pic}
              />
              <View>
                <Text className="mt-1 text-[20px] text-center">
                  Matara to Colombo
                </Text>
                <Text className="mt-1 text-[15px] text-center">
                  20 Members|1 day|25 nov 2025|Confirmed
                </Text>
              </View>
              <View className="w-full flex flex-row justify-between px-3 mt-3">
                <Text className="mt-1 text-[20px] text-start font-bold">
                  5000.00 LKR
                </Text>

                <TouchableOpacity className="rounded-md bg-black justify-center w-16 items-center" onPress={() => alert('menna ebuwa')}>
                  <Text className=" text-white font-semibold">JOIN</Text>
                </TouchableOpacity>

              </View>
            </View>

          </View>
        </ScrollView>
      </View>

    </View>
  );
}
