import { api } from './api';
import type { User } from '../types';
import { USERS_MOCK } from '../mocks/usersMocks';

// Banco de dados de usuários em memória
let usersLocal = [...USERS_MOCK];

export const AuthService = {
  login: async (username: string, password: string): Promise<User> => {
    try {
      // Tenta bater no backend real
      const response = await api.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      console.warn("⚠️ Backend Offline. Usando Auth Mock.");
      
      // Lógica de validação do Mock
      const userFound = usersLocal.find(u => u.username === username);

      if (!userFound) {
        throw new Error("USER_NOT_FOUND");
      }

      if (userFound.password !== password) {
        throw new Error("WRONG_PASSWORD");
      }

      // Retorna o usuário sem a senha
      const { password: _, ...userSafe } = userFound;
      return userSafe;
    }
  },

  register: async (username: string, password: string, name: string): Promise<void> => {
    try {
      await api.post('/auth/register', { username, password, name, role: 'funcionario' });
    } catch (error) {
      console.warn("⚠️ Backend Offline. Registro simulado.");
      
      if (usersLocal.find(u => u.username === username)) {
        throw new Error("USER_EXISTS");
      }

      // Adiciona novo usuário (padrão funcionário)
      usersLocal.push({
        username,
        password,
        name,
        role: 'funcionario' // Novos registros vêm como funcionário por padrão
      });
    }
  },

  resetPassword: async (username: string): Promise<void> => {
    // Simulação apenas
    console.log(`Email de recuperação enviado para ${username}`);
    return Promise.resolve();
  }
};