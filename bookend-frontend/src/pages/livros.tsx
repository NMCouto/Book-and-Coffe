import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, PencilSimple, Trash, Faders } from 'phosphor-react';
import '../styles/paginasTabelas.css'; 
import type { AdvancedFilterState, LivroView } from '../types';
import { CadastroLivro } from '../components/cadastro_livros';
import { ModalFiltrarLivro } from '../components/filtrarLivro';
import { parseBookDate } from '../utils/validator';
import { Pagination } from '../components/ui/Paginacao';
import { adaptLivro } from '../utils/adapters';

import { LIVROS_MOCK } from '../mocks/livrosMocks';

const ITEMS_PER_PAGE = 11;

export function Livros() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'disponiveis' | 'indisponiveis'>('todos');
  const [currentPage, setCurrentPage] = useState(1);

  const [activeFilters, setActiveFilters] = useState<AdvancedFilterState>({
    genres: [],
    authors: [],
    publishers: [],
    startDate: null,
    endDate: null
  });

  const livrosData: LivroView[] = LIVROS_MOCK.map(adaptLivro);

 const livrosFiltrados = livrosData.filter((livro) => {
    
    // Filtro de Busca (Input de Texto)
    const searchLower = searchTerm.toLowerCase();
    const matchSearch = 
      livro.titulo.toLowerCase().includes(searchLower) || 
      livro.isbn.includes(searchTerm);

    // Filtro de Status (Abas)
    let matchStatus = true;
    if (filterStatus === 'disponiveis') matchStatus = livro.disponivel === true;
    if (filterStatus === 'indisponiveis') matchStatus = livro.disponivel === false;

    // Filtros Avançados (Vindos do Modal)
    // -- Gênero
    const generoLivro = livro.genero || 'NA';
    const matchGenre = activeFilters.genres.length === 0 || activeFilters.genres.includes(generoLivro);

    // -- Autor
    const autorLivro = livro.autor || 'NA';
    const matchAutor = activeFilters.authors.length === 0 || activeFilters.authors.includes(autorLivro);

    // -- Editora
    const editoraLivro = livro.editora || 'NA';
    const matchEditora = activeFilters.publishers.length === 0 || activeFilters.publishers.includes(editoraLivro);

    // -- Data
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

    // O livro precisa passar em TODAS as provas para aparecer
    return matchSearch && matchStatus && matchGenre && matchAutor && matchEditora && matchData;
  });

  // LÓGICA DE FATIAMENTO (Slice)
  // Aplicamos a paginação SOBRE a lista já filtrada
  const totalItems = livrosFiltrados.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  const livrosAtuais = livrosFiltrados.slice(startIndex, endIndex);

  // COMANDOS DE TECLADO (Setas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se o usuário estiver digitando num input
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
  }, [totalPages]); // Recria o listener se o número total de páginas mudar

  // Resetar para página 1 se o usuário filtrar algo
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, activeFilters]);

  return (
    <div className="page-container">
      
      <div className="tabs-container">
        <Link to="/clientes" className="tab-button">Clientes</Link>
        <Link to="/livros" className="tab-button active">Livros</Link>
      </div>

      <div className="action-bar">
        {/* Grupo Pesquisa + Filtros */}
        <div className="search-filter-group">
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Procurar livros (Título ou ISBN)" 
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MagnifyingGlass size={18} className="search-icon" />
          </div>

          <button className="btn-filter" onClick={() => setIsFilterOpen(true)}>
             <Faders size={18} weight="bold" />
             Filtrar
           </button>

           <div className="status-toggle-group">
            <button 
              className={`status-toggle-btn ${filterStatus === 'todos' ? 'active' : ''}`}
              onClick={() => setFilterStatus('todos')}
            >
              Todos
            </button>
            <button 
              className={`status-toggle-btn ${filterStatus === 'disponiveis' ? 'active' : ''}`}
              onClick={() => setFilterStatus('disponiveis')}
            >
              Disponíveis
            </button>
            <button 
              className={`status-toggle-btn ${filterStatus === 'indisponiveis' ? 'active' : ''}`}
              onClick={() => setFilterStatus('indisponiveis')}
            >
              Indisponíveis
            </button>
          </div>
        </div>
        
        <button className="btn-solid" onClick={() => setIsModalOpen(true)}>
            Novo Livro <Plus size={16} />
         </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Título</th>
              <th className="text-center">ISBN</th>
              <th className="text-center">Gênero</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
             {livrosAtuais.map(livro => (
               <tr key={livro.id}>
                 <td>{livro.titulo}</td>
                 <td className="text-center">{livro.isbn}</td>
                 <td className="text-center">{livro.genero}</td>
                 <td className="text-center">
                    <div className="action-cell">
                      <button className="icon-btn edit"><PencilSimple size={20} /></button>
                      <button className="icon-btn delete"><Trash size={20} /></button>
                    </div>
                 </td>
               </tr>
             ))}

             {/* Preenchimento visual se a página não estiver cheia (opcional) */}
              {Array.from({ length: ITEMS_PER_PAGE - livrosAtuais.length }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={4}>&nbsp;</td>
                </tr>
              ))}
             
             {livrosFiltrados.length === 0 && (
               <tr>
                 <td colSpan={4} style={{textAlign: 'center', padding: 20, color: '#666'}}>
                   Nenhum livro encontrado.
                 </td>
               </tr>
            )}
          </tbody>
        </table>

        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
     </div>

      <CadastroLivro 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      <ModalFiltrarLivro 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        livrosTotais={livrosData} 
        onConfirm={(filters) => setActiveFilters(filters)}
        currentFilters={activeFilters} 
      />
        
    </div>
  );
}