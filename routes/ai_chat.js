const express = require('express');
const router = express.Router();
const aiChatController = require('../controllers/ai_chat_controller');

router.get('/health', aiChatController.health);
router.post('/chat', aiChatController.chat);

module.exports = router;
