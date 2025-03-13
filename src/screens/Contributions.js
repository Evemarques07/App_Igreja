import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import api from "../services/api";

const Contributions = ({ route }) => {
  const { token, selectedYear } = route.params;
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showList, setShowList] = useState(false);

  const fetchEntradas = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowList(false);

    try {
      console.log("Iniciando requisição para /entradas/me/...");
      console.log("Token antes da requisição:", token);
      const response = await api.get(`/entradas/me/`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Formato de resposta inválido");
      }

      const entradasComEspaco = response.data.map((item) => ({
        ...item,
        tipo: item.tipo.replace(/_/g, " "),
      }));

      const tiposPermitidos = [
        "Dizimos",
        "Ofertas",
        "Ofertas Missionarias",
        "Campanhas",
        "Eventos",
        "Venda Materiais",
        "Doacoes Empresas",
        "Parcerias Ongs",
        "Apoio Outras Igrejas",
        "Investimentos",
      ];

      const entradasFiltradas = entradasComEspaco.filter(
        (item) =>
          tiposPermitidos.includes(item.tipo) &&
          new Date(item.dataRegistro).getFullYear() === selectedYear
      );

      const groupedData = tiposPermitidos
        .map((tipo) => {
          const dataByType = entradasFiltradas.filter(
            (item) => item.tipo === tipo
          );
          const total = dataByType.reduce(
            (sum, item) => sum + parseFloat(item.valor || 0),
            0
          );

          return {
            title: tipo,
            data: dataByType,
            total: total.toFixed(2),
          };
        })
        .filter((section) => section.data.length > 0);

      setEntradas(groupedData);
      setShowList(true);
    } catch (error) {
      console.error("Erro ao buscar entradas:", error);
      setError("Erro ao buscar as entradas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedYear, token]);

  useEffect(() => {
    if (selectedYear) {
      fetchEntradas();
    }
  }, [selectedYear, token, fetchEntradas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEntradas();
  }, [fetchEntradas]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💵 Suas Contribuições</Text>
      {selectedYear ? (
        <Text style={styles.yearText}>{selectedYear}</Text>
      ) : (
        <Text style={styles.yearText}>
          Selecione um ano para ver as contribuições.
        </Text>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text>Carregando...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {showList && (
        <SectionList
          sections={entradas}
          keyExtractor={(item) =>
            item.idEntrada?.toString() || Math.random().toString()
          }
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.entradaItem}>
              <Text style={styles.descricao}>{item.descricao}</Text>
              <Text style={styles.data}>
                📅 {new Date(item.dataRegistro).toLocaleDateString("pt-BR")}
              </Text>
              <Text style={styles.valor}>
                💰 R$ {parseFloat(item.valor).toFixed(2)}
              </Text>
            </View>
          )}
          renderSectionFooter={({ section }) => (
            <Text style={styles.total}>Total: R$ {section.total}</Text>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma entrada encontrada.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F4F4F4" },
  title: {
    paddingTop: 8,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0097d9",
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#0097d9",
    color: "#FFF",
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  entradaItem: {
    backgroundColor: "#FFF",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDD",
    elevation: 2,
  },
  descricao: { fontSize: 16, fontWeight: "bold" },
  data: { fontSize: 14, color: "#666" },
  valor: { fontSize: 16, fontWeight: "bold", color: "#008000" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: { fontSize: 16, color: "red", textAlign: "center" },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 40,
    padding: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    alignSelf: "center",
    width: "80%",
  },
  total: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#008000",
    marginTop: 8,
    padding: 10,
    backgroundColor: "#F0F0F0",
    borderRadius: 6,
    textAlign: "center",
  },
  yearText: {
    borderRadius: 10,
    padding: 8,
    alignSelf: "center",
    backgroundColor: "#0097d9",
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    fontWeight: "bold",
  },
});

export default Contributions;
