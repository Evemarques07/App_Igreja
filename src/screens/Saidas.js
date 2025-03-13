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

const Saidas = ({ route }) => {
  const { token, selectedYear, selectedMonth } = route.params;
  const [saidas, setSaidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showList, setShowList] = useState(false);

  const fetchSaidas = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowList(false);

    try {
      const response = await api.get(`/saidas/`, {
        headers: { Authorization: `Bearer ${token.access_token}` },
      });

      if (!Array.isArray(response.data)) {
        throw new Error("Formato de resposta inválido");
      }

      const saidasComEspaco = response.data.map((item) => ({
        ...item,
        tipo: item.tipo.replace(/_/g, " "), // Substitui "_" por espaço
      }));

      const saidasFiltradas = saidasComEspaco.filter((item) => {
        const itemDate = new Date(item.dataRegistro);
        return (
          itemDate.getFullYear() === selectedYear &&
          itemDate.getMonth() + 1 === selectedMonth
        );
      });

      const groupedData = Array.from(
        new Map(
          saidasFiltradas.map((item) => [
            item.tipo,
            { title: item.tipo, data: [] },
          ])
        )
      ).map(([type, group]) => {
        group.data = saidasFiltradas.filter((item) => item.tipo === type);
        const total = group.data.reduce(
          (sum, item) => sum + parseFloat(item.valor || 0),
          0
        );
        return {
          ...group,
          total: total.toFixed(2),
        };
      });

      setSaidas(groupedData);
      setShowList(true);
    } catch (error) {
      console.error("Erro ao buscar saídas:", error);
      setError("Erro ao buscar as saídas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedYear, selectedMonth, token]);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchSaidas();
    }
  }, [selectedYear, selectedMonth, token, fetchSaidas]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchSaidas();
  }, [fetchSaidas]);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Saídas</Text> */}
      {selectedYear && selectedMonth && (
        <Text style={styles.yearMonthText}>
          {new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
            new Date(selectedYear, selectedMonth - 1)
          )}{" "}
          {selectedYear}
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
          sections={saidas}
          keyExtractor={(item) =>
            item.idSaida?.toString() || Math.random().toString()
          }
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.saidaItem}>
              <Text style={styles.descricao}>Descrição: {item.descricao}</Text>
              <Text style={styles.valor}>
                💰 R$ {parseFloat(item.valor).toFixed(2)}
              </Text>
              <Text style={styles.data}>
                📅 {new Date(item.dataRegistro).toLocaleDateString("pt-BR")}
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
            <Text style={styles.emptyText}>Nenhuma saída encontrada.</Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 8,
    backgroundColor: "#F4F4F4",
  },
  title: {
    paddingTop: 8,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0097d9",
    marginBottom: 8,
  },
  yearMonthText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    textTransform: "capitalize",
    color: "#FFF",
    backgroundColor: "#0097d9",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  saidaItem: {
    backgroundColor: "#FFF",
    padding: 12,
    marginBottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDD",
    elevation: 2,
  },
  descricao: { fontSize: 16, fontWeight: "bold" },
  valor: { fontSize: 16, color: "green", fontWeight: "bold" },
  data: { fontSize: 14, color: "#666" },
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
    fontSize: 16,
    color: "#999",
    marginTop: 20,
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
});

export default Saidas;
