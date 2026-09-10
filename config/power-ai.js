const fs = require('fs');
const dotenv = require('dotenv');

function cleanUrl(value, fallback) {
  return String(value || fallback).trim().replace(/\/+$/, '');
}

function loadSharedSecrets(filePath) {
  const path = String(filePath || '').trim();
  if (!path) return {};
  try {
    return dotenv.parse(fs.readFileSync(path));
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error(`[POWER-AI] Không đọc được POWERAI_ENV_FILE: ${error.message}`);
    }
    return {};
  }
}

const configured =
  process.env.POWERAI_API_URL ||
  process.env.POWER_AI_URL ||
  process.env.POWER_AI_BASE_URL;

const sharedSecrets = loadSharedSecrets(process.env.POWERAI_ENV_FILE);
const apiKey = process.env.POWERAI_API_KEY
  || process.env.POWER_AI_API_KEY
  || sharedSecrets.SERVICE_API_KEY
  || '';
const adminKey = process.env.POWERAI_ADMIN_KEY
  || process.env.POWER_AI_ADMIN_KEY
  || sharedSecrets.ADMIN_API_KEY
  || '';

if (process.env.NODE_ENV === 'production' && !configured) {
  throw new Error('Production yêu cầu cấu hình POWERAI_API_URL');
}

module.exports = Object.freeze({
  baseUrl: cleanUrl(configured, 'http://127.0.0.1:8080'),
  timeoutMs: Number(process.env.POWERAI_TIMEOUT_MS || process.env.POWER_AI_TIMEOUT_MS || 10000),
  apiKey,
  adminKey,
  authConfigured: Boolean(apiKey)
});
