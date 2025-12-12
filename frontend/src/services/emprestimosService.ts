import { api } from './api';
import type { EmprestimoView } from '../types';
import { adaptEmprestimo } from '../utils/adapters';
import { EMPRESTIMOS_MOCK } from '../mocks/emprestimosMocks';

let emprestimosLocal = [...EMPRESTIMOS_MOCK];

export const EmprestimosService = {
  getAll: async (): Promise<EmprestimoView[]> => {
    try {
      const response = await api.get('/emprestimos', { timeout: 2000 });
      return response.data.map(adaptEmprestimo);
    } catch (error) {
      return emprestimosLocal.map(adaptEmprestimo);
    }
  },

  create: async (novo: any): Promise<void> => {
    // 1. PREPARAR PAYLOAD
    // O formulário manda { isbn, titulo, cpf, obs, ... }
    const payload = {
        titulo: novo.titulo,
        isbn: Number(String(novo.isbn).replace(/\D/g, '')),
        // O Backend espera 'cpf_emprestimo'
        cpf_emprestimo: Number(String(novo.cpf).replace(/\D/g, '')),
        data_emissao: novo.dataEmissao,
        data_devolucao: novo.dataDevolucao,
        comentario: novo.obs, // Mapeia obs -> comentario
        status: "Pendente"
    };

    try {
      await api.post('/emprestimos', payload);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Salvando empréstimo no Mock.");
      const novoMock = { 
          _id: Math.random().toString(), 
          ...payload,
          // Ajuste de chaves para o Adapter local ler corretamente se necessário
          // mas como usamos o payload formatado, o adapter deve estar pronto para ler
          // as chaves do backend (cpf_emprestimo, etc)
      };
      // @ts-ignore
      emprestimosLocal.push(novoMock);
    }
  },

  update: async (id: string, dados: any): Promise<void> => {
    // Mapeamento parcial para update
    const payload: any = {};
    if (dados.obs) payload.comentario = dados.obs;
    if (dados.dataDevolucao) payload.data_devolucao = dados.dataDevolucao;
    if (dados.status) payload.status = dados.status;

    try {
      await api.put(`/emprestimos/${id}`, payload);
    } catch (error) {
      // Mock update
      emprestimosLocal = emprestimosLocal.map(e => 
        (e._id === id || e.id === id) ? { ...e, ...payload } : e
      );
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/emprestimos/${id}`);
    } catch (error) {
      emprestimosLocal = emprestimosLocal.filter(e => e._id !== id && e.id !== id);
    }
  }
};