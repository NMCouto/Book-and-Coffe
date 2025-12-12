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

     app.get("/emprestimos/atrasados", async (req, res) => {
        try {
            const fimHoje = new Date();
            fimHoje.setHours(23, 59, 59, 999);

            // Busca: Data devolução é menor ou igual a hoje E Status não é "Devolvido"
            const pendentes = await emprestimo.find({
                data_devolucao: { $lte: fimHoje },
                status: { $ne: 'Devolvido' } // Ignora os já finalizados
            });

            res.json(pendentes);
        } catch (error) {
            res.status(500).send(error);
        }
    });

}