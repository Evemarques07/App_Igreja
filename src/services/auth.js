// src/services/auth.js
import axios from "axios";

const API_URL = "http://192.168.100.11:8000";

export const login = async (username, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/token`,
      `username=${username}&password=${password}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login (completo):", error);
    if (error.response) {
      console.error("Detalhes do erro:", error.response.data);
      console.error("Status do erro:", error.response.status);
      console.error("Headers do erro:", error.response.headers);
    } else if (error.request) {
      console.error("Não houve resposta do servidor.");
    } else {
      console.error("Erro ao configurar a requisição:", error.message);
    }
    throw error;
  }
};
