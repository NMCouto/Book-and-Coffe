import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import type { BoardView, KanbanColumnData, CardView, ColumnId } from '../types';

// Função auxiliar para gerar data formatada (apenas para o mock)
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString('pt-BR');
};

interface BoardContextType {
  boards: BoardView[];
  createNewBoard: (title: string) => void;
  deleteBoard: (boardId: string) => void;
  moveCard: (boardId: string, result: DropResult) => void;
  updateCard: (boardId: string, columnId: string, cardId: string, updates: Partial<CardView>) => void;
  addCardToBoard: (boardId: string, columnId: string, title: string) => void;
  deleteCard: (boardId: string, cardId: string) => void;
  addColumnToBoard: (boardId: string, title: string) => void;
  deleteColumn: (boardId: string, columnId: string) => void;
  renameColumn: (boardId: string, columnId: string, newTitle: string) => void;
  changeColumnColor: (boardId: string, columnId: string, newColor: string) => void;
}

const BoardContext = createContext({} as BoardContextType);

// Dados Iniciais 
const INITIAL_BOARDS: BoardView[] = [
  {
    id: 'operacional',
    title: 'Operacional (Padrão)',
    columns: [
      { 
        id: 'devolucoes', 
        title: 'Devoluções', 
        color: '#D32F2F', // Vermelho
        cards: [
          { 
            id: 'dev-1', 
            title: 'Sapiens: Uma breve história da humanidade', 
            priority: 'high', 
            columnId: 'devolucoes',
            dueDate: '05/12/2025', // Data passada simulada
            cpf: '123.456.789-09',
            isLate: true
          },
          { 
            id: 'dev-2', 
            title: 'O Poder do Hábito', 
            priority: 'high', 
            columnId: 'devolucoes',
            dueDate: '02/12/2025',
            cpf: '998.877.665-50',
            isLate: true
          },
          { 
            id: 'dev-3', 
            title: 'Cem Anos de Solidão', 
            priority: 'medium', 
            columnId: 'devolucoes',
            dueDate: getFutureDate(3), // Daqui a 3 dias (Próximo)
            cpf: '258.147.369-11',
            isLate: false
          }
        ]
      },
      { 
        id: 'pendencias', 
        title: 'Pendências',
        color: '#F57C00', // Laranja 
        cards: [
          { id: 'task-1', title: 'Comprar prateleira nova', priority: 'medium', columnId: 'pendencias' },
          { id: 'task-2', title: 'Comprar livros novos', priority: 'high', columnId: 'pendencias' }
        ]
      },
      { id: 'todo', title: 'A fazer', color: '#0855a1ff', cards: [] }, // Azul
      { id: 'doing', title: 'Em andamento', color: '#448AFF', cards: [] }, // Azul Claro
      { id: 'done', title: 'Concluído', color: '#388E3C', cards: [] } // Verde
    ]
  }
];

export function BoardProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<BoardView[]>(INITIAL_BOARDS);

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

  const updateCard = (boardId: string, columnId: string, cardId: string, updates: Partial<CardView>) => {
    setBoards(prev => prev.map(board => {
      if (board.id !== boardId) return board;

      const newColumns = board.columns.map(col => {
        if (col.id !== columnId) return col;

        const newCards = col.cards.map(card => {
          if (card.id !== cardId) return card;
          // Mescla os dados antigos com as atualizações (titulo, prioridade, comentario)
          return { ...card, ...updates };
        });

        return { ...col, cards: newCards };
      });

      return { ...board, columns: newColumns };
    }));
  };

  const addColumnToBoard = (boardId: string, title: string) => {
     setBoards(prevBoards => prevBoards.map(board => {
        if (board.id !== boardId) return board;
        
        const newCol: KanbanColumnData = {
           id: title.toLowerCase().replace(/\s/g, '-'),
           title,
           color: '#E0E0E0', // Cor Padrão (cinza)
           cards: []
        };
        return { ...board, columns: [...board.columns, newCol] };
     }));
  };

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

  const deleteBoard = (boardId: string) => {
    if (boardId === 'operacional') {
      alert("O quadro Operacional não pode ser excluído.");
      return;
    }
    if (confirm("Tem certeza que deseja excluir este quadro?")) {
      setBoards(prev => prev.filter(b => b.id !== boardId));
    }
  };

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

  const renameColumn = (boardId: string, columnId: string, newTitle: string) => {
    setBoards(prev => prev.map(board => {
      if (board.id !== boardId) return board;
      
      const newColumns = board.columns.map(col => 
        col.id === columnId ? { ...col, title: newTitle } : col
      );
      return { ...board, columns: newColumns };
    }));
  };

  const deleteColumn = (boardId: string, columnId: string) => {
    setBoards(prev => prev.map(board => {
      if (board.id !== boardId) return board;
      
      const newColumns = board.columns.filter(col => col.id !== columnId);
      return { ...board, columns: newColumns };
    }));
  };

  const changeColumnColor = (boardId: string, columnId: string, newColor: string) => {
    setBoards(prev => prev.map(board => {
      if (board.id !== boardId) return board;
      
      const newColumns = board.columns.map(col => 
        col.id === columnId ? { ...col, color: newColor } : col
      );
      return { ...board, columns: newColumns };
    }));
  };

  return (
    <BoardContext.Provider value={{ boards, createNewBoard, deleteBoard, deleteCard, 
      moveCard, updateCard, addCardToBoard, addColumnToBoard, renameColumn, deleteColumn, changeColumnColor 
    }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);