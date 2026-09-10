function cleanUrl(value, fallback) {
  return String(value || fallback).trim().replace(/\/+$/, '');
}

module.exports = Object.freeze({
  qwenApiUrl: cleanUrl(
    process.env.QWEN_API_URL || process.env.OLLAMA_URL,
    'http://127.0.0.1:11434'
  ),
  qwenModel: process.env.QWEN_MODEL || process.env.OLLAMA_MODEL || 'qwen3:4b',
  qwenTimeoutMs: Number(process.env.QWEN_TIMEOUT_MS || process.env.OLLAMA_TIMEOUT_MS || 120000),
  qwenApiKey: process.env.QWEN_API_KEY || '',
  qwenNumCtx: Number(process.env.QWEN_NUM_CTX || process.env.OLLAMA_NUM_CTX || 8192),
  qwenNumPredict: Number(process.env.QWEN_NUM_PREDICT || process.env.OLLAMA_NUM_PREDICT || 700),
  qwenTemperature: Number(process.env.QWEN_TEMPERATURE || process.env.OLLAMA_TEMPERATURE || 0.1),
  qwenKeepAlive: process.env.QWEN_KEEP_ALIVE || process.env.OLLAMA_KEEP_ALIVE || '10m',
  maxHistoryMessages: Number(process.env.AI_MAX_HISTORY_MESSAGES || 12),
  maxConversations: Number(process.env.AI_MAX_CONVERSATIONS || 300)
});
