import { useRouter, useFocusEffect } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { cssInterop } from 'nativewind'
import { Image } from 'expo-image'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from 'jwt-decode';
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import Stomp from 'stompjs'


cssInterop(Image, { className: "style" });


// const pic = require('../../assets/images/tabbar/tower.png')
const pic = require('../../assets/images/tabbar/towert.png')
const bg = require('../../assets/images/bg.jpg');
const t = require('../../assets/images/tabbar/tower.jpg')
const srch = require('../../assets/images/search1.png');

interface Trip {

  _id: string,
  thumbnail: string,
  destination: string

}

interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string;
  id: string
}

/* const placesCollection = [
  { id: '1', image: pic, title: 'Lotus Tower' },
  { id: '2', image: bg, title: 'Another Place' },
  { id: '3', image: t, title: 'Another Place' },
  { id: '4', image: pic, title: 'Lotus Tower' },
  { id: '5', image: bg, title: 'Another Place' },
  { id: '6', image: t, title: 'Another Place' },

]; */
const groupCollection = [
  { id: '1', image: pic, title: 'Matara to Colombo', duration: 2, date: '04 june 2020', stats: 'Confirm', price: 5000, max: 20, current: 3 },
  { id: '2', image: bg, title: 'Galle to Kurunegala', duration: 1, date: '05 july 2021', stats: 'Pending', price: 2300, max: 10, current: 13 },
  { id: '3', image: t, title: 'Colombo to jaffna', duration: 4, date: '06 aug 2022', stats: 'Cancelled', price: 1500, max: 25, current: 10 },
  { id: '4', image: pic, title: 'Matara to Kandy', duration: 10, date: '07 sept 2023', stats: 'Pending', price: 9000, max: 10, current: 4 },
  { id: '5', image: bg, title: 'Galle to Dehiwala', duration: 2, date: '08 oct 2024', stats: 'Pending', price: 1800, max: 15, current: 10 },
  { id: '6', image: t, title: 'Matale to Rajarata', duration: 6, date: '09 nov 2025', stats: 'Confirm', price: 700, max: 30, current: 24 },

];

/* interface MyToken {
  sub: string;
  roles: string[];
  username: string;
  email: string
  exp:number,
  iat:number
} */

export default function Index() {

  const router = useRouter();
  const [search, setSearch] = useState('');
  const [username, setUsername] = useState('')
  const [trips, setTrips] = useState<Trip[]>([])
  const [stompClient, setStompClient] = useState<Stomp.Client | null>(null);
  const [privateStompClient, setPrivateStompClient] = useState<Stomp.Client | null>(null);


  //

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws')
    const client = Stomp.over(socket)
    client.connect({}, function (frame?: Stomp.Frame) {
      if (frame) {

        console.log('Connected to STOMP server')
        setStompClient(client)

        client?.subscribe('/topic/messages', function (result: Stomp.Message) {

          console.log("message:", result.body)

        })
      }

    })

    return () => {

      if (client?.connected) {
        client.disconnect(() => {
          console.log("STOMP client disconnected.");
        });
      }
    };

  }, [])


  const sendMessage = () => {

    var text = "publicsss notification"

    if (stompClient?.connected) {
      stompClient.send("/app/toAll", {}, JSON.stringify({ 'text': text }))
      console.log("Message sent:", text);
    } else {
      console.log("STOMP client is not connected. Message not sent.");
    }
  }

  // Add a function to handle the private connection and subscription


  // Use useEffect to manage the connection lifecycle
  useEffect(() => {

    // Add a function to handle the private connection and subscription
    const connectAndSubscribePrivate = async () => {
      const keys = await AsyncStorage.getItem("token");
      if (keys) {
        const { id } = jwtDecode(keys) as MyToken;

        const privateSocket = new SockJS('http://localhost:8080/ws');
        const privateClient = Stomp.over(privateSocket);

        const connectHeaders = {
          Authorization: `Bearer ${keys}`,
        };

        // ADD TH INE to see the headers in your client console
        console.log("Client is attempting to connect with these headers:", connectHeaders);


        // Reconnection logic is now in the error callback of connect()
        privateClient.connect(connectHeaders, (frame) => {
          console.log('Connected to private STOMP server');
          setPrivateStompClient(privateClient);
          console.log(frame)
          // Corrected subscriptin URL using the user ID
          privateClient.subscribe(`/user/queue/notifications`, (result: Stomp.Message) => {
            console.log("Private message for user", id, ":", result.body);
          });
        })

        return privateClient;
      }
      return null; // Return nll if there's no token
    };
    // jj the async function to connect
    const privateClientPromise = connectAndSubscribePrivate();

    // Cleanup function
    return () => {
      // This part is fine and will handle cleanup when the component unmounts
      if (privateClientPromise && privateClientPromise.then) {
        privateClientPromise.then(client => {
          if (client?.connected) {
            client.disconnect(() => {
              console.log("Private STOMP client disconnected.");
            });
          }
        });
      }
    };
  }, []);

  const sendPrivateMessage = (userId: string) => {

    var text = "private notification"

    if (privateStompClient?.connected) {
      privateStompClient.send("/app/private", {}, JSON.stringify({ 'text': text, 'to': userId }))
      console.log("Message sent:", text);
      console.log("To:", userId);
    } else {
      console.log("STOMP client is not connected. Private Message not sent.");
    }
  }

  //

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

          const x = jwtDecode(keys)
          const y: MyToken = jwtDecode(keys)
          if (x && x.exp && x.sub) {
            if (x.exp * 1000 < Date.now()) {

              loggingout()
              return;
            }
            setUsername(x.sub)
            getTrips(keys)




          }

        } else {

          loggingout();

        }

      }
      getAll();

    }, []) // The empty dependency array here is for useCallback, not the effect itself
  );


  const getTrips = async (keys: string) => {
    try {

      const x: MyToken = jwtDecode(keys)

      const res = await fetch(`http://localhost:8080/traveler/trips-view?id=${x.id}`)
      //const res = await fetch(`https://travelsri-backend.onrender.com/traveler/trips-view?id=${x.id}`)

      const data = await res.json()

      if (data) {

        //console.log(data)
        setTrips(data)

      }

    } catch (err) {

      console.log('Error from getting solotrip dto')

    }
  }


  const loggingout = async (reason = null) => {

    await AsyncStorage.removeItem('token')

    router.replace({
      pathname: '/(auth)', // 👈 Your login route path (e.g., the file at app/login.tsx)
      params: { reason: 'TOKEN_EXPIRED' }
    });

  }


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
    <View className="bg-[#F2F5FA] justify-evenly h-full w-full">

      <View className="w-full items-center mt-1 ">

        <Text className="text-[22px] font-semibold text-gray-400">Good Afternoon {username} !</Text>

        <TouchableOpacity onPress={sendMessage}>
          <Text>test</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sendPrivateMessage('6896b523a4cb790f5547f87f')}>
          <Text>private</Text>
        </TouchableOpacity>

      </View>
      <View className="h-[40%]">

        <Text className="text-[22px] font-semibold m-3">My Plans</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5"
          contentContainerClassName={`pr-16 ${!trips || trips.length === 0 ? 'w-full' : ''}`}
        >
          <View className=" flex-row gap-10 w-full">
            {(!trips || trips.length == 0) && <View className=" w-full h-full justify-center items-center"><Text className="text-gray-400">No plans yet</Text></View>}
            {trips.map((item) => {

              return (
                <TouchableOpacity onPress={() => router.push(`/views/plan/${item._id}`)} className="w-[83px]" key={item._id}>
                  <Image
                    className="w-[83px] h-[190px] rounded-[23px] shadow-gray-400 shadow-lg"
                    source={{ uri: `data:image/jpeg;base64,${item.thumbnail}` }}
                  />
                  <Text className="mt-2 text-[10px] italic text-center">
                    {item.destination}
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

