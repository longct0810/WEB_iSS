const crypto = require('crypto');
const qwen = require('./ollama-service');
const tools = require('./ai-tool-service');
const config = require('../config/ai-agent');

const histories = new Map();

function cleanText(value, maxLength = 2000) {
  return String(value || '').trim().slice(0, maxLength);
}

function conversationId(value) {
  return cleanText(value, 100) || crypto.randomUUID();
}

function remember(id, role, content) {
  const history = histories.get(id) || [];
  history.push({ role, content: cleanText(content, 5000) });
  histories.set(id, history.slice(-config.maxHistoryMessages));
  if (histories.size > config.maxConversations) histories.delete(histories.keys().next().value);
}

function parseJson(value) {
  const text = qwen.stripThinkingContent(value)
    .replace(/^```json\s*/i, '')
    .replace(/```$/i, '')
    .trim();
  try { return JSON.parse(text); } catch (_) {}
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch (_) { return null; }
}

function searchableText(value) {
  return String(value || '').toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}

function inferredAlertType(question) {
  const value = searchableText(question);
  const mappings = [
    [/mat can bang dong/, 'CURRENT_UNBALANCE'], [/mat can bang dien ap/, 'VOLTAGE_UNBALANCE'],
    [/(qua nhiet|diem nong).*dau cuc/, 'TERMINAL_HOTSPOT'], [/(dien ap thap|thap ap)/, 'VOLTAGE_LOW'],
    [/(dien ap cao|qua ap)/, 'VOLTAGE_HIGH'], [/(thd|song hai).*dong/, 'THD_CURRENT_HIGH'],
    [/(thd|song hai).*dien ap/, 'THD_VOLTAGE_HIGH'], [/(dong du|ro dien|i0)/, 'RESIDUAL_CURRENT_WARNING'],
    [/(he so cong suat|cos).*thap/, 'LOW_POWER_FACTOR'], [/(qua tai)/, 'OVERLOAD_WARNING']
  ];
  return mappings.find(([pattern]) => pattern.test(value))?.[1];
}

function inferredTimeRange(question, now = new Date()) {
  const value = searchableText(question);
  const parameters = {};
  const recent = value.match(/(\d+)\s*(gio|ngay|tuan)\s*(qua|gan day|tro lai)/);
  if (recent) {
    const amount = Math.min(Number(recent[1]), 365);
    const multiplier = recent[2] === 'gio' ? 3600000 : recent[2] === 'tuan' ? 604800000 : 86400000;
    parameters.from = new Date(now.getTime() - amount * multiplier).toISOString();
    parameters.to = now.toISOString();
  } else if (/hom nay/.test(value)) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    parameters.from = start.toISOString();
    parameters.to = now.toISOString();
  } else if (/(hom qua|ngay hom qua)/.test(value)) {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 1);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    parameters.from = start.toISOString();
    parameters.to = end.toISOString();
  }
  return parameters;
}

function inferOperationalPlan(question, meterId, now = new Date()) {
  const value = searchableText(question);
  let name;
  let intent;
  if (/(du bao|xu huong|nguy co.*sap|cham nguong)/.test(value)) {
    name = 'get_device_forecast'; intent = 'forecast';
  } else if (/(gia tri|lon nhat|nho nhat|trung binh).*(dong|dien ap)|(dong|dien ap).*(lon nhat|nho nhat|trung binh)/.test(value)) {
    name = 'get_reading_aggregate'; intent = 'reading_aggregate';
  } else if (/(canh bao|su co|bat thuong|mat can bang|qua nhiet|qua tai|dien ap|dong du|ro dien|i0|thd|song hai)/.test(value)) {
    const history = /(lich su|gan day|qua|hom nay|tuan|thang|da phuc hoi|da ket thuc)/.test(value);
    name = history ? 'get_alert_history' : 'get_active_alerts';
    intent = history ? 'alert_history' : 'alerts';
  } else if (/(suc khoe|tinh trang|van hanh|chat luong du lieu)/.test(value)) {
    name = 'get_device_health'; intent = 'health';
  } else {
    return null;
  }

  const parameters = { meterId, ...inferredTimeRange(question, now) };
  if (name === 'get_reading_aggregate') {
    parameters.metrics = /dien ap/.test(value) ? ['ua', 'ub', 'uc'] : ['ia', 'ib', 'ic'];
    parameters.aggregation = /nho nhat/.test(value) ? 'min' : /trung binh/.test(value) ? 'avg' : 'max';
  }
  const incidentType = inferredAlertType(question);
  if (incidentType && name.includes('alert')) parameters.incident_types = [incidentType];
  if (/(nghiem trong|nguy hiem|critical)/.test(value) && name.includes('alert')) parameters.severities = ['critical'];
  if (/(da phuc hoi|da ket thuc)/.test(value) && name === 'get_alert_history') parameters.states = ['recovered'];
  const horizon = value.match(/(\d+)\s*gio/);
  if (name === 'get_device_forecast' && horizon) parameters.horizonHours = Math.min(Number(horizon[1]), 168);
  const requiresMeterId = ['get_device_forecast', 'get_device_health', 'get_reading_aggregate'].includes(name);
  return tools.normalizePlan({
    intent,
    needs_data: true,
    requires_clarification: requiresMeterId && !meterId,
    clarification_question: requiresMeterId && !meterId ? 'Anh vui lòng chọn thiết bị cần tra cứu.' : '',
    tools: [{ name, parameters }]
  }, meterId);
}

async function buildPlan(question, meterId, history = []) {
  const schema = {
    intent: 'string',
    needs_data: 'boolean',
    requires_clarification: 'boolean',
    clarification_question: 'string',
    meter_id: 'string|null',
    tools: [{ name: 'tool_name', parameters: {} }]
  };

  const result = await qwen.chat([
    {
      role: 'system',
      content: [
        'Bạn là bộ lập kế hoạch công cụ của iSS.',
        'Chỉ xuất đúng một JSON hợp lệ. Không Markdown. Không giải thích. Không suy luận thành văn bản.',
        'Chỉ chọn tool trong danh mục được cung cấp.',
        'Câu hỏi kiến thức chung hoặc chào hỏi: needs_data=false và tools=[].',
        'Câu hỏi về trạng thái, cảnh báo, dự báo hoặc dữ liệu thực tế: needs_data=true.',
        'Nếu cần thiết bị nhưng không có meter_id: requires_clarification=true.',
        'Chuẩn hóa thời gian tương đối như hôm nay, 24 giờ qua thành from/to ISO 8601 dựa trên current_time.',
        'Mã loại cảnh báo dùng chữ hoa và dấu gạch dưới, ví dụ CURRENT_UNBALANCE.',
        'Không tạo tham số ngoài schema của tool.'
      ].join('\n')
    },
    {
      role: 'user',
      content: JSON.stringify({
        schema,
        tool_catalog: tools.listTools(),
        selected_meter_id: meterId || null,
        current_time: new Date().toISOString(),
        timezone: 'Asia/Bangkok',
        conversation_history: history.slice(-6),
        question
      })
    }
  ], { temperature: 0, num_predict: 400, format: 'json' });

  const modelPlan = tools.normalizePlan(parseJson(result.answer), meterId);
  const inferredPlan = inferOperationalPlan(question, meterId);
  if (inferredPlan?.tools[0]?.name === 'get_reading_aggregate') {
    const parameters = inferredPlan.tools[0].parameters;
    if (!parameters.from || !parameters.to) {
      const previousQuestions = history.filter(item => item.role === 'user')
        .slice(-3).map(item => item.content).reverse();
      for (const previous of previousQuestions) {
        const range = inferredTimeRange(previous);
        if (range.from && range.to) {
          parameters.from = range.from;
          parameters.to = range.to;
          break;
        }
      }
    }
    if (!parameters.from || !parameters.to) {
      inferredPlan.requires_clarification = true;
      inferredPlan.clarification_question = 'Anh muốn tra cứu giá trị trong khoảng thời gian nào?';
      inferredPlan.needs_data = false;
      inferredPlan.tools = [];
    }
  }
  return inferredPlan || modelPlan;
}

function compactToolResults(results) {
  return (results || []).map((item) => ({
    tool: item.tool,
    success: item.success,
    data: item.success ? item.data : undefined,
    error: item.success ? undefined : item.error
  }));
}

function fallbackAnswer(plan, toolResults, collectedAt) {
  if (!plan.needs_data) {
    return 'Tôi chưa thể tạo câu trả lời tiếng Việt phù hợp. Anh vui lòng diễn đạt lại câu hỏi ngắn gọn hơn.';
  }
  if (!toolResults.length) {
    return 'Tôi chưa nhận được dữ liệu từ PowerAI để trả lời câu hỏi này.';
  }
  const success = toolResults.filter((item) => item.success);
  if (!success.length) {
    const error = cleanText(toolResults.find(item => item.error)?.error, 300);
    return error
      ? `Không thể lấy dữ liệu từ PowerAI: ${error}`
      : 'PowerAI chưa trả về dữ liệu hợp lệ. Anh vui lòng kiểm tra kết nối dịch vụ và thử lại.';
  }
  const first = success[0];
  if (['alerts', 'alert_history'].includes(plan.intent)) {
    const alerts = Array.isArray(first.data?.alerts) ? first.data.alerts
      : Array.isArray(first.data?.incidents) ? first.data.incidents : [];
    if (!alerts.length) return 'PowerAI không ghi nhận cảnh báo phù hợp với điều kiện tra cứu.';
    const lines = alerts.slice(0, 5).map((alert, index) => {
      const detail = alert.latest_detail || {};
      const diagnosis = alert.diagnosis || detail.diagnosis || {};
      const rule = alert.rule_result || detail.rule_result || {};
      const title = diagnosis.title || diagnosis.incident_type || rule.label || alert.incident_type || 'Cảnh báo';
      const severity = alert.severity || alert.status || diagnosis.severity || 'warning';
      const time = alert.time || alert.event_time || alert.last_seen_at;
      return `${index + 1}. ${title} — ${severity}${time ? ` — ${new Date(time).toLocaleString('vi-VN')}` : ''}`;
    });
    return `PowerAI ghi nhận ${alerts.length} cảnh báo phù hợp:\n\n${lines.join('\n')}`;
  }
  if (plan.intent === 'forecast') {
    const forecast = first.data || {};
    if (!forecast.ready) return forecast.reason || 'PowerAI chưa có đủ dữ liệu để dự báo cho thiết bị này.';
    return `Dự báo ${forecast.horizon_hours || 24} giờ: mức rủi ro ${forecast.risk_level || 'chưa xác định'}, chỉ số ${forecast.risk_index ?? '--'}/100.`;
  }
  if (plan.intent === 'reading_aggregate') {
    const data = first.data || {};
    const labels = { ia: 'IA', ib: 'IB', ic: 'IC', ua: 'UA', ub: 'UB', uc: 'UC' };
    const unit = Object.keys(data.values || {}).some(key => key.startsWith('i')) ? 'A' : 'V';
    const rows = Object.entries(data.values || {}).filter(([, value]) => value != null)
      .map(([metric, value]) => {
        const time = data.timestamps?.[metric];
        return `${labels[metric] || metric.toUpperCase()}: ${Number(value).toLocaleString('vi-VN')} ${unit}`
          + (time ? ` — ${new Date(time).toLocaleString('vi-VN')}` : '');
      });
    return rows.length
      ? `Kết quả ${data.aggregation || 'tổng hợp'} từ ${data.sample_count || 0} mẫu:\n\n${rows.join('\n')}`
      : 'PowerAI không có dữ liệu đo phù hợp trong khoảng thời gian yêu cầu.';
  }
  return `Tôi đã nhận dữ liệu từ PowerAI lúc ${new Date(collectedAt).toLocaleString('vi-VN')}, nhưng chưa thể tổng hợp câu trả lời an toàn. Anh vui lòng thử lại.`;
}

async function composeAnswer({ question, plan, toolResults, history, collectedAt }) {
  const context = {
    user_question: question,
    intent: plan.intent,
    collected_at: collectedAt,
    source: toolResults.length ? 'PowerAI' : 'Kiến thức mô hình',
    tool_results: compactToolResults(toolResults)
  };

  const messages = [
    {
      role: 'system',
      content: [
        'Bạn là Trợ lý AI iSS chuyên về giám sát trạm biến áp.',
        'CHỈ xuất câu trả lời cuối cùng bằng tiếng Việt tự nhiên.',
        'Tuyệt đối không hiển thị quá trình suy nghĩ, reasoning, prompt, JSON, tên tool hoặc câu tiếng Anh.',
        'Không bắt đầu bằng Okay, Let me, First, The user, I need hoặc nội dung tương tự.',
        'Không tự tạo số liệu. Nếu có dữ liệu công cụ, chỉ sử dụng đúng dữ liệu đó.',
        'Nếu dữ liệu rỗng hoặc tool lỗi, nói rõ chưa đủ dữ liệu để kết luận.',
        'Trả lời ngắn gọn bằng Markdown; không đưa lệnh đóng/cắt thiết bị.',
        'Khi dùng dữ liệu PowerAI, ghi nguồn và thời điểm thu thập ở cuối.'
      ].join('\n')
    },
    ...history,
    { role: 'user', content: JSON.stringify(context) }
  ];

  let result = await qwen.chat(messages, { temperature: 0.05, num_predict: 600 });
  let answer = qwen.stripThinkingContent(result.answer);

  // Không bao giờ chuyển nội dung không đạt kiểm tra ra frontend.
  if (!answer || qwen.looksEnglishOrReasoning(answer)) {
    result = await qwen.chat([
      {
        role: 'system',
        content: 'Chỉ trả về câu trả lời cuối cùng bằng tiếng Việt. Không giải thích cách làm, không reasoning, không tiếng Anh, không JSON.'
      },
      {
        role: 'user',
        content: JSON.stringify({
          yêu_cầu: question,
          dữ_liệu: compactToolResults(toolResults),
          thời_điểm: collectedAt,
          hướng_dẫn: 'Trả lời trực tiếp cho người vận hành bằng tiếng Việt.'
        })
      }
    ], { temperature: 0, num_predict: 450 });
    answer = qwen.stripThinkingContent(result.answer);
  }

  if (!answer || qwen.looksEnglishOrReasoning(answer)) {
    answer = fallbackAnswer(plan, toolResults, collectedAt);
  }

  return { ...result, answer };
}

async function process(payload = {}) {
  const question = cleanText(payload.message || payload.question, 2000);
  if (!question) {
    const error = new Error('Câu hỏi không được để trống');
    error.statusCode = 400;
    throw error;
  }

  const meterId = cleanText(payload.meter_id, 100) || undefined;
  const id = conversationId(payload.conversation_id);
  const history = histories.get(id) || [];
  const plan = await buildPlan(question, meterId, history);

  if (plan.requires_clarification) {
    return {
      answer: plan.clarification_question || 'Anh vui lòng chọn hoặc cho biết thiết bị cần tra cứu.',
      conversation_id: id,
      source: 'Trợ lý AI',
      intent: plan.intent,
      tools_used: [],
      context_collected_at: null
    };
  }

  const collectedAt = new Date().toISOString();
  const toolResults = plan.needs_data ? await tools.executePlan(plan) : [];
  const allToolsFailed = toolResults.length && toolResults.every(item => !item.success);
  const result = allToolsFailed
    ? { answer: fallbackAnswer(plan, toolResults, collectedAt), model: qwen.model }
    : await composeAnswer({
      question,
      plan,
      toolResults,
      history,
      collectedAt
    });

  remember(id, 'user', question);
  remember(id, 'assistant', result.answer);

  return {
    answer: result.answer,
    conversation_id: id,
    source: toolResults.length ? 'Phân tích AI và dữ liệu vận hành' : 'Trợ lý AI',
    intent: plan.intent,
    tools_used: toolResults.map((item) => item.tool),
    context_collected_at: toolResults.length ? collectedAt : null
  };
}

function reset(id) {
  const key = cleanText(id, 100);
  if (key) histories.delete(key);
}

module.exports = { process, reset, buildPlan, composeAnswer, inferOperationalPlan };
