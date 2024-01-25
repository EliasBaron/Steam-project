import { View, Text, Image, StyleSheet, Dimensions, Linking, TouchableOpacity } from 'react-native'
import { Link, router, useLocalSearchParams } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
// import { useParams, useNavigate } from 'react-router-dom';
import { useNavigation } from "@react-navigation/native";

const GameMultimedia = ({ images, on_press }) => {
  const [imgs, setImgs] = useState([]);
  // const [mainImg, setMainImg] = useState("");
  
  useEffect(() => {
    if (images && images.length > 0) {
      setImgs(images);
      // setMainImg(props.images[0].src);
    }
  }, [images]);

  return (
    <>
        <View style={styles.container}>
          {imgs.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => on_press(index)} style={styles.imageContainer}>
              <Image
                key={index}
                source={{ uri: img.src }}
                style={styles.image}
                resizeMode="cover" // or "contain" depending on your preference
              />
            </TouchableOpacity>
          ))}
        </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    width: '100%',
  },
  image: {
    width: '100%', 
    height: '100%',
  },
  imageContainer: {
    marginBottom: 5,
    width: '48%',
    aspectRatio: 16/9,
    marginBottom: 7,
  },
});

export default GameMultimedia;