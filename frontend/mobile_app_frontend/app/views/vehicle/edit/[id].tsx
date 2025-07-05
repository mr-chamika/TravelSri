import { Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function Edit() {

    const {id} = useLocalSearchParams()

    return (

        <View>

            <Text>this is edit vehicle {id}</Text>

        </View>

    )

}