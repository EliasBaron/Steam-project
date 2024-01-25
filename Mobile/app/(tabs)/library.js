import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import GamesWrapper from "../../auxComp/GamesWrapper.js";
import { getCurrentUser } from "../../auxComp/api.js";

export default function Library() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const _user = await getCurrentUser(token);
        setUser(_user);
        setGames(_user.games);
      } catch (err) {
        console.error("API error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("index");
  };

  return (
    <ScrollView
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}
    >
      {user && (
        <View style={styles.userContainer}>
          <Image source={{ uri: user.image }} style={styles.userImage} />
          <Text style={styles.userName}>{user.name}</Text>
          <Pressable
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.8 : 1,
              },
              styles.logoutButton,
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      )}
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <Text style={styles.errorText}>Error fetching data</Text>
      ) : (
        <GamesWrapper games={games} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 30,
    flex: 1,
    backgroundColor: "#202742",
  },
  container: {
    margin: 10,
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  gameImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#202742",
  },
  userImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#88d1fb",
  },
  userName: {
    flex: 1,
    fontSize: 20,
    marginBottom: 10,
    color: "white",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
  },
});
