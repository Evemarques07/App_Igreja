/// src/screens/Home.js
import React, { useState, useCallback } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { jwtDecode } from "jwt-decode";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import CustomDrawerContent from "../components/CustomDrawerContent";
import TabNavigator from "../navigation/TabNavigator";
import ChangeUsername from "./ChangeUsername";
import ChangePassword from "./ChangePassword";
import Avisos from "./Avisos";
import api from "../services/api";

const Drawer = createDrawerNavigator();

const Home = ({ route }) => {
  const navigation = useNavigation();
  const { token } = route.params;
  const [capitalizedName, setCapitalizedName] = useState(null);
  const [aviso, setAviso] = useState(null);

  let decodedToken;
  try {
    decodedToken = token ? jwtDecode(token.access_token) : null;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
  }

  const fetchCapitalizedName = async (idUser, token) => {
    try {
      const response = await api.get(`/usuarios/capitalize/${idUser}`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });
      return response.data.capitalized_login;
    } catch (error) {
      console.error("Erro ao buscar nome capitalizado:", error);
      return null;
    }
  };

  const fetchAvisos = async (idMembro, token) => {
    try {
      console.log("Iniciando requisição para /avisos/ativos/");

      const response = await api.get("/avisos/ativos/", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });

      console.log("Resposta da API:", response.data);

      const userAviso = response.data.find(
        (aviso) => aviso.idMembro === idMembro
      );

      if (userAviso) {
        console.log("Aviso encontrado para o usuário:", userAviso);
        setAviso(userAviso);
      } else {
        console.log(
          "Nenhum aviso encontrado para o usuário com idMembro:",
          idMembro
        );
      }
    } catch (error) {
      console.error("Erro ao buscar avisos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (decodedToken) {
        const idUser = decodedToken.idMembro;
        fetchCapitalizedName(idUser, token)
          .then((name) => setCapitalizedName(name))
          .catch((error) => console.error("Erro ao buscar nome:", error));
        fetchAvisos(idUser, token);
      }
    }, [token])
  );

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", onPress: () => navigation.replace("Login") },
    ]);
  };

  return (
    <View style={styles.container}>
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent {...props} token={token} />
        )}
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: "#0097d9" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText}>
                {capitalizedName
                  ? `Bem-vindo(a), ${capitalizedName}!`
                  : decodedToken
                  ? `Bem-vindo(a), ${decodedToken.nomeCompleto}!`
                  : "Bem-vindo(a)!"}
              </Text>
              {aviso && (
                <View style={styles.avisoContainer}>
                  <Text style={styles.avisoText}>Avisos</Text>
                </View>
              )}
            </View>
          ),
        }}
      >
        <Drawer.Screen
          name="Home"
          component={TabNavigator}
          initialParams={{ token }}
        />
        <Drawer.Screen
          name="Alterar nome de Usuário"
          component={ChangeUsername}
          initialParams={{
            token,
            refreshCapitalizedName: () => {
              if (decodedToken) {
                fetchCapitalizedName(decodedToken.idMembro, token)
                  .then((name) => setCapitalizedName(name))
                  .catch((error) =>
                    console.error("Erro ao buscar nome:", error)
                  );
              }
            },
          }}
        />
        <Drawer.Screen
          name="Alterar Senha"
          component={ChangePassword}
          initialParams={{ token }}
        />
        <Drawer.Screen
          name="Avisos"
          component={Avisos}
          initialParams={{ token }}
          options={{
            drawerLabel: ({ focused }) => (
              <View style={styles.drawerLabelContainer}>
                <Text
                  style={[styles.drawerLabel, aviso && styles.drawerLabelAtivo]}
                >
                  Avisos
                </Text>
                {aviso && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>!</Text>{" "}
                    {/* Apenas um alerta de aviso */}
                  </View>
                )}
              </View>
            ),
          }}
        />

        <Drawer.Screen
          name="Sair"
          component={View}
          options={{
            drawerLabel: "Sair",
            title: "Sair",
            drawerItemStyle: { backgroundColor: "#ff4d4d" },
            drawerLabelStyle: { color: "#fff", fontWeight: "bold" },
          }}
          listeners={{ focus: handleLogout }}
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
  headerTitleContainer: {
    flexDirection: "row", // Deixa o título e o aviso lado a lado
    alignItems: "center", // Centraliza verticalmente
  },
  headerTitleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10, // Espaço entre o título e o aviso
  },
  avisoContainer: {
    backgroundColor: "yellow",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  avisoText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabsContainer: {
    flex: 1,
  },
  drawerLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  drawerLabel: {
    fontSize: 16,
    color: "#555", // Cor neutra padrão
    fontWeight: "normal",
  },
  drawerLabelAtivo: {
    color: "#ffcc00", // Cor amarela vibrante quando há avisos
    fontWeight: "bold",
    fontSize: 18, // Aumenta um pouco o tamanho para chamar atenção
  },
  badge: {
    backgroundColor: "#ff3b30", // Vermelho chamativo para indicar notificações
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Home;
