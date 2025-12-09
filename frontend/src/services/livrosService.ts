import { api } from './api';
import type { LivroView, LivroInput } from '../types';
import { adaptLivro } from '../utils/adapters';
import { LIVROS_MOCK } from '../mocks/livrosMocks';

export const LivrosService = {
  // LISTAR (GET) COM FALLBACK
  getAll: async (): Promise<LivroView[]> => {
    try {
      // Tenta bater na API (com timeout curto para não travar muito tempo)
      const response = await api.get('/livros', { timeout: 2000 });
      return response.data.map(adaptLivro);
    } catch (error) {
      console.warn("⚠️ Backend Offline ou indisponível. Usando Mocks de Livros.");
      
      // Retorna o Mock passando pelo mesmo adaptador (para manter o padrão visual)
      return LIVROS_MOCK.map(adaptLivro);
    }
  },

  // CRIAR (POST) - Simulação
  create: async (novoLivro: LivroInput): Promise<void> => {
    try {
      await api.post('/livros', novoLivro);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Criação simulada no console.");
      console.log("Dados recebidos:", novoLivro);
      // Não faz nada (finge que salvou) para não quebrar a UI
    }
  },

  // ATUALIZAR (PUT) - Simulação
  update: async (id: string, dados: Partial<LivroInput>): Promise<void> => {
    try {
      await api.put(`/livros/${id}`, dados);
    } catch (error) {
      console.warn(`⚠️ Backend Offline. Update simulado para ID: ${id}`);
    }
  },

  // DELETAR (DELETE) - Simulação
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/livros/${id}`);
    } catch (error) {
      console.warn(`⚠️ Backend Offline. Delete simulado para ID: ${id}`);
    }
  }
};