import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";

const ChangeUsername = ({ route, navigation }) => {
  const { token } = route.params;

  let decodedToken;
  let idMembro;

  try {
    decodedToken = token ? jwtDecode(token.access_token) : null;
    idMembro = decodedToken ? decodedToken.idMembro : null;
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    setModalMessage("Erro ao obter informações do usuário.");
    setModalVisible(true);
    navigation.goBack();
    return null;
  }

  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChangeUsername = async () => {
    setLoading(true);

    const idMembroInt = parseInt(idMembro, 10);
    if (isNaN(idMembroInt)) {
      console.error("Erro: idMembro não é um número válido!", idMembro);
      setModalMessage("ID do membro inválido.");
      setModalVisible(true);
      setLoading(false);
      return;
    }

    try {
      const response = await api.patch(
        `/usuarios/${idMembroInt}`,
        { login: newUsername },
        { headers: { Authorization: `Bearer ${token.access_token}` } }
      );

      if (response.status === 200) {
        setModalMessage("Nome de usuário alterado com sucesso!");
        setModalVisible(true);
      } else {
        throw new Error("Erro ao alterar o nome de usuário");
      }
    } catch (error) {
      console.error("Erro ao alterar o nome de usuário:", error);
      setModalMessage("Erro ao alterar o nome de usuário. Tente novamente.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Nome de Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Novo Nome de Usuário"
        value={newUsername}
        onChangeText={setNewUsername}
        placeholderTextColor="#B0BEC5"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleChangeUsername}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (modalMessage === "Nome de usuário alterado com sucesso!") {
                  navigation.goBack();
                }
              }}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0097d9",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#B0BEC5",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#0097d9",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    elevation: 3,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#0097d9",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangeUsername;
