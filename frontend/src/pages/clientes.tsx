import { useState, useEffect, useMemo } from 'react';
import { PencilSimple, Trash } from 'phosphor-react';
import '../styles/paginasTabelas.css';

// --- Componentes Genéricos ---
import { GenericToolbar } from '../components/ui/GenericToolbar';
import { GenericTable } from '../components/ui/GenericTable';
import { Pagination } from '../components/ui/Paginacao'; 

// --- Específicos ---
import { TopNavigation } from '../components/ui/TopNavigation';
import { CadastroCliente } from '../components/cadastro_cliente';
import { ClientesService } from '../services/clientesService';
import type { ClienteView, ColumnDef } from '../types';

const ITEMS_PER_PAGE = 11;

export function Clientes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativos' | 'N ativos'>('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientesData, setClientesData] = useState<ClienteView[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para Carregar Dados (Backend ou Mock)
  async function loadClientes() {
    try {
      setIsLoading(true);
      const dados = await ClientesService.getAll(); // O Serviço já traz adaptado!
      setClientesData(dados);
    } catch (error) {
      console.error("Erro ao carregar clientes", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Carrega ao abrir a tela
  useEffect(() => {
    loadClientes();
  }, []);

  // Função de Deletar
  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      await ClientesService.delete(id);
      loadClientes(); // Recarrega a lista para atualizar a tabela
    }
  }

  // --- CONFIGURAÇÃO DAS COLUNAS (A parte que especializa a tabela) ---
  const columns = useMemo<ColumnDef<ClienteView>[]>(() => [
    { header: 'Nome do cliente', accessor: 'nome' },
    { header: 'CPF', accessor: 'cpf', className: 'text-center' },
    { header: 'Telefone', accessor: 'telefone', className: 'text-center' },
    { header: 'Num. Empréstimos', accessor: 'emprestimosAtivos', className: 'text-center' },
    {
      header: 'Ações',
      className: 'text-center',
      render: (cliente) => (
        <div className="action-cell">
           <button className="icon-btn edit"><PencilSimple size={20} /></button>
           <button className="icon-btn delete" onClick={() => handleDelete(cliente.id)}>
             <Trash size={20} />
           </button>
        </div>
      )
    }
  ], []); // Array vazio no final garante que a config não seja recriada à toa

  // Lógica de Filtragem (Nome OU CPF)
  const clientesFiltrados = clientesData.filter((cliente) => {
    // Converte tudo para minúsculo para a busca não diferenciar maiúsculas
    const searchLower = searchTerm.toLowerCase();

    // --- Filtro de Status ---
    let matchStatus = true;
    if (filterStatus === 'ativos') {
      matchStatus = cliente.ativo === true;
    } else if (filterStatus === 'N ativos') {
      matchStatus = cliente.ativo === false;
    }
    // Se for 'todos', matchStatus continua true
    
    return (
      cliente.nome.toLowerCase().includes(searchLower) || 
      cliente.cpf.includes(searchTerm)
    ) && matchStatus;
  });

  // LÓGICA DE FATIAMENTO (Slice)
  const totalItems = clientesFiltrados.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  const clientesAtuais = clientesFiltrados.slice(startIndex, endIndex);

  // COMANDOS DE TECLADO (Igual ao Livros)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se o usuário estiver digitando no input de busca
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === 'ArrowLeft') {
        setCurrentPage(prev => Math.max(prev - 1, 1));
      } 
      else if (e.key === 'ArrowRight') {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages]); 

  // Resetar para página 1 se pesquisar algo
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="page-container">

      <TopNavigation />

      {/* Toolbar Genérica + Filtros Específicos */}
      <GenericToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewItem={() => setIsModalOpen(true)}
        newItemLabel="Novo Cliente"
      >
         {/* INJEÇÃO DE CONTEÚDO ESPECÍFICO DE CLIENTES */}
         <div className="status-toggle-group">
            <button className={`status-toggle-btn ${filterStatus === 'todos' ? 'active' : ''}`} onClick={() => setFilterStatus('todos')}>Todos</button>
            <button className={`status-toggle-btn ${filterStatus === 'ativos' ? 'active' : ''}`} onClick={() => setFilterStatus('ativos')}>Com Empréstimos</button>
            <button className={`status-toggle-btn ${filterStatus === 'N ativos' ? 'active' : ''}`} onClick={() => setFilterStatus('N ativos')}>Sem Empréstimos</button>
         </div>
      </GenericToolbar>

      <div className="table-container">
        {/* Tabela Genérica configurada com as colunas de Cliente */}
        <GenericTable 
          data={clientesAtuais}
          columns={columns}
          isLoading={isLoading}
          itemsPerPage={ITEMS_PER_PAGE}
        />

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CadastroCliente isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); loadClientes(); }} />
    </div>
  );
}