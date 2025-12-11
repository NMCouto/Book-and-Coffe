import { useState } from 'react'; // <--- Importar useState
import { DragDropContext } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { Plus, X } from 'phosphor-react'; // <--- Importar X
import { KanbanColumn } from './kanbanColumn';
import  type { KanbanColumnData, CardView } from '../../types';
import '../../styles/kanban.css';

interface GenericBoardProps {
  columns: KanbanColumnData[];
  onCardMove: (result: DropResult) => void;
  onAddCard: (columnId: string, title: string) => void;
  onAddColumn?: (title: string) => void; 
  onCardClick: (card: CardView) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onChangeColumnColor: (columnId: string, color: string) => void;
  readOnly?: boolean;
}

export function GenericBoard({ 
  columns, onCardMove, onAddCard, onChangeColumnColor, onAddColumn, onCardClick, 
  onRenameColumn, onDeleteColumn, readOnly = false 
}: GenericBoardProps) {

  // Estados locais para controlar o formulário de nova lista
  const [isAddingList, setIsAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const handleAddListSubmit = () => {
    if (!newListTitle.trim()) return; // Não adiciona vazio
    
    if (onAddColumn) {
      onAddColumn(newListTitle);
    }
    
    setNewListTitle(''); // Limpa o input
    setIsAddingList(false); // Fecha o form (ou mantenha true se quiser adicionar várias seguidas)
  };

  const handleCancel = () => {
    setIsAddingList(false);
    setNewListTitle('');
  };

  return (
    <DragDropContext onDragEnd={onCardMove}>
      <div className="kanban-board">
        {columns.map(col => (
          <KanbanColumn 
            key={col.id} 
            column={col} 
            // Passa a função diretamente. 
            // Se for readOnly, passa função vazia
            onAddCard={readOnly ? () => {} : onAddCard}
            
            onCardClick={onCardClick}
            onRenameColumn={onRenameColumn}
            onDeleteColumn={onDeleteColumn}
            onChangeColor={onChangeColumnColor}
          />
        ))}

        {/* LÓGICA CONDICIONAL: Botão ou Formulário */}
        {onAddColumn && !readOnly && (
          isAddingList ? (
            // --- MODO FORMULÁRIO (Igual Trello) ---
            <div className="add-list-wrapper">
              <input 
                type="text" 
                className="input-new-list"
                placeholder="Digite o nome da lista..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                autoFocus // Foca automaticamente ao abrir
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddListSubmit();
                  if (e.key === 'Escape') handleCancel();
                }}
              />
              <div className="add-list-controls">
                <button className="btn-confirm-add" onClick={handleAddListSubmit}>
                  Adicionar Lista
                </button>
                <button className="btn-cancel-add" onClick={handleCancel}>
                  <X size={20} />
                </button>
              </div>
            </div>
          ) : (
            // --- MODO BOTÃO PADRÃO ---
            <button className="btn-add-list" onClick={() => setIsAddingList(true)}>
              <Plus size={20} /> Adicionar outra lista
            </button>
          )
        )}
      </div>
    </DragDropContext>
  );
}