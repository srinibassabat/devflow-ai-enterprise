const { GoogleGenerativeAI } = require("@google/generative-ai");
const Chat = require("../models/Chat");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Send message to Gemini AI
// @route   POST /api/chat/send
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { message, chatId } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // System context for developer assistant
    const systemContext = `You are DevFlow AI, an expert coding assistant integrated into a developer productivity platform. 
    You help developers with:
    - Writing and debugging code (React, Node.js, Express, MongoDB, JavaScript, Python, etc.)
    - Explaining programming concepts clearly
    - Reviewing code for best practices
    - Suggesting architecture patterns
    - Helping with MERN stack development
    Be concise, practical, and provide working code examples when relevant.`;

    const prompt = `${systemContext}\n\nDeveloper asks: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiMessage = response.text();

    // Save or update chat history in MongoDB
    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: req.user._id });
      if (chat) {
        chat.messages.push({ role: "user", content: message });
        chat.messages.push({ role: "assistant", content: aiMessage });
        await chat.save();
      }
    }

    if (!chat) {
      // Create new chat session
      const title = message.length > 40 ? message.substring(0, 40) + "..." : message;
      chat = await Chat.create({
        user: req.user._id,
        title,
        messages: [
          { role: "user", content: message },
          { role: "assistant", content: aiMessage },
        ],
      });
    }

    res.json({
      reply: aiMessage,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Gemini AI Error:", error.message);
    res.status(500).json({ message: "AI service error", error: error.message });
  }
};

// @desc    Get all chat sessions for user
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id })
      .select("title createdAt")
      .sort({ createdAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get specific chat messages
// @route   GET /api/chat/:chatId
// @access  Private
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chat/:chatId
// @access  Private
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.chatId, user: req.user._id });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    await chat.deleteOne();
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { sendMessage, getChatHistory, getChatById, deleteChat };
