import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewLayout() {

    return (
        <SafeAreaView className="flex-1 bg-[#F2F5FA]" edges={["bottom", "top"]}>
            <Stack screenOptions={{ headerShown: false }}>



            </Stack>
        </SafeAreaView>
    )

}