import { api } from './api';
import type { BoardView } from '../types';

// Mock de fallback
const MOCK_BOARDS: BoardView[] = [
  {
    id: 'operacional',
    title: 'Operacional (Offline)',
    columns: [
      { id: 'todo', title: 'A Fazer', color: '#1976D2', cards: [] },
      { id: 'doing', title: 'Em Progresso', color: '#448AFF', cards: [] },
      { id: 'done', title: 'Concluído', color: '#388E3C', cards: [] }
    ]
  }
];

let localBoards = [...MOCK_BOARDS];

export const BoardsService = {
  // 1. Corrigido: Aceita userId (opcional) para bater com a chamada do Contexto
  getAll: async (userId?: string): Promise<BoardView[]> => {
    try {
      // Passamos o userId como query param se quiser filtrar no futuro
      const response = await api.get(`/quadros${userId ? `?userId=${userId}` : ''}`);
      return response.data;
    } catch (error) {
      console.warn("⚠️ Backend Offline. Usando Boards Locais.");
      return localBoards;
    }
  },

  // 2. Adicionado: Método Create
  create: async (title: string, userId: string): Promise<BoardView> => {
    // Define colunas padrão para um novo quadro
    const defaultColumns = [
      { id: 'todo', title: 'A Fazer', color: '#E0E0E0', cards: [] },
      { id: 'doing', title: 'Em Andamento', color: '#E0E0E0', cards: [] },
      { id: 'done', title: 'Concluído', color: '#E0E0E0', cards: [] }
    ];

    const payload = {
        title,
        owner: userId,
        columns: defaultColumns,
        // Gera um ID simples baseado no título se o backend não gerar (mas o ideal é o back gerar _id)
        id: title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5)
    };

    try {
      const response = await api.post('/quadros', payload);
      return response.data;
    } catch (error) {
      // Fallback
      const newBoard = { ...payload, id: payload.id }; // Mantém ID gerado no front pro mock
      localBoards.push(newBoard);
      return newBoard;
    }
  },

  update: async (board: BoardView): Promise<void> => {
    try {
      await api.put(`/quadros/${board.id}`, board);
    } catch (error) {
      localBoards = localBoards.map(b => b.id === board.id ? board : b);
    }
  },

  // 3. Adicionado: Método Delete
  delete: async (boardId: string): Promise<void> => {
    try {
      await api.delete(`/quadros/${boardId}`);
    } catch (error) {
      localBoards = localBoards.filter(b => b.id !== boardId);
    }
  }
};