import mongoose from "mongoose";

// Esquema do Cartão (dentro do quadro)
const cardSchema = new mongoose.Schema({
  id: String, // ID gerado pelo front (uuid) para controle do Drag&Drop
  title: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  columnId: String,
  comment: String,
  // Dados extras para visualização
  dueDate: String,
  cpf: String,
  isLate: Boolean
});

// Esquema da Coluna
const columnSchema = new mongoose.Schema({
  id: String,
  title: String,
  color: String,
  cards: [cardSchema] // Array de cartões (mantém a ordem)
});

// Esquema do Quadro
const boardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // ID legível (ex: 'operacional')
  title: { type: String, required: true },
  columns: [columnSchema]
});

export default mongoose.model("Board", boardSchema);