import { useState, useMemo, useEffect } from 'react';
import { X, ArrowLeft } from 'phosphor-react';
import '../styles/components/filtroModal.css';

// -- Componentes --
import { parseBookDate } from '../utils/validator';
import { Autocomplete } from './ui/AutoComplete';
import { CustomDatePicker } from './ui/CustomDatePicker';

// -- Tipos --
import type { AdvancedFilterState } from '../types';
// REMOVIDO: import { ALL_GENRES, ALL_AUTHORS, ALL_PUBLISHERS } from '../constants'; 
// Agora tudo vem do banco de dados (livrosTotais)

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  livrosTotais: any[]; // Dados "brutos" vindos do backend
  onConfirm: (filters: AdvancedFilterState) => void;
  currentFilters: AdvancedFilterState;
}

export function ModalFiltrarLivro({ isOpen, onClose, livrosTotais, onConfirm, currentFilters }: ModalProps) {
  if (!isOpen) return null;

  // Estados dos Filtros
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAutores, setSelectedAutores] = useState<string[]>([]);
  const [selectedEditoras, setSelectedEditoras] = useState<string[]>([]);
  
  // Estados de Data
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [openDateInfo, setOpenDateInfo] = useState<'start' | 'end' | null>(null);

  // --- 1. GERAÇÃO DINÂMICA DE GÊNEROS ---
  const availableGenres = useMemo(() => {
    const genresSet = new Set<string>();
    livrosTotais.forEach(livro => {
      if (livro.genero) {
        // Divide gêneros compostos por barra ou vírgula
        const partes = livro.genero.split(/[\/,]/);
        partes.forEach((parte: string) => {
          const limpo = parte.trim();
          if (limpo) {
             // Capitaliza a primeira letra (Ex: "drama" -> "Drama")
             const capitalizado = limpo.charAt(0).toUpperCase() + limpo.slice(1);
             genresSet.add(capitalizado);
          }
        });
      }
    });
    return Array.from(genresSet).sort();
  }, [livrosTotais]);

  // --- 2. GERAÇÃO DINÂMICA DE AUTORES ---
  const availableAuthors = useMemo(() => {
    const authorsSet = new Set<string>();
    livrosTotais.forEach(livro => {
      if (livro.autor) {
        // Adiciona o autor limpo (sem espaços extras)
        authorsSet.add(livro.autor.trim());
      }
    });
    return Array.from(authorsSet).sort();
  }, [livrosTotais]);

  // --- 3. GERAÇÃO DINÂMICA DE EDITORAS ---
  const availablePublishers = useMemo(() => {
    const publishersSet = new Set<string>();
    livrosTotais.forEach(livro => {
      // Alguns livros podem não ter editora, checamos antes
      if (livro.editora) {
        publishersSet.add(livro.editora.trim());
      }
    });
    return Array.from(publishersSet).sort();
  }, [livrosTotais]);

  // Carrega filtros salvos ao abrir
  useEffect(() => {
    if (isOpen) {
      setSelectedGenres(currentFilters.genres);
      setSelectedAutores(currentFilters.authors);
      setSelectedEditoras(currentFilters.publishers);
      setStartDate(currentFilters.startDate);
      setEndDate(currentFilters.endDate);
    }
  }, [isOpen, currentFilters]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  // Contagem de resultados em tempo real
  const filteredCount = useMemo(() => {
    return livrosTotais.filter(livro => {
      // Filtro Gênero (Lógica "Contém")
      const bookGenreLower = (livro.genero || '').toLowerCase();
      const matchGenre = selectedGenres.length === 0 || selectedGenres.some(selected => 
        bookGenreLower.includes(selected.toLowerCase())
      );

      // Filtro Autor (Lógica Exata ou Contém, Autocomplete geralmente busca exato da lista)
      const matchAutor = selectedAutores.length === 0 || selectedAutores.includes(livro.autor || '');
      
      // Filtro Editora
      const matchEditora = selectedEditoras.length === 0 || selectedEditoras.includes(livro.editora || '');
      
      // Filtro Data
      let matchData = true;
      if (startDate || endDate) {
        const bookDate = parseBookDate(livro.data_lancamento);
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
    onClose();
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

        {/* Gênero (Dinâmico) */}
        <div className="filter-section">
          <label className="section-label">Gênero :</label>
          {availableGenres.length > 0 ? (
            <div className="chips-grid">
              {availableGenres.map(genre => (
                <button 
                  key={genre} 
                  className={`chip-btn ${selectedGenres.includes(genre) ? 'selected' : ''}`}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre} {selectedGenres.includes(genre) && <X size={14} weight="bold" />}
                </button>
              ))}
            </div>
          ) : (
            <p className="empty-filter-msg">Nenhum gênero encontrado.</p>
          )}
        </div>

        {/* Autor (Dinâmico) */}
        <Autocomplete 
          label="Autor :"
          placeholder="Procurar Autor"
          suggestions={availableAuthors} // <--- Passando a lista dinâmica
          selectedItems={selectedAutores}
          onSelectionChange={setSelectedAutores}
        />

        {/* Editora (Dinâmico) */}
        <Autocomplete 
          label="Editora :"
          placeholder="Procurar Editora"
          suggestions={availablePublishers} // <--- Passando a lista dinâmica
          selectedItems={selectedEditoras}
          onSelectionChange={setSelectedEditoras}
        />

        {/* Datas */}
        <div className="filter-section">
          <label className="section-label">Intervalo de lançamento :</label>
          <div className="date-range-container">
            <CustomDatePicker 
               label="Início" 
               value={startDate} 
               onChange={setStartDate} 
               isOpen={openDateInfo === 'start'}
               onToggle={() => setOpenDateInfo(openDateInfo === 'start' ? null : 'start')}
            />
             <CustomDatePicker 
               label="Fim" 
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