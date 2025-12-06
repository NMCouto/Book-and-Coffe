import { useState } from 'react';
import { ArrowLeft, CaretLeft, CaretRight } from 'phosphor-react';
import '../../styles/components/datepicker.css'; 

interface DatePickerProps {
  label: string;
  value: Date | null;
  onChange: (d: Date | null) => void;
  // Controle de abertura pode ser interno ou externo. 
  // Aqui mantive externo para permitir que um feche o outro.
  isOpen: boolean; 
  onToggle: () => void;
}

export function CustomDatePicker({ label, value, onChange, isOpen, onToggle }: DatePickerProps) {
  const [viewDate, setViewDate] = useState(value || new Date());
  const [mode, setMode] = useState<'month' | 'year'>('month');

  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  // Sincroniza estado se abrir com valor novo
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
    setMode('month');
  };

  const handleApply = () => {
    onChange(viewDate);
    onToggle();
  };

  const handleReset = () => {
    onChange(null);
    setViewDate(new Date());
    onToggle();
  };

  const currentYear = new Date().getFullYear();
  const yearsList = Array.from({length: 20}, (_, i) => currentYear - 10 + i);

  return (
    <div className="date-input-wrapper">
      <span style={{marginBottom: 5, color: '#666', fontSize: '0.9rem'}}>{label}</span>
      
      <button className="date-display-btn" onClick={onToggle}>
        {value ? `${months[value.getMonth()]} ${value.getFullYear()}` : "any"}
      </button>

      {isOpen && (
        <div className="custom-datepicker">
          <div className="picker-header" style={{ justifyContent: mode === 'month' ? 'center' : 'space-between' }}>
             {mode === 'year' && (
                <button className="picker-back-btn" onClick={() => setMode('month')}>
                  <ArrowLeft size={20} weight="bold" />
                </button>
             )}

             {mode === 'month' ? (
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
               <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>Selecionar Ano</span>
            )}
          </div>

          {mode === 'year' && (
              <div className="year-list">
                {yearsList.map(year => (
                  <div key={year} className={`year-item ${year === viewDate.getFullYear() ? 'selected' : ''}`} onClick={() => selectYear(year)}>
                    {year}
                  </div>
                ))}
              </div>
          )}

          <div className="picker-actions">
            <button className="btn-reset" onClick={handleReset}>Limpar filtro</button>
            <button className="btn-solid" style={{padding: '8px 20px', borderRadius: '12px'}} onClick={handleApply}>Aplicar</button>
          </div>
        </div>
      )}
    </div>
  );
}