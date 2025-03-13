// src/screens/Home.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import CustomDrawerContent from "../components/CustomDrawerContent";
import { createDrawerNavigator } from "@react-navigation/drawer";

import YearSelection from "./YearSelection";
import YearSelectionSaidas from "./YearSelectionSaidas";
import TabNavigator from "../navigation/TabNavigator";
import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChangePassword";

const Drawer = createDrawerNavigator();

const HomeContent = ({ token }) => {
  return <TabNavigator token={token} />;
};

const Home = ({ route }) => {
  const { token } = route.params;
  console.log("Token recebido em Home:", token); // Adicione este log
  let decodedToken = null;
  try {
    if (token && token.access_token) {
      // Verifica se o token e o access_token existem
      decodedToken = jwtDecode(token.access_token);
    } else {
      console.warn("Token inválido ou ausente.");
    }
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
  }
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent {...props} token={token} />
        )}
        screenOptions={{
          headerShown: true,
          headerTitle: decodedToken
            ? `Bem-vindo(a), ${decodedToken.nomeCompleto}!`
            : "Bem-vindo(a)!",
          headerStyle: {
            backgroundColor: "#0097d9",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          drawerActiveBackgroundColor: "#0097d9",
          drawerActiveTintColor: "#fff",
          drawerInactiveTintColor: "#333",
        }}
      >
        <Drawer.Screen
          name="Contribuições"
          component={TabNavigator}
          initialParams={{ token: token }}
        />
        <Drawer.Screen
          name="Relatórios"
          component={YearSelectionSaidas}
          initialParams={{ token: token }}
        />
        <Drawer.Screen
          name="ChangeUsername"
          component={ChangeUsername}
          initialParams={{ token: token }}
        />
        <Drawer.Screen
          name="ChangePassword"
          component={ChangePassword}
          initialParams={{ token: token }}
        />
      </Drawer.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabsContainer: {
    flex: 1,
  },
});

export default Home;
