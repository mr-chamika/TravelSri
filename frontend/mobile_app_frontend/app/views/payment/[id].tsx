import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function Views() {

    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (

        <View className="h-full w-full border-2 pt-5">
            <TouchableOpacity className="m-2" onPress={() => router.replace(`/(tabs)`)}><Text>Home</Text></TouchableOpacity>
            <View className="h-full justify-center items-center">
                <Text>Make your payment here{id}</Text>
            </View>
        </View>

    )

}