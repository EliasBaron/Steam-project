import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import GamesWrapper from "../../auxComp/GamesWrapper.js";
import { getRecomendedGames } from "../../auxComp/api.js";

const Home = () => {
  const [games, setGames] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const recommended = await getRecomendedGames();
        setGames(recommended);
      } catch (err) {
        console.error("API error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.mainContainer}
    >
      <Text style={styles.gamesTitle}>FEATURED & RECOMMENDED</Text>
      {games ? (
        <View>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Text style={styles.errorText}>Error fetching data</Text>
          ) : (
            <GamesWrapper games={games} /> 
          )}
        </View>
      ) : (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 30,
    flex: 1,
    backgroundColor: "#202742",
  },
  container: {
    margin: 10,
    marginBottom: 30,
  },
  gamesTitle: {
    marginTop: 20,
    fontSize: 20,
    marginBottom: 10,
    color: "white",
    fontWeight: "bold",
  },
  errorText: {
    color: "white",
    fontSize: 16,
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
});

export default Home;
