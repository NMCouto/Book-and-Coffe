import { Draggable } from '@hello-pangea/dnd';
import type { CardView } from '../../types';
import '../../styles/kanban.css';
import { CalendarBlank, User } from 'phosphor-react'; // Importar ícones

interface KanbanCardProps {
  card: CardView;
  index: number;
  onClick: (card: CardView) => void;
}

export function KanbanCard({ card, index, onClick }: KanbanCardProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(card)}
          className={`kanban-card priority-${card.priority} ${snapshot.isDragging ? 'dragging' : ''}`}
          style={{ ...provided.draggableProps.style }}
        >
          {/* Se estiver atrasado, mostra o Badge Vermelho no topo */}
          {card.isLate && (
            <div className="card-badge-late">Atrasado</div>
          )}

          <div className="card-title-text">
            {card.title}
          </div>
          
          {/* Informações Extras (Data e CPF) - Só renderiza se existirem */}
          {(card.dueDate || card.cpf) && (
            <div className="card-info-rows">
               {card.dueDate && (
                 <div className="info-row">
                   <CalendarBlank size={14} weight="bold" />
                   <span>{card.dueDate}</span>
                 </div>
               )}
               {card.cpf && (
                 <div className="info-row">
                   <User size={14} weight="bold" />
                   <span>CPF: {card.cpf}</span>
                 </div>
               )}
            </div>
          )}

          {/* Mantém a prioridade original se NÃO for um card de devolução (opcional, ou mostra ambos) */}
          {!card.isLate && !card.dueDate && (
             <div className="card-meta">
                <span className="priority-text">
                  {card.priority === 'high' ? 'Alta' : card.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
             </div>
          )}
        </div>
      )}
    </Draggable>
  );
}