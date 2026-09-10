const { chatWithOllama, checkOllamaHealth } = require('../services/ollama-service');

const SYSTEM_PROMPT = [
  'Bạn là trợ lý AI của hệ thống giám sát trạm biến áp iSS.',
  'Luôn trả lời bằng tiếng Việt, rõ ràng, ngắn gọn và đúng chuyên môn điện.',
  'Không tự tạo số liệu, trạng thái thiết bị hoặc kết quả cảnh báo.',
  'Chỉ kết luận tình trạng vận hành khi dữ liệu được cung cấp trong ngữ cảnh.',
  'Khi chưa đủ dữ liệu, phải nói rõ chưa đủ dữ liệu để kết luận.',
  'Khuyến nghị phải mang tính hỗ trợ vận hành; không thay thế quy trình an toàn và người có thẩm quyền.'
].join(' ');

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .slice(-10)
    .filter((item) => item && ['user', 'assistant'].includes(item.role))
    .map((item) => ({
      role: item.role,
      content: String(item.content || '').trim().slice(0, 4000)
    }))
    .filter((item) => item.content);
}

async function chat(req, res) {
  try {
    const question = String(req.body?.question || '').trim();
    if (!question) {
      return res.status(400).json({ success: false, message: 'Câu hỏi không được để trống' });
    }
    if (question.length > 2000) {
      return res.status(400).json({ success: false, message: 'Câu hỏi vượt quá 2.000 ký tự' });
    }

    const context = req.body?.context && typeof req.body.context === 'object'
      ? JSON.stringify(req.body.context)
      : '';

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...sanitizeHistory(req.body?.history)
    ];

    if (context) {
      messages.push({
        role: 'system',
        content: `Ngữ cảnh iSS/PowerAI do hệ thống cung cấp:\n${context.slice(0, 12000)}`
      });
    }

    messages.push({ role: 'user', content: question });

    const result = await chatWithOllama(messages);
    return res.json({ success: true, answer: result.content });
  } catch (error) {
    console.error('[AI CHAT]', error);
    return res.status(503).json({
      success: false,
      message: 'Chatbot AI hiện không khả dụng'
    });
  }
}

async function health(req, res) {
  const status = await checkOllamaHealth();
  return res.status(status.online ? 200 : 503).json({ success: status.online });
}

module.exports = { chat, health };
