import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const GamesWrapper = ({ games }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {games.map((game) => (
        <Pressable
          key={game.id}
          onPress={() => navigation.navigate("game", { gameId: game.id })}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.8 : 1,
            },
            styles.gameItem,
          ]}
        >
          <Image
            source={{ uri: game.mainImage.src }}
            style={styles.gameImage}
          />
          <View style={styles.gameDetails}>
            <Text style={[styles.textColor, styles.gameName]}>{game.name}</Text>
            <View style={styles.detailsContainer}>
              <View style={styles.tagContainer}>
                {game.tags.slice(0, 2).map((tag, index) => (
                  <React.Fragment key={index}>
                    <Text style={[styles.textColor, styles.underline]}>
                      {tag.name}
                    </Text>
                    <Text style={styles.textColor}> </Text>
                  </React.Fragment>
                ))}
              </View>
              <Text style={[styles.textColor, styles.priceText]}>
                {game.price.amount.toFixed(2)} {game.price.currency}
              </Text>
            </View>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default GamesWrapper;
