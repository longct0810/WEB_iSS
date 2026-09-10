const axios = require("axios");
const config = require("../config/power-ai");

const client = axios.create({
  baseURL: config.baseUrl,
  timeout: config.timeoutMs,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(config.apiKey ? { "X-PowerAI-Key": config.apiKey } : {})
  }
});

const RETRYABLE_NETWORK_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN"
]);
const RETRYABLE_HTTP_STATUS = new Set([502, 503, 504]);
const GET_RETRY_DELAYS_MS = [300, 900, 1800];
const MODEL_DRIFT_CACHE_TTL_MS = 60 * 1000;
let modelDriftCache = null;
let modelDriftInFlight = null;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const method = String(request?.method || "").toLowerCase();
    const retryCount = Number(request?._powerAiRetryCount || 0);
    const status = Number(error.response?.status || 0);
    const retryable =
      RETRYABLE_NETWORK_CODES.has(error.code) ||
      RETRYABLE_HTTP_STATUS.has(status);

    if (
      !request ||
      method !== "get" ||
      !retryable ||
      retryCount >= GET_RETRY_DELAYS_MS.length
    ) {
      return Promise.reject(error);
    }

    request._powerAiRetryCount = retryCount + 1;
    await wait(GET_RETRY_DELAYS_MS[retryCount]);
    return client.request(request);
  }
);

async function analyzeHybrid(reading) {
  const response = await client.post("/v1/analyze/hybrid", reading);
  return response.data;
}

async function bootstrapHistory(readings) {
  const response = await client.post(
    "/v1/history/bootstrap",
    { readings },
    { timeout: Math.max(config.timeoutMs, 30000) }
  );
  return response.data;
}

async function getDeviceHealth(meterId) {
  const response = await client.get(
    `/v1/devices/${encodeURIComponent(String(meterId))}/health`
  );
  return response.data;
}

async function getAlerts({
  meterId,
  severity,
  incidentType,
  state,
  source,
  from,
  to,
  limit = 20,
  activeOnly = false,
  history = false,
  includeObservations = false
} = {}) {
  const response = await client.get(history ? "/v1/alerts/history" : "/v1/alerts", {
    params: {
      meter_id: meterId || undefined,
      severity: severity || undefined,
      incident_type: incidentType || undefined,
      state: state || undefined,
      source: source || undefined,
      from: from || undefined,
      to: to || undefined,
      limit,
      active_only: history ? undefined : activeOnly,
      include_observations: includeObservations
    }
  });
  return response.data;
}

async function getDeviceForecast(meterId, horizonHours = 24) {
  const response = await client.get(
    `/v1/devices/${encodeURIComponent(String(meterId))}/forecast`,
    { params: { horizon_hours: horizonHours } }
  );
  return response.data;
}

async function getReadingAggregate(meterId, { metrics, from, to, aggregation = 'max' }) {
  const response = await client.get(
    `/v1/devices/${encodeURIComponent(String(meterId))}/readings/aggregate`,
    { params: { metrics: metrics.join(','), from, to, aggregation } }
  );
  return response.data;
}

async function chatDevice(message, meterId) {
  const response = await client.post("/v1/chat/device", {
    message,
    meter_id: meterId
  });
  return response.data;
}

async function getServiceHealth() {
  const response = await client.get("/health");
  return response.data;
}

async function getModelInfo() {
  const response = await client.get("/v1/model/info");
  return response.data;
}

async function getSystemVersion() {
  const response = await client.get("/v1/system/version");
  return response.data;
}

async function getModelHealth() {
  const response = await client.get("/v1/model/health");
  return response.data;
}

async function getModelDrift() {
  const now = Date.now();
  if (modelDriftCache && now - modelDriftCache.loadedAt < MODEL_DRIFT_CACHE_TTL_MS) {
    return modelDriftCache.data;
  }
  if (!modelDriftInFlight) {
    modelDriftInFlight = client.get("/v1/model/drift")
      .then((response) => {
        modelDriftCache = { data: response.data, loadedAt: Date.now() };
        return response.data;
      })
      .finally(() => {
        modelDriftInFlight = null;
      });
  }
  return modelDriftInFlight;
}

async function getFeedbackReadiness(params = {}) {
  const response = await client.get("/v1/p1/feedback/readiness", { params });
  return response.data;
}

function adminHeaders() {
  if (!config.adminKey) {
    throw new Error("SMARTGRID chưa cấu hình POWER_AI_ADMIN_KEY");
  }
  return { "X-PowerAI-Admin-Key": config.adminKey };
}

async function getP1Incidents(params = {}) {
  const response = await client.get("/v1/p1/incidents", { params });
  return response.data;
}

async function createP1Incident(payload) {
  const response = await client.post("/v1/p1/incidents", payload, {
    headers: adminHeaders()
  });
  return response.data;
}

async function updateP1Incident(incidentId, payload) {
  const response = await client.patch(
    `/v1/p1/incidents/${encodeURIComponent(String(incidentId))}`,
    payload,
    { headers: adminHeaders() }
  );
  return response.data;
}

async function saveP1AlertFeedback(payload) {
  const response = await client.post("/v1/p1/alert-feedback", payload, {
    headers: adminHeaders()
  });
  return response.data;
}

async function saveP1AlertFeedbackBulk(payload) {
  const response = await client.post("/v1/p1/alert-feedback/bulk", payload, {
    headers: adminHeaders()
  });
  return response.data;
}

async function getP1EvaluationMetrics(params = {}) {
  const response = await client.get("/v1/p1/evaluation/metrics", { params });
  return response.data;
}

async function getP1TemporalEvaluation(params = {}) {
  const response = await client.get("/v1/p1/evaluation/temporal", { params });
  return response.data;
}

module.exports = {
  analyzeHybrid,
  bootstrapHistory,
  getDeviceHealth,
  getAlerts,
  getDeviceForecast,
  getReadingAggregate,
  chatDevice,
  getServiceHealth,
  getModelInfo,
  getSystemVersion,
  getModelHealth,
  getModelDrift,
  getFeedbackReadiness,
  getP1Incidents,
  createP1Incident,
  updateP1Incident,
  saveP1AlertFeedback,
  saveP1AlertFeedbackBulk,
  getP1EvaluationMetrics,
  getP1TemporalEvaluation
};
