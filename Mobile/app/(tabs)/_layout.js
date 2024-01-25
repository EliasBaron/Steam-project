import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from '../../auxComp/api.js';

const TabsLayout = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const currentUser = await getCurrentUser(token);
        setUser(currentUser);
      } catch (err) {
        console.error('API error', err);
      }
    };

    fetchData();
  }, []);

  return (
    user && (
      <Tabs
        screenOptions={{
          tabBarStyle: { backgroundColor: '#040712', borderTopColor: '#040712' },
          tabBarActiveTintColor: '#88d1fb',
          tabBarShowLabel : false,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Image
                source={{ uri: user.image }}
                style={{ width: size, height: size, borderRadius: size / 2, borderColor: color, borderWidth: 1 }}
              />
            ),
          }}
        />
      </Tabs>
    )
  );
};

export default TabsLayout;
