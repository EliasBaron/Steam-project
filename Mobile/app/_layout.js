import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#040712",
          shadowColor: "transparent",
        },
        headerTintColor: "#ffff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="register" />
      <Stack.Screen
        name="purchase"
        options={({ route }) => ({
          title: route.params?.gameName || "Purchase",
        })}
      />
    </Stack>
  );
};

export default StackLayout;
