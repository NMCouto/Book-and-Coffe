import { useState } from 'react';
import { X, MagnifyingGlass } from 'phosphor-react';
import '../../styles/components/autocomplete.css';

interface AutocompleteProps {
  label: string;
  placeholder: string;
  suggestions: string[]; // Lista completa (ex: Todos os Autores)
  selectedItems: string[]; // O que o usuário já escolheu
  onSelectionChange: (items: string[]) => void; // Função para atualizar o pai
}

export function Autocomplete({ 
  label, 
  placeholder, 
  suggestions, 
  selectedItems, 
  onSelectionChange 
}: AutocompleteProps) {
  
  const [searchTerm, setSearchTerm] = useState('');

  const handleSelect = (item: string) => {
    onSelectionChange([...selectedItems, item]);
    setSearchTerm('');
  };

  const handleRemove = (item: string) => {
    onSelectionChange(selectedItems.filter(i => i !== item));
  };

  // Filtra as sugestões baseado no que foi digitado E no que já foi selecionado
  const filteredSuggestions = suggestions.filter(
    item => item.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedItems.includes(item)
  );

  return (
    <div className="filter-section">
      <label className="section-label">{label}</label>
      <div className="autocomplete-container">
        
        {/* Tags Selecionadas */}
        <div className="selected-chips-area">
          {selectedItems.map(item => (
            <button key={item} className="chip-btn selected" onClick={() => handleRemove(item)}>
              {item} <X size={14} weight="bold" />
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="search-input-icon">
           <input 
             type="text" 
             className="form-input" 
             placeholder={placeholder}
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
           <MagnifyingGlass size={20} className="search-icon" />
        </div>

        {/* Lista Flutuante */}
        {searchTerm && (
          <div className="suggestions-list">
            {filteredSuggestions.map(item => (
                <div key={item} className="suggestion-item" onClick={() => handleSelect(item)}>
                  {item}
                </div>
            ))}
            {filteredSuggestions.length === 0 && (
                <div className="suggestion-item" style={{cursor: 'default', color: '#999'}}>
                    Nenhum resultado encontrado
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}