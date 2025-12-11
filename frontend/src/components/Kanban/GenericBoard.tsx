import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Plus } from 'phosphor-react';
import { KanbanColumn } from './kanbanColumn';
import  type { KanbanColumnData, CardView } from '../../types';
import '../../styles/kanban.css';

interface GenericBoardProps {
  columns: KanbanColumnData[];
  onCardMove: (result: DropResult) => void;
  onAddCard: (columnId: string) => void;
  onAddColumn?: () => void;
  onCardClick: (card: CardView) => void;
  readOnly?: boolean;
}

export function GenericBoard({ 
  columns, onCardMove, onAddCard, onAddColumn, onCardClick, readOnly = false 
}: GenericBoardProps) {
  return (
    <DragDropContext onDragEnd={onCardMove}>
      <div className="kanban-board">
        {columns.map(col => (
          <KanbanColumn 
            key={col.id} 
            column={col} 
            onAddCard={readOnly ? () => {} : onAddCard}
            onCardClick={onCardClick}
          />
        ))}
        {onAddColumn && !readOnly && (
          <button className="btn-add-list" onClick={onAddColumn}>
            <Plus size={20} /> Adicionar Lista
          </button>
        )}
      </div>
    </DragDropContext>
  );
}