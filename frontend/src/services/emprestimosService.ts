import { api } from './api';
import type { EmprestimoView, EmprestimoInput } from '../types';
import { adaptEmprestimo } from '../utils/adapters';
import { EMPRESTIMOS_MOCK } from '../mocks/emprestimosMocks';

export const EmprestimosService = {
  // GET LISTA
  getAll: async (): Promise<EmprestimoView[]> => {
    try {
      // Tenta pegar do Backend (Node/Express)
      const response = await api.get('/emprestimos', { timeout: 2000 });
      return response.data.map(adaptEmprestimo);
    } catch (error) {
      console.warn("⚠️ Backend Offline ou indisponível. Usando Mocks de Empréstimos.");
      
      // Fallback para o Mock
      return EMPRESTIMOS_MOCK.map(adaptEmprestimo);
    }
  },

  // POST CRIAR
  create: async (novo: EmprestimoInput): Promise<void> => {
    try {
      await api.post('/emprestimos', novo);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Criação simulada.");
    }
  },
  
  // DELETE
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/emprestimos/${id}`);
    } catch (error) {
      console.warn(`⚠️ Backend Offline. Delete simulado para ID: ${id}`);
    }
  }
};