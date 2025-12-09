import mongoose from "mongoose";

const emprestimoSchema = new mongoose.Schema({
    titulo: { type: String, required: true},
    isbn: {type: Number, required: true },
    cpf_emprestimo: { type:Number, required: true },
    data_emissao: { type:Date, default: Date.now },
    data_devolucao: { 
        type:Date, 
        default: () =>{
            const data = new Date();
            data.setDate(data.getDate() + 7); //caso a data nao seja definida o padrão é 1 semana 
            return data;
        }
    },
    status: { type: String, required: true, default: "Pendente"}
});

export default mongoose.model("emprestimo", emprestimoSchema);