import { useState, useMemo, useEffect } from 'react';
import { X, ArrowLeft } from 'phosphor-react';
import '../styles/components/filtroModal.css';

// -- Componentes --
import { parseBookDate } from '../utils/validator';
import { Autocomplete } from './ui/AutoComplete';
import { CustomDatePicker } from './ui/CustomDatePicker';

// -- Tipos e constantes --
import type { AdvancedFilterState } from '../types';
import { ALL_GENRES, ALL_AUTHORS, ALL_PUBLISHERS } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  livrosTotais: any[];
  onConfirm: (filters: AdvancedFilterState) => void;
  currentFilters: AdvancedFilterState;
}

export function ModalFiltrarLivro({ isOpen, onClose, livrosTotais, onConfirm, currentFilters }: ModalProps) {
  if (!isOpen) return null;

  // Estados
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAutores, setSelectedAutores] = useState<string[]>([]);
  const [selectedEditoras, setSelectedEditoras] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openDateInfo, setOpenDateInfo] = useState<'start' | 'end' | null>(null);

  // Lógica de memória para os filtros
  useEffect(() => {
    if (isOpen) {
      setSelectedGenres(currentFilters.genres);
      setSelectedAutores(currentFilters.authors);
      setSelectedEditoras(currentFilters.publishers);
      setStartDate(currentFilters.startDate);
      setEndDate(currentFilters.endDate);
    }
  }, [isOpen, currentFilters]);

  // Lógica simples de Gênero (Chips)
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  // Lógica de Contagem (UseMemo)
  const filteredCount = useMemo(() => {
    return livrosTotais.filter(livro => {
      const matchGenre = selectedGenres.length === 0 || selectedGenres.includes(livro.genero || 'NA');
      const matchAutor = selectedAutores.length === 0 || selectedAutores.includes(livro.autor || 'NA');
      const matchEditora = selectedEditoras.length === 0 || selectedEditoras.includes(livro.editora || 'NA');
      
      let matchData = true;
      if (startDate || endDate) {
        const bookDate = parseBookDate(livro.data);
        if (!bookDate) matchData = false; 
        else {
           if (startDate && bookDate < startDate) matchData = false;
           if (endDate && bookDate > endDate) matchData = false;
        }
      }
      return matchGenre && matchAutor && matchEditora && matchData;
    }).length;
  }, [selectedGenres, selectedAutores, selectedEditoras, startDate, endDate, livrosTotais]);

  const handleConfirm = () => {
    onConfirm({
      genres: selectedGenres,
      authors: selectedAutores,
      publishers: selectedEditoras,
      startDate: startDate,
      endDate: endDate
    });
    
    onClose(); // Fecha o modal
  };

  return (
    <div className="modal-overlay">
      <div className="filter-modal-card">
        <div className="filter-header">
          <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="filter-title">Filtrar por :</h2>
        </div>

        {/* Gênero (Mantive aqui pois é bem específico visualmente) */}
        <div className="filter-section">
          <label className="section-label">Gênero :</label>
          <div className="chips-grid">
            {ALL_GENRES.map(genre => (
              <button 
                key={genre} 
                className={`chip-btn ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                onClick={() => toggleGenre(genre)}
              >
                {genre} {selectedGenres.includes(genre) && <X size={14} weight="bold" />}
              </button>
            ))}
          </div>
        </div>

        {/* Autor */}
        <Autocomplete 
          label="Autor :"
          placeholder="Procurar Autor"
          suggestions={ALL_AUTHORS}
          selectedItems={selectedAutores}
          onSelectionChange={setSelectedAutores}
        />

        {/* Editora */}
        <Autocomplete 
          label="Editora :"
          placeholder="Procurar Editora"
          suggestions={ALL_PUBLISHERS}
          selectedItems={selectedEditoras}
          onSelectionChange={setSelectedEditoras}
        />

        {/* Datas */}
        <div className="filter-section">
          <label className="section-label">Intervalo de lançamento :</label>
          <div className="date-range-container">
            <CustomDatePicker 
               label="Início*" 
               value={startDate} 
               onChange={setStartDate} 
               isOpen={openDateInfo === 'start'}
               onToggle={() => setOpenDateInfo(openDateInfo === 'start' ? null : 'start')}
            />
             <CustomDatePicker 
               label="Fim*" 
               value={endDate} 
               onChange={setEndDate} 
               isOpen={openDateInfo === 'end'}
               onToggle={() => setOpenDateInfo(openDateInfo === 'end' ? null : 'end')}
            />
          </div>
        </div>

        <div className="modal-footer" style={{marginTop: '40px'}}>
           <button className="btn-outline" onClick={onClose} style={{borderRadius: '20px', padding: '10px 30px'}}>Voltar</button>
           <button className="btn-solid" onClick={handleConfirm} style={{borderRadius: '20px', padding: '10px 30px'}}>
             Confirmar ({filteredCount})
           </button>
        </div>
      </div>
    </div>
  );
}