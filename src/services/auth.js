// src/services/auth.js
import axios from "axios";

const API_URL = "http://192.168.100.11:8000"; // Substitua pelo seu IP e porta

export const login = async (username, password) => {
  try {
    console.log("Iniciando requisição de login..."); // Log antes da requisição
    const response = await axios.post(
      `${API_URL}/auth/token`,
      `username=${username}&password=${password}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Resposta da API:", response.data); // Log da resposta da API
    return response.data; // Retorna o objeto com access_token e token_type
  } catch (error) {
    console.error("Erro ao fazer login (completo):", error); // Log completo do erro
    if (error.response) {
      // O servidor respondeu com um status code diferente de 2xx
      console.error("Detalhes do erro:", error.response.data);
      console.error("Status do erro:", error.response.status);
      console.error("Headers do erro:", error.response.headers);
    } else if (error.request) {
      // A requisição foi feita, mas não houve resposta do servidor
      console.error("Não houve resposta do servidor.");
    } else {
      // Algum outro erro aconteceu ao configurar a requisição
      console.error("Erro ao configurar a requisição:", error.message);
    }
    throw error; // Rejeita a promessa para que o componente Login possa tratar o erro
  }
};
