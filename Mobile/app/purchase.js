import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import {getGame, purchase} from "../auxComp/api.js"

export default function PurchasePage() {
  const { id } = useLocalSearchParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");
  const [cvv, setCvv] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [number, setNumber] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const _game = await getGame(id);
        setGame(_game);
      } catch (err) {
        console.error("API error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (game) {
      navigation.setOptions({ title: game.name });
    }
  }, [game]);

  const validateInput = () => {
    if (!cardHolderName || !cvv || !expirationDate || !number) {
      Alert.alert("Error", "All fields are required");
      return false;
    }

    if (!/^\d{3}$/.test(cvv)) {
      Alert.alert("Error", "CVV should be a three-digit number");
      return false;
    }

    if (!/^\d{2}-\d{2}-\d{4}$/.test(expirationDate)) {
      Alert.alert("Error", "Expiration date should be in MM-dd-yyyy format");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateInput()) {
      Alert.alert("Error", "Verify all fields and try again.");
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await purchase(id, cardHolderName, cvv, expirationDate, number, token)
      router.replace("/library");
    } catch (err) {
      console.error("API error", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.mainContainer}>
      {loading ? (
        <ActivityIndicator />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Error, you already have this game.
          </Text>
        </View>
      ) : game ? (
        <View style={styles.gameCardContainer}>
          <View style={styles.gameCard}>
            <Image
              source={{ uri: game.mainImage.src }}
              style={styles.gameImage}
            />
            <View style={styles.gameInfo}>
              <Text style={styles.gameInfoText}>{game.name}</Text>
              <Text style={styles.gamePrice}>
                {game.price.currency} {game.price.amount.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>Buy</Text>
            <Text style={styles.label}>Card Holder Name</Text>
            <TextInput
              style={styles.input}
              value={cardHolderName}
              onChangeText={setCardHolderName}
            />
            <Text style={styles.label}>CVV</Text>
            <TextInput style={styles.input} value={cvv} onChangeText={setCvv} />
            <Text style={styles.label}>Expiration Date</Text>
            <TextInput
              style={styles.input}
              value={expirationDate}
              onChangeText={setExpirationDate}
              placeholder="MM-dd-yyyy"
            />
            <Text style={styles.label}>Number</Text>
            <TextInput
              style={styles.input}
              value={number}
              onChangeText={setNumber}
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
              <Text style={styles.buttonText}>Buy Now</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 30,
    marginTop: -30,
    paddingTop: 0,
    flex: 1,
    backgroundColor: "#202742",
  },
  gamePrice: {
    fontWeight: "bold", 
    color:"white", 
    marginTop: 5, 
    fontSize: 18,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    color: "white",
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
  },
  label: {
    color: "white",
    marginBottom: 10,
    fontSize: 20,
  },
  input: {
    height: 40,
    backgroundColor: "#454e62",
    marginBottom: 15,
    paddingHorizontal: 10,
    color: "white",
    fontSize: 18,
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  gameCard: {
    flexDirection: "column",
    marginVertical: 30,
    alignItems: "center",
  },
  gameImage: {
    width: Dimensions.get("window").width,
    height: 200,
    resizeMode: "cover",
  },
  gameInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    width: "100%",
    marginTop: 10,
    flexWrap: "wrap"
  },
  gameInfoText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    flex: 1
  },
  gameCardContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#12a7ff",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  errorText: {
    color: "#b20000",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
