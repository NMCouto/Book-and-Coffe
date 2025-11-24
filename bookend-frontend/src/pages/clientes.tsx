import { useState } from 'react';
import { Plus } from 'phosphor-react';
import { CadastroCliente } from '../components/cadastro_cliente';

export function Clientes() {
  // Estado para controlar se o modal está visível
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="clientes-page">
      {/* ... Seu cabeçalho existente ... */}
      <div className="header-actions">
        <input type="text" placeholder="Procurar um cliente" className="search-bar" />
        
        {/* Botão que ABRE o modal */}
        <button className="btn-novo-cliente" onClick={() => setIsModalOpen(true)}>
          Novo Cliente 
          <Plus size={20} style={{marginLeft: 8}} />
        </button>
      </div>

      {/* ... Sua tabela de clientes ... */}

      {/* --- O MODAL FICA AQUI (Pode ser no final do componente) --- */}
      <CadastroCliente 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}