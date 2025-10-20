import express from "express";
import Chat from "../models/Chat.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all chats for the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ timestamp: -1 });
    res.json(chats);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Save a new chat
router.post("/", auth, async (req, res) => {
  const { message, response, type } = req.body;
  try {
    const chat = await Chat.create({ userId: req.user.id, message, response, type });
    res.json(chat);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a chat by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const chat = await Chat.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json({ message: "Chat deleted" });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
