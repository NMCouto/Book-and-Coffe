import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { KanbanCard } from './kanbanCard';
import { ColumnMenu } from './columnMenu'; 
import { useAlert } from '../../contexts/AlertContext'; 
import type { KanbanColumnData, CardView } from '../../types';
import '../../styles/kanban.css';
import { Plus } from 'phosphor-react';

interface KanbanColumnProps {
  column: KanbanColumnData;
  onAddCard: (columnId: string, title: string) => void;
  onCardClick: (card: CardView) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void; 
  onDeleteColumn: (columnId: string) => void;
  onChangeColor: (columnId: string, newColor: string) => void;
}

export function KanbanColumn({ 
  column, 
  onAddCard, 
  onCardClick, 
  onRenameColumn, 
  onDeleteColumn,
  onChangeColor 
}: KanbanColumnProps) {

    const { showAlert } = useAlert();

    // Estados para Adicionar Cartão
    const [isAdding, setIsAdding] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');

    // Estados para Renomear
    const [isRenaming, setIsRenaming] = useState(false);
    const [tempTitle, setTempTitle] = useState(column.title);

    // --- LÓGICA DE RENOMEAR ---
    const handleRenameStart = () => {
        setTempTitle(column.title);
        setIsRenaming(true);
    };

    const handleRenameSubmit = () => {
        if (tempTitle.trim() && tempTitle !== column.title) {
            onRenameColumn(column.id, tempTitle);
        }
        setIsRenaming(false);
    };

    const handleKeyDownRename = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleRenameSubmit();
        if (e.key === 'Escape') {
            setTempTitle(column.title);
            setIsRenaming(false);
        }
    };

    // --- LÓGICA DE ADICIONAR CARTÃO ---
    const handleAddSubmit = () => {
        if (!newCardTitle.trim()) return;
        onAddCard(column.id, newCardTitle);
        setNewCardTitle('');
        setIsAdding(false);
    };

    const handleCancelAdd = () => {
        setIsAdding(false);
        setNewCardTitle('');
    };

    // --- LÓGICA DE DELETAR (ATUALIZADA COM O MODAL) ---
    const handleDelete = async () => {
        // Substitui o confirm() nativo pelo nosso Modal
        const confirmado = await showAlert({
            title: 'Alerta-exclusão',
            message: `Tem certeza que deseja excluir a lista "${column.title}" e todos os seus cartões?`,
            confirmText: 'Sim',
            cancelText: 'Cancelar',
            type: 'confirm'
        });

        // Se o usuário clicou em "Sim" (true), executa a exclusão
        if (confirmado) {
            onDeleteColumn(column.id);
        }
    };

    // Cor do texto baseada no fundo
    const isDarkBackground = column.color && column.color !== '#E0E0E0';
    const textColor = isDarkBackground ? 'white' : 'var(--text-main)';

    return (
        <div className="kanban-column">
            <div 
                className="column-header"
                style={{ 
                    backgroundColor: column.color || '#E0E0E0', 
                    color: textColor
                }}
            >
                {isRenaming ? (
                    <input 
                        className="input-rename-column"
                        value={tempTitle}
                        style={{ color: '#333' }} 
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={handleRenameSubmit}
                        onKeyDown={handleKeyDownRename}
                        autoFocus
                    />
                ) : (
                    <span 
                        className="column-title-text"
                        onDoubleClick={handleRenameStart}
                        style={{ color: 'inherit' }}
                    >
                        {column.title}
                    </span>
                )}

                <ColumnMenu 
                    currentColor={column.color}
                    onAddCard={() => setIsAdding(true)}
                    onRename={handleRenameStart}
                    onDelete={handleDelete} // Passamos a função async atualizada
                    onColorChange={(newColor) => onChangeColor(column.id, newColor)}
                />
            </div>

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
                    
                    {isAdding && (
                        <div className="add-card-form">
                            <textarea
                                className="input-new-card"
                                placeholder="Insira um título para este cartão..."
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleAddSubmit();
                                    }
                                    if(e.key === 'Escape') handleCancelAdd();
                                }}
                            />
                            <div className="add-card-controls">
                                <button className="btn-confirm-add" onClick={handleAddSubmit}>
                                    Adicionar Cartão
                                </button>
                                <button className="btn-cancel-add" onClick={handleCancelAdd}>
                                    {/* Se não tiver X importado, importe de phosphor-react */}
                                    <span style={{fontSize: '1.2rem'}}>×</span> 
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                )}
            </Droppable>

            {!isAdding && (
                <button 
                    className="btn-add-card"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus size={16}/> Adicionar cartão
                </button>
            )}
        </div>
    );
}