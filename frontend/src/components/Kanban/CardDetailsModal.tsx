import { useState, useRef, useEffect } from 'react';
import { X, Trash, Check, CaretDown, ChatText } from 'phosphor-react';
import type { CardView } from '../../types';
import { useBoard } from '../../contexts/BoardContext';
import { useAlert } from '../../contexts/AlertContext';
import '../../styles/components/CardDetailsModal.css';

interface CardDetailsModalProps {
  card: CardView;
  boardId: string; // Precisamos disso para o update
  onClose: () => void;
  // onDelete agora é opcional aqui pois podemos chamar direto do contexto se quisermos,
  // mas vamos manter para usar a lógica do pai se preferir.
  onDelete?: () => void; 
}

export function CardDetailsModal({ card, boardId, onClose, onDelete }: CardDetailsModalProps) {
  const { updateCard, deleteCard } = useBoard();
  const { showAlert } = useAlert();

  // Estados locais para edição
  const [title, setTitle] = useState(card.title);
  const [comment, setComment] = useState(card.comment || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(card.priority);
  
  // Controle do Menu de Prioridade
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const priorityRef = useRef<HTMLDivElement>(null);

  // Fecha menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
        setIsPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Labels para exibição
  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta'
  };

  const handleSave = () => {
    // Chama a função do contexto para atualizar
    updateCard(boardId, card.columnId, card.id, {
      title,
      comment,
      priority
    });
    onClose();
  };

  const handleDelete = async () => {
    const confirmado = await showAlert({
        title: 'Excluir Cartão',
        message: 'Tem certeza que deseja excluir este cartão permanentemente?',
        confirmText: 'Sim, excluir',
        cancelText: 'Cancelar',
        type: 'confirm'
    });

    if (confirmado) {
        if (onDelete) onDelete();
        else deleteCard(boardId, card.id);
        onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        
        {/* Header: Botão Fechar e Input de Título */}
        <div>
            <div className="modal-header-actions">
                <button className="btn-close-modal" onClick={onClose}>
                    <X size={24} />
                </button>
            </div>
            
            <input 
                className="modal-title-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título do Cartão"
            />
        </div>

        {/* Seção de Prioridade (Dropdown Customizado) */}
        <div className="priority-section" ref={priorityRef}>
            <label className="modal-label">Prioridade</label>
            
            <div 
                className="priority-trigger" 
                onClick={() => setIsPriorityOpen(!isPriorityOpen)}
            >
                {/* Mostra o texto com a cor correspondente */}
                <span className={`p-text-${priority}`}>
                    {priorityLabels[priority]}
                </span>
                <CaretDown size={14} weight="bold" />
            </div>

            {isPriorityOpen && (
                <div className="priority-menu">
                    <div 
                        className={`priority-option ${priority === 'low' ? 'selected' : ''}`}
                        onClick={() => { setPriority('low'); setIsPriorityOpen(false); }}
                    >
                        Baixa
                    </div>
                    <div 
                        className={`priority-option ${priority === 'medium' ? 'selected' : ''}`}
                        onClick={() => { setPriority('medium'); setIsPriorityOpen(false); }}
                    >
                        Média
                    </div>
                    <div 
                        className={`priority-option ${priority === 'high' ? 'selected' : ''}`}
                        onClick={() => { setPriority('high'); setIsPriorityOpen(false); }}
                    >
                        Alta
                    </div>
                </div>
            )}
        </div>

        {/* Seção de Comentários */}
        <div className="comment-section">
            <label className="modal-label" style={{display: 'flex', alignItems: 'center', gap: 6}}>
                <ChatText size={16}/> Comentário
            </label>
            <textarea 
                className="modal-textarea"
                placeholder="Adicione uma descrição mais detalhada..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
        </div>

        {/* Rodapé: Excluir na Esquerda, Salvar na Direita */}
        <div className="modal-footer-custom">
            <button className="btn-delete-simple" onClick={handleDelete}>
                <Trash size={18} />
                Excluir
            </button>

            <button className="btn-save-pill" onClick={handleSave}>
                <Check size={18} weight="bold" />
                Salvar
            </button>
        </div>

      </div>
    </div>
  );
}