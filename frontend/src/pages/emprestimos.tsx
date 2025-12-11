import { useState, useEffect, useMemo } from 'react';

// Components
import { TopNavigation } from '../components/ui/TopNavigation'; // Navegação Superior
import { GenericTable } from '../components/ui/GenericTable';
import { GenericToolbar } from '../components/ui/GenericToolbar';
import { Pagination } from '../components/ui/Paginacao'; // ou Pagination, verifique seu arquivo
import { CadastroEmprestimo } from '../components/cadastro_emprestimos';

// Services & Types
import { EmprestimosService } from '../services/emprestimosService';
import type { EmprestimoView, ColumnDef } from '../types';

// Styles
import '../styles/paginasTabelas.css';
import '../styles/emprestimos.css';

// Tipo para o estado do filtro
type FilterStatus = 'todos' | 'atrasados' | 'em_dia';

export function Emprestimos() {
  // --- ESTADOS ---
  const [data, setData] = useState<EmprestimoView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos'); // <--- NOVO ESTADO
  const [currentPage, setCurrentPage] = useState(1);
  const [isCadastroOpen, setIsCadastroOpen] = useState(false);

  const itemsPerPage = 8;

  // --- CARREGAR DADOS ---
  useEffect(() => {
    carregarEmprestimos();
  }, []);

  const carregarEmprestimos = async () => {
    setIsLoading(true);
    const resultado = await EmprestimosService.getAll();
    setData(resultado);
    setIsLoading(false);
  };

  // --- COLUNAS ---
  const columns: ColumnDef<EmprestimoView>[] = [
    { header: 'Título do Livro', accessor: 'titulo', className: 'text-left' },
    { header: 'ISBN', accessor: 'isbn', className: 'text-left' },
    { 
      header: 'CPF Cliente', 
      className: 'text-left',
      render: (item) => item.cpfCliente.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    },
    { 
      header: 'Data Emissão', 
      className: 'text-center',
      render: (item) => new Date(item.dataEmissao).toLocaleDateString('pt-BR')
    },
    { 
      header: 'Devolução', 
      className: 'text-center',
      render: (item) => new Date(item.dataDevolucao).toLocaleDateString('pt-BR')
    },
    {
      header: 'Status',
      className: 'text-center',
      render: (item) => {
        const isLate = item.status === 'atrasado';
        return (
          <span className={`status-badge ${isLate ? 'status-late' : 'status-ok'}`}>
            {isLate ? 'Atrasado' : 'Em dia'}
          </span>
        );
      }
    }
  ];

  // --- LÓGICA DE FILTRAGEM ---
  const filteredData = useMemo(() => {
    return data.filter(item => {
      // 1. Filtro de Texto (Busca)
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        item.titulo.toLowerCase().includes(term) ||
        item.cpfCliente.includes(term) ||
        item.isbn.includes(term);

      // 2. Filtro de Status (Abas)
      let matchesStatus = true;
      if (filterStatus === 'atrasados') {
        matchesStatus = item.status === 'atrasado';
      } else if (filterStatus === 'em_dia') {
        matchesStatus = item.status === 'em_dia'; // ou item.status !== 'atrasado'
      }

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, data]);

  // --- PAGINAÇÃO ---
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="page-container">
      <TopNavigation />

      <GenericToolbar
        searchTerm={searchTerm}
        onSearchChange={(text) => {
            setSearchTerm(text);
            setCurrentPage(1); 
        }}
        newItemLabel="Novo Empréstimo"
        onNewItem={() => setIsCadastroOpen(true)}
      >
        <div className="filter-tabs-group">
          <button 
            className={`filter-tab-btn ${filterStatus === 'todos' ? 'active' : ''}`}
            onClick={() => { setFilterStatus('todos'); setCurrentPage(1); }}
          >
            Todos
          </button>
          
          <button 
            className={`filter-tab-btn ${filterStatus === 'atrasados' ? 'active' : ''}`}
            onClick={() => { setFilterStatus('atrasados'); setCurrentPage(1); }}
          >
            Atrasados
          </button>
          
          <button 
            className={`filter-tab-btn ${filterStatus === 'em_dia' ? 'active' : ''}`}
            onClick={() => { setFilterStatus('em_dia'); setCurrentPage(1); }}
          >
            Em dia
          </button>
        </div>
      </GenericToolbar>

      <div className="table-container">
        <GenericTable 
          data={currentData}
          columns={columns}
          isLoading={isLoading}
          itemsPerPage={itemsPerPage}
          emptyMessage="Nenhum empréstimo encontrado com os filtros atuais."
        />
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <CadastroEmprestimo 
        isOpen={isCadastroOpen} 
        onClose={() => setIsCadastroOpen(false)} 
      />
    </div>
  );
}