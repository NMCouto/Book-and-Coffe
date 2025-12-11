import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './kanbanCard';
import type { KanbanColumnData, CardView } from '../../types';
import '../../styles/kanban.css'; // Certifique-se que o CSS está importado
import { Plus } from 'phosphor-react';

interface KanbanColumnProps {
  column: KanbanColumnData;
  onAddCard: (columnId: string) => void;
  onCardClick: (card: CardView) => void;
}

export function KanbanColumn({ column, onAddCard, onCardClick }: KanbanColumnProps) {
    
    const getHeaderColorClass = (colId: string) => {
        if (colId === 'todo') return 'header-todo';
        if (colId === 'doing') return 'header-doing';
        if (colId === 'done') return 'header-done';
        return '';
    };

    return (
        <div className="kanban-column">
            {/* Cabeçalho */}
            <div className={`column-header ${getHeaderColorClass(column.id)}`}>
                <span>{column.title}</span>
                {/* CSS movido para classe .column-counter */}
                <span className="column-counter">
                    {column.cards.length}
                </span>
            </div>

            {/* Área de Drop */}
            <Droppable droppableId={column.id}>
                {(provided) => (
                <div
                    className="column-content"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {column.cards.map((card, index) => (
                        <KanbanCard 
                            key={card.id} 
                            card={card} 
                            index={index} 
                            onClick={onCardClick} 
                        />
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>

            <button 
                className="btn-add-card"
                onClick={() => onAddCard(column.id)}
            >
                <Plus size={16}/> Adicionar cartão
            </button>
        </div>
    );
}