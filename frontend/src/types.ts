// ==========================================
// TIPOS GERAIS
// ==========================================
export interface MongoDocument {
  _id: string;
  __v?: number;
}

export type ColumnId = string;

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
  comment?: string;
  priority: 'low' | 'medium' | 'high';
  columnId: string;
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

export interface EmprestimoView {
  id: string;
  titulo: string;
  isbn: string;
  cpfCliente: string;
  dataEmissao: string;
  dataDevolucao: string;
  status: 'em_dia' | 'atrasado'; // Campo calculado pelo adapter
}

// --- KANBAN CUSTOMIZÁVEL ---


export interface BoardView {
  id: string;
  title: string;
  columns: KanbanColumnData[];
}

export interface CardView {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  columnId: string;
  comment?: string;

  dueDate?: string; // Data de devolução
  cpf?: string;     // CPF do cliente
  isLate?: boolean; // Se está atrasado (para mostrar a tag vermelha)
}
// Atualizamos a coluna para não ter ID fixo ('todo', 'doing')
// Estrutura Visual do Quadro (Colunas contendo listas de Cards)
export interface KanbanColumnData {
  id: string; // Agora é um UUID (ex: "col-1234")
  title: string;
  color?: string; // Para personalização visual
  cards: CardView[];
}

// ==========================================
// TIPOS DE INPUT (PARA FORMULÁRIOS)
// Use estes tipos nos Modais de Cadastro (antes de ter _id)
// ==========================================

export type ClienteInput = Omit<ClienteDB, '_id' | '__v' | 'ativo' | 'emprestimosAtivos'>;
export type LivroInput = Omit<LivroDB, '_id' | '__v'>;
export type CardInput = Omit<CardDB, '_id' | '__v' | 'createdAt'>;

export interface EmprestimoInput {
  titulo: string;
  isbn: string | number;
  cpf_emprestimo: string | number;
  data_emissao: Date | string;
  data_devolucao: Date | string;
}

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

// T = Tipo do dado (Ex: ClienteView ou LivroView)
export interface ColumnDef<T> {
  header: string;           // O título da coluna (Ex: "Nome")
  accessor?: keyof T;       // A chave do dado (Ex: "nome") - opcional se usar render
  render?: (item: T) => React.ReactNode; // Função para desenhar algo customizado (botões, checkbox)
  className?: string;       // Classes extras (Ex: "text-center")
}