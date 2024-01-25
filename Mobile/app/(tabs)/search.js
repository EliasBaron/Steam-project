import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams, Link } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import GamesWrapper from "../../auxComp/GamesWrapper.js";
import { getSearchGames } from "../../auxComp/api.js";

const Search = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const { q } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [amountOfPages, setAmountOfPages] = useState(0);

  useEffect(() => {
    if (q) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const searchResult = await getSearchGames(q);
          setGames(searchResult.list);
          setAmountOfPages(searchResult.amountOfPages);
        } catch (err) {
          console.error("api error", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setGames([]);
      setAmountOfPages(0);
    }
  }, [q, page]);

  useEffect(() => {
    setPage(1);
  }, [q]);

  //useLayoutEffect(() => {
  //if (gamesWrapperRef.current) {
  //gamesWrapperRef.current.scrollTop = gamesWrapperRef.current.scrollHeight;
  //}
  //}, [games]);

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  function searchSubmit() {
    router.setParams({ q: searchText });
  }

  if (error) {
    return <Text>Something went wrong...</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.mainContainer}
    >
      <Text style={styles.title}>SEARCH GAME</Text>
      <TextInput
        onSubmitEditing={searchSubmit}
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        style={styles.input}
      />
      {!q ? (
        <Text style={styles.text}>Search for a game</Text>
      ) : games.length == 0 ? (
        <Text style={styles.text}>no results found</Text>
      ) : games && Array.isArray(games) ? (
        <View>
          {loading ? (
            <ActivityIndicator />
          ) : error ? (
            <Text style={styles.errorText}>Error fetching data</Text>
          ) : (
            <GamesWrapper games={games} />
          )}
        </View>
      ) : null}
        {games && Array.isArray(games) && games.length > 0 && (
          <View style={styles.paginationContainer}>
            <Pressable
              style={styles.paginationButton}
              disabled={page === 1}
              onPress={() => handlePageChange(page - 1)}
            >
              <Text style={styles.paginationText}>&lt;</Text>
            </Pressable>
            <Text style={styles.paginationText}>
              {page} of {amountOfPages}
            </Text>
            <Pressable
              style={styles.paginationButton}
              disabled={page === amountOfPages}
              onPress={() => handlePageChange(page + 1)}
            >
              <Text style={styles.paginationText}>&gt;</Text>
            </Pressable>
          </View>
        )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "white",
    fontSize: 16,
  },
  mainContainer: {
    padding: 30,
    flex: 1,
    backgroundColor: "#202742",
  },
  title: {
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
  gameItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#142155",
    borderRadius: 8,
  },
  textColor: {
    color: "white",
  },
  gameImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 8,
  },
  gameDetails: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  input: {
    height: 40,
    backgroundColor: "#454e62",
    marginBottom: 15,
    paddingHorizontal: 10,
    color: "white",
  },
  paginationButton: {
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  paginationText: {
    color: "white",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 25,
  },
});

export default Search;
