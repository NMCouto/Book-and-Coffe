import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, PencilSimple, Trash, Faders } from 'phosphor-react';
import { CadastroLivro } from '../components/cadastro_livros'; // Modal de Livro
import { ModalFiltrarLivro } from '../components/filtrarLivro';
import '../styles/listagem.css'; 

export function Livros() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const livrosData = [
    { id: 1, titulo: 'Harry Potter', isbn: '978-85-325-3078-3', genero: 'Fantasia', vol: 1, data: '21/12/2025', disponivel: true },
    { id: 2, titulo: 'O Senhor dos Anéis', isbn: '123-456', genero: 'Aventura', vol: 1, data: '20/01/2024', disponivel: true },
  ];

  // Filtro (Título OU ISBN)
  const livrosFiltrados = livrosData.filter((livro) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      livro.titulo.toLowerCase().includes(searchLower) ||
      livro.isbn.includes(searchTerm)
    );
  });

  return (
    <div className="page-container">
      
      <div className="tabs-container">
        <Link to="/clientes" className="tab-button">Clientes</Link>
        <Link to="/livros" className="tab-button active">Livros</Link>
      </div>

      <div className="action-bar">
        {/* Grupo Pesquisa + Filtro */}
        <div className="search-filter-group">
          <div className="search-wrapper">
            <input 
              type="text" 
              placeholder="Procurar um livro (Título ou ISBN)" 
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
            {/* 3. Usa lista filtrada */}
             {livrosFiltrados.map(livro => (
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
             
             {livrosFiltrados.length === 0 && (
               <tr>
                 <td colSpan={4} style={{textAlign: 'center', padding: 20, color: '#666'}}>
                   Nenhum livro encontrado.
                 </td>
               </tr>
            )}
          </tbody>
        </table>

        <div className="pagination-footer">
          <button className="page-btn">{'<<'}</button>
          <button className="page-btn">{'<'}</button>
          <button className="page-btn">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <span style={{padding: '5px'}}>...</span>
          <button className="page-btn">10</button>
          <button className="page-btn">{'>'}</button>
          <button className="page-btn">{'>>'}</button>
        </div>
      </div>

      <CadastroLivro isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <ModalFiltrarLivro isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} livrosTotais={livrosData} />
        
    </div>
  );
}