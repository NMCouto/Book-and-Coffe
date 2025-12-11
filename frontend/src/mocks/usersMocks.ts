import type { User } from '../types';

// Mock inicial com 1 gerente e 1 funcionário
export const USERS_MOCK: User[] = [
  { username: 'admin', password: '123', role: 'gerente', name: 'Gerente Geral' },
  { username: 'user', password: '123', role: 'funcionario', name: 'Funcionário Padrão' }
];