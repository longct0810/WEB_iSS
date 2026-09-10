const axios = require('axios');
const config = require('../config/ai-agent');

const baseURL = config.qwenApiUrl;
const model = config.qwenModel;

const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
if (config.qwenApiKey) headers.Authorization = `Bearer ${config.qwenApiKey}`;

const client = axios.create({ baseURL, timeout: config.qwenTimeoutMs, headers });

function stripThinkingContent(value) {
  return String(value || '')
    .replace(/<think(?:\s[^>]*)?>[\s\S]*?<\/think>/gi, '')
    .replace(/<thinking(?:\s[^>]*)?>[\s\S]*?<\/thinking>/gi, '')
    .replace(/^[\s\S]*?<\/think>/i, '')
    .replace(/^[\s\S]*?<\/thinking>/i, '')
    .trim();
}

function vietnameseScore(value) {
  const text = String(value || '').toLowerCase();
  const viChars = (text.match(/[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/g) || []).length;
  const viWords = (text.match(/\b(và|là|của|có|không|được|thiết bị|điện áp|dòng điện|hệ thống|cảnh báo|dữ liệu|nguyên nhân|khuyến nghị|hiện tại|chưa đủ)\b/g) || []).length;
  const enWords = (text.match(/\b(the|and|this|that|user|need|think|answer|because|with|from|what|how|should|here|okay|wait|first|translat|tool results?)\w*\b/g) || []).length;
  return viChars + viWords * 2 - enWords * 4;
}

function looksEnglishOrReasoning(value) {
  const text = String(value || '').trim();
  if (!text) return false;
  return vietnameseScore(text) < 0 || /\b(okay|let me|the user|i need|first,|wait,|tool_results?|chain of thought|reasoning|translat(?:e|ing))\b/i.test(text);
}

async function health() {
  const response = await client.get('/api/tags', { timeout: 5000 });
  const models = Array.isArray(response.data?.models) ? response.data.models : [];
  return {
    connected: true,
    base_url: baseURL,
    model,
    model_ready: models.some((item) => item.name === model || item.model === model),
    models: models.map((item) => item.name || item.model).filter(Boolean)
  };
}

async function chat(messages, options = {}) {
  const payload = {
    model,
    messages,
    stream: false,
    think: false,
    keep_alive: config.qwenKeepAlive,
    options: {
      temperature: config.qwenTemperature,
      num_ctx: config.qwenNumCtx,
      num_predict: config.qwenNumPredict,
      ...(options.options || options)
    }
  };
  if (options.format) payload.format = options.format;

  const response = await client.post('/api/chat', payload);
  return {
    answer: stripThinkingContent(response.data?.message?.content),
    model: response.data?.model || model,
    done: Boolean(response.data?.done),
    total_duration: response.data?.total_duration || null,
    eval_count: response.data?.eval_count || null
  };
}

module.exports = {
  health,
  chat,
  model,
  baseURL,
  stripThinkingContent,
  looksEnglishOrReasoning
};
