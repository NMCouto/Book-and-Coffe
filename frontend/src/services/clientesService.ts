import { api } from './api';
import type { ClienteView, ClienteInput } from '../types';
import { adaptCliente } from '../utils/adapters';
import { CLIENTES_MOCK } from '../mocks/clientesMocks';

// Banco em memória
let clientesLocal = [...CLIENTES_MOCK];

export const ClientesService = {
  getAll: async (): Promise<ClienteView[]> => {
    try {
      const response = await api.get('/clientes', { timeout: 2000 });
      return response.data.map(adaptCliente);
    } catch (error) {
      console.log("🔄 Backend Offline. Lendo clientes da memória.");
      return clientesLocal.map(adaptCliente);
    }
  },

  // CORREÇÃO AQUI: Substituímos 'any' por 'ClienteInput'
  create: async (novo: ClienteInput): Promise<void> => {
    
    // 1. PREPARAR O PAYLOAD (Adapter Reverso: Front -> Back)
    const payload = {
        nome: novo.nome,
        // Usamos String() para garantir que .replace funcione mesmo se vier number
        cpf: Number(String(novo.cpf).replace(/\D/g, '')), 
        
        // O Backend espera chaves com Letra Maiúscula conforme seu Schema
        Telefone: novo.Telefone, // O input já deve vir com o nome certo ou mapeamos aqui
        DataNasc: novo.DataNasc,
        CEP: novo.CEP ? Number(String(novo.CEP).replace(/\D/g, '')) : undefined
    };

    try {
      await api.post('/clientes', payload);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Salvando no Mock.");
      
      const novoMock = { 
        _id: Math.random().toString(36).substr(2, 9), 
        ...payload, 
        emprestimosAtivos: 0
      };
      
      // @ts-ignore
      clientesLocal.push(novoMock);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error) {
      clientesLocal = clientesLocal.filter(c => c._id !== id && c.id !== id);
    }
  }
};