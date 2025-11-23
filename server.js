import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

import registrarRotasLivros from "./rotas/rotasLivros.js";
import registrarRotasClientes from "./rotas/rotasClientes.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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


app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
