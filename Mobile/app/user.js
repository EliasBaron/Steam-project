import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams, Link, useNavigation } from "expo-router";
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
  Button,
} from "react-native";
import botonLike from "../assets/icon_thumbsUp_v6.png";
import botonDisLike from "../assets/icon_thumbsDown_v6.png";
import {getUser, getCurrentUser, addOrRemoveFriend} from "../auxComp/api.js"

const User = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [friendButtonText, setFriendButtonText] = useState("");
  const { id } = useLocalSearchParams();
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const _user = await getUser(id, token);
        setReviews(_user.reviews);
        setUser(_user);
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
    if (user) {
      navigation.setOptions({ title: user.name });

      const fetchData = async () => {
        setLoading(true);
        try{
          const token = await AsyncStorage.getItem("token");
          const _user = await getCurrentUser(token);
          setCurrentUser(_user);
          if (_user.friends.some((f) => f.id == user.id)) {
            setFriendButtonText("Delete friend");
          } else {
            setFriendButtonText("Add friend");
          }
        } catch (err) {
          console.error("api error", err);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  function renderReviews() {
    return (
      <View style={styles.gameDetails}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.gameContainer}>
            <View>
              <Image
                source={{ uri: review.game.mainImage.src }}
                style={styles.gameImage}
              />
              <Image
                source={review.isRecommended ? botonLike : botonDisLike}
                style={styles.reviewImage}
              />
            </View>
            <View style={styles.textReviewContainer}>
              <View
                style={styles.gameNameContainer}
              >
                <Text style={[styles.gameName, styles.textColor]}>
                  {review.game.name}
                </Text>
              </View>
              <View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  function handleFriendButton() {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem("token");
      try {
        const res = await addOrRemoveFriend(id, token);
        setCurrentUser(res.data);
          if (friendButtonText === "Add friend") {
            setFriendButtonText("Delete friend");
          } else {
            setFriendButtonText("Add friend");
          }
      } catch (error) {
        console.error("api error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
      
    };
    fetchData();
  }

  if (error) {
    return <Text>Something went wrong...</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.mainContainer}>
      {user && (
        <View style={styles.userContainer}>
          <Image source={{ uri: user.image }} style={styles.userImage} />
          <Text style={styles.userName}>{user.name}</Text>
          {currentUser && user.id !== currentUser.id && (
            <View style={styles.friendButtonContainer}>
              <Pressable
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                  },
                  styles.button,
                  {
                    backgroundColor:
                      friendButtonText === "Add friend" ? "#12a7ff" : "red",
                  },
                ]}
                onPress={handleFriendButton}
                title={friendButtonText}
              >
                <Text style={styles.buttonText}>{friendButtonText}</Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
      <Text style={styles.textColor}>REVIEWS</Text>
      {renderReviews()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 30,
    flex: 1,
    backgroundColor: "#202742",
  },
  friendButtonContainer: {
    marginLeft: 10
  },
  gameNameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textReviewContainer: {
    flex: 1, 
    flexDirection: "column", 
    padding: 20,
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
  },
  container: {
    marginBottom: 30,
  },
  gameItem: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#0F183B",
    borderRadius: 8,
    alignItems: "left",
  },
  textColor: {
    color: "white",
  },
  gameName: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  gameImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: "center",
  },
  gameDetails: {
    padding: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  underline: {
    textDecorationLine: "underline",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  reviewText: {
    color: "white",
    fontSize: 10,
  },
  gameContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 20,
    backgroundColor: "#0F183B",
    paddingBottom: 10,
    position: "relative",
  },
  button: {
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "right",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewImage: {
    zIndex: 999,
    width: 30,
    height: 30,
    position: "absolute",
    bottom: 15,
    right: 10,
    backgroundColor: "black",
    opacity: 85,
  },
});

export default User;
