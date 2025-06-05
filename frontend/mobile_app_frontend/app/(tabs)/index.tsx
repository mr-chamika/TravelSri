import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";
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
    <View className="flex-1 items-center justify-center bg-black">

      <View className="bg-[#FFFFFF33] rounded-full px-5 absolute z-10 flex flex-row items-center">

        <TextInput

          className="h-11 w-72 outline-none text-[#ffffffaa]"
          placeholderTextColor="#ffffffaa"
          placeholder='Search'
          value={search}
          onChangeText={setSearch}

        />

        <TouchableOpacity onPress={handler} className="ml-2">
          <Image source={srch}></Image>
        </TouchableOpacity>

      </View>

      <Image source={bg} style={{ height: '100%' }} />

    </View>
  );
}
