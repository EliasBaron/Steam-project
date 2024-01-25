import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Linking,
  Pressable,
  Modal,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import GameMultimedia from "../auxComp/GameMultimedia";
import { SafeAreaView } from "react-native-safe-area-context";
import { Review, Reviews, WriteReviewBox } from "../auxComp/Review";
import {getGame, getCurrentUser} from "../auxComp/api.js"
import { TouchableOpacity } from "react-native-gesture-handler";

const game = () => {
  const { gameId } = useLocalSearchParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [hasGame, setHasGame] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [tagsVisible, setTagsVisible] = useState(false);
  const navigation = useNavigation();
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [multimediaVisible, setMultimediaVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const _game = await getGame(gameId);
        setGame(_game);
      } catch (error) {
        console.error("api error", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [gameId, hasReviewed]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const _user = await getCurrentUser(token);
        setUser(_user);
      } catch (err) {
        console.error("API error", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setHasGame(game && user && user.games.some((g) => g.id == game.id));
    setHasReviewed(hasGame && game.reviews.some((r) => r.user.id == user.id));
  }, [game, user, hasGame, hasReviewed]);

  useEffect(() => {
    if (game) {
      navigation.setOptions({ title: game.name });
    }
  }, [game]);

  const getOwnReview = () => {
    const r = game.reviews.find((review) => review.user.id === user.id);
    if (!r) return;
    return <Review review={r}></Review>;
  };

  const goBuyGame = () => {
    const isPurchased = user && user.games.some((g) => g.id == game.id);
    if (user && !isPurchased) {
      navigation.navigate("purchase", { id: game.id });
    }
  };

  const showTags = () => {
    setTagsVisible(true);
  };

  const hideTags = () => {
    setTagsVisible(false);
  };

  const showMultimedia = () => {
    setMultimediaVisible(true);
  };

  const hideMultimedia = () => {
    setMultimediaVisible(false);
  };

  const selectMedia = (i) => {
    setSelectedMedia(i);
    showMultimedia();
  };

  if (error) {
    return <Text>Something went wrong...</Text>;
  }

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.scrollContainer}>
        {game ? (
          <>
            <View style={styles.container}>
              <Image
                source={{ uri: game.mainImage.src }}
                style={styles.image}
              />
            </View>
            <View
              style={styles.fullWidthWithMargin}
            >
              <View style={styles.rowContainer}>
                <Text style={styles.text}>Developer: </Text>
                <Text
                  style={[styles.text, styles.underline]}
                  onPress={() => Linking.openURL(game.website)}
                >
                  {" "}
                  {game.developer.name}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.text}>Website: </Text>
                <Text
                  style={[styles.text, styles.underline]}
                  onPress={() => Linking.openURL(game.website)}
                >
                  {" "}
                  {game.website}
                </Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.text}>Release date: {}</Text>
                <Text style={styles.text}>{game.releaseDate}</Text>
              </View>
              <View style={styles.rowContainer}>
                <Text style={styles.text}>Tags: </Text>
                <View
                  style={styles.tagsContainer}
                >
                  {game.tags.slice(0, 4).map((tag) => (
                    <TouchableOpacity key={tag.id} onPress={showTags}>
                      <Text
                        style={[
                          styles.text,
                          styles.underline,
                        ]}
                      >
                        {" "}
                        {tag.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={showTags}>
                    <Text
                      style={[styles.text, styles.underline]}
                    >
                      {" "}
                      ...more
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            {user && !user.games.some((g) => g.id == game.id) ? (
              <View
                style={[
                  styles.buyBox,
                  styles.fullWidthWithMargin,
                ]}
              >
                <View
                  style={styles.buySection}
                >
                  <Text
                    style={[styles.text, styles.buyFont]}
                  >
                    Buy
                  </Text>
                  <Text
                    style={[styles.text, styles.buyFont]}
                  >
                    {game.price.currency + " "}
                    {game.price.amount.toFixed(2)}
                  </Text>
                </View>
                <Pressable style={styles.buyButton} onPress={goBuyGame}>
                  <Text style={[styles.text, styles.buyFont]}>Buy</Text>
                </Pressable>
              </View>
            ) : (
              <></>
            )}
            <View style={styles.centeredContainer}>
              <GameMultimedia
                images={game.multimedia}
                style={styles.centeredContainer}
                on_press={selectMedia}
              />
            </View>
            <View style={styles.fullWidth}>
              <Text
                style={[
                  styles.text,
                  styles.titleText,
                ]}
              >
                {" "}
                ABOUT THIS GAME{" "}
              </Text>
              <Text style={styles.text}> {game.description} </Text>
            </View>
            <Text
              style={[
                styles.text,
                styles.titleText,
              ]}
            >
              REQUIREMENTS
            </Text>
            <View style={styles.requirement}>
              <Text style={styles.text}>Processor: </Text>
              <Text style={styles.text}>
                {game.requirement.processor.map((p) => (
                  <React.Fragment key={p}>{p} </React.Fragment>
                ))}
              </Text>
            </View>
            <View style={styles.requirement}>
              <Text style={styles.text}>Memory: </Text>
              <Text style={styles.text}>
                {game.requirement.memory}gb
              </Text>
            </View>
            <View style={styles.requirement}>
              <Text style={styles.text}>Graphics: </Text>
              <Text style={styles.text}>
                {game.requirement.graphics.map((g) => (
                  <Text style={styles.text} key={g}>
                    {g}
                  </Text>
                ))}
              </Text>
            </View>

            <View>
              <Text
                style={[
                  styles.text,
                  styles.titleText,
                ]}
              >
                RELATED GAMES
              </Text>
              
              <ScrollView
                horizontal={true}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
                style={{ 
                  width: windowWidth, 
                  marginBottom: 10 
                }}
              >
                {game.relatedGames.map((g, i) => (
                  <Pressable
                    key={i}
                    onPress={() => {
                      navigation.navigate("game", { gameId: g.id });
                    }}
                  >
                    <View style={styles.centeredContainer}>
                      <Image
                        source={{ uri: g.mainImage.src }}
                        style={styles.recomendedGameImg}
                      />
                      <Text style={ styles.relatedGameText } >
                        {g.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {hasGame ? (
              hasReviewed ? (
                <>
                  {getOwnReview()}
                  <Reviews
                    reviews={game.reviews.filter(
                      (review) => review.user.id !== user.id
                    )}
                  />
                </>
              ) : (
                <>
                  <WriteReviewBox
                    user={user}
                    game_id={gameId}
                    on_review={() => setHasReviewed(true)}
                  />
                  <Reviews reviews={game.reviews} />
                </>
              )
            ) : (
              <Reviews reviews={game.reviews} />
            )}

            {game && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={tagsVisible}
                onRequestClose={hideTags}
              >
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>All Tags</Text>
                  <View style={[styles.greyCenteredContainer, styles.smoothCornerContainer]}>
                    {game.tags.map((tag) => (
                      <Text key={tag.id + "modal"} style={styles.modalTag}>
                        {tag.name}
                        {"  "}
                      </Text>
                    ))}
                  </View>
                  <TouchableOpacity onPress={hideTags}>
                    <Text style={styles.modalClose}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}
            {game && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={multimediaVisible}
                onRequestClose={hideMultimedia}
              >
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Multimedia</Text>
                  <View
                    style={styles.greyCenteredContainer}
                  >
                    <Image
                      source={{ uri: game.multimedia[selectedMedia].src }}
                      style={styles.image}
                    />
                  </View>
                  <TouchableOpacity onPress={hideMultimedia}>
                    <Text style={styles.modalClose}>Close</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

export default game;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    aspectRatio: 16 / 9,
    resizeMode: "contain",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202742",
  },
  requirement: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  recomendedGameImg: {
    height: 200,
    width: "12em",
    aspectRatio: 9 / 12,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 20,
    // flex: 1,
  },
  buyButton: {
    backgroundColor: "#12a7ff",
    // justifyContent: 'center'
    alignItems: "center",
    width: "70%",
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buyBox: {
    backgroundColor: "#142155",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 5,
  },
  text: {
    color: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "white",
    marginBottom: 10,
  },
  modalTag: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  modalClose: {
    fontSize: 18,
    color: "white",
    marginTop: 20,
  },
  scrollContainer: {
    width: "100%", 
    alignContent: "center",
  },
  fullWidthWithMargin: {
    width: "100%",
    marginBottom: 10,
    marginTop: 10,
  },
  rowContainer: {
    flexDirection: "row"
  },
  greyCenteredContainer: {
    width: "80%",
    alignItems: "center",
    backgroundColor: "grey",
    flexWrap: "wrap",
    flexDirection: "row",
  },
  smoothCornerContainer: {
    padding: 10,
    borderRadius: 15,
  },
  underline: {
    textDecorationLine: "underline"
  },
  buySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buyFont: { 
    fontSize: 20, 
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    flexWrap: "wrap",
  },
  fullWidth: {
    width: "100%"
  },
  centeredContainer: { 
    justifyContent: "center", 
    alignItems: "center" 
  },
  titleText: {
    fontSize: 20, 
    fontWeight: "500", 
    marginTop: 16,
    marginBottom: 8 
  },
  requirementText: {
    flex: 1
  },
  relatedGameText: {
    position: "absolute",
    bottom: 40,
    fontSize: 28,
    fontWeight: "700",
    width: "90%",
    left: "5%",
    textAlign: "center",
    color: "white"
  }
});
