import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { register } from "../auxComp/api.js"

export default function Register({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !password || !name || !image || !backgroundImage) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email");
      return;
    }

    try {
      const response = await register(email, password, name, image, backgroundImage);

      if (response.status === 200) {
        const user = response.data;
        const token = response.headers.authorization;
        await AsyncStorage.setItem("token", token);
        router.replace("/home");
      } else {
        Alert.alert("Error", "An error occurred during registration");
      }
    } catch (error) {
      console.error(error);
      if (error.code === "ECONNABORTED") {
        Alert.alert("Error", "The request took too long - please try again.");
      } else {
        Alert.alert("Error", "Email is taken");
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.loginForm}>
        <Text style={styles.heading}>Create your account</Text>
        <TextInput
          placeholder="EMAIL"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          placeholder="PASSWORD"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          placeholder="NAME"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          placeholder="IMAGE"
          value={image}
          onChangeText={setImage}
          style={styles.input}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          placeholder="BACKGROUND IMAGE"
          value={backgroundImage}
          onChangeText={setBackgroundImage}
          style={styles.input}
          placeholderTextColor="#D3D3D3"
        />
        <Pressable
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
            styles.button,
          ]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>REGISTER</Text>
        </Pressable>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202742",
  },
  loginForm: {
    width: "80%",
  },
  heading: {
    color: "white",
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    backgroundColor: "#454e62",
    marginBottom: 15,
    paddingHorizontal: 10,
    color: "white",
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#12a7ff",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
