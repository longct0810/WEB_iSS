const test = require('node:test');
const assert = require('node:assert/strict');

const agent = require('../services/ai-agent-service');

test('câu hỏi cảnh báo hiện tại luôn được định tuyến sang PowerAI', () => {
  const plan = agent.inferOperationalPlan('Thiết bị đang chọn có cảnh báo nào đang xảy ra?', '366621');
  assert.equal(plan.needs_data, true);
  assert.equal(plan.tools[0].name, 'get_active_alerts');
  assert.equal(plan.tools[0].parameters.meterId, '366621');
});

test('câu hỏi lịch sử nhận diện loại cảnh báo và khoảng ngày', () => {
  const now = new Date('2026-08-12T03:00:00.000Z');
  const plan = agent.inferOperationalPlan('Tìm cảnh báo mất cân bằng dòng trong 7 ngày gần đây.', '366621', now);
  const parameters = plan.tools[0].parameters;
  assert.equal(plan.tools[0].name, 'get_alert_history');
  assert.equal(parameters.incidentType, 'CURRENT_UNBALANCE');
  assert.equal(parameters.from, '2026-08-05T03:00:00.000Z');
  assert.equal(parameters.to, now.toISOString());
});

test('câu hỏi dự báo ngắn vẫn gọi API khi đã chọn thiết bị', () => {
  const plan = agent.inferOperationalPlan('Dự báo giúp tôi.', '366621');
  assert.equal(plan.tools[0].name, 'get_device_forecast');
  assert.equal(plan.requires_clarification, false);
});

test('dự báo yêu cầu chọn thiết bị nếu chưa có ngữ cảnh', () => {
  const plan = agent.inferOperationalPlan('Dự báo giúp tôi.');
  assert.equal(plan.requires_clarification, true);
});

test('giá trị dòng lớn nhất hôm qua gọi tool tổng hợp dữ liệu đo', () => {
  const now = new Date('2026-08-12T03:00:00.000Z');
  const plan = agent.inferOperationalPlan('giá trị dòng lớn nhất ngày hôm qua', '366621', now);
  assert.equal(plan.tools[0].name, 'get_reading_aggregate');
  assert.deepEqual(plan.tools[0].parameters.metrics, ['ia', 'ib', 'ic']);
  assert.equal(plan.tools[0].parameters.aggregation, 'max');
  assert.equal(plan.tools[0].parameters.from, '2026-08-10T17:00:00.000Z');
  assert.equal(plan.tools[0].parameters.to, '2026-08-11T17:00:00.000Z');
});
