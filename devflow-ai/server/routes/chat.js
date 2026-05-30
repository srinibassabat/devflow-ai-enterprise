const express = require("express");
const router = express.Router();
const { sendMessage, getChatHistory, getChatById, deleteChat } = require("../controllers/chatController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.post("/send", sendMessage);
router.get("/history", getChatHistory);
router.get("/:chatId", getChatById);
router.delete("/:chatId", deleteChat);

module.exports = router;
