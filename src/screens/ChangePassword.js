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
import Icon from "react-native-vector-icons/Feather";

const ChangePassword = ({ route, navigation }) => {
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

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setModalMessage("As senhas não coincidem.");
      setModalVisible(true);
      setLoading(false);
      return;
    }

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
        {
          password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token.access_token}` },
        }
      );

      if (response.status === 200) {
        setModalMessage("Senha alterada com sucesso!");
        setModalVisible(true);
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        throw new Error("Erro ao alterar a senha");
      }
    } catch (error) {
      console.error("Erro ao alterar a senha:", error);
      setModalMessage("Erro ao alterar a senha. Tente novamente.");
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Senha</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Nova Senha"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholderTextColor="#B0BEC5"
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowNewPassword(!showNewPassword)}
        >
          <Icon
            name={showNewPassword ? "eye" : "eye-off"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirmar Nova Senha"
          secureTextEntry={!showConfirmNewPassword}
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          placeholderTextColor="#B0BEC5"
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
        >
          <Icon
            name={showConfirmNewPassword ? "eye" : "eye-off"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePassword}
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
                if (modalMessage === "Senha alterada com sucesso!") {
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
  inputPassword: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "#B0BEC5",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingRight: 10,
  },
  icon: {
    padding: 10,
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

export default ChangePassword;
