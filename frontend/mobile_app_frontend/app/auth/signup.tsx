import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { signupUser } from "../../services/auth";
import { useRouter } from "expo-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // Or let user pick
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await signupUser({ email, password, role });
      alert("Signup successful. Now log in.");
      router.replace("/auth/login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
      <Button title="Sign Up" onPress={handleSignup} />
      <Text onPress={() => router.push("/auth/login")}>Already have an account? Log in</Text>
    </View>
  );
}
