import { api } from './api';
import type { LivroView } from '../types';
import { adaptLivro } from '../utils/adapters';
import { LIVROS_MOCK } from '../mocks/livrosMocks';

let livrosLocal = [...LIVROS_MOCK];

export const LivrosService = {
  getAll: async (): Promise<LivroView[]> => {
    try {
      const response = await api.get('/livros', { timeout: 2000 });
      return response.data.map(adaptLivro);
    } catch (error) {
      return livrosLocal.map(adaptLivro);
    }
  },

  create: async (novo: any): Promise<void> => {
    // 1. PREPARAR PAYLOAD
    const payload = {
        titulo: novo.titulo,
        autor: novo.autor,
        genero: novo.genero,
        editora: novo.editora,
        // Converte ISBN string para Number
        isbn: Number(String(novo.isbn).replace(/\D/g, '')),
        volume: Number(novo.volume) || 1,
        // Backend define padrão "Disponível", não precisa mandar se for novo
    };

    try {
      await api.post('/livros', payload);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Salvando livro no Mock.");
      const novoMock = { 
          _id: Math.random().toString(), 
          ...payload,
          disponibilidade: "Disponível" // Simula o default do Mongoose
      };
      // @ts-ignore
      livrosLocal.push(novoMock);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/livros/${id}`);
    } catch (error) {
      livrosLocal = livrosLocal.filter(l => l._id !== id && l.id !== id);
    }
  }
};