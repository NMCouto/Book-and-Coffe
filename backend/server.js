import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import registrarRotasLivros from "./rotas/rotasLivros.js";
import registrarRotasClientes from "./rotas/rotasClientes.js";
import registrarRotasEmprestimos from "./rotas/rotasEmprestimos.js";
import registrarRotasCards from "./rotas/cards.js";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:3000", "http://localhost:5173"]
}));


// Conecta ao MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Conectado ao MongoDB");
    } catch (error) {
        console.log("Erro ao conectar ao MongoDB", error);
    }
};

connectDB();

//as rotas ficam resgistradas aqui 
registrarRotasLivros(app);
registrarRotasClientes(app);
registrarRotasEmprestimos(app);
registrarRotasCards(app);


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
