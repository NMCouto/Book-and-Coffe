import { api } from './api';
import type { ClienteView, ClienteInput } from '../types';
import { adaptCliente } from '../utils/adapters';
import { CLIENTES_MOCK } from '../mocks/clientesMocks';

// Banco em memória (Estado local do frontend enquanto BD estiver off)
let clientesLocal = [...CLIENTES_MOCK];

export const ClientesService = {
  
  // --- LISTAR ---
  getAll: async (): Promise<ClienteView[]> => {
    try {
      const response = await api.get('/clientes', { timeout: 2000 });
      return response.data.map(adaptCliente);
    } catch (error) {
      // console.log("🔄 Backend Offline. Lendo clientes da memória.");
      return clientesLocal.map(adaptCliente);
    }
  },

  // --- CRIAR ---
  create: async (novo: ClienteInput): Promise<void> => {
    // Adapter Reverso: Transforma dados do Form (minúsculo) para o Banco (Maiúsculo/Number)
    const payload = {
        nome: novo.nome,
        // Limpa formatação do CPF e garante Number
        cpf: Number(String(novo.cpf).replace(/\D/g, '')), 
        
        // Mapeia chaves: form.telefone -> db.Telefone
        Telefone: novo.telefone, 
        DataNasc: novo.dataNasc,
        CEP: novo.cep ? Number(String(novo.cep).replace(/\D/g, '')) : undefined
    };

    try {
      await api.post('/clientes', payload);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Criando no Mock.");
      
      const novoMock = { 
        _id: Math.random().toString(36).substr(2, 9), 
        ...payload, // Salva no mock com a estrutura do banco (Telefone, etc) para o adapter ler certo depois
        emprestimosAtivos: 0
      };
      
      // @ts-ignore
      clientesLocal.push(novoMock);
    }
  },

  // --- ATUALIZAR (NOVO) ---
  update: async (id: string, dados: ClienteInput): Promise<void> => {
    // Mesma lógica de mapeamento do create
    const payload = {
        nome: dados.nome,
        cpf: Number(String(dados.cpf).replace(/\D/g, '')), 
        Telefone: dados.telefone, 
        DataNasc: dados.dataNasc,
        CEP: dados.cep ? Number(String(dados.cep).replace(/\D/g, '')) : undefined
    };

    try {
      await api.put(`/clientes/${id}`, payload);
    } catch (error) {
      console.warn("⚠️ Backend Offline. Atualizando Mock.");
      
      // Atualiza o item correspondente na lista em memória
      clientesLocal = clientesLocal.map(c => {
         // Verifica ID (compatibilidade com _id do mongo ou id do mock)
         if (c._id === id || c.id === id) {
             return {
                 ...c, // Mantém campos antigos (ex: id)
                 ...payload, // Sobrescreve com os novos dados formatados
                 // Opcional: garantir que cpf vire string no mock se o adapter local esperar string,
                 // mas o adapter geralmente trata. Aqui salvamos igual ao banco (Number).
             };
         }
         return c;
      });
    }
  },

  // --- EXCLUIR ---
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/clientes/${id}`);
    } catch (error) {
      // Remove da memória
      clientesLocal = clientesLocal.filter(c => c._id !== id && c.id !== id);
    }
  }
};