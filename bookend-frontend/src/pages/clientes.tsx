import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MagnifyingGlass, PencilSimple, Trash, Faders } from 'phosphor-react';
import { CadastroCliente } from '../components/cadastro_cliente';
import '../styles/listagem.css';

export function Clientes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock de dados (para a tabela não ficar vazia)
  const clientesData = [
    { id: 1, nome: 'Cliente 1', cpf: '175.478.987-06', tel: '21 99876-9876', ativo: true, data: '21/12/2025', emprestimos: 4 },
    { id: 2, nome: 'Cliente 2', cpf: '175.478.987-06', tel: '21 99876-9876', ativo: false, data: 'NA', emprestimos: 0 },
  ];

  // Lógica de Filtragem (Nome OU CPF)
  const clientesFiltrados = clientesData.filter((cliente) => {
    // Converte tudo para minúsculo para a busca não diferenciar maiúsculas
    const searchLower = searchTerm.toLowerCase();
    
    return (
      cliente.nome.toLowerCase().includes(searchLower) || 
      cliente.cpf.includes(searchTerm)
    );
  });

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
          
          {/* Botão de Filtro (Visual por enquanto) */}
          <button className="btn-filter">
            <Faders size={18} weight="bold" />
            Filtrar
          </button>
        </div>
        
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
              <th className="text-center">Empréstimos ativos</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Usa a lista FILTRADA aqui, não a original */}
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td>{cliente.nome}</td>
                <td className="text-center">{cliente.cpf}</td>
                <td className="text-center">{cliente.tel}</td>
                <td className="text-center">
                  <input type="checkbox" checked={cliente.ativo} readOnly />
                </td>
                <td className="text-center">
                  <div className="action-cell">
                    <button className="icon-btn edit"><PencilSimple size={20} /></button>
                    <button className="icon-btn delete"><Trash size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Mensagem caso não encontre nada */}
            {clientesFiltrados.length === 0 && (
               <tr>
                 <td colSpan={5} style={{textAlign: 'center', padding: 20, color: '#666'}}>
                   Nenhum cliente encontrado.
                 </td>
               </tr>
            )}
          </tbody>
        </table>

        {/* Rodapé Paginação */}
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

      <CadastroCliente isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}