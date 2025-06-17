import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, TextInput, TouchableOpacity, View, Text } from "react-native";
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
    <View className="justify-center items-center h-full">
      <Text>hello, This is the homepage</Text>
    </View>
  );
}
