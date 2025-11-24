import emprestimo from "../modelos/emprestimo.js";

export default function registrarRotasEmprestimos(app){
    // Criar cliente
    app.post("/emprestimos", async (req, res) => {
        try {
            const novoEmprestimo = await emprestimo.create(req.body);
            res.json(novoEmprestimo);
        } catch (error) {
            res.send(error);
        }
    });

    // Listar clientes
    app.get("/emprestimos", async (req, res) => {
        try {
            const emprestimo = await emprestimo.find();
            res.json(emprestimo);
        } catch (error) {
            res.send(error);
        }
    });

    // Atualizar cliente
    app.put("/emprestimos/:id", async (req, res) => {
        try {
            const atualizado = await emprestimo.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(atualizado);
        } catch (error) {
            res.send(error);
        }
    });

    // Excluir cliente
    app.delete("/emprestimos/:id", async (req, res) => {
        try {
            const excluido = await emprestimo.findByIdAndDelete(req.params.id);
            res.json(excluido);
        } catch (error) {
            res.send(error);
        }
    });
}