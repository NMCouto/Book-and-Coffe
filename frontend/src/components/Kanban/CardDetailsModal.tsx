import { X, Trash } from 'phosphor-react';
import type { CardView } from '../../types';
import '../../styles/components/CardDetailsModal.css';

interface CardDetailsModalProps {
  card: CardView;
  onClose: () => void;
  onDelete: () => void;
}

export function CardDetailsModal({ card, onClose, onDelete }: CardDetailsModalProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
           <h3>Detalhes do Cartão</h3>
           <button className="btn-close-modal" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="modal-field">
            <label className="modal-label">Título</label>
            <div className="modal-value" style={{fontWeight: 600}}>{card.title}</div>
        </div>

        <div className="modal-field">
            <label className="modal-label">Prioridade</label>
            <div className={`priority-badge priority-${card.priority}`}>
                {card.priority === 'high' ? 'Alta' : card.priority === 'medium' ? 'Média' : 'Baixa'}
            </div>
        </div>

        <div className="modal-actions">
            <button className="btn-delete-card" onClick={onDelete}>
                <Trash size={18} /> Excluir Cartão
            </button>
        </div>
      </div>
    </div>
  );
}