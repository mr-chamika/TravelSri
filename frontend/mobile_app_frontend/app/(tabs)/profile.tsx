/* import { Text, View } from 'react-native'

export default function Profile() {

    return (

        <View className='flex-1 justify-center items-center'>

            <Text>This is Profile</Text>

        </View>

    )

} */

import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

export default function App() {

    interface Student {
        _id: string;
        name: string;
        address: string;
    }

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [students, setStudents] = useState<Student[]>([]);

    //const [students, setStudents] = useState([]);
    const [ok, setOk] = useState(false);

    const handleSubmit = () => {
        fetch('http://10.22.127.137:8080/student/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, address }),
        })
            .then((res) => res.text())
            .then((data) => {
                console.log(data);
                Alert.alert('Success', 'Student added!');
            })
            .catch((err) => {
                console.error('Error:', err);
                Alert.alert('Error', 'Failed to add student');
            });
    };

    const getAll = () => {
        setOk(true);
        fetch('http://10.22.127.137:8080/student/getAll')
            .then((res) => res.json())
            .then((data: Student[]) => setStudents(data))
            .catch((err) => {
                console.error('Error:', err);
                Alert.alert('Error', 'Failed to fetch students');
            });
    };

    const less = () => setOk(false);

    return (
        <View className='w-full flex-1 justify-center items-center'>
            <View className="mb-4 w-[300px]">
                <TextInput
                    className="border border-gray-400 rounded px-4 py-2 text-base"
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter name"
                />
            </View>
            <View className="mb-4 w-[300px]">
                <TextInput
                    className="border border-gray-400 rounded px-4 py-2 text-base"
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Enter address"
                />
            </View>
            <Pressable onPress={handleSubmit} className="bg-blue-500 rounded py-3 mb-4">
                <Text className="text-white text-center font-semibold w-[300px]">Submit</Text>
            </Pressable>

            <Pressable onPress={getAll} className="bg-green-500 rounded  py-3 mb-6">
                <Text className="text-white text-center font-semibold w-[300px]">Get All</Text>
            </Pressable>

            {ok && (
                <View className="space-y-4 mb-6">
                    {students.map((student) => (
                        <View key={student._id} className="border border-gray-300 p-4 rounded">
                            <Text className="text-lg">Name: {student.name}</Text>
                            <Text className="text-lg">Address: {student.address}</Text>
                        </View>
                    ))}
                    <Pressable onPress={less} className="bg-red-500 rounded px-4 py-3">
                        <Text className="text-white text-center font-semibold">Show Less</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}
