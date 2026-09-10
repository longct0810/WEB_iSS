const test = require('node:test');
const assert = require('node:assert/strict');

const CONFIG_PATH = require.resolve('../config/power-ai');

function loadConfig(env) {
  const previous = { ...process.env };
  Object.assign(process.env, env);
  delete require.cache[CONFIG_PATH];
  try {
    return require(CONFIG_PATH);
  } finally {
    process.env = previous;
    delete require.cache[CONFIG_PATH];
  }
}

test('PowerAI config ưu tiên tên biến chuẩn và loại bỏ dấu / cuối URL', () => {
  const config = loadConfig({
    NODE_ENV: 'test',
    POWERAI_API_URL: 'http://127.0.0.1:8080///',
    POWERAI_API_KEY: 'service-key',
    POWER_AI_URL: 'http://legacy.invalid'
  });
  assert.equal(config.baseUrl, 'http://127.0.0.1:8080');
  assert.equal(config.apiKey, 'service-key');
  assert.equal(config.authConfigured, true);
});

test('thiếu khóa PowerAI được phản ánh mà không làm dừng SCADA', () => {
  const config = loadConfig({
    NODE_ENV: 'production',
    POWERAI_API_URL: 'http://127.0.0.1:8080',
    POWERAI_API_KEY: '',
    POWER_AI_API_KEY: ''
  });
  assert.equal(config.authConfigured, false);
});
