import livro from "../modelos/livro.js";

export default function registrarRotasLivros(app){

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
    
    //Excluir o livro
    app.delete("/livros/:id", async (req, res) => {
        try {
            const livroexcluido = await livro.findByIdAndDelete(req.params.id);
            res.json(livroexcluido);
        }catch (error) {
            res.send(error);
        }
    });
}
