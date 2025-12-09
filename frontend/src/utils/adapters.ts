import type { LivroDB, LivroView, ClienteDB, ClienteView } from '../types';

// Função auxiliar para formatar data (ISO -> DD/MM/AAAA)
function formatDate(dateStr: string | undefined): string {
  if (!dateStr || dateStr === 'NA') return 'NA';
  
  // Tenta criar uma data
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Se der erro, devolve a original
  
  // Formata para pt-BR
  return new Intl.DateTimeFormat('pt-BR').format(date);
}

// Função auxiliar para formatar CPF
function formatCPF(cpf: number): string {
  return String(cpf).padStart(11, '0').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

// --- ADAPTADOR DE LIVRO ---
export function adaptLivro(livro: LivroDB): LivroView {
  return {
    id: livro._id, // Converte _id para id
    titulo: livro.titulo,
    // Converte número para string (resolve o erro do .includes)
    isbn: String(livro.isbn), 
    genero: livro.genero || 'Não informado',
    autor: livro.autor,
    editora: livro.editora || 'Não informada',
    // Formata a data para ficar bonitinha na tabela
    data: formatDate(livro.data_lancamento), 
    // Transforma a string "Disponível" em true/false
    disponivel: livro.disponibilidade === 'Disponível', 
    volume: livro.volume || '-'
  };
}

// --- ADAPTADOR DE CLIENTE ---
export function adaptCliente(cliente: ClienteDB): ClienteView {
  return {
    id: cliente._id,
    nome: cliente.nome,
    // Formata o CPF visualmente e converte para string
    cpf: formatCPF(cliente.cpf), 
    // Padroniza o nome da propriedade para minúsculo
    telefone: cliente.Telefone, 
    ativo: cliente.ativo ?? true, // Se não vier nada, assume ativo
    emprestimosAtivos: cliente.emprestimosAtivos || 0
  };
}