import emprestimo from "../modelos/emprestimo.js";

export default function registrarRotasEmprestimos(app){
    app.post("/emprestimos", async (req, res) => {
        try {
            const novoEmprestimo = await emprestimo.create(req.body);
            res.json(novoEmprestimo);
        } catch (error) {
            res.send(error);
        }
    });

    app.get("/emprestimos", async (req, res) => {
        try {
            const lista = await emprestimo.find();
            res.json(lista);
        } catch (error) {
            res.send(error);
        }
    });

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

    app.delete("/emprestimos/:id", async (req, res) => {
        try {
            const excluido = await emprestimo.findByIdAndDelete(req.params.id);
            res.json(excluido);
        } catch (error) {
            res.send(error);
        }
    });

     app.get("/emprestimos/devolucaoHoje", async (req, res) => {
        try {
            const inicio = new Date();
            inicio.setHours(0, 0, 0, 0);

            const fim = new Date();
            fim.setHours(23, 59, 59, 999);

            const emprestimosHoje = await emprestimo.find({
                data_devolucao: { $gte: inicio, $lte: fim }
            });

            res.json(emprestimosHoje);
        } catch (error) {
            res.send(error);
        }
    });

}