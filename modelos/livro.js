import mongoose from "mongoose";

const livroSchema = new mongoose.Schema({
    "isbn": {
        type: Number,
        required: true
    },
    "titulo": {
        type: String,
        required: true
    },
    "genero": { 
        type: String
    },
    "data_lancamento": {
        type: Date,
        default: Date.now
    },
    "editora": { 
        type: String
    },
    "autor": { 
        type:String, 
        required: true
    },
    "volume":{ type: Number}
});

export default mongoose.model("livro", livroSchema);