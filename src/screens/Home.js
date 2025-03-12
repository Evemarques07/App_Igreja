import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { jwtDecode } from "jwt-decode";
import TabNavigator from "../navigation/TabNavigator";

const Home = ({ route }) => {
  const { token } = route.params;
  const decodedToken = jwtDecode(token.access_token);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Bem-vindo(a), {decodedToken.nomeCompleto}!
        </Text>
        <Text>ID: {decodedToken.idMembro}</Text>
        <Text>CPF: {decodedToken.cpf}</Text>
        <Text>Cargo: {decodedToken.cargo}</Text>
      </View>

      {/* TabNavigator ocupa o restante da tela */}
      <View style={styles.tabsContainer}>
        <TabNavigator route={route} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa a tela toda
    backgroundColor: "#f0f0f0",
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 4, // Adiciona sombra no Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tabsContainer: {
    flex: 1, // Permite que as abas ocupem o espaço restante
  },
});

export default Home;
