const test = require('node:test');
const assert = require('node:assert/strict');

const tools = require('../services/ai-tool-service');

test('catalog công bố schema tham số để Qwen lập kế hoạch', () => {
  const alerts = tools.listTools().find(item => item.name === 'get_alert_history');
  assert.ok(alerts);
  assert.equal(alerts.parameters.from, 'ISO 8601 có múi giờ');
  assert.match(alerts.parameters.incident_types, /mã loại cảnh báo/);
});

test('normalizePlan chuẩn hóa và giới hạn tham số cảnh báo', () => {
  const plan = tools.normalizePlan({
    intent: 'search_alerts',
    needs_data: true,
    tools: [{
      name: 'get_alert_history',
      parameters: {
        meter_id: ' 102 ',
        incident_types: ['current_unbalance', 'INVALID TYPE'],
        severities: ['critical', 'unknown'],
        states: ['active', 'recovered', 'bad'],
        from: '2026-08-11T09:15:00+07:00',
        to: 'not-a-date',
        limit: 999
      }
    }]
  });

  assert.equal(plan.needs_data, true);
  assert.deepEqual(plan.tools[0], {
    name: 'get_alert_history',
    parameters: {
      meterId: '102',
      severity: 'critical',
      incidentType: 'CURRENT_UNBALANCE',
      state: 'active,recovered',
      source: undefined,
      from: '2026-08-11T02:15:00.000Z',
      to: undefined,
      limit: 100
    }
  });
});

test('tool không có trong whitelist bị loại bỏ', () => {
  const plan = tools.normalizePlan({
    needs_data: true,
    tools: [{ name: 'call_any_url', parameters: { url: 'https://example.com' } }]
  });
  assert.equal(plan.needs_data, false);
  assert.deepEqual(plan.tools, []);
});
