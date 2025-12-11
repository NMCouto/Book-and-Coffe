import React from 'react';
import { Link } from 'react-router-dom';
// Exemplo de ícones da biblioteca lucide-react
import { BookOpen, BarChart3, Users, Handshake } from 'lucide-react'; 

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <nav aria-label="Navegação Principal do Sistema">
        
        {/* Link para a página de Cadastro  */}
        <Link 
          to="/" 
          className="sidebar-item"
          title="Ir para a tela de Cadastro de Clientes e Livros."
        >
          <Users size={20} />
          <span>Cadastro</span>
        </Link>

        {/* Link para a página de Análise */}
        <Link 
          to="/analise" 
          className="sidebar-item"
          title="Ir para o painel de Diagnóstico Mensal e Análise de Vendas." 
        >
          <BarChart3 size={20} />
          <span>Análise de Dados</span>
        </Link>

        {/*Link para Empréstimo */}
        <Link 
          to="/emprestimo" 
          className="sidebar-item"
          title="Registrar um novo Empréstimo de Livro ou Devolução." 
        >
          <Handshake size={20} /> 
          <span>Novo Empréstimo</span>
        </Link>
        


      </nav>
    </div>
  );
};

export default Sidebar;