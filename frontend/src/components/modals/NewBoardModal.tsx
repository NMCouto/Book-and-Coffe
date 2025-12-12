import { useState } from 'react';
import { X, Kanban } from 'phosphor-react';
import '../../styles/cadastroModal.css'; // Reutiliza o estilo dos outros modais

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
}

export function NewBoardModal({ isOpen, onClose, onConfirm }: NewBoardModalProps) {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!title.trim()) {
      alert("O nome do quadro não pode estar vazio.");
      return;
    }
    onConfirm(title);
    setTitle(''); // Limpa após criar
    onClose();
  };

  // Permite salvar apertando Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm();
  };

  return (
    <div className="modal-overlay">
      {/* maxWidth menor para ficar elegante, já que é só um input */}
      <div className="modal-card" style={{ maxWidth: '450px', height: 'auto' }}>
        
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Kanban size={28} /> Novo Quadro
          </h2>
          <button className="btn-close-modal" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="form-group">
          <label className="form-label">Nome do Quadro</label>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Ex: Marketing, Financeiro..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <p style={{fontSize: '0.85rem', color: '#666', marginTop: '8px'}}>
            Este quadro será criado e vinculado ao seu usuário.
          </p>
        </div>

        {/* Rodapé (Botões Padrão) */}
        <div className="modal-footer" style={{marginTop: '30px'}}>
          <button className="btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button 
            className="btn-solid" 
            onClick={handleConfirm}
            disabled={!title.trim()}
            style={{ opacity: !title.trim() ? 0.6 : 1 }}
          >
            Criar Quadro
          </button>
        </div>

      </div>
    </div>
  );
}