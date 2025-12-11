import { useState, useMemo } from 'react';
import { Search, Trash2, Pencil } from 'lucide-react';
import React from 'react'; // Importar React se for .tsx

const Cadastro: React.FC = () => {
  // Define o estado para a aba ativa
  const [abaAtiva, setAbaAtiva] = useState('clientes');
  
  // Define o estado para o termo de busca em cada aba (Opcional, mas útil)
  const [searchTerm, setSearchTerm] = useState(''); 

  const clientes = useMemo(() => [
    { data: '01/01/2025', nome: 'cliente 1', cpf: '123.456.789-00' },
    { data: '15/02/2025', nome: 'Maria Silva', cpf: '987.654.321-00' },
  ], []);

  const livros = useMemo(() => [
    { data: '01/01/2025', titulo: 'Livro 1', isbn: '111-22-3333-4444-5' },
    { data: '10/03/2025', titulo: 'O Senhor dos Anéis', isbn: '978-85-359-0277-4' },
  ], []);

  // --- Funções de Renderização Auxiliares (Melhora a leitura do código) ---

  const renderSearchBar = (tabName: string) => (
    <div className="search-bar" role="search" aria-label={`Buscar em ${tabName}`}>
      <input 
        type="text" 
        placeholder={`Buscar ${tabName}...`} 
        aria-label={`Campo de busca para ${tabName}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className="search-icon" aria-hidden="true" />
    </div>
  );

  const renderAcoesBotoes = (id: string, itemType: string) => (
    <td className="acoes">
      <button 
        className="acao-btn delete" 
        aria-label={`Excluir ${itemType} ${id}`}
        title={`Excluir ${itemType} ${id}`}
        onClick={() => console.log(`Excluir ${itemType}: ${id}`)}
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>
      <button 
        className="acao-btn edit" 
        aria-label={`Editar ${itemType} ${id}`}
        title={`Editar ${itemType} ${id}`} 
        onClick={() => console.log(`Editar ${itemType}: ${id}`)}
      >
        <Pencil size={18} aria-hidden="true" /> 
      </button>
    </td>
  );

  // --- Componente Principal ---

  return (
    <div className="pagina">
      <h2 className="titulo-pagina">Cadastro</h2>
      
      <div className="aba-buttons" role="tablist" aria-label="Seleção de Cadastro">
        
        {/* ABA CLIENTES */}
        <button
          role="tab"
          className={abaAtiva === 'clientes' ? 'aba-active' : ''} 
          onClick={() => setAbaAtiva('clientes')}
          aria-selected={abaAtiva === 'clientes'}
          aria-controls="panel-clientes"
          id="tab-clientes"
        >
          Clientes
        </button>
        
        {/* ABA LIVROS */}
        <button
          role="tab"
          className={abaAtiva === 'livros' ? 'aba-active' : ''} 
          onClick={() => setAbaAtiva('livros')}
          aria-selected={abaAtiva === 'livros'}
          aria-controls="panel-livros"
          id="tab-livros"
        >
          Livros
        </button>
      </div>

      {/* PAINEL DE CONTEÚDO CLIENTES */}
      {abaAtiva === 'clientes' && (
        <div 
          className="tabela-container"
          role="tabpanel"
          id="panel-clientes"
          aria-labelledby="tab-clientes"
        >
          {renderSearchBar('clientes')}

          <table className="tabela" aria-label="Tabela de Clientes Cadastrados">
            <thead><tr><th>Data</th><th>Nome</th><th>CPF</th><th>Ações</th></tr></thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr key={i}>
                  <td>{c.data}</td>
                  <td>{c.nome}</td>
                  <td>{c.cpf}</td>
                  {renderAcoesBotoes(c.nome, 'cliente')}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PAINEL DE CONTEÚDO LIVROS */}
      {abaAtiva === 'livros' && (
        <div 
          className="tabela-container"
          role="tabpanel"
          id="panel-livros"
          aria-labelledby="tab-livros"
        >
          {renderSearchBar('livros')}
          <table className="tabela" aria-label="Tabela de Livros Cadastrados">
            <thead><tr><th>Data</th><th>Título</th><th>ISBN</th><th>Ações</th></tr></thead>
            <tbody>
              {livros.map((l, i) => (
                <tr key={i}>
                  <td>{l.data}</td>
                  <td>{l.titulo}</td>
                  <td>{l.isbn}</td>
                  {renderAcoesBotoes(l.titulo, 'livro')}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
export default Cadastro