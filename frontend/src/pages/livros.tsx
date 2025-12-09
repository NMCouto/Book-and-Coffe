import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PencilSimple, Trash, Faders } from 'phosphor-react';
import '../styles/paginasTabelas.css'; 

// --- Componentes Genéricos ---
import { Pagination } from '../components/ui/Paginacao';
import { GenericTable } from '../components/ui/GenericTable';
import { GenericToolbar } from '../components/ui/GenericToolbar';

// Tipos e Utilitários
import type { AdvancedFilterState, LivroView, ColumnDef } from '../types';
import { parseBookDate } from '../utils/validator';

// --- Específicos ---
import { LivrosService } from '../services/livrosService';
import { CadastroLivro } from '../components/cadastro_livros';
import { ModalFiltrarLivro } from '../components/filtrarLivro';

const ITEMS_PER_PAGE = 11;

export function Livros() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [livrosData, setLivrosData] = useState<LivroView[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<'todos' | 'disponiveis' | 'indisponiveis'>('todos');
  
  const [activeFilters, setActiveFilters] = useState<AdvancedFilterState>({
    genres: [], authors: [], publishers: [], startDate: null, endDate: null
  });

  // --- SERVIÇOS (Busca e Delete) ---
  async function loadLivros() {
    try {
      setIsLoading(true);
      const dados = await LivrosService.getAll();
      setLivrosData(dados);
    } catch (error) {
      alert("Erro ao carregar livros.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Tem certeza que deseja excluir este livro?")) {
       await LivrosService.delete(id);
       loadLivros(); 
    }
  }

  useEffect(() => { loadLivros(); }, []);

  // --- DEFINIÇÃO DAS COLUNAS (Especialização da GenericTable) ---
  const columns = useMemo<ColumnDef<LivroView>[]>(() => [
    { header: 'Título', accessor: 'titulo' },
    { header: 'ISBN', accessor: 'isbn', className: 'text-center' },
    { header: 'Gênero', accessor: 'genero', className: 'text-center' },
    { 
      header: 'Ações', 
      className: 'text-center',
      render: (livro) => (
        <div className="action-cell">
           <button className="icon-btn edit" title="Editar"><PencilSimple size={20} /></button>
           <button className="icon-btn delete" onClick={() => handleDelete(livro.id)} title="Excluir">
             <Trash size={20} />
           </button>
        </div>
      )
    }
  ], []);

  // --- LÓGICA DE FILTRAGEM ---
  const livrosFiltrados = livrosData.filter((livro) => {
    // A) Busca Texto
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = livro.titulo.toLowerCase().includes(searchLower) || livro.isbn.includes(searchTerm);

    // B) Status
    let matchStatus = true;
    if (filterStatus === 'disponiveis') matchStatus = livro.disponivel === true;
    if (filterStatus === 'indisponiveis') matchStatus = livro.disponivel === false;

    // C) Filtros Avançados
    const generoLivro = livro.genero || 'NA';
    const autorLivro = livro.autor || 'NA';
    const editoraLivro = livro.editora || 'NA';

    const matchGenre = activeFilters.genres.length === 0 || activeFilters.genres.includes(generoLivro);
    const matchAutor = activeFilters.authors.length === 0 || activeFilters.authors.includes(autorLivro);
    const matchEditora = activeFilters.publishers.length === 0 || activeFilters.publishers.includes(editoraLivro);

    // D) Datas
    let matchData = true;
    if (activeFilters.startDate || activeFilters.endDate) {
      const bookDate = parseBookDate(livro.data);
      if (!bookDate) {
         matchData = false;
      } else {
         if (activeFilters.startDate && bookDate < activeFilters.startDate) matchData = false;
         if (activeFilters.endDate && bookDate > activeFilters.endDate) matchData = false;
      }
    }

    return matchSearch && matchStatus && matchGenre && matchAutor && matchEditora && matchData;
  });

  // --- PAGINAÇÃO E CONTROLES ---
  const totalPages = Math.ceil(livrosFiltrados.length / ITEMS_PER_PAGE);
  const currentData = livrosFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filterStatus, activeFilters]);

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
      
      <div className="tabs-container">
        <Link to="/clientes" className="tab-button">Clientes</Link>
        <Link to="/livros" className="tab-button active">Livros</Link>
      </div>

      {/* TOOLBAR GENÉRICA + INJEÇÃO DE FILTROS ESPECÍFICOS */}
      <GenericToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewItem={() => setIsModalOpen(true)}
        newItemLabel="Novo Livro"
      >
         {/* Botão de Filtro Avançado */}
         <button className="btn-filter" onClick={() => setIsFilterOpen(true)}>
             <Faders size={18} weight="bold" />
             Filtrar
         </button>

         {/* Botões de Status */}
         <div className="status-toggle-group">
            <button className={`status-toggle-btn ${filterStatus === 'todos' ? 'active' : ''}`} onClick={() => setFilterStatus('todos')}>Todos</button>
            <button className={`status-toggle-btn ${filterStatus === 'disponiveis' ? 'active' : ''}`} onClick={() => setFilterStatus('disponiveis')}>Disponíveis</button>
            <button className={`status-toggle-btn ${filterStatus === 'indisponiveis' ? 'active' : ''}`} onClick={() => setFilterStatus('indisponiveis')}>Indisponíveis</button>
         </div>
      </GenericToolbar>

      <div className="table-container">
        {/* TABELA GENÉRICA */}
        <GenericTable 
          data={currentData}
          columns={columns}
          isLoading={isLoading}
          itemsPerPage={ITEMS_PER_PAGE}
          emptyMessage="Nenhum livro encontrado."
        />

        {/* PAGINAÇÃO */}
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
     </div>

      {/* MODAIS */}
      <CadastroLivro 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); loadLivros(); }} 
      />

      <ModalFiltrarLivro 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        livrosTotais={livrosData} // Passa dados brutos para contagem preview
        onConfirm={setActiveFilters}
        currentFilters={activeFilters} 
      />
        
    </div>
  );
}