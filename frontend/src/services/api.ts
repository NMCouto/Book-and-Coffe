import axios from 'axios';

// Cria uma instância do Axios com o endereço do Backend
export const api = axios.create({
  baseURL: 'http://localhost:5500', // <--- Verifique a porta do backend
});

// (Opcional) Adiciona um log para ajudar a ver erros no console
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na API:", error);
    return Promise.reject(error);
  }
);