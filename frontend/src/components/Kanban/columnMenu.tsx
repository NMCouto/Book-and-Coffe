import { useState, useRef, useEffect } from 'react';
import { DotsThree, X, Trash, PencilSimple, Plus } from 'phosphor-react';
import '../../styles/components/ColumnMenu.css';
import '../../styles/kanban.css'; // Importa estilos do color picker

interface ColumnMenuProps {
  currentColor?: string;
  onAddCard: () => void;
  onRename: () => void;
  onDelete: () => void;
  onColorChange: (color: string) => void; // <--- NOVA PROP
}

// Paleta de cores para o usuário escolher
const COLORS = [
  '#E0E0E0', // Padrão (Cinza)
  '#FF5252', 
  '#D32F2F', 
  '#FFAB40',
  '#F57C00',
  '#FFD740',
  '#388E3C', 
  '#69F0AE',
  '#0855a1ff', 
  '#448AFF',  
  '#7C4DFF', 
  '#FF4081', 
];

export function ColumnMenu({ onAddCard, onRename, onDelete, onColorChange, currentColor }: ColumnMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="column-menu-wrapper" ref={menuRef}>
      <button 
        className={`btn-column-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Ações da lista"
        // Se a cor for muito escura, talvez precise forçar ícone branco, 
        // mas aqui vamos manter simples herdando a cor do header
      >
        <DotsThree size={24} weight="bold" />
      </button>

      {isOpen && (
        <div className="column-menu-dropdown">
          <div className="menu-header">
             <span>Ações da Lista</span>
             <button className="btn-close-menu" onClick={() => setIsOpen(false)}>
               <X size={14} />
             </button>
          </div>

          {/* SEÇÃO DE CORES */}
          <div className="color-picker-section">
            <span className="color-picker-label">Cor da Lista</span>
            <div className="color-swatches">
                {COLORS.map(color => (
                    <button
                        key={color}
                        className={`color-btn ${currentColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onColorChange(color)}
                        title={color}
                    />
                ))}
            </div>
          </div>
          
          <div className="menu-list">
            <button className="menu-item" onClick={() => handleAction(onAddCard)}>
               <Plus size={16} /> Adicionar cartão...
            </button>
            <button className="menu-item" onClick={() => handleAction(onRename)}>
               <PencilSimple size={16} /> Renomear lista...
            </button>
            <div style={{height: 1, background: 'var(--border-color)', margin: '4px 0'}}></div>
            <button className="menu-item danger" onClick={() => handleAction(onDelete)}>
               <Trash size={16} /> Excluir esta lista
            </button>
          </div>
        </div>
      )}
    </div>
  );
}