import { useState, useEffect, useMemo } from 'react';
import { Trash, PencilSimple } from 'phosphor-react';
import { TopNavigation } from '../components/ui/TopNavigation';
import { GenericTable } from '../components/ui/GenericTable';
import { GenericToolbar } from '../components/ui/GenericToolbar';
import { Pagination } from '../components/ui/Paginacao';
import { CadastroEmprestimo } from '../components/cadastro_emprestimos';
import { EditLoanModal } from '../components/emprestimo/editEmpreModal';
import { useAlert } from '../contexts/AlertContext';

import { EmprestimosService } from '../services/emprestimosService';
import type { EmprestimoView, ColumnDef } from '../types';
import '../styles/paginasTabelas.css';
import '../styles/emprestimos.css';

type FilterStatus = 'todos' | 'atrasados' | 'em_dia' | 'devolvido';

export function Emprestimos() {
  const { showAlert } = useAlert();
  
  const [data, setData] = useState<EmprestimoView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<EmprestimoView | null>(null);

  const itemsPerPage = 8;

  useEffect(() => { carregarEmprestimos(); }, []);

  const carregarEmprestimos = async () => {
    setIsLoading(true);
    const resultado = await EmprestimosService.getAll();
    setData(resultado);
    setIsLoading(false);
  };

  const handleNew = () => setIsCreateOpen(true);

  const handleEdit = (item: EmprestimoView) => {
    setSelectedLoan(item);
    setIsEditOpen(true);
  };

  // --- LÓGICA DE SALVAR (Com Tratamento de Erro) ---
  const handleSaveNew = async (dados: any) => {
    try {
        await EmprestimosService.create(dados);
        await carregarEmprestimos();
        // Não fechamos aqui, deixamos o modal fechar sozinho se não der erro
    } catch (error: any) {
        // MOSTRA O AVISO DE LIVRO INDISPONÍVEL
        showAlert({
            title: 'Atenção',
            message: error.message || 'Erro ao realizar empréstimo.',
            type: 'alert'
        });
        throw error; // Lança o erro para o Modal saber que falhou
    }
  };

  const handleSaveUpdate = async (id: string, updates: any) => {
    try {
        await EmprestimosService.update(id, updates);
        await carregarEmprestimos();
        setIsEditOpen(false);
        setSelectedLoan(null);
    } catch (error) {
        console.error(error);
    }
  };

  // ... (handleDelete e Colunas permanecem iguais) ...
  const handleDelete = async (item: EmprestimoView) => {
    if (item.status !== 'devolvido') {
        showAlert({ title: 'Ação Bloqueada', message: 'Apenas empréstimos devolvidos podem ser excluídos.', type: 'alert' });
        return;
    }
    if (await showAlert({ title: 'Excluir Histórico', message: 'Tem certeza que deseja apagar este registro?', confirmText: 'Sim', cancelText: 'Cancelar' })) {
        await EmprestimosService.delete(item.id);
        carregarEmprestimos();
    }
  };

  const columns: ColumnDef<EmprestimoView>[] = [
    { header: 'Título do Livro', accessor: 'titulo', className: 'text-left' },
    { header: 'ISBN', accessor: 'isbn', className: 'text-left' },
    { header: 'CPF Cliente', className: 'text-left', render: (item) => item.cpfCliente.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") },
    { header: 'Data Devolução', className: 'text-center', render: (item) => new Date(item.dataDevolucao).toLocaleDateString('pt-BR') },
    {
      header: 'Status',
      className: 'text-center',
      render: (item) => {
        let badgeClass = 'status-ok'; 
        let label = 'Em dia';
        switch (item.status) {
            case 'atrasado': badgeClass = 'status-late'; label = 'Atrasado'; break;
            case 'devolvido': badgeClass = 'status-neutral'; label = 'Devolvido'; break;
            case 'em_dia': default: badgeClass = 'status-ok'; label = 'Em dia'; break;
        }
        return <span className={`status-badge ${badgeClass}`}>{label}</span>;
      }
    },
    {
      header: 'Ações',
      className: 'action-cell',
      render: (item) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="icon-btn edit" onClick={() => handleEdit(item)}><PencilSimple size={20} /></button>
          <button className="icon-btn delete" onClick={() => handleDelete(item)}><Trash size={20} /></button>
        </div>
      )
    }
  ];

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = item.titulo.toLowerCase().includes(term) || item.cpfCliente.includes(term);
      let matchesStatus = true;
      if (filterStatus === 'atrasados') matchesStatus = (item.status === 'atrasado');
      else if (filterStatus === 'em_dia') matchesStatus = (item.status === 'em_dia');
      else if (filterStatus === 'devolvido') matchesStatus = (item.status === 'devolvido');
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') setCurrentPage(p => Math.max(p - 1, 1));
      if (e.key === 'ArrowRight') setCurrentPage(p => Math.min(p + 1, totalPages));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]);

  return (
    <div className="page-container">
      <TopNavigation />
      <GenericToolbar searchTerm={searchTerm} onSearchChange={(text) => { setSearchTerm(text); setCurrentPage(1); }} newItemLabel="Novo Empréstimo" onNewItem={handleNew}>
        <div className="filter-tabs-group">
          <button className={`filter-tab-btn ${filterStatus === 'todos' ? 'active' : ''}`} onClick={() => setFilterStatus('todos')}>Todos</button>
          <button className={`filter-tab-btn ${filterStatus === 'atrasados' ? 'active' : ''}`} onClick={() => setFilterStatus('atrasados')}>Atrasados</button>
          <button className={`filter-tab-btn ${filterStatus === 'em_dia' ? 'active' : ''}`} onClick={() => setFilterStatus('em_dia')}>Em dia</button>
          <button className={`filter-tab-btn ${filterStatus === 'devolvido' ? 'active' : ''}`} onClick={() => setFilterStatus('devolvido')}>Devolvidos</button>
        </div>
      </GenericToolbar>
      <div className="table-container">
        <GenericTable data={currentData} columns={columns} isLoading={isLoading} itemsPerPage={itemsPerPage} emptyMessage="Nenhum empréstimo encontrado." />
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      
      {/* ATUALIZADO: Passamos handleSaveNew */}
      <CadastroEmprestimo 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSave={handleSaveNew}
      />
      <EditLoanModal isOpen={isEditOpen} onClose={() => { setIsEditOpen(false); setSelectedLoan(null); }} loan={selectedLoan} onSave={handleSaveUpdate} />
    </div>
  );
}