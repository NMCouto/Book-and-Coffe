import { useState, useMemo } from 'react';
import { X, MagnifyingGlass, ArrowLeft, CaretLeft, CaretRight } from 'phosphor-react';
import { parseBookDate } from '../utils/validator.tsx';
import '../styles/cadastroModal.css';
import '../styles/filtroModal.css';

// --- DADOS MOCKADOS PARA EXEMPLO ---
const ALL_GENRES = ['Fantasia', 'Aventura', 'Terror', 'Romance', 'Sci-Fi', 'Acadêmico', 'História'];
const ALL_AUTHORS = ['J.K. Rowling', 'J.R.R. Tolkien', 'Stephen King', 'George Orwell', 'Machado de Assis'];
const ALL_PUBLISHERS = ['Rocco', 'HarperCollins', 'Companhia das Letras', 'Intrínseca'];

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  livrosTotais: any[];
}

export function ModalFiltrarLivro({ isOpen, onClose, livrosTotais }: ModalProps) {
  if (!isOpen) return null;

  // --- ESTADOS DOS FILTROS ---
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  // Autor
  const [searchAutor, setSearchAutor] = useState('');
  const [selectedAutores, setSelectedAutores] = useState<string[]>([]);
  
  // Editora
  const [searchEditora, setSearchEditora] = useState('');
  const [selectedEditoras, setSelectedEditoras] = useState<string[]>([]);

  // Datas
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // --- CONTROLE DOS POPUPS DE DATA ---
  const [openDateInfo, setOpenDateInfo] = useState<'start' | 'end' | null>(null);

  // --- LÓGICA DE GÊNERO ---
  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  // --- LÓGICA DE AUTOCOMPLETE (Genérica) ---
  const handleSelectSuggestion = (
    item: string, 
    setList: React.Dispatch<React.SetStateAction<string[]>>, 
    setSearch: (s: string) => void
  ) => {
    setList(prev => [...prev, item]);
    setSearch('');
  };

  const removeTag = (item: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
    setList(prev => prev.filter(i => i !== item));
  };

  // --- LÓGICA DE CONTAGEM (PREVIEW) ---
  // Aqui filtramos a lista "fictícia" só para mostrar o número no botão
  const filteredCount = useMemo(() => {
    return livrosTotais.filter(livro => {
      
      const generoLivro = livro.genero || 'NA';
      const matchGenre = selectedGenres.length === 0 || selectedGenres.includes(generoLivro);

      const autorLivro = livro.autor || 'NA';
      const matchAutor = selectedAutores.length === 0 || selectedAutores.includes(autorLivro);

      const editoraLivro = livro.editora || 'NA';
      const matchEditora = selectedEditoras.length === 0 || selectedEditoras.includes(editoraLivro);

      let matchData = true;
      
      // Se o usuário ativou algum filtro de data...
      if (startDate || endDate) {
        const bookDate = parseBookDate(livro.data); // Tenta converter
        
        // Se o livro NÃO tem data válida (retornou null), ele FALHA imediatamente
        if (!bookDate) {
           matchData = false; 
        } else {
           // Se tem data, faz a comparação normal
           if (startDate && bookDate < startDate) matchData = false;
           if (endDate && bookDate > endDate) matchData = false;
        }
      }

      return matchGenre && matchAutor && matchEditora && matchData;

    }).length;
  }, [
    selectedGenres, 
    selectedAutores, 
    selectedEditoras, 
    startDate, 
    endDate, 
    livrosTotais
  ]);


  return (
    <div className="modal-overlay">
      <div className="filter-modal-card">
        
        {/* Header */}
        <div className="filter-header">
          <button onClick={onClose} style={{background: 'none', border: 'none', cursor: 'pointer'}}>
            <ArrowLeft size={24} />
          </button>
          <h2 className="filter-title">Filtrar por :</h2>
        </div>

        {/* 1. Gêneros */}
        <div className="filter-section">
          <label className="section-label">Gênero :</label>
          <div className="chips-grid">
            {ALL_GENRES.map(genre => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button 
                  key={genre} 
                  className={`chip-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                  {isSelected && <X size={14} weight="bold" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Autor (Autocomplete) */}
        <div className="filter-section">
          <label className="section-label">Autor :</label>
          <div className="autocomplete-container">
            {/* Tags Selecionadas */}
            <div className="selected-chips-area">
              {selectedAutores.map(autor => (
                <button key={autor} className="chip-btn selected" onClick={() => removeTag(autor, setSelectedAutores)}>
                  {autor} <X size={14} weight="bold" />
                </button>
              ))}
            </div>
            {/* Input */}
            <div className="search-input-icon">
               <input 
                 type="text" 
                 className="form-input" 
                 placeholder="Procurar Autor"
                 value={searchAutor}
                 onChange={(e) => setSearchAutor(e.target.value)}
               />
               <MagnifyingGlass size={20} className="search-icon" />
            </div>
            {/* Lista Sugestões */}
            {searchAutor && (
              <div className="suggestions-list">
                {ALL_AUTHORS.filter(a => a.toLowerCase().includes(searchAutor.toLowerCase()) && !selectedAutores.includes(a))
                  .map(autor => (
                    <div key={autor} className="suggestion-item" onClick={() => handleSelectSuggestion(autor, setSelectedAutores, setSearchAutor)}>
                      {autor}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* 3. Editora (Autocomplete) */}
        <div className="filter-section">
          <label className="section-label">Editora :</label>
          <div className="autocomplete-container">
            <div className="selected-chips-area">
              {selectedEditoras.map(ed => (
                 <button key={ed} className="chip-btn selected" onClick={() => removeTag(ed, setSelectedEditoras)}>
                 {ed} <X size={14} weight="bold" />
               </button>
              ))}
            </div>
            <div className="search-input-icon">
               <input 
                 type="text" 
                 className="form-input" 
                 placeholder="Procurar Editora"
                 value={searchEditora}
                 onChange={(e) => setSearchEditora(e.target.value)}
               />
               <MagnifyingGlass size={20} className="search-icon" />
            </div>
             {searchEditora && (
              <div className="suggestions-list">
                {ALL_PUBLISHERS.filter(e => e.toLowerCase().includes(searchEditora.toLowerCase()) && !selectedEditoras.includes(e))
                  .map(pub => (
                    <div key={pub} className="suggestion-item" onClick={() => handleSelectSuggestion(pub, setSelectedEditoras, setSearchEditora)}>
                      {pub}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Intervalo de Lançamento (Custom Date Picker) */}
        <div className="filter-section">
          <label className="section-label">Intervalo de lançamento :</label>
          <div className="date-range-container">
            
            {/* Data Início */}
            <DatePickerInput 
               label="Início*" 
               value={startDate} 
               onChange={setStartDate} 
               isOpen={openDateInfo === 'start'}
               onToggle={() => setOpenDateInfo(openDateInfo === 'start' ? null : 'start')}
            />

            {/* Data Fim */}
             <DatePickerInput 
               label="Fim*" 
               value={endDate} 
               onChange={setEndDate} 
               isOpen={openDateInfo === 'end'}
               onToggle={() => setOpenDateInfo(openDateInfo === 'end' ? null : 'end')}
            />

          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{marginTop: '40px'}}>
           <button className="btn-outline" onClick={onClose} style={{borderRadius: '20px', padding: '10px 30px'}}>
             Voltar
           </button>
           <button className="btn-solid" onClick={onClose} style={{borderRadius: '20px', padding: '10px 30px'}}>
             Continuar ({filteredCount})
           </button>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTE: DATE PICKER CUSTOMIZADO ---
// Colocado aqui para simplificar o copy-paste
interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function DatePickerInput({ label, value, onChange, isOpen, onToggle }: DatePickerProps) {
  // Inicia com a data selecionada OU a data de hoje se for nulo
  const [viewDate, setViewDate] = useState(value || new Date());
  const [mode, setMode] = useState<'month' | 'year'>('month');

  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Reseta a visualização quando o popup abre
  if (isOpen && value && viewDate.getTime() !== value.getTime()) {
     setViewDate(value);
  }

  const addMonth = (val: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + val);
    setViewDate(newDate);
  };

  const selectYear = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    setMode('month'); // Volta para visualização de mês após escolher o ano
  };

  const handleApply = () => {
    onChange(viewDate);
    onToggle(); // Fecha
  };

  // NOVA FUNÇÃO: Limpar Filtro
  const handleReset = () => {
    onChange(null); // Define o valor como nulo (sem filtro)
    setViewDate(new Date()); // Reseta a visualização para hoje
    onToggle(); // Fecha
  };

  // Gera uma lista de anos (ex: 10 anos para trás e 10 para frente)
  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({length: 20}, (_, i) => currentYear - 10 + i);


  return (
    <div className="date-input-wrapper">
      <span style={{marginBottom: 5, color: '#666', fontSize: '0.9rem'}}>{label}</span>
      
      <button className="date-display-btn" onClick={onToggle}>
        {value 
          ? `${months[value.getMonth()]} ${value.getFullYear()}` 
          : "any"} {/* Mostra "any" se for nulo */}
      </button>

      {isOpen && (
        <div className="custom-datepicker">
          {/* --- CABEÇALHO DO PICKER --- */}
          <div 
            className="picker-header" 
            style={{ 
              /* Se for Mês, centraliza. Se for Ano, separa os itens (Seta na esq, Texto na dir) */
              justifyContent: mode === 'month' ? 'center' : 'space-between' 
            }}
          >
             {/* 1. Seta de Voltar (SÓ aparece no modo 'year') */}
             {mode === 'year' && (
                <button 
                  className="picker-back-btn" 
                  onClick={() => setMode('month')} /* Volta para o mês */
                  title="Voltar para meses"
                >
                  <ArrowLeft size={20} weight="bold" />
                </button>
             )}

             {/* 2. Conteúdo Central */}
             {mode === 'month' ? (
              // MODO MÊS: Navegação completa
              <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
                  <button className="nav-arrow" onClick={() => addMonth(-1)}>
                    <CaretLeft size={24} weight="bold"/>
                  </button>
                  
                  <button className="month-year-btn" onClick={() => setMode('year')}>
                    {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </button>
                  
                  <button className="nav-arrow" onClick={() => addMonth(1)}>
                    <CaretRight size={24} weight="bold"/>
                  </button>
              </div>
            ) : (
               // MODO ANO: Apenas o título
               <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>Selecionar Ano</span>
            )}
          </div>

          {/* --- CORPO DO PICKER --- */}
          {mode === 'year' && (
              <div className="year-list">
                {yearsList.map(year => (
                  <div 
                    key={year} 
                    className={`year-item ${year === viewDate.getFullYear() ? 'selected' : ''}`} 
                    onClick={() => selectYear(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
          )}

           {/* --- RODAPÉ COM AÇÕES --- */}
          <div className="picker-actions">
            {/* NOVO: Botão Limpar */}
            <button className="btn-reset" onClick={handleReset}>
              Limpar filtro
            </button>
            
            <button className="btn-solid" style={{padding: '8px 20px', borderRadius: '12px'}} onClick={handleApply}>
              Aplicar
            </button>
          </div>

        </div>
      )}
    </div>
  );
}