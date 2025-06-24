import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import { loginUser } from "../../services/auth";
import { useRouter } from "expo-router";
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const { token, role } = await loginUser(email, password);
      await SecureStore.setItemAsync("jwt", token);
      await SecureStore.setItemAsync("role", role);

      if (role === "merchant") router.replace("/(merchant-tabs)");
      else if (role === "admin") router.replace("/(admin-tabs)");
      else router.replace("/(customer-tabs)");
    } catch (err) {
      alert("Login failed. Try again.");
    }
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Text onPress={() => router.push("/auth/signup")}>Don't have an account? Sign up</Text>
    </View>
  );
}
