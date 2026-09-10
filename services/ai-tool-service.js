const powerAiClient = require('./power-ai-client');

const SEVERITIES = new Set(['warning', 'critical']);
const STATES = new Set(['pending', 'active', 'escalated', 'recovered']);
const SOURCES = new Set(['rule', 'ai_anomaly', 'hybrid']);

function text(value, maxLength = 100) {
  return value == null ? undefined : String(value).trim().slice(0, maxLength) || undefined;
}

function enumList(value, allowed) {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  const normalized = values.map(item => String(item).trim().toLowerCase()).filter(item => allowed.has(item));
  return normalized.length ? [...new Set(normalized)].join(',') : undefined;
}

function incidentTypes(value) {
  const values = Array.isArray(value) ? value : String(value || '').split(',');
  const normalized = values.map(item => String(item).trim().toUpperCase())
    .filter(item => /^[A-Z][A-Z0-9_]{1,79}$/.test(item));
  return normalized.length ? [...new Set(normalized)].join(',') : undefined;
}

function isoDate(value) {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

function alertParameters(parameters = {}, defaults = {}) {
  return {
    meterId: text(parameters.meterId || parameters.meter_id),
    severity: enumList(parameters.severity || parameters.severities, SEVERITIES),
    incidentType: incidentTypes(parameters.incidentType || parameters.incident_type || parameters.incident_types),
    state: enumList(parameters.state || parameters.states || defaults.state, STATES),
    source: enumList(parameters.source || parameters.sources, SOURCES),
    from: isoDate(parameters.from),
    to: isoDate(parameters.to),
    limit: Math.min(Math.max(Number(parameters.limit) || defaults.limit || 20, 1), 100)
  };
}

const TOOL_CATALOG = Object.freeze({
  get_device_health: {
    description: 'Lấy tình trạng sức khỏe và chất lượng dữ liệu của thiết bị',
    requiresMeterId: true,
    run: ({ meterId }) => powerAiClient.getDeviceHealth(meterId)
  },
  get_active_alerts: {
    description: 'Lấy cảnh báo đang hoạt động của thiết bị hoặc toàn hệ thống',
    parameters: {
      meterId: 'string, mã thiết bị nếu người dùng chỉ định',
      incident_types: 'string[] mã loại cảnh báo, ví dụ CURRENT_UNBALANCE',
      severities: 'warning|critical[]',
      sources: 'rule|ai_anomaly|hybrid[]',
      from: 'ISO 8601 có múi giờ', to: 'ISO 8601 có múi giờ', limit: 'integer 1..100'
    },
    requiresMeterId: false,
    normalize: parameters => alertParameters(parameters, { limit: 20 }),
    run: parameters => powerAiClient.getAlerts({
      ...alertParameters(parameters, { limit: 20 }),
      activeOnly: true
    })
  },
  get_alert_history: {
    description: 'Lấy lịch sử cảnh báo của thiết bị',
    parameters: {
      meterId: 'string, mã thiết bị nếu người dùng chỉ định',
      incident_types: 'string[] mã loại cảnh báo', severities: 'warning|critical[]',
      states: 'pending|active|escalated|recovered[]', sources: 'rule|ai_anomaly|hybrid[]',
      from: 'ISO 8601 có múi giờ', to: 'ISO 8601 có múi giờ', limit: 'integer 1..100'
    },
    requiresMeterId: false,
    normalize: parameters => alertParameters(parameters, { limit: 30 }),
    run: parameters => powerAiClient.getAlerts({
      ...alertParameters(parameters, { limit: 30 }),
      history: true,
      includeObservations: true
    })
  },
  get_device_forecast: {
    description: 'Lấy dự báo PowerAI của thiết bị trong số giờ yêu cầu',
    parameters: { meterId: 'string bắt buộc', horizonHours: 'integer 1..168' },
    requiresMeterId: true,
    run: ({ meterId, horizonHours = 24 }) => powerAiClient.getDeviceForecast(
      meterId,
      Math.min(Math.max(Number(horizonHours) || 24, 1), 168)
    )
  },
  get_reading_aggregate: {
    description: 'Tính giá trị lớn nhất, nhỏ nhất hoặc trung bình của thông số điện trong một khoảng thời gian',
    parameters: {
      meterId: 'string bắt buộc', metrics: 'ia|ib|ic|ua|ub|uc[]',
      aggregation: 'max|min|avg', from: 'ISO 8601 có múi giờ', to: 'ISO 8601 có múi giờ'
    },
    requiresMeterId: true,
    normalize: parameters => ({
      meterId: text(parameters.meterId || parameters.meter_id),
      metrics: (Array.isArray(parameters.metrics) ? parameters.metrics : String(parameters.metrics || '').split(','))
        .map(item => String(item).toLowerCase()).filter(item => ['ia', 'ib', 'ic', 'ua', 'ub', 'uc'].includes(item)),
      aggregation: ['max', 'min', 'avg'].includes(String(parameters.aggregation).toLowerCase())
        ? String(parameters.aggregation).toLowerCase() : 'max',
      from: isoDate(parameters.from), to: isoDate(parameters.to)
    }),
    run: parameters => powerAiClient.getReadingAggregate(parameters.meterId, parameters)
  },
  get_powerai_status: {
    description: 'Lấy trạng thái dịch vụ, model và phiên bản PowerAI',
    requiresMeterId: false,
    run: async () => {
      const values = await Promise.allSettled([
        powerAiClient.getServiceHealth(),
        powerAiClient.getModelHealth(),
        powerAiClient.getSystemVersion()
      ]);
      return {
        service: values[0].status === 'fulfilled' ? values[0].value : null,
        model: values[1].status === 'fulfilled' ? values[1].value : null,
        version: values[2].status === 'fulfilled' ? values[2].value : null
      };
    }
  },
  get_model_drift: {
    description: 'Lấy trạng thái độ lệch mô hình PowerAI',
    requiresMeterId: false,
    run: () => powerAiClient.getModelDrift()
  }
});

function listTools() {
  return Object.entries(TOOL_CATALOG).map(([name, item]) => ({
    name,
    description: item.description,
    requires_meter_id: item.requiresMeterId,
    parameters: item.parameters || {}
  }));
}

function normalizePlan(plan, fallbackMeterId) {
  const source = plan && typeof plan === 'object' ? plan : {};
  const requested = Array.isArray(source.tools) ? source.tools : [];
  const tools = requested
    .map((item) => typeof item === 'string' ? { name: item, parameters: {} } : item)
    .filter((item) => item && TOOL_CATALOG[item.name])
    .slice(0, 4)
    .map((item) => ({
      name: item.name,
      parameters: TOOL_CATALOG[item.name].normalize
        ? TOOL_CATALOG[item.name].normalize({
          ...(item.parameters && typeof item.parameters === 'object' ? item.parameters : {}),
          meterId: item.parameters?.meterId || item.parameters?.meter_id || source.meter_id || fallbackMeterId
        })
        : {
        ...(item.parameters && typeof item.parameters === 'object' ? item.parameters : {}),
        meterId: item.parameters?.meterId || source.meter_id || fallbackMeterId || undefined
        }
    }));

  return {
    intent: String(source.intent || 'general_question').slice(0, 80),
    needs_data: Boolean(source.needs_data && tools.length),
    requires_clarification: Boolean(source.requires_clarification),
    clarification_question: String(source.clarification_question || '').slice(0, 300),
    tools
  };
}

async function executePlan(plan) {
  const outputs = [];
  for (const toolCall of plan.tools || []) {
    const tool = TOOL_CATALOG[toolCall.name];
    if (!tool) continue;

    const meterId = toolCall.parameters?.meterId;
    if (tool.requiresMeterId && !meterId) {
      outputs.push({
        tool: toolCall.name,
        success: false,
        error: 'Chưa xác định thiết bị cần tra cứu'
      });
      continue;
    }

    try {
      const data = await tool.run(toolCall.parameters || {});
      outputs.push({ tool: toolCall.name, success: true, data });
    } catch (error) {
      const upstream = error.response?.data;
      const message = typeof upstream === 'string' ? upstream
        : upstream?.detail || upstream?.message
          || (upstream ? JSON.stringify(upstream) : error.message);
      outputs.push({
        tool: toolCall.name,
        success: false,
        error: message
      });
    }
  }
  return outputs;
}

module.exports = { listTools, normalizePlan, executePlan, alertParameters };
