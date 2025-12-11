import React from 'react';
import { Link } from 'react-router-dom';
// Exemplo de ícones da biblioteca lucide-react
import { BookOpen, BarChart3, Users, Handshake } from 'lucide-react'; 

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <nav>
        {/* Link para a página de Cadastro (ou Home) */}
        <Link to="/" className="sidebar-item">
          <Users size={20} />
          <span>Cadastro</span>
        </Link>

        {/* Link para a página de Análise */}
        <Link to="/analise" className="sidebar-item">
          <BarChart3 size={20} />
          <span>Análise de Dados</span>
        </Link>

        {/* ✅ NOVO LINK: Empréstimo */}
        <Link to="/emprestimo" className="sidebar-item">
          {/* O ícone Handshake ou BookOpen são boas opções */}
          <Handshake size={20} /> 
          <span>Novo Empréstimo</span>
        </Link>
        
        {/* Adicione outros links conforme necessário */}

      </nav>
    </div>
  );
};

export default Sidebar;