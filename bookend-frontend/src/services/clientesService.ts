import { api } from './api';
import type { ClienteView, ClienteInput } from '../types';
import { adaptCliente } from '../utils/adapters';
import { CLIENTES_MOCK } from '../mocks/clientesMocks';

export const ClientesService = {
  getAll: async (): Promise<ClienteView[]> => {
    try {
      const response = await api.get('/clientes', { timeout: 2000 });
      return response.data.map(adaptCliente);
    } catch (error) {
      console.warn("⚠️ Backend Offline ou indisponível. Usando Mocks de Clientes.");
      // Retorna o Mock adaptado
      return CLIENTES_MOCK.map(adaptCliente);
    }
  },

  create: async (novoCliente: ClienteInput): Promise<void> => {
    try {
      await api.post('/clientes', novoCliente);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Cliente simulado.");
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error) {
      console.warn(`⚠️ Backend Offline. Delete simulado para ID: ${id}`);
    }
  }
};