import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; 
import { House, Users, X,BookOpen, Money, Plus, SignOut, Kanban, Trash, Gear, ChartLine } from 'phosphor-react';
import { useBoard } from '../../contexts/BoardContext.tsx';
import { NewBoardModal } from '../modals/NewBoardModal.tsx';
import '../../styles/components/Sidebar.css';

// Adicionei onClose nas props para poder fechar ao navegar
export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  const { boards, createNewBoard, deleteBoard } = useBoard();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateBoard = async (title: string) => {
    await createNewBoard(title);
    // O modal fecha sozinho dentro do componente NewBoardModal ao chamar onClose, 
    // ou você pode fechar aqui se preferir mudar a lógica.
  };

  const handleLogout = () => {
    navigate('/'); 
    onClose(); 
  };

  const handleDeleteBoard = (e: React.MouseEvent, boardId: string) => {
    e.preventDefault(); // Evita navegar ao clicar na lixeira
    e.stopPropagation();
    
    deleteBoard(boardId);
    // Se estivermos no quadro que foi deletado, volta pro operacional
    if (window.location.pathname.includes(boardId)) {
        navigate('/quadros/operacional');
    }
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
           <span className="brand-name">Book and Coffee</span>
           <button className="btn-close" onClick={onClose}><X size={20} weight="bold"/></button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/inicio" className="nav-link" onClick={onClose}>
            <House size={20} weight="bold" /> 
            <span>Início</span>
          </NavLink>
          
          <NavLink to="/clientes" className="nav-link" onClick={onClose}>
            <Users size={20} weight="bold" /> 
            <span>Clientes</span>
          </NavLink>
          
          <NavLink to="/livros" className="nav-link" onClick={onClose}>
            <BookOpen size={20} weight="bold" /> 
            <span>Livros</span>
          </NavLink>

          <NavLink to="/emprestimos" className="nav-link" onClick={onClose}>
            <Money size={20} weight="bold" /> 
            <span>Empréstimos</span>
          </NavLink>

          <NavLink to="/analise" className="nav-link" onClick={onClose}>
            <ChartLine size={20} weight="bold" /> 
            <span>Análises</span>
          </NavLink>

          {/* Linha Divisória */}
          <div className="divider"></div>

          {/* Configurações */}
          <NavLink to="/config" className="nav-link" onClick={onClose}>
            <Gear size={20} weight="bold" /> 
            <span>Configurações</span>
          </NavLink>

          {/* Linha Divisória */}
          <div className="divider"></div>

          <div className="boards-section">
            <div className="section-header">
              <span>Quadros</span>
              <button className="btn-add-mini" onClick={() => setIsModalOpen(true)} title="Criar novo quadro">
                <Plus size={16} weight="bold"/>
              </button>
            </div>

            <div className="boards-list">
              {boards.map(board => (
                <NavLink 
                  key={board.id} 
                  to={`/quadros/${board.id}`}
                  onClick={onClose}
                  className={({ isActive }) => isActive ? "board-link active" : "board-link"}
                >
                  <div className="board-link-content">
                    <Kanban size={18} weight={board.id === 'operacional' ? 'fill' : 'regular'} />
                    <span className="board-name">{board.title}</span>
                  </div>

                  {/* Botão de Excluir (Só aparece se não for o operacional) */}
                  {board.id !== 'operacional' && (
                    <button 
                      className="btn-delete-board"
                      onClick={(e) => handleDeleteBoard(e, board.id)}
                      title="Excluir quadro"
                    >
                      <Trash size={16} />
                    </button>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <SignOut size={20} weight="bold" /> 
            <span>Sair</span>
          </button>
        </div>
      </div>
      
      <div className={`overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />

      <NewBoardModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateBoard}
      />
    </>
  );
}