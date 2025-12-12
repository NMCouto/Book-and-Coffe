// --- KANBAN (Card) ---
export type ColumnId = string;

export interface CardView {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  columnId: string;
  comment?: string;
  createdAt?: string;
  
  dueDate?: string;
  cpf?: string;
  isLate?: boolean;
}

export interface KanbanColumnData {
  id: string;
  title: string;
  color?: string;
  cards: CardView[];
}

export interface BoardView {
  id: string;
  title: string;
  columns: KanbanColumnData[];
}

// --- CLIENTES ---

// O Input segue o padrão do formulário (camelCase)
export interface ClienteInput {
  nome: string;
  cpf: number | string;
  telefone: string;      // O formulário envia minúsculo
  dataNasc?: string;     // O formulário envia minúsculo
  cep?: number | string; // O formulário envia minúsculo
  
  // Opcionais para compatibilidade com backend direto se necessário
  Telefone?: string;
  DataNasc?: string;
  CEP?: number | string;
}

export interface ClienteView {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  dataNasc?: string;
  cep?: string;
  emprestimosAtivos?: number; 
}

// --- LIVROS ---
export interface LivroInput {
  titulo: string;
  autor: string;
  isbn: number | string;
  genero?: string;
  editora?: string;
  volume?: number;
  data_lancamento?: string;
  disponivel?: boolean;
}

export interface LivroView {
  id: string;
  titulo: string;
  autor: string;
  editora: string,
  isbn: string;
  genero: string;
  data: string;
  volume: string;
  disponivel: boolean;
}

// --- EMPRÉSTIMOS ---
export interface EmprestimoInput {
  titulo: string;
  isbn: number | string;
  cpf_emprestimo: number | string;
  data_emissao?: string;
  data_devolucao?: string;
  comentario?: string;
  status?: string;
}

export interface EmprestimoView {
  id: string;
  titulo: string;
  isbn: string;
  cpfCliente: string;
  dataEmissao: string;
  dataDevolucao: string;
  status: 'em_dia' | 'atrasado' | 'pendente' | 'devolvido';
  comentario?: string;
}

// Genérico para tabelas
export interface ColumnDef<T> {
  header: string;
  accessor?: keyof T;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

// tipo para uso nos filtros avançados do livro
export interface AdvancedFilterState {
  genres: string[];
  authors: string[];
  publishers: string[];
  startDate: Date | null;
  endDate: Date | null;
}