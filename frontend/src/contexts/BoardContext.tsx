import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { DropResult } from '@hello-pangea/dnd';
import type { BoardView, KanbanColumnData, CardView, ColumnId } from '../types';
import { BoardsService } from '../services/boardsService';
import { EmprestimosService } from '../services/emprestimosService';
import { useAuth } from './AuthContext';

interface BoardContextType {
  boards: BoardView[];
  createNewBoard: (title: string) => Promise<void>;
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

export function BoardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); // Pega o usuário logado
  const [boards, setBoards] = useState<BoardView[]>([]);

  // 1. CARREGAR DADOS AO INICIAR
  useEffect(() => {
    if (user) {
      carregarDadosIniciais();
    }
  }, [user]);

  const carregarDadosIniciais = async () => {
    if (!user) return;

    try {
      // Busca Quadros e Empréstimos Atrasados em paralelo
      const [listaQuadros, listaAtrasados] = await Promise.all([
        BoardsService.getAll(user.username),
        EmprestimosService.getAtrasados()
      ]);

      // Processa a injeção dos cartões
      const quadrosAtualizados = listaQuadros.map(board => {
        // Só mexe no quadro 'operacional'
        if (board.id === 'operacional') {
          
          // Encontra a coluna de devoluções (pelo ID 'devolucoes' ou título)
          const colIndex = board.columns.findIndex(c => c.id === 'devolucoes' || c.title.toLowerCase().includes('devoluções'));
          
          if (colIndex === -1) return board; // Se não achar a coluna, retorna igual

          const colunaDevolucoes = { ...board.columns[colIndex] };
          
          // CRIAÇÃO DOS CARTÕES AUTOMÁTICOS
          listaAtrasados.forEach(emp => {
            // Verifica se já existe um card para esse empréstimo para não duplicar
            // Usamos um prefixo 'loan-' no ID para identificar
            const cardId = `loan-${emp.id}`;
            const jaExiste = colunaDevolucoes.cards.some(c => c.id === cardId);

            if (!jaExiste) {
              colunaDevolucoes.cards.push({
                id: cardId,
                title: emp.titulo, // Título do Livro
                priority: 'high',  // Atrasado é prioridade alta
                columnId: colunaDevolucoes.id,
                
                // Dados Extras solicitados:
                cpf: emp.cpfCliente,
                dueDate: emp.dataDevolucao, // Data Vencimento
                isLate: true,
                comment: `Empréstimo atrasado/vencendo. ISBN: ${emp.isbn}`
              });
            }
          });

          // Atualiza a coluna no quadro
          const novasColunas = [...board.columns];
          novasColunas[colIndex] = colunaDevolucoes;
          
          return { ...board, columns: novasColunas };
        }
        return board;
      });

      setBoards(quadrosAtualizados);

    } catch (error) {
      console.error("Erro ao carregar dados do Kanban", error);
    }
  };

  // --- FUNÇÃO AUXILIAR PARA SALVAR NO BANCO ---
  // Atualiza o estado visualmente E chama o serviço para persistir
  const updateBoardState = (newBoards: BoardView[], changedBoardId: string) => {
    setBoards(newBoards); // Atualiza Tela
    
    const changedBoard = newBoards.find(b => b.id === changedBoardId);
    if (changedBoard) {
      // Salva no Backend (Fire and forget - não bloqueia a tela)
      BoardsService.update(changedBoard);
    }
  };

  // --- CRIAR QUADRO ---
  const createNewBoard = async (title: string) => {
    if (!user) return;
    try {
        // Chama o serviço para criar no banco e receber o objeto com ID gerado
        const newBoard = await BoardsService.create(title, user.username);
        setBoards(prev => [...prev, newBoard]);
    } catch (error) {
        console.error("Erro ao criar quadro", error);
    }
  };

  // --- EXCLUIR QUADRO ---
  const deleteBoard = (boardId: string) => {
    if (boardId === 'operacional') {
      alert("O quadro Operacional é padrão do sistema e não pode ser excluído.");
      return;
    }
    if (confirm("Tem certeza que deseja excluir este quadro permanentemente?")) {
      setBoards(prev => prev.filter(b => b.id !== boardId)); // Otimista
      BoardsService.delete(boardId); // Backend
    }
  };

  // --- ADICIONAR CARTÃO ---
  const addCardToBoard = (boardId: string, columnId: string, title: string) => {
    const newBoards = boards.map(board => {
      if (board.id !== boardId) return board;

      const newCard: CardView = {
        id: Math.random().toString(36).substr(2, 9), // ID temporário, idealmente o back geraria
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
    });
    
    updateBoardState(newBoards, boardId);
  };

  // --- MOVER CARTÃO (DRAG AND DROP) ---
  const moveCard = (boardId: string, result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Calculamos o novo estado
    const newBoards = [...boards];
    const boardIndex = newBoards.findIndex(b => b.id === boardId);
    if (boardIndex === -1) return;

    const board = { ...newBoards[boardIndex] };
    const columns = [...board.columns];

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

    // Atualiza Contexto e Banco
    updateBoardState(newBoards, boardId);
  };

  // --- ATUALIZAR CARTÃO ---
  const updateCard = (boardId: string, columnId: string, cardId: string, updates: Partial<CardView>) => {
    const newBoards = boards.map(board => {
      if (board.id !== boardId) return board;

      const newColumns = board.columns.map(col => {
        // Se columnId vier undefined (às vezes acontece), varre todas. Se vier, otimiza.
        if (columnId && col.id !== columnId) return col;

        const newCards = col.cards.map(card => {
          if (card.id !== cardId) return card;
          return { ...card, ...updates };
        });

        return { ...col, cards: newCards };
      });

      return { ...board, columns: newColumns };
    });

    updateBoardState(newBoards, boardId);
  };

  // --- DELETAR CARTÃO ---
  const deleteCard = (boardId: string, cardId: string) => {
    const newBoards = boards.map(board => {
      if (board.id !== boardId) return board;

      const newColumns = board.columns.map(col => ({
        ...col,
        cards: col.cards.filter(c => c.id !== cardId)
      }));

      return { ...board, columns: newColumns };
    });

    updateBoardState(newBoards, boardId);
  };

  // --- ADICIONAR COLUNA ---
  const addColumnToBoard = (boardId: string, title: string) => {
     const newBoards = boards.map(board => {
        if (board.id !== boardId) return board;
        
        const newCol: KanbanColumnData = {
           id: title.toLowerCase().replace(/\s/g, '-'),
           title,
           color: '#E0E0E0', 
           cards: []
        };
        return { ...board, columns: [...board.columns, newCol] };
     });
     
     updateBoardState(newBoards, boardId);
  };

  // --- RENOMEAR COLUNA ---
  const renameColumn = (boardId: string, columnId: string, newTitle: string) => {
    const newBoards = boards.map(board => {
      if (board.id !== boardId) return board;
      
      const newColumns = board.columns.map(col => 
        col.id === columnId ? { ...col, title: newTitle } : col
      );
      return { ...board, columns: newColumns };
    });

    updateBoardState(newBoards, boardId);
  };

  // --- DELETAR COLUNA ---
  const deleteColumn = (boardId: string, columnId: string) => {
    const newBoards = boards.map(board => {
      if (board.id !== boardId) return board;
      
      const newColumns = board.columns.filter(col => col.id !== columnId);
      return { ...board, columns: newColumns };
    });

    updateBoardState(newBoards, boardId);
  };

  // --- MUDAR COR DA COLUNA ---
  const changeColumnColor = (boardId: string, columnId: string, newColor: string) => {
    const newBoards = boards.map(board => {
      if (board.id !== boardId) return board;
      
      const newColumns = board.columns.map(col => 
        col.id === columnId ? { ...col, color: newColor } : col
      );
      return { ...board, columns: newColumns };
    });

    updateBoardState(newBoards, boardId);
  };

  return (
    <BoardContext.Provider value={{ 
        boards, createNewBoard, deleteBoard, deleteCard, 
        moveCard, updateCard, addCardToBoard, addColumnToBoard, 
        renameColumn, deleteColumn, changeColumnColor 
    }}>
      {children}
    </BoardContext.Provider>
  );
}

export const useBoard = () => useContext(BoardContext);