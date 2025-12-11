import type { EmprestimoDB } from '../types';

export const EMPRESTIMOS_MOCK: EmprestimoDB[] = [
  { 
    _id: '1', 
    titulo: 'O Senhor dos Anéis', 
    isbn: 9788533613, 
    cpf_emprestimo: 12345678900, 
    data_emissao: '2023-10-01T10:00:00Z', 
    data_devolucao: '2023-10-15T10:00:00Z' 
  },
  { 
    _id: '2', 
    titulo: 'Dom Quixote', 
    isbn: 9780142437, 
    cpf_emprestimo: 98765432100, 
    data_emissao: '2023-10-05T14:30:00Z', 
    data_devolucao: '2023-10-20T14:30:00Z' 
  },
  { 
    _id: '3', 
    titulo: 'Código Limpo', 
    isbn: 9780132350, 
    cpf_emprestimo: 11122233344, 
    data_emissao: '2023-09-01T09:00:00Z', 
    data_devolucao: '2023-09-10T09:00:00Z' // Data passada = Atrasado no teste
  }
];