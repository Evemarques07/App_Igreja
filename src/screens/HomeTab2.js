// src/screens/HomeTab2.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HomeTab2 = () => {
  return (
    <View style={styles.container}>
      <Text>Conteúdo da Aba 2</Text>
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

export default HomeTab2;
