const powerAiClient = require("../services/power-ai-client");

const ANALYSIS_MIN_INTERVAL_MS = 10 * 1000;
const analysisStates = new Map();

const READING_FIELDS = [
  "meter_id",
  "time",
  "ua",
  "ub",
  "uc",
  "ia",
  "ib",
  "ic",
  "i0",
  "p_total",
  "q_total",
  "power_factor",
  "cos_a",
  "cos_b",
  "cos_c",
  "frequency",
  "terminal_temperature_a",
  "terminal_temperature_b",
  "terminal_temperature_c",
  "ambient_temperature",
  "thd_ua",
  "thd_ub",
  "thd_uc",
  "thd_ia",
  "thd_ib",
  "thd_ic"
];

function normalizeReading(body) {
  const reading = READING_FIELDS.reduce((normalized, field) => {
    if (body[field] !== undefined) {
      normalized[field] = body[field];
    }
    return normalized;
  }, {});
  if (process.env.POWER_AI_DIRECT_I0_ENABLED !== "true") {
    reading.i0 = null;
  }
  return reading;
}

async function analyzeHybrid(req, res) {
  const reading = normalizeReading(req.body || {});

  if (reading.meter_id === undefined || !reading.time) {
    return res.status(400).json({
      success: false,
      message: "Thiếu meter_id hoặc time"
    });
  }

  try {
    const meterKey = String(reading.meter_id);
    const now = Date.now();
    const state = analysisStates.get(meterKey) || {
      lastAnalyzedAt: 0,
      lastResult: null,
      inFlight: null
    };

    if (
      state.lastResult &&
      now - state.lastAnalyzedAt < ANALYSIS_MIN_INTERVAL_MS
    ) {
      return res.status(200).json({
        success: true,
        data: state.lastResult,
        reused: true
      });
    }

    if (!state.inFlight) {
      state.lastAnalyzedAt = now;
      state.inFlight = powerAiClient.analyzeHybrid(reading)
        .then(data => {
          state.lastResult = data;
          return data;
        })
        .finally(() => {
          state.inFlight = null;
        });
      analysisStates.set(meterKey, state);
    }

    const data = await state.inFlight;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    const upstreamStatus = err.response && err.response.status;
    const upstreamData = err.response && err.response.data;

    console.error(
      "[POWER-AI] analyze/hybrid failed:",
      upstreamStatus || err.code || err.message
    );

    return res.status(502).json({
      success: false,
      message: "Không thể kết nối dịch vụ PowerAI",
      upstream_status: upstreamStatus || null,
      detail: upstreamData && upstreamData.detail
        ? upstreamData.detail
        : undefined
    });
  }
}

async function bootstrapHistory(req, res) {
  const readings = Array.isArray(req.body && req.body.readings)
    ? req.body.readings.map(normalizeReading)
    : [];
  if (!readings.length || readings.length > 256) {
    return res.status(400).json({
      success: false,
      message: "Lịch sử phải có từ 1 đến 256 bản ghi"
    });
  }
  try {
    const data = await powerAiClient.bootstrapHistory(readings);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendUpstreamError(res, err, "history bootstrap");
  }
}

function sendUpstreamError(res, err, operation) {
  const upstreamStatus = err.response && err.response.status;
  const upstreamData = err.response && err.response.data;
  const status = [401, 403, 404, 409, 422, 429].includes(upstreamStatus)
    ? upstreamStatus
    : 502;

  console.error(
    `[POWER-AI] ${operation} failed:`,
    upstreamStatus || err.code || err.message
  );

  if (status === 429) {
    res.set("Retry-After", err.response?.headers?.["retry-after"] || "60");
  }
  return res.status(status).json({
    success: false,
    message: status === 404
      ? "PowerAI chưa có dữ liệu cho thiết bị"
      : status === 429
        ? "PowerAI đang giới hạn tần suất, vui lòng thử lại sau"
      : "Không thể kết nối dịch vụ PowerAI",
    upstream_status: upstreamStatus || null,
    detail: upstreamData && upstreamData.detail
      ? upstreamData.detail
      : undefined
  });
}

function sendP1UpstreamError(res, err, operation) {
  const upstreamStatus = err.response && err.response.status;
  const upstreamData = err.response && err.response.data;
  const status = [400, 403, 404, 409, 422, 429].includes(upstreamStatus)
    ? upstreamStatus
    : 502;
  console.error(
    `[POWER-AI] ${operation} failed:`,
    upstreamStatus || err.code || err.message
  );
  return res.status(status).json({
    success: false,
    message: status === 502
      ? "Không thể kết nối dịch vụ PowerAI"
      : "PowerAI từ chối dữ liệu đánh giá",
    upstream_status: upstreamStatus || null,
    detail: upstreamData && upstreamData.detail
      ? upstreamData.detail
      : err.message
  });
}

function cleanText(value, maxLength = 4000) {
  return typeof value === "string"
    ? value.trim().slice(0, maxLength)
    : "";
}

async function deviceHealth(req, res) {
  try {
    const data = await powerAiClient.getDeviceHealth(req.params.meterId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendUpstreamError(res, err, "device health");
  }
}

async function alerts(req, res) {
  const requestedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isFinite(requestedLimit)
    ? Math.max(1, Math.min(requestedLimit, 100))
    : 20;

  try {
    const data = await powerAiClient.getAlerts({
      meterId: req.query.meter_id,
      severity: req.query.severity,
      incidentType: req.query.incident_type,
      state: req.query.state,
      source: req.query.source,
      from: req.query.from,
      to: req.query.to,
      limit,
      activeOnly: req.query.active_only === "true",
      history: req.query.history === "true",
      includeObservations: req.query.include_observations === "true"
    });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendUpstreamError(res, err, "alerts");
  }
}

async function deviceForecast(req, res) {
  const requestedHorizon = Number.parseInt(req.query.horizon_hours, 10);
  const horizonHours = Number.isFinite(requestedHorizon)
    ? Math.max(1, Math.min(requestedHorizon, 168))
    : 24;

  try {
    const data = await powerAiClient.getDeviceForecast(
      req.params.meterId,
      horizonHours
    );
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendUpstreamError(res, err, "device forecast");
  }
}

async function deviceChat(req, res) {
  const message = typeof req.body.message === "string"
    ? req.body.message.trim()
    : "";
  const meterId = req.body.meter_id;

  if (!message || message.length > 1000 || meterId === undefined || meterId === null) {
    return res.status(400).json({
      success: false,
      message: "Nội dung chat hoặc meter_id không hợp lệ"
    });
  }

  try {
    const data = await powerAiClient.chatDevice(message, meterId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendUpstreamError(res, err, "device chat");
  }
}

async function systemStatus(req, res) {
  try {
    const results = await Promise.allSettled([
      powerAiClient.getServiceHealth(),
      powerAiClient.getModelInfo(),
      powerAiClient.getSystemVersion(),
      powerAiClient.getModelHealth(),
      powerAiClient.getModelDrift()
    ]);
    const value = (index, fallback = {}) =>
      results[index].status === "fulfilled" ? results[index].value : fallback;
    // /health is the connectivity source of truth. Promise.allSettled is used
    // for optional model diagnostics, but must not turn a failed upstream call
    // into a successful "connected" response.
    if (results[0].status !== "fulfilled") {
      return sendUpstreamError(res, results[0].reason, "system status");
    }
    if (results[2].status !== "fulfilled") {
      return sendUpstreamError(res, results[2].reason, "system authentication");
    }

    const service = value(0);
    const model = value(1);
    const version = value(2);
    const modelHealth = value(3);
    const drift = value(4);

    return res.status(200).json({
      success: true,
      data: {
        connected: true,
        authenticated: true,
        diagnostics: {
          model_info: results[1].status,
          system_version: results[2].status,
          model_health: results[3].status,
          model_drift: results[4].status
        },
        service,
        model,
        version,
        model_health: modelHealth,
        drift
      }
    });
  } catch (err) {
    return sendUpstreamError(res, err, "system status");
  }
}

async function p1Incidents(req, res) {
  try {
    const data = await powerAiClient.getP1Incidents({
      meter_id: req.query.meter_id || undefined,
      date_from: req.query.date_from || undefined,
      date_to: req.query.date_to || undefined,
      limit: Math.max(1, Math.min(Number.parseInt(req.query.limit, 10) || 100, 1000))
    });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendP1UpstreamError(res, err, "P1 incidents");
  }
}

async function p1CreateIncident(req, res) {
  const body = req.body || {};
  const payload = {
    meter_id: body.meter_id,
    occurred_at: body.occurred_at,
    resolved_at: body.resolved_at || null,
    incident_type: cleanText(body.incident_type, 128),
    severity: body.severity,
    description: cleanText(body.description),
    technical_conclusion: cleanText(body.technical_conclusion) || null,
    resolution_notes: cleanText(body.resolution_notes) || null,
    created_by: cleanText(body.created_by, 128),
    source: "smartgrid-dashboard"
  };
  if (
    payload.meter_id === undefined ||
    !payload.occurred_at ||
    !payload.incident_type ||
    !["warning", "critical"].includes(payload.severity) ||
    !payload.description ||
    !payload.created_by
  ) {
    return res.status(400).json({
      success: false,
      message: "Thông tin sự cố chưa đầy đủ"
    });
  }
  try {
    const data = await powerAiClient.createP1Incident(payload);
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return sendP1UpstreamError(res, err, "P1 create incident");
  }
}

async function p1UpdateIncident(req, res) {
  const body = req.body || {};
  const payload = {};
  [
    "resolved_at",
    "incident_type",
    "severity",
    "description",
    "technical_conclusion",
    "resolution_notes"
  ].forEach(field => {
    if (body[field] !== undefined) {
      payload[field] = typeof body[field] === "string"
        ? cleanText(body[field])
        : body[field];
    }
  });
  try {
    const data = await powerAiClient.updateP1Incident(
      req.params.incidentId,
      payload
    );
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendP1UpstreamError(res, err, "P1 update incident");
  }
}

async function p1AlertFeedback(req, res) {
  const body = req.body || {};
  const payload = {
    event_id: body.event_id,
    incident_id: uuidPattern.test(incidentId) ? incidentId : null,
    meter_id: body.meter_id,
    alert_time: body.alert_time,
    verdict: body.verdict,
    reviewer: cleanText(body.reviewer, 128),
    notes: cleanText(body.notes) || null
  };
  if (
    !payload.event_id ||
    payload.meter_id === undefined ||
    !payload.alert_time ||
    !["true_positive", "false_positive", "uncertain"].includes(payload.verdict) ||
    !payload.reviewer
  ) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu đánh giá cảnh báo chưa hợp lệ"
    });
  }
  try {
    const data = await powerAiClient.saveP1AlertFeedback(payload);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendP1UpstreamError(res, err, "P1 alert feedback");
  }
}

async function p1AlertFeedbackBulk(req, res) {
  const body = req.body || {};
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const eventIds = Array.isArray(body.event_ids)
    ? [...new Set(
        body.event_ids
          .map(value => String(value || '').trim())
          .filter(value => uuidPattern.test(value))
      )].slice(0, 100)
    : [];
  const incidentId = String(body.incident_id || '').trim();
  const payload = {
    event_ids: eventIds,
    incident_id: uuidPattern.test(incidentId) ? incidentId : null,
    verdict: body.verdict,
    reviewer: cleanText(body.reviewer, 128),
    notes: cleanText(body.notes) || null,
    metadata: {
      group_key: cleanText(body.group_key, 500) || null
    }
  };
  if (
    (!payload.event_ids.length && !payload.incident_id) ||
    !["true_positive", "false_positive", "uncertain"].includes(payload.verdict) ||
    !payload.reviewer
  ) {
    return res.status(400).json({
      success: false,
      message: "Dữ liệu đánh giá nhóm cảnh báo chưa hợp lệ"
    });
  }
  try {
    const data = await powerAiClient.saveP1AlertFeedbackBulk(payload);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendP1UpstreamError(res, err, "P1 bulk alert feedback");
  }
}

async function p1EvaluationMetrics(req, res) {
  try {
    const data = await powerAiClient.getP1EvaluationMetrics({
      meter_id: req.query.meter_id || undefined,
      date_from: req.query.date_from || undefined,
      date_to: req.query.date_to || undefined
    });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendP1UpstreamError(res, err, "P1 evaluation metrics");
  }
}

async function p1TemporalEvaluation(req, res) {
  try {
    const data = await powerAiClient.getP1TemporalEvaluation({
      meter_id: req.query.meter_id || undefined,
      date_from: req.query.date_from || undefined,
      date_to: req.query.date_to || undefined,
      lead_window_hours: Math.max(
        1, Math.min(168, Number(req.query.lead_window_hours) || 24)
      )
    });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendP1UpstreamError(res, err, "P1 temporal evaluation");
  }
}


async function modelDrift(req, res) {
  try {
    const data = await powerAiClient.getModelDrift();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendUpstreamError(res, err, "model drift");
  }
}

async function feedbackReadiness(req, res) {
  try {
    const data = await powerAiClient.getFeedbackReadiness({
      meter_id: req.query.meter_id || undefined,
      date_from: req.query.date_from || undefined,
      date_to: req.query.date_to || undefined
    });
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendP1UpstreamError(res, err, "feedback readiness");
  }
}

module.exports = {
  analyzeHybrid,
  bootstrapHistory,
  deviceHealth,
  alerts,
  deviceForecast,
  deviceChat,
  systemStatus,
  modelDrift,
  feedbackReadiness,
  p1Incidents,
  p1CreateIncident,
  p1UpdateIncident,
  p1AlertFeedback,
  p1AlertFeedbackBulk,
  p1EvaluationMetrics,
  p1TemporalEvaluation
};
