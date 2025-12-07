import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, PencilSimple, Trash } from 'phosphor-react';
import '../styles/paginasTabelas.css';
import { CadastroCliente } from '../components/cadastro_cliente';
import { Pagination } from '../components/ui/Paginacao';
import { adaptCliente } from '../utils/adapters';
import { CLIENTES_MOCK } from '../mocks/clientesMocks'
import type { ClienteView } from '../types';


const ITEMS_PER_PAGE = 11;

export function Clientes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'ativos' | 'N ativos'>('todos');
  const [currentPage, setCurrentPage] = useState(1);

  const clientesData: ClienteView[] = CLIENTES_MOCK.map(adaptCliente);

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
      
      <div className="tabs-container">
        <Link to="/clientes" className="tab-button active">Clientes</Link>
        <Link to="/livros" className="tab-button">Livros</Link>
      </div>

      <div className="action-bar">
        {/* Grupo Pesquisa + Filtro */}
        <div className="search-filter-group">
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Procurar um cliente (Nome ou CPF)" 
              className="search-input"
              value={searchTerm} // Conecta ao estado
              onChange={(e) => setSearchTerm(e.target.value)} // Atualiza o estado
            />
            <MagnifyingGlass size={18} className="search-icon" />
          </div>

           <div className="status-toggle-group">
            <button 
              className={`status-toggle-btn ${filterStatus === 'todos' ? 'active' : ''}`}
              onClick={() => setFilterStatus('todos')}
            >
              Todos
            </button>
            <button 
              className={`status-toggle-btn ${filterStatus === 'ativos' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ativos')}
            >
              Com Empréstimos Ativos
            </button>
            <button 
              className={`status-toggle-btn ${filterStatus === 'N ativos' ? 'active' : ''}`}
              onClick={() => setFilterStatus('N ativos')}
            >
              Sem Empréstimos Ativos
            </button>
          </div>
        </div>
        
        <button className="btn-solid" onClick={() => setIsModalOpen(true)} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          Novo Cliente <Plus size={16} weight="bold" />
        </button>
        
        <button className="btn-solid" onClick={() => setIsModalOpen(true)} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
          Novo Cliente <Plus size={16} weight="bold" />
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome do cliente</th>
              <th className="text-center">CPF</th>
              <th className="text-center">Telefone</th>
              <th className="text-center">Num. Empréstimos</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* 4. Map atualizado para 'currentClientes' */}
            {clientesAtuais.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td className="text-center">{cliente.cpf}</td>
                <td className="text-center">{cliente.telefone}</td>
                <td className="text-center">{cliente.emprestimosAtivos}</td>
                <td className="text-center">
                  <div className="action-cell">
                    <button className="icon-btn edit"><PencilSimple size={20} /></button>
                    <button className="icon-btn delete"><Trash size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Linhas vazias para manter altura fixa (opcional, mas recomendado) */}
            {Array.from({ length: ITEMS_PER_PAGE - clientesAtuais.length }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={5}>&nbsp;</td>
                </tr>
            ))}

            {clientesAtuais.length === 0 && totalItems === 0 && (
               <tr>
                 <td colSpan={5} style={{textAlign: 'center', padding: 20, color: '#666'}}>
                   Nenhum cliente encontrado.
                 </td>
               </tr>
            )}
          </tbody>
        </table>

        {/* 5. Componente de Paginação */}
        <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
        />
      </div>

      <CadastroCliente isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}