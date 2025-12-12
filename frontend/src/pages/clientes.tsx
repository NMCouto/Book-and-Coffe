import { useState, useEffect, useMemo } from 'react';
import { Trash, PencilSimple } from 'phosphor-react';
import { TopNavigation } from '../components/ui/TopNavigation';
import { GenericTable } from '../components/ui/GenericTable';
import { GenericToolbar } from '../components/ui/GenericToolbar';
import { Pagination } from '../components/ui/Paginacao';
import { useAlert } from '../contexts/AlertContext';
import { CadastroCliente } from '../components/cadastro_cliente';

// Services & Types
import { ClientesService } from '../services/clientesService';
import { EmprestimosService } from '../services/emprestimosService';
import type { ClienteView, EmprestimoView, ColumnDef } from '../types';
type FilterType = 'todos' | 'com_emprestimos' | 'sem_emprestimos';

// Styles
import '../styles/paginasTabelas.css';
import '../styles/emprestimos.css'; 

export function Clientes() {
  const { showAlert } = useAlert();
  
  const [clientes, setClientes] = useState<ClienteView[]>([]);
  const [emprestimos, setEmprestimos] = useState<EmprestimoView[]>([]);
  const [filterStatus, setFilterStatus] = useState<FilterType>('todos');
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  const [editingClient, setEditingClient] = useState<ClienteView | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setIsLoading(true);
    try {
      const [listaClientes, listaEmprestimos] = await Promise.all([
        ClientesService.getAll(),
        EmprestimosService.getAll()
      ]);
      //console.log("Lista recarregada:", listaClientes); // Debug
      setClientes(listaClientes);
      setEmprestimos(listaEmprestimos);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNÇÃO DE ABRIR MODAL PARA EDIÇÃO ---
  const handleEdit = (cliente: ClienteView) => {
    setEditingClient(cliente); // Define quem vai ser editado
    setIsModalOpen(true);      // Abre o modal
  };

  // --- FUNÇÃO DE ABRIR MODAL PARA CRIAÇÃO ---
  const handleNew = () => {
    setEditingClient(null); // Limpa edição (é novo)
    setIsModalOpen(true);
  };

  // --- SALVAR (CRIA OU ATUALIZA) ---
  const handleSaveCliente = async (dados: any) => {
    try {
        if (editingClient) {
            // MODO EDIÇÃO
            console.log("Atualizando cliente:", editingClient.id);
            await ClientesService.update(editingClient.id, dados);
        } else {
            // MODO CRIAÇÃO
            console.log("Criando novo cliente");
            await ClientesService.create(dados);
        }
        
        await carregarDados();
        setIsModalOpen(false);
        setEditingClient(null); // Limpa estado após salvar

    } catch (error) {
        console.error("Erro ao salvar:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmado = await showAlert({
        title: 'Excluir Cliente',
        message: 'Tem certeza que deseja excluir este cliente?',
        confirmText: 'Sim',
        cancelText: 'Cancelar'
    });

    if (confirmado) {
        await ClientesService.delete(id);
        carregarDados();
    }
  };

  // Colunas
  const columns: ColumnDef<ClienteView>[] = [
    { header: 'Nome do cliente', accessor: 'nome', className: 'text-left' },
    { header: 'CPF', accessor: 'cpf', className: 'text-left' },
    { header: 'Telefone', accessor: 'telefone', className: 'text-left' },
    { 
      header: 'Status', 
      className: 'text-center',
      render: (cliente) => {
        const emprestimosDoCliente = emprestimos.filter(e => e.cpfCliente === cliente.cpf);
        const possuiAtraso = emprestimosDoCliente.some(e => e.status === 'atrasado');
        
        let statusClass = 'status-ok'; // Verde por padrão
        let texto = 'Regular';

        if (possuiAtraso) {
            statusClass = 'status-late'; // Vermelho
            texto = 'Pendente';
        } else if (emprestimosDoCliente.length === 0) {
            statusClass = 'status-ok';  // cinza
            texto = 'Sem empréstimos';
        }

        return (
          <span className={`status-badge ${statusClass}`}>
            {texto}
          </span>
        );
      }
    },
    {
      header: 'Ações',
      className: 'action-cell',
      render: (item) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {/* BOTÃO EDITAR CONECTADO */}
          <button 
            className="icon-btn edit" 
            title="Editar"
            onClick={() => handleEdit(item)} 
          >
            <PencilSimple size={20} />
          </button>
          
          <button className="icon-btn delete" onClick={() => handleDelete(item.id)} title="Excluir">
            <Trash size={20} />
          </button>
        </div>
      )
    }
  ];

  // --- FILTROS ---
  const filteredData = useMemo(() => {
    return clientes.filter(cliente => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        cliente.nome.toLowerCase().includes(term) || 
        cliente.cpf.includes(term);

      if (!matchesSearch) return false;

      const emprestimosDoCliente = emprestimos.filter(e => e.cpfCliente === cliente.cpf);
      const temAtivos = emprestimosDoCliente.length > 0;

      if (filterStatus === 'com_emprestimos') return temAtivos;
      if (filterStatus === 'sem_emprestimos') return !temAtivos;

      return true; // 'todos'
    });
  }, [clientes, emprestimos, searchTerm, filterStatus]);

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

      <GenericToolbar 
        searchTerm={searchTerm} 
        onSearchChange={(t) => { setSearchTerm(t); setCurrentPage(1); }} 
        newItemLabel="Novo Cliente" 
        onNewItem={handleNew}
      >
        <div className="filter-tabs-group">
          <button 
            className={`filter-tab-btn ${filterStatus === 'todos' ? 'active' : ''}`} 
            onClick={() => { setFilterStatus('todos'); setCurrentPage(1); }}
          >
            Todos
          </button>
          <button 
            className={`filter-tab-btn ${filterStatus === 'com_emprestimos' ? 'active' : ''}`} 
            onClick={() => { setFilterStatus('com_emprestimos'); setCurrentPage(1); }}
          >
            Com Empréstimos
          </button>
          <button 
            className={`filter-tab-btn ${filterStatus === 'sem_emprestimos' ? 'active' : ''}`} 
            onClick={() => { setFilterStatus('sem_emprestimos'); setCurrentPage(1); }}
          >
            Sem Empréstimos
          </button>
        </div>
      </GenericToolbar>

      <div className="table-container">
        <GenericTable 
          data={currentData} 
          columns={columns} 
          isLoading={isLoading} 
          itemsPerPage={itemsPerPage} 
          emptyMessage="Nenhum cliente encontrado."
        />
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

      <CadastroCliente 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingClient(null); }}
        onSave={handleSaveCliente}
        clienteParaEditar={editingClient} // Passa o cliente selecionado
      />
    </div>
  );
}