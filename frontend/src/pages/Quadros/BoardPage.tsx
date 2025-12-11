import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBoard } from '../../contexts/BoardContext';
import { GenericBoard } from '../../components/Kanban/GenericBoard';
import { CardDetailsModal } from '../../components/Kanban/CardDetailsModal';
import type { CardView } from '../../types';
import '../../styles/paginasTabelas.css'; 

export function BoardPage() {
  const { boardId } = useParams();
  const { boards, moveCard, addCardToBoard, addColumnToBoard, deleteCard, renameColumn, deleteColumn, changeColumnColor } = useBoard();
  
  const [selectedCard, setSelectedCard] = useState<CardView | null>(null);

  const currentBoard = boards.find(b => b.id === boardId);

  // Estilo movido para .board-not-found
  if (!currentBoard) {
    return <div className="board-not-found">Quadro não encontrado. Selecione um quadro no menu lateral.</div>;
  }

  const handleCardClick = (card: CardView) => {
    setSelectedCard(card);
  };

  const handleDeleteCurrentCard = () => {
    if (selectedCard && confirm("Tem certeza que deseja excluir este cartão?")) {
        deleteCard(currentBoard.id, selectedCard.id);
        setSelectedCard(null);
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="action-bar">
           {/* Estilo movido para .board-page-title */}
           <h2 className="board-page-title">
             {currentBoard.title}
           </h2>
        </div>

        <GenericBoard 
          columns={currentBoard.columns}
          onCardMove={(result) => moveCard(currentBoard.id, result)}
          onAddCard={(columnId, title) => {
              addCardToBoard(currentBoard.id, columnId, title);
          }}
          onAddColumn={(title) => {
              addColumnToBoard(currentBoard.id, title);
          }}
          onCardClick={handleCardClick}

          onChangeColumnColor={(colId, color) => changeColumnColor(currentBoard.id, colId, color)}
          onRenameColumn={(colId, newTitle) => renameColumn(currentBoard.id, colId, newTitle)}
          onDeleteColumn={(colId) => deleteColumn(currentBoard.id, colId)}
        />
      </div>

      {selectedCard && (
        <CardDetailsModal 
            card={selectedCard}
            boardId={currentBoard.id}
            onClose={() => setSelectedCard(null)} 
            onDelete={handleDeleteCurrentCard}
        />
      )}
    </>
  );
}