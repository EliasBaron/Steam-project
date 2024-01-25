import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import {  TextInput, TouchableOpacity } from "react-native";
import botonLike from "../assets/icon_thumbsUp_v6.png";
import botonDisLike from "../assets/icon_thumbsDown_v6.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addReview } from "../auxComp/api.js"

const Review = ({ review }) => {
  const navigation = useNavigation();
  const go_to_user = () => {
    navigation.navigate("user", { id: review.user.id })
  } 
  return (
    <>
      <View style={styles.review}>
        <View style={styles.userInfoContainer}>
          <TouchableOpacity onPress={go_to_user}>
            <Image
              source={{ uri: review.user.image }}
              style={[
                styles.image,
                styles.userReviewImage,
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.text} onPress={go_to_user}>{review.user.name}</Text>
          <Image
            source={review.isRecommended ? botonLike : botonDisLike}
            style={styles.image}
          />
        </View>
        <Text style={[styles.text]}>{review.text}</Text>
      </View>
    </>
  );
};

const Reviews = ({ reviews }) => {
  return (
    <>
      {reviews.map((r) => (
        <Review key={r.id} review={r} />
      ))}
    </>
  );
};

const WriteReviewBox = ({ user, game_id, on_review }) => {
  const [reviewText, setReviewText] = useState("");
  const [token, setToken] = useState(null);
  const [likePressed, setLikePressed] = useState(null);
  const [isSelectedValue, setIsSelectedValue] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      const fetchedToken = await AsyncStorage.getItem("token");
      setToken(fetchedToken);
    };

    fetchToken();
  }, []);

  const sendReview = async () => {
    if (!reviewText) {
      return;
    }
    if (reviewText && isSelectedValue && likePressed != null) {
      try {
        const response = await addReview(game_id, likePressed, reviewText, token);
        if (on_review) {
          on_review();
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.error("Please enter a review before submitting.");
    }
  };

  const handleLikePress = () => {
    setLikePressed(true);
    setIsSelectedValue(true);
  };

  const handleDislikePress = () => {
    setLikePressed(false);
    setIsSelectedValue(true);
  };

  return (
    <View style={styles.writeReviewBox}>
      <View style={styles.writeReviewRow}>
        <Image source={ {uri:user.image}} style={[styles.image, styles.userReviewImage]} />
        <Text style={styles.text}>{user.name}</Text>
      </View>
      <View style={styles.writeReviewRow}>
        <Text style={styles.text}>Recommended</Text>
        <TouchableOpacity
          style={[
            styles.button,
            isSelectedValue && likePressed && styles.activeButton,
          ]}
          onPress={handleLikePress}
        >
          <Image source={botonLike} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            isSelectedValue && !likePressed && styles.activeButton,
          ]}
          onPress={handleDislikePress}
        >
          <Image source={botonDisLike} style={styles.image} />
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Text</Text>

      <TextInput
        placeholder=""
        value={reviewText}
        onChangeText={(text) => setReviewText(text)}
        style={styles.textInput}
        multiline={true}
      />
      <View style={styles.addReviewButtonContainer}>
        <Pressable style={styles.sendReview} onPress={sendReview}>
          <Text style={styles.text}>Add review</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  review: {
    width: "100%",
    backgroundColor: "#454E62", // Grey background color
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  image: {
    height: 40,
    width: 40,
  },
  userImage: {
    borderRadius: 20, 
    borderWidth: 1.5, 
    borderColor: "white",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Distribute children with equal space
    marginBottom: 10,
    width: "100%", // Take the full width
  },
  button: {
    backgroundColor: "black",
    padding: 1,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "gold", // Change to the color you want when the button is pressed
  },
  textInput: {
    height: 100,
    // textAlign: 'auto'
    textAlignVertical: "top",
    backgroundColor: "grey",
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 15,
  },
  sendReview: {
    backgroundColor: '#142155ff',
    height:60,
    width:200,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:15,
    marginBottom: 10,
    marginTop: 20
  },
  writeReviewBox: {
    backgroundColor: "black",
    width: "100%",
    alignSelf: "center",
    marginBottom: 20,
    padding:10
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
  writeReviewRow: { 
    flexDirection: "row", 
    alignItems:'center',
  },
  addReviewButtonContainer: {
    alignItems:'center'
  },
  userReviewImage: { 
    borderRadius: 20, 
    borderWidth: 1.5, 
    borderColor: "white" 
  }
});

// export default {Review, Reviews};
export { Review };
export { Reviews };
export { WriteReviewBox };
