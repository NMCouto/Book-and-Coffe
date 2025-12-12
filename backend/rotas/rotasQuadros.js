import Board from "../modelos/quadro.js";

// Dados iniciais do quadro operacional (caso o banco esteja vazio)
const BOARD_PADRAO = {
  id: "operacional",
  title: "Operacional",
  columns: [
    { id: "devolucoes", title: "Devoluções", color: "#D32F2F", cards: [] },
    { id: "pendencias", title: "Pendências", color: "#F57C00", cards: [] },
    { id: "todo", title: "A fazer", color: "#1976D2", cards: [] },
    { id: "doing", title: "Em andamento", color: "#448AFF", cards: [] },
    { id: "done", title: "Concluído", color: "#388E3C", cards: [] }
  ]
};

export default function registrarRotasBoards(app) {

  // LISTAR TODOS (E criar o padrão se não existir)
  app.get("/quadros", async (req, res) => {
    try {
      // 1. Tenta buscar o quadro operacional
      let boards = await Board.find();
      
      // 2. Se não existir nenhum (banco zerado) ou não achar o operacional, cria
      const temOperacional = boards.some(b => b.id === 'operacional');
      
      if (!temOperacional) {
        await Board.create(BOARD_PADRAO);
        boards = await Board.find(); // Busca de novo com o criado
      }

      res.json(boards);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ATUALIZAR QUADRO (A rota mais importante do Kanban)
  // O Front manda o estado completo do quadro após mover um card
  app.put("/quadros/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { columns, title } = req.body;

      const boardAtualizado = await Board.findOneAndUpdate(
        { id: id }, // Busca pelo nosso ID customizado (string)
        { columns, title },
        { new: true }
      );

      res.json(boardAtualizado);
    } catch (error) {
      res.status(500).json({ error: "Erro ao atualizar quadro" });
    }
  });

  // CRIAR NOVO QUADRO (Para o futuro, se quiser múltiplos quadros)
  app.post("/quadros", async (req, res) => {
    try {
      const novoBoard = await Board.create(req.body);
      res.json(novoBoard);
    } catch (error) {
      res.status(500).json({ error: "Erro ao criar quadro" });
    }
  });

  app.delete("/quadros/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Impede excluir o quadro padrão
      if (id === 'operacional') {
        return res.status(403).json({ message: "Não é possível excluir o quadro operacional." });
      }

      await Board.findOneAndDelete({ id: id });
      res.json({ message: "Quadro excluído com sucesso" });
    } catch (error) {
      res.status(500).json({ error: "Erro ao excluir quadro" });
    }
  });
}
