import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    comment: { type: String, default: "" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    columnId: { type: String, required: true }, // ex: "todo", "doing", "done"
    createdAt: { type: Date, default: Date.now }
});

const Card = mongoose.model("Card", CardSchema);
export default Card;
