import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  response: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ["chatbot", "voice"], required: true },
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
