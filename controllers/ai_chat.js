const qwen = require('../services/ollama-service');
const aiTools = require('../services/ai-tool-service');
const agent = require('../services/ai-agent-service');

async function health(req, res) {
  try {
    const qwenHealth = await qwen.health();
    return res.json({
      success: true,
      data: {
        connected: Boolean(qwenHealth.connected),
        ready: Boolean(qwenHealth.model_ready)
      }
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'Không kết nối được dịch vụ AI',
      data: { connected: false, ready: false },
      error: error.code || error.message
    });
  }
}

async function models(req, res) {
  return res.status(404).json({ success: false, message: 'Không hỗ trợ truy vấn thông tin mô hình' });
}

function tools(req, res) {
  return res.json({ success: true, data: aiTools.listTools() });
}

async function chat(req, res) {
  try { return res.json({ success: true, data: await agent.process(req.body || {}) }); }
  catch (error) {
    const status = error.statusCode || (error.code === 'ECONNREFUSED' ? 503 : 502);
    console.error('[AI AGENT 2.0]', error.response?.data || error.message);
    return res.status(status).json({
      success: false,
      message: status === 503 ? 'Dịch vụ AI chưa hoạt động' : error.message || 'Trợ lý AI chưa thể trả lời'
    });
  }
}

function writeSse(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function chatStream(req, res) {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  try {
    writeSse(res, 'status', { message: 'Đang phân tích câu hỏi...' });
    const data = await agent.process(req.body || {});
    if (data.tools_used?.length) writeSse(res, 'status', { message: 'Đã đọc dữ liệu PowerAI...' });
    writeSse(res, 'done', data);
    res.end();
  } catch (error) {
    console.error('[AI AGENT 2.0 STREAM]', error.response?.data || error.message);
    writeSse(res, 'error', { message: error.code === 'ECONNREFUSED' ? 'Dịch vụ AI chưa hoạt động' : error.message || 'Trợ lý AI chưa thể trả lời' });
    res.end();
  }
}

function reset(req, res) {
  agent.reset(req.body?.conversation_id);
  return res.json({ success: true });
}

module.exports = { health, models, tools, chat, chatStream, reset };
