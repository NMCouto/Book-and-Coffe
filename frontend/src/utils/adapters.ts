import type { ClienteView, LivroView, EmprestimoView, CardView } from '../types';

// --- CLIENTE ---
// O Schema usa: cpf (Number), nome, Telefone, DataNasc, CEP
export const adaptCliente = (data: any): ClienteView => {
  return {
    id: data._id || data.id || Math.random().toString(),
    nome: data.nome,
    // Converte Number do BD para String e garante zeros à esquerda se precisar (ex: CPF)
    cpf: String(data.cpf || '').padStart(11, '0'), 
    // Mapeia Maiúsculas do BD para camelCase do Front
    telefone: data.Telefone || data.telefone || '',
    dataNasc: data.DataNasc ? new Date(data.DataNasc).toLocaleDateString('pt-BR') : '',
    cep: String(data.CEP || ''),
    
    // Campo calculado no front (não vem do BD neste schema)
    emprestimosAtivos: 0 
  };
};

// --- LIVRO ---
// O Schema usa: isbn (Number), titulo, genero, data_lancamento, editora, autor, volume, disponibilidade (String)
export const adaptLivro = (data: any): LivroView => {
  return {
    id: data._id || data.id,
    titulo: data.titulo,
    autor: data.autor,
    genero: data.genero || '',
    isbn: String(data.isbn || ''),
    editora: String(data.editora),
    data: data.data_lancamento || new Date().toISOString(),   
    // Lógica: Se a string for "Disponível", é true.
    disponivel: data.disponibilidade === 'Disponível',
    volume: data.volume || ''
  };
};

// --- EMPRÉSTIMO ---
// O Schema usa: titulo, isbn, cpf_emprestimo, data_emissao, data_devolucao, status, comentario
export const adaptEmprestimo = (data: any): EmprestimoView => {
  return {
    id: data._id || data.id,
    titulo: data.titulo,
    isbn: String(data.isbn || ''),
    // Traduz o nome do campo do BD para o do Front
    cpfCliente: String(data.cpf_emprestimo || '').padStart(11, '0'),
    
    dataEmissao: data.data_emissao || new Date().toISOString(),
    dataDevolucao: data.data_devolucao || '',
    
    // Se o backend já der o status calculado ou string, usamos. 
    // Se não, calculamos no front com base na data.
    status: calcularStatus(data.data_devolucao, data.status),
    
    comentario: data.comentario
  };
};

// --- CARD (KANBAN) ---
// O Schema usa: title, comment, priority, columnId, createdAt
export const adaptCard = (data: any): CardView => {
  return {
    id: data._id || data.id,
    title: data.title,
    priority: data.priority || 'low',
    columnId: data.columnId,
    comment: data.comment,
    // Formata a data de criação se necessário
    createdAt: data.createdAt ? new Date(data.createdAt).toLocaleDateString('pt-BR') : undefined
  };
};

// --- AUXILIARES ---

function calcularStatus(dataDevolucao: string | Date, statusBackend?: string): 'em_dia' | 'atrasado' {
  // Se o backend retornou explicitamente "Atrasado", confiamos nele
  if (statusBackend === 'Atrasado') return 'atrasado';
  
  if (!dataDevolucao) return 'em_dia';
  
  const hoje = new Date();
  const devolucao = new Date(dataDevolucao);
  
  // Zera as horas para comparar apenas o dia
  hoje.setHours(0,0,0,0);
  devolucao.setHours(0,0,0,0);

  return devolucao < hoje ? 'atrasado' : 'em_dia';
}