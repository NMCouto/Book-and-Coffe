import { useState, useEffect, useRef } from 'react';
import { X, Check, CaretDown } from 'phosphor-react';
import type { EmprestimoView } from '../../types';
import '../../styles/cadastroModal.css'; 
import '../../styles/components/editEmpreModal.css'; // Onde colocamos o CSS novo

interface EditLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loan: EmprestimoView | null;
  onSave: (id: string, updates: { status: string; obs: string }) => void;
}

// Opções de Status com Labels e Classes
const STATUS_OPTIONS = [
  { value: 'em_dia', label: 'Em dia', colorClass: 'status-text-em_dia' },
  { value: 'atrasado', label: 'Atrasado', colorClass: 'status-text-atrasado' },
  { value: 'devolvido', label: 'Devolvido', colorClass: 'status-text-devolvido' },
];

export function EditLoanModal({ isOpen, onClose, loan, onSave }: EditLoanModalProps) {
  const [status, setStatus] = useState('em_dia');
  const [obs, setObs] = useState('');
  
  // Controle do Menu Customizado
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loan) {
      setStatus(loan.status || 'em_dia');
      setObs(loan.comentario || '');
    }
  }, [loan]);

  // Fecha o menu se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || !loan) return null;

  const handleSave = () => {
    onSave(loan.id, { status, obs });
    onClose();
  };

  // Encontra o objeto da opção atual para mostrar o label e cor correta
  const currentOption = STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        
        {/* Cabeçalho */}
        <div className="modal-header-actions" style={{justifyContent: 'space-between', marginBottom: 20}}>
            <h3 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-main)'}}>Editar Empréstimo</h3>
            <button className="btn-close-modal" onClick={onClose}><X size={24} /></button>
        </div>

        {/* Informações Estáticas */}
        <div style={{marginBottom: 20, padding: '12px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee'}}>
            <p style={{margin: '0 0 6px', fontWeight: 'bold', fontSize: '1rem'}}>{loan.titulo}</p>
            <p style={{margin: 0, fontSize: '0.85rem', color: '#666'}}>
               <strong>Cliente:</strong> {loan.cpfCliente} <br/>
               <strong>ISBN:</strong> {loan.isbn}
            </p>
        </div>

        {/* --- SELETOR CUSTOMIZADO DE STATUS --- */}
        <div className="priority-section" style={{marginBottom: 20}} ref={menuRef}>
            <label className="modal-label" style={{marginBottom: 8, display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase'}}>
                STATUS
            </label>
            
            <div className="custom-select-wrapper">
                {/* Botão Trigger */}
                <div 
                    className="custom-select-trigger" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <span className={currentOption.colorClass}>
                        {currentOption.label}
                    </span>
                    <CaretDown size={14} weight="bold" style={{color: '#888'}}/>
                </div>

                {/* Lista Dropdown */}
                {isMenuOpen && (
                    <div className="custom-select-menu">
                        {STATUS_OPTIONS.map(opt => (
                            <div 
                                key={opt.value}
                                className={`custom-option ${status === opt.value ? 'selected' : ''}`}
                                onClick={() => {
                                    setStatus(opt.value);
                                    setIsMenuOpen(false);
                                }}
                            >
                                {opt.label}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Comentário */}
        <div className="comment-section">
            <label className="modal-label" style={{display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', marginBottom: 8}}>
                COMENTÁRIO
            </label>
            <textarea 
                className="modal-textarea" 
                placeholder="Adicione uma observação..." 
                value={obs} 
                onChange={(e) => setObs(e.target.value)}
                style={{minHeight: '100px', width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'inherit'}}
            />
        </div>

        {/* Rodapé */}
        <div className="modal-footer-custom" style={{justifyContent: 'flex-end', marginTop: 25}}>
            <button className="btn-save-pill" onClick={handleSave} style={{padding: '8px 24px'}}>
                <Check size={18} weight="bold" /> Salvar
            </button>
        </div>

      </div>
    </div>
  );
}