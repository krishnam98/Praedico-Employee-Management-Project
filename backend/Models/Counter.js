import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  seq: { type: Number, default: 9999 },
});

export default mongoose.model("Counter", counterSchema);
