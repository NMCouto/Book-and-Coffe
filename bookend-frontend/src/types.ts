// ==========================================
// TIPOS GERAIS DO MONGODB
// ==========================================
export interface MongoDocument {
  _id: string;
  __v?: number;
}

// ==========================================
// TIPOS RAW (DO BANCO DE DADOS)
// Use estes tipos nos Serviços/API e nos Mocks brutos
// ==========================================

export interface ClienteDB extends MongoDocument {
  cpf: number;         
  nome: string;
  Telefone: string;      
  DataNasc?: string;     
  CEP?: number;
  ativo?: boolean;       
  emprestimosAtivos?: number; 
}

export interface LivroDB extends MongoDocument {
  isbn: number;          
  titulo: string;
  genero?: string;
  autor: string;
  editora?: string;
  data_lancamento: string; // ISO Date String (ex: "2023-10-25T...")
  volume?: number;
  disponibilidade: string; // "Disponível" | "Indisponível"
}

export interface EmprestimoDB extends MongoDocument {
  titulo: string;
  isbn: number;
  cpf_emprestimo: number;
  data_emissao: string;
  data_devolucao: string;
}

export interface CardDB extends MongoDocument {
  title: string;
  comment: string;
  priority: 'low' | 'medium' | 'high';
  columnId: 'todo' | 'doing' | 'done';
  createdAt: string;
}

// ==========================================
// TIPOS VIEW (PARA O FRONTEND/TELAS)
// Use estes tipos nas páginas (Livros.tsx, Clientes.tsx)
// Eles já passaram pelo Adaptador e estão limpinhos
// ==========================================

export interface ClienteView {
  id: string;
  nome: string;
  cpf: string;           // Formatado (ex: "123.456.789-00")
  telefone: string;      // Padronizado minúsculo
  ativo: boolean;
  emprestimosAtivos: number;
}

export interface LivroView {
  id: string;
  titulo: string;
  isbn: string;          // String para facilitar busca (.includes)
  genero: string;        // Se for null, o adaptador põe "Não informado"
  autor: string;
  editora: string;
  data: string;          // Formatada PT-BR (ex: "25/10/2023")
  disponivel: boolean;   // Booleano é melhor para ifs
  volume: number | string;
}

// ==========================================
// TIPOS DE INPUT (PARA FORMULÁRIOS)
// Use estes tipos nos Modais de Cadastro (antes de ter _id)
// ==========================================

export type ClienteInput = Omit<ClienteDB, '_id' | '__v' | 'ativo' | 'emprestimosAtivos'>;
export type LivroInput = Omit<LivroDB, '_id' | '__v'>;
export type CardInput = Omit<CardDB, '_id' | '__v' | 'createdAt'>;

// ==========================================
// TIPOS DE FILTRO (UI STATE)
// Use no Modal de Filtro Avançado
// ==========================================

export interface AdvancedFilterState {
  genres: string[];
  authors: string[];
  publishers: string[];
  startDate: Date | null;
  endDate: Date | null;
}