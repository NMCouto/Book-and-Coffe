import { useState } from 'react';
import { Plus } from 'phosphor-react';
import { CadastroLivro } from '../components/cadastro_livros';

export function Livros() {
  // Estado para controlar se o modal está visível
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="livros-page">
      {/* ... Seu cabeçalho existente ... */}
      <div className="header-actions">
        <input type="text" placeholder="Procurar um livro" className="search-bar" />
        
        {/* Botão que ABRE o modal */}
        <button className="btn-novo-livro" onClick={() => setIsModalOpen(true)}>
          Novo Livro 
          <Plus size={20} style={{marginLeft: 8}} />
        </button>
      </div>

      {/* ... Sua tabela de livros ... */}

      {/* --- O MODAL FICA AQUI (Pode ser no final do componente) --- */}
      <CadastroLivro 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}