// --- KANBAN (Card) ---
export type ColumnId = string;

export interface CardView {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  columnId: string;
  comment?: string;
  createdAt?: string;
  
  // Campos opcionais para visualização de empréstimo no Kanban
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
export interface ClienteInput {
  nome: string;
  cpf: number | string; // O BD pede Number, mas o input é string. O adapter trata.
  Telefone: string;     // No BD está Maiúsculo
  DataNasc?: string;    // No BD está Maiúsculo
  CEP?: number | string;// No BD está Maiúsculo
}

export interface ClienteView {
  id: string;
  nome: string;
  cpf: string;          // No front usamos string formatada
  telefone: string;
  dataNasc?: string;
  cep?: string;
  // Esses campos não existem no Schema do BD, mas usamos na lógica do front (status)
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

// --- EMPRÉSTIMOS ---
export interface EmprestimoInput {
  titulo: string;
  isbn: number | string;
  cpf_emprestimo: number | string; // Nome exato do BD para o envio
  data_emissao?: string;
  data_devolucao?: string;
  comentario?: string;
  status?: string;
}

export interface EmprestimoView {
  id: string;
  titulo: string;
  isbn: string;
  cpfCliente: string;   // Mapeado de 'cpf_emprestimo'
  dataEmissao: string;  // Mapeado de 'data_emissao'
  dataDevolucao: string;// Mapeado de 'data_devolucao'
  status: 'em_dia' | 'atrasado' | 'pendente';
  comentario?: string;
}

// Definição genérica para colunas de tabela
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