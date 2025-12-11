import { useState, useEffect, useMemo } from 'react';
import { CalendarBlank, Trash } from 'phosphor-react';

// Components
import { TopNavigation } from '../components/ui/TopNavigation';
import { GenericTable } from '../components/ui/GenericTable';
import { GenericToolbar } from '../components/ui/GenericToolbar';
import { Pagination } from '../components/ui/Paginacao';
import { CadastroEmprestimo } from '../components/cadastro_emprestimos';
import { useAlert } from '../contexts/AlertContext';

// Services & Types
import { EmprestimosService } from '../services/emprestimosService';
import type { EmprestimoView, ColumnDef } from '../types';

// Styles
import '../styles/paginasTabelas.css';
import '../styles/emprestimos.css';

type FilterStatus = 'todos' | 'atrasados' | 'em_dia';

export function Emprestimos() {
  const [data, setData] = useState<EmprestimoView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useAlert();

  const itemsPerPage = 8;

  useEffect(() => {
    carregarEmprestimos();
  }, []);

  const carregarEmprestimos = async () => {
    setIsLoading(true);
    const resultado = await EmprestimosService.getAll();
    setData(resultado);
    setIsLoading(false);
  };

  // --- AÇÃO DE EXCLUIR ---
  const handleDelete = async (id: string) => {
    const confirmado = await showAlert({
        title: 'Excluir Empréstimo',
        message: 'Tem certeza que deseja excluir este registro de empréstimo?',
        confirmText: 'Sim',
        cancelText: 'Cancelar'
    });

    if (confirmado) {
        await EmprestimosService.delete(id);
        carregarEmprestimos();
    }
  };

  const handleSaveEmprestimo = async (dados: any) => {
    await EmprestimosService.create(dados);
    carregarEmprestimos();
    setIsModalOpen(false);
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
    // Exibindo apenas Devolução para economizar espaço
    { 
      header: 'Data Devolução', 
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
    },
    // --- COLUNA DE AÇÕES (SÓ EXCLUIR) ---
    {
      header: 'Ações',
      className: 'action-cell',
      render: (item) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button 
            className="icon-btn delete" 
            onClick={() => handleDelete(item.id)}
            title="Excluir"
          >
            <Trash size={20} />
          </button>
        </div>
      )
    }
  ];

  // Filtros
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = item.titulo.toLowerCase().includes(term) || item.cpfCliente.includes(term);
      let matchesStatus = true;
      if (filterStatus === 'atrasados') matchesStatus = item.status === 'atrasado';
      else if (filterStatus === 'em_dia') matchesStatus = item.status === 'em_dia';
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="page-container">
      <TopNavigation />

      <div className="action-bar" style={{ marginBottom: 0 }}>
        <h2 className="emprestimos-title">
          <CalendarBlank size={28} weight="duotone" />
          Empréstimos Ativos
        </h2>
      </div>

      <GenericToolbar
        searchTerm={searchTerm}
        onSearchChange={(text) => { setSearchTerm(text); setCurrentPage(1); }}
        newItemLabel="Novo Empréstimo"
        onNewItem={() => setIsModalOpen(true)}
      >
        <div className="filter-tabs-group">
          <button className={`filter-tab-btn ${filterStatus === 'todos' ? 'active' : ''}`} onClick={() => setFilterStatus('todos')}>Todos</button>
          <button className={`filter-tab-btn ${filterStatus === 'atrasados' ? 'active' : ''}`} onClick={() => setFilterStatus('atrasados')}>Atrasados</button>
          <button className={`filter-tab-btn ${filterStatus === 'em_dia' ? 'active' : ''}`} onClick={() => setFilterStatus('em_dia')}>Em dia</button>
        </div>
      </GenericToolbar>

      <div className="table-container">
        <GenericTable 
          data={currentData}
          columns={columns}
          isLoading={isLoading}
          itemsPerPage={itemsPerPage}
          emptyMessage="Nenhum empréstimo encontrado."
        />
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <CadastroEmprestimo 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveEmprestimo}
      />
    </div>
  );
}