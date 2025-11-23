import Cliente from "../modelos/cliente.js";

export default function registrarRotasClientes(app){
    // Criar cliente
    app.post("/clientes", async (req, res) => {
        try {
            const novoCliente = await Cliente.create(req.body);
            res.json(novoCliente);
        } catch (error) {
            res.send(error);
        }
    });

    // Listar clientes
    app.get("/clientes", async (req, res) => {
        try {
            const clientes = await Cliente.find();
            res.json(clientes);
        } catch (error) {
            res.send(error);
        }
    });

    // Atualizar cliente
    app.put("/clientes/:id", async (req, res) => {
        try {
            const atualizado = await Cliente.findByIdAndUpdate(
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
    app.delete("/clientes/:id", async (req, res) => {
        try {
            const excluido = await Cliente.findByIdAndDelete(req.params.id);
            res.json(excluido);
        } catch (error) {
            res.send(error);
        }
    });
}