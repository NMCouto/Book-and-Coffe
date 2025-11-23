import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import livro from "./modelos/livro.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());//converte as requisições para JSON 

//conecta ao servidor do MongoDB Atlas
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado ao MongoDB');
    } catch (error) {
        console.log('Erro ao Conectar ao MongoDB', error);

    }
};

connectDB();

//para criar e adicionar o livro no banco de dados 
app.post("/livros", async (req, res) => {
    try {
        const novolivro = await livro.create(req.body);
        res.json(novolivro);
    } catch (error) {
        res.send(error);
    }
});

//Visualiza os livros existentes no banco de dados 
app.get("/livros", async(req, res) => {
    try{
        const livros = await livro.find();
        res.json(livros);
    }catch (error){
        res.send(error);
    }
});

//atualiza um livro existente pelo id 
app.put("/livros/:id", async(req, res) => {
    try{
        const novolivro = await livro.findByIdAndUpdate(req.params.id, req.body);
        res.json(novolivro);
    }catch (error){
        res.send(error);
    }
});

app.delete("/livros/:id", async (req, res) => {
    try {
        const livroexcluido = await livro.findByIdAndDelete(req.params.id);
        res.json(livroexcluido);
    }catch (error) {
        res.send(error);
    }
});


app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
});



