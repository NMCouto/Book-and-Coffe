import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import type { BoardView, KanbanColumnData, CardView, ColumnId } from '../types';

interface BoardContextType {
  boards: BoardView[];
  createNewBoard: (title: string) => void;
  deleteBoard: (boardId: string) => void;
  moveCard: (boardId: string, result: DropResult) => void;
  addCardToBoard: (boardId: string, columnId: string, title: string) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  addColumnToBoard: (boardId: string, title: string) => void;
}

const BoardContext = createContext({} as BoardContextType);

// Dados Iniciais (O antigo mock do operacional)
const INITIAL_BOARDS: BoardView[] = [
  {
    id: 'operacional',
    title: 'Operacional (Padrão)',
    columns: [
      { id: 'todo', title: 'A Fazer', cards: [{ id: '1', title: 'Criar protótipo', priority: 'high', columnId: 'todo' }] },
      { id: 'doing', title: 'Em Progresso', cards: [{ id: '3', title: 'Desenvolver API', priority: 'medium', columnId: 'doing' }] },
      { id: 'done', title: 'Concluído', cards: [] }
    ]
  }
];

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<BoardView[]>(INITIAL_BOARDS);

  // 1. Criar novo Quadro
  const createNewBoard = (title: string) => {
    const newId = title.toLowerCase().replace(/\s+/g, '-');
    const newBoard: BoardView = {
      id: newId,
      title,
      columns: [
        { id: 'todo', title: 'A Fazer', cards: [] },
        { id: 'doing', title: 'Em Progresso', cards: [] },
        { id: 'done', title: 'Concluído', cards: [] }
      ]
    };
    setBoards([...boards, newBoard]);
  };

  // 2. Adicionar Card
  const addCardToBoard = (boardId: string, columnId: string, title: string) => {
    setBoards(prevBoards => prevBoards.map(board => {
      if (board.id !== boardId) return board;

      const newCard: CardView = {
        id: Math.random().toString(),
        title,
        priority: 'low',
        columnId: columnId as ColumnId
      };

      return {
        ...board,
        columns: board.columns.map(col => 
          col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
        )
      };
    }));
  };

  // 3. Adicionar Coluna
  const addColumnToBoard = (boardId: string, title: string) => {
     setBoards(prevBoards => prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        const newCol: KanbanColumnData = {
           id: title.toLowerCase().replace(/\s/g, '-'),
           title,
           cards: []
        };
        return { ...board, columns: [...board.columns, newCol] };
     }));
  };

  // 4. Mover Card (Lógica do Drag and Drop)
  const moveCard = (boardId: string, result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    setBoards(prevBoards => {
      const newBoards = [...prevBoards];
      const boardIndex = newBoards.findIndex(b => b.id === boardId);
      if (boardIndex === -1) return prevBoards;

      const board = { ...newBoards[boardIndex] };
      const columns = [...board.columns]; // Cópia rasa das colunas

      const sourceColIndex = columns.findIndex(col => col.id === source.droppableId);
      const destColIndex = columns.findIndex(col => col.id === destination.droppableId);

      const sourceCol = { ...columns[sourceColIndex], cards: [...columns[sourceColIndex].cards] };
      const destCol = { ...columns[destColIndex], cards: [...columns[destColIndex].cards] };

      const [movedCard] = sourceCol.cards.splice(source.index, 1);

      if (sourceCol.id === destCol.id) {
        sourceCol.cards.splice(destination.index, 0, movedCard);
        columns[sourceColIndex] = sourceCol;
      } else {
        const updatedCard = { ...movedCard, columnId: destCol.id as ColumnId };
        destCol.cards.splice(destination.index, 0, updatedCard);
        columns[sourceColIndex] = sourceCol;
        columns[destColIndex] = destCol;
      }

      board.columns = columns;
      newBoards[boardIndex] = board;
      return newBoards;
    });
  };

  // 5. Excluir Quadro (Com proteção do quadro padrão)
  const deleteBoard = (boardId: string) => {
    if (boardId === 'operacional') {
      alert("O quadro Operacional não pode ser excluído.");
      return;
    }
    if (confirm("Tem certeza que deseja excluir este quadro?")) {
      setBoards(prev => prev.filter(b => b.id !== boardId));
    }
  };

  // 6. Excluir Cartão
  const deleteCard = (boardId: string, cardId: string) => {
    setBoards(prevBoards => prevBoards.map(board => {
      if (board.id !== boardId) return board;

      const newColumns = board.columns.map(col => ({
        ...col,
        cards: col.cards.filter(c => c.id !== cardId) // Remove o card pelo ID
      }));

      return { ...board, columns: newColumns };
    }));
  };

  return (
    <BoardContext.Provider value={{ boards, createNewBoard, deleteBoard, deleteCard, moveCard, addCardToBoard, addColumnToBoard }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);