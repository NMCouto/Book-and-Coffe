import { api } from './api';
import type { LivroView, LivroInput } from '../types';
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

  create: async (novo: LivroInput): Promise<void> => {
    const payload = {
        titulo: novo.titulo,
        autor: novo.autor,
        genero: novo.genero,
        editora: novo.editora,
        isbn: Number(String(novo.isbn).replace(/\D/g, '')), 
        volume: novo.volume ? Number(novo.volume) : undefined,
        data_lancamento: novo.data_lancamento,
        disponibilidade: "Disponível" 
    };

    try {
      await api.post('/livros', payload);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Salvando livro no Mock.");
      const novoMock = { _id: Math.random().toString(), ...payload };
      // @ts-ignore
      livrosLocal.push(novoMock);
    }
  },

  // --- ATUALIZAR (Com lógica de disponibilidade) ---
  update: async (id: string, dados: LivroInput): Promise<void> => {
    const payload: any = {
        titulo: dados.titulo,
        autor: dados.autor,
        genero: dados.genero,
        editora: dados.editora,
        isbn: Number(String(dados.isbn).replace(/\D/g, '')),
        volume: dados.volume ? Number(dados.volume) : undefined,
        data_lancamento: dados.data_lancamento
    };

    // Lógica para converter Boolean -> String do Backend
    if (dados.disponivel !== undefined) {
        payload.disponibilidade = dados.disponivel ? "Disponível" : "Indisponível";
    }

    try {
      await api.put(`/livros/${id}`, payload);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Atualizando Mock.");
      
      livrosLocal = livrosLocal.map(l => {
         if (l._id === id || l.id === id) {
             return { ...l, ...payload };
         }
         return l;
      });
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