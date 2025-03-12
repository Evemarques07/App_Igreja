// src/screens/HomeTab1.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeTab1 = () => {
  return (
    <View style={styles.container}>
      <Text>Conteúdo da Aba 1</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeTab1;
