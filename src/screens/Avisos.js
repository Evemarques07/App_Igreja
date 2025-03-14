import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";

const Avisos = ({ route }) => {
  const { token } = route.params;
  const [aviso, setAviso] = useState([]);
  const [avisosCarregados, setAvisosCarregados] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  let decodedToken;
  try {
    decodedToken = token ? jwtDecode(token.access_token) : null;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }

  const fetchAvisos = useCallback(async (idMembro, token) => {
    try {
      console.log("Iniciando requisição para /avisos/ativos/");
      const response = await api.get("/avisos/ativos/", {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });

      console.log("Resposta da API:", response.data);

      // Filtra todos os avisos que pertencem ao idMembro
      const userAvisos = response.data.filter(
        (aviso) => aviso.idMembro === idMembro
      );

      setAviso(userAvisos);
    } catch (error) {
      console.error("Erro ao buscar avisos:", error);
      setAviso([]); // Garante que a lista fique vazia em caso de erro
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (decodedToken && !avisosCarregados) {
        fetchAvisos(decodedToken.idMembro, token);
        setAvisosCarregados(true);
      }
    }, [token, decodedToken, avisosCarregados])
  );

  const onRefresh = async () => {
    if (decodedToken) {
      setRefreshing(true);
      await fetchAvisos(decodedToken.idMembro, token);
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {aviso.length > 0 ? (
        aviso.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.avisoTitle}>📢 Aviso Importante!</Text>
            <Text style={styles.avisoMessage}>{item.descricao}</Text>
            <Text style={styles.avisoDate}>
              📅 {new Date(item.dataEvento).toLocaleDateString("pt-BR")}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noAvisoText}>
          Nenhum aviso disponível no momento.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F8FB",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "90%",
    alignItems: "center",
    marginBottom: 12,
  },
  avisoTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0097d9",
    marginBottom: 10,
    textAlign: "center",
  },
  avisoMessage: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
  },
  avisoDate: {
    fontSize: 16,
    color: "#555",
    fontWeight: "bold",
    marginTop: 10,
  },
  noAvisoText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default Avisos;
