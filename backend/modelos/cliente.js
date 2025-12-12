import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
    cpf: { type: Number, required: true },
    nome: { type : String, required: true },
    Telefone: { type: String, required: true },
    DataNasc: { type: Date},
    CEP: { type: Number }
})

export default mongoose.model("Cliente", clienteSchema);