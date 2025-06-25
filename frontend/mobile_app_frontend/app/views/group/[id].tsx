import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (

        <View className="h-full w-full">
            <TouchableOpacity className="m-2" onPress={() => router.back()}><Text>Back</Text></TouchableOpacity>
            <View className="h-full justify-center items-center">
                <Text>group : {id}</Text>
            </View>
        </View>

    )

}