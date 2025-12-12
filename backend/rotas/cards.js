import Card from "../modelos/Card.js";

export default function registrarRotasCards(app) {

    // Criar card
    app.post("/cards", async (req, res) => {
        try {
            const novoCard = await Card.create(req.body);
            res.json(novoCard);
        } catch (error) {
            res.status(500).json({ error: "Erro ao criar card" });
        }
    });

    // Listar cards
    app.get("/cards", async (req, res) => {
        try {
            const cards = await Card.find();
            res.json(cards);
        } catch (error) {
            res.status(500).json({ error: "Erro ao buscar cards" });
        }
    });

    // Atualizar card (coluna, título, comentário...)
    app.put("/cards/:id", async (req, res) => {
        try {
            const atualizado = await Card.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            res.json(atualizado);
        } catch (error) {
            res.status(500).json({ error: "Erro ao atualizar card" });
        }
    });

    // Deletar card
    app.delete("/cards/:id", async (req, res) => {
        try {
            await Card.findByIdAndDelete(req.params.id);
            res.json({ message: "Card apagado" });
        } catch (error) {
            res.status(500).json({ error: "Erro ao apagar card" });
        }
    });
}
