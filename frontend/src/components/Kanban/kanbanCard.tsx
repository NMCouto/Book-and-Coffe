import { Draggable } from '@hello-pangea/dnd';
import type { CardView } from '../../types';
import '../../styles/kanban.css';

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
          // IMPORTANTE: Este style abaixo NÃO PODE ser removido.
          // Ele é essencial para a biblioteca de drag-and-drop funcionar (movimento do card).
          style={{ ...provided.draggableProps.style }}
        >
          {/* Estilo do título movido para classe .card-title-text */}
          <div className="card-title-text">
            {card.title}
          </div>
          
          <div className="card-meta">
             <span className="priority-text">
               {card.priority === 'high' ? 'Alta' : card.priority === 'medium' ? 'Média' : 'Baixa'}
             </span>
          </div>
        </div>
      )}
    </Draggable>
  );
}