import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import React, { useState, useEffect} from "react";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../auxComp/api.js"

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        router.replace('/home');
      }
    };
  
    checkToken();
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Invalid email");
      return;
    }

    try {
      const response = await login(email, password)

      if (response.status === 200) {
        const user = response.data;
        const token = response.headers.authorization;
        await AsyncStorage.setItem("token", token);
        router.replace("/home");
      } else {
        Alert.alert("Error", "An error occurred during login");
      }
    } catch (error) {
      console.error(error);
      if (error.code === "ECONNABORTED") {
        Alert.alert("Error", "The request took too long - please try again.");
      } else if (error.response && error.response.status === 401) {
        Alert.alert("Error", "Invalid email or password");
      } else {
        Alert.alert("Error", "An error occurred. Please try again later.");
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.loginForm}>
        <Text style={styles.heading}>SIGN IN</Text>
        <TextInput
          placeholder="EMAIL"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          placeholder="PASSWORD"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={true}
          style={styles.input}
          placeholderTextColor="#D3D3D3"
        />
        <Link href="/register" style={styles.singup}>
          <Text>Sign Up</Text>
        </Link>
        <View>
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
              styles.button,
            ]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

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
  singup: {
    color: "white",
    textAlign: "left",
    marginBottom: 20,
    fontWeight: "bold",
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

export default LoginPage;
