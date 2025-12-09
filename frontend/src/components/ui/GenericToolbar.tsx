import { MagnifyingGlass, Plus } from 'phosphor-react';
import '../../styles/paginasTabelas.css';

interface GenericToolbarProps {
  searchTerm: string;
  onSearchChange: (text: string) => void;
  onNewItem: () => void;
  newItemLabel: string;
  children?: React.ReactNode; // <--- AQUI ENTRAM OS FILTROS ESPECÍFICOS
}

export function GenericToolbar({ 
  searchTerm, 
  onSearchChange, 
  onNewItem, 
  newItemLabel,
  children 
}: GenericToolbarProps) {
  return (
    <div className="action-bar">
      <div className="search-filter-group">
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="Procurar..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <MagnifyingGlass size={18} className="search-icon" />
        </div>
        
        {/* Renderiza o que a página mandar (Botões de Status, Filtro Avançado, etc) */}
        {children} 
      </div>
      
      <button className="btn-solid" onClick={onNewItem} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
        {newItemLabel} <Plus size={16} weight="bold" />
      </button>
    </div>
  );
}