import { Link, useLocation } from 'react-router-dom';
import { X, Plus } from 'phosphor-react'; 
import '../styles/Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation(); // Para saber em qual página estamos

  // Função auxiliar para verificar se o link está ativo
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <>
      <div className={`overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        <div className="sidebar-header">
          <div className="brand">
            <img src="/assets/logocafe.png" alt="Bookend" className="logo-img" />
            <span className="brand-name">Book and coffe</span>
          </div>

          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Links Principais */}
        <nav className="nav-section">
          <Link to="/kanban" className={`nav-link ${isActive('/')}`} onClick={onClose}>Início</Link>
          <Link to="/clientes" className={`nav-link ${isActive('/clientes')}`} onClick={onClose}>Clientes</Link>
          <Link to="/livros" className={`nav-link ${isActive('/livros')}`} onClick={onClose}>Livros</Link>
          <Link to="/analises" className={`nav-link ${isActive('/analises')}`} onClick={onClose}>Análises</Link>
        </nav>

        {/* Linha Divisória */}
        <div className="divider"></div>

        {/* Configurações */}
        <nav className="nav-section">
          <Link to="/config" className="nav-link" onClick={onClose}>Configurações</Link>
        </nav>

        {/* Linha Divisória */}
        <div className="divider"></div>

        {/* Quadros */}
        <div className="quadros-section">
          <div className="quadros-header">
            <span>Quadros</span>
            <button className="btn-add-quadro"><Plus size={16} /></button>
          </div>
          
          {/* Linha Divisória abaixo do título Quadros */}
          <div className="divider"></div>

          <div className="quadros-list">
            <Link 
              to="/kanban" 
              className={`quadro-link ${isActive('/kanban')}`} 
              onClick={onClose}
            >
              Quadro 1
            </Link>
          </div>
        </div>

      </aside>
    </>
  );
}