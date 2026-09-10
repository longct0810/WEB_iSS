
var lstTsvh_bdpt = [];
var tt_nhamay = "";
let aiReportTimer = null;
let powerAiStatusTimer = null;
const powerAiRealtimeMeters = new Map();
const powerAiRealtimeTimers = new Map();
const powerAiLowVoltageThermalHistory = new Map();
const lowVoltageDisplayedValues = new WeakMap();
const lowVoltageAnimationTimers = new WeakMap();
const DASHBOARD_LIVE_VALUE_SELECTOR = [
  '[data-ioa]',
  '#thdUAvg', '#thdUMax', '#thdIAvg', '#thdIMax',
  '#realtimeUA', '#realtimeUB', '#realtimeUC',
  '#realtimeIA', '#realtimeIB', '#realtimeIC',
  '#powerAiAlertCount', '#aiScore',
  '.power-ai-health-score strong',
  '.power-ai-risk-value strong'
].join(',');

function animateLowVoltageUpdate(element) {
  if (!(element instanceof HTMLElement)) return;
  const rawValue = String(element.textContent || '').replace(',', '.').trim();
  const nextValue = Number.parseFloat(rawValue);
  if (!Number.isFinite(nextValue)) return;

  const previousValue = lowVoltageDisplayedValues.get(element);
  lowVoltageDisplayedValues.set(element, nextValue);
  if (previousValue === undefined || previousValue === nextValue) return;

  const directionClass = nextValue > previousValue
    ? 'power-ai-value-up'
    : 'power-ai-value-down';
  element.classList.remove(
    'power-ai-value-up',
    'power-ai-value-down',
    'power-ai-value-changed'
  );
  // Reflow để animation chạy lại khi cùng một ô cập nhật liên tiếp.
  void element.offsetWidth;
  element.classList.add(directionClass, 'power-ai-value-changed');
  const container = element.closest(
    'tr, .metric, .thd-card, .power-ai-health-overview, .power-ai-risk'
  );
  if (container) {
    container.classList.remove('power-ai-row-updated');
    void container.offsetWidth;
    container.classList.add('power-ai-row-updated');
  }

  window.clearTimeout(lowVoltageAnimationTimers.get(element));
  lowVoltageAnimationTimers.set(element, window.setTimeout(() => {
    element.classList.remove(
      'power-ai-value-up',
      'power-ai-value-down',
      'power-ai-value-changed'
    );
    if (container) container.classList.remove('power-ai-row-updated');
  }, 900));
}

function observeLowVoltageDashboard() {
  const dashboard = document.getElementById('dashboardMain');
  if (!dashboard || dashboard.dataset.liveEffectReady === 'true') return;
  dashboard.dataset.liveEffectReady = 'true';

  dashboard.querySelectorAll(DASHBOARD_LIVE_VALUE_SELECTOR).forEach(element => {
    const value = Number.parseFloat(String(element.textContent || '').trim());
    if (Number.isFinite(value)) lowVoltageDisplayedValues.set(element, value);
  });

  const observer = new MutationObserver(mutations => {
    const changedValues = new Set();
    const changedAnalysis = new Set();
    const changedPanels = new Set();
    mutations.forEach(mutation => {
      const parent = mutation.target.nodeType === Node.TEXT_NODE
        ? mutation.target.parentElement
        : mutation.target;
      const valueElement = parent && parent.closest
        ? parent.closest(DASHBOARD_LIVE_VALUE_SELECTOR)
        : null;
      if (valueElement) changedValues.add(valueElement);
      const analysisItem = parent && parent.closest
        ? parent.closest('.power-ai-lv-analysis-item')
        : null;
      if (analysisItem) changedAnalysis.add(analysisItem);
      const panel = parent && parent.closest
        ? parent.closest('#powerAiHealth, #powerAiForecast')
        : null;
      if (panel) changedPanels.add(panel);
    });
    changedValues.forEach(animateLowVoltageUpdate);
    changedAnalysis.forEach(item => {
      item.classList.remove('power-ai-analysis-updated');
      void item.offsetWidth;
      item.classList.add('power-ai-analysis-updated');
      window.setTimeout(
        () => item.classList.remove('power-ai-analysis-updated'),
        1000
      );
    });
    changedPanels.forEach(panel => {
      panel.classList.remove('power-ai-row-updated');
      void panel.offsetWidth;
      panel.classList.add('power-ai-row-updated');
      window.setTimeout(
        () => panel.classList.remove('power-ai-row-updated'),
        900
      );
    });
  });
  observer.observe(
    dashboard,
    { childList: true, characterData: true, subtree: true }
  );
}

$(observeLowVoltageDashboard);
const powerAiRealtimeLastSent = new Map();
const powerAiRealtimeLastAnalyzedAt = new Map();
const powerAiRealtimeInFlight = new Set();
const powerAiHistoryBootstrapKeys = new Map();
const POWER_AI_REALTIME_ANALYSIS_INTERVAL_MS = 15 * 1000;
const POWER_AI_CLIENT_VERSION = '1.1.0';
let powerAiAlertHistoryMode = false;
let powerAiShowObservations = false;
const thdRealtimeSnapshots = new Map();
const thdRealtimeTimers = new Map();
const THD_REALTIME_MAX_POINTS = 120;
const electricalRealtimeSnapshots = new Map();
const electricalRealtimeTimers = new Map();
const ELECTRICAL_REALTIME_MAX_POINTS = 120;
// dashboard
$(document).ready(function () {
  const savedCode = localStorage.getItem("code_nhamay");
  const savedDeviceId = localStorage.getItem("id_thietbi");


  // renderKhoangHaThe(366621);//
  // renderCongToTongRows(366621);//
  // renderHaTheRows(366621);//

  if (savedCode) {
    reloadDashboardByNhaMay(savedCode);
    if (savedDeviceId) {
      loadBaoCaoAI(savedDeviceId);
    }
    startBaoCaoAITimer();
  }
  loadPowerAISystemStatus();
  startPowerAIStatusTimer();
  initMetricMonitoring();
  initElectricalRealtimeCharts();

  $('.power-ai-sidebar-section')
    .prop('open', true)
    .children('summary')
    .on('click keydown', function (event) {
      if ($(event.target).closest('button').length) return;
      if (
        event.type === 'click' ||
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
      }
    });

  window.addEventListener("nhamay:changed", function (e) {
    const child_code = e.detail.child_code;
    const id_thietbi = e.detail.id_thietbi;
    resetElectricalRealtimeCharts();

    // render dashboard
      renderKhoangHaThe(id_thietbi);//
      renderCongToTongRows(id_thietbi);//
      renderHaTheRows(id_thietbi);//
    
    reloadDashboardByNhaMay(child_code);
    loadBaoCaoAI(id_thietbi);
    updatePowerAIChatDevice();
    startBaoCaoAITimer();
  });

  $("#bdptPrev").on("click", function () {
    if (bdptPage > 1) {
      bdptPage--;
      renderBdptPage();
    }
  });

  $("#bdptNext").on("click", function () {
    const totalPage = Math.ceil(feeders.length / bdptPageSize);
    if (bdptPage < totalPage) {
      bdptPage++;
      renderBdptPage();
    }
  });
  // loadBaoCaoAI(savedCode);

});

function startBaoCaoAITimer() {

  if (aiReportTimer) {
    clearInterval(aiReportTimer);
  }

  aiReportTimer = setInterval(() => {
    const idThietBi = getSelectedDeviceId();
    if (!idThietBi) return;

    console.log('Auto refresh AI Report:', new Date());

    loadBaoCaoAI(idThietBi);

  }, 15 * 60 * 1000); // 15 phút
}

function getSelectedDeviceId() {
  const selectedOption = document.querySelector('#cbo_nhamay option:checked');
  const optionDeviceId = selectedOption
    ? selectedOption.getAttribute('data-id-thietbi')
    : null;

  return optionDeviceId || localStorage.getItem('id_thietbi') || null;
}

function metricValues(card) {
  return Array.from(card.querySelectorAll('.metric-data-row .phase'))
    .map(element => Number(String(element.textContent).trim()))
    .filter(Number.isFinite);
}

function evaluateMetric(type, values) {
  if (values.length < 3) {
    return { level: 'offline', label: 'Chờ dữ liệu' };
  }

  if (type === 'voltage') {
    const outsideLimit = values.some(value => value < 198 || value > 242);
    return outsideLimit
      ? { level: 'critical', label: 'Ngoài ngưỡng' }
      : { level: 'ok', label: 'Bình thường' };
  }

  if (type === 'current') {
    const average = values.reduce((total, value) => total + value, 0) / values.length;
    const imbalance = average
      ? Math.max(...values.map(value => Math.abs(value - average))) / average * 100
      : 0;
    if (imbalance > 20) return { level: 'critical', label: 'Mất cân bằng' };
    if (imbalance > 10) return { level: 'warning', label: 'Cần theo dõi' };
    return { level: 'ok', label: 'Cân bằng' };
  }

  if (type === 'power-factor') {
    const average = values.reduce((total, value) => total + value, 0) / values.length;
    if (average < 0.9) return { level: 'critical', label: 'Hệ số thấp' };
    if (average < 0.95) return { level: 'warning', label: 'Cần theo dõi' };
    return { level: 'ok', label: 'Tốt' };
  }

  return { level: 'ok', label: 'Trực tuyến' };
}

function updateMetricCard(card) {
  if (!card) return;
  const values = metricValues(card);
  const result = evaluateMetric(card.dataset.metricType, values);

  card.classList.remove('metric-ok', 'metric-warning', 'metric-critical', 'metric-offline');
  card.classList.add(`metric-${result.level}`);
  const state = card.querySelector('.metric-state');
  const time = card.querySelector('.metric-footer time');
  if (state) state.textContent = result.label;
  if (time && values.length) {
    time.textContent = new Date().toLocaleTimeString('vi-VN');
  }
  const metricName = card.querySelector('.metric-title')?.textContent.trim() || 'Thông số';
  card.setAttribute(
    'aria-label',
    `${metricName}: ${values.length ? values.join(', ') : 'chưa có dữ liệu'}. ${result.label}`
  );
}

function initMetricMonitoring() {
  const grid = document.querySelector('.metric-grid');
  if (!grid || typeof MutationObserver === 'undefined') return;

  grid.querySelectorAll('.metric').forEach(updateMetricCard);
  const observer = new MutationObserver(mutations => {
    const cards = new Set();
    mutations.forEach(mutation => {
      const row = mutation.target.nodeType === Node.ELEMENT_NODE
        ? mutation.target.closest('.metric-data-row')
        : mutation.target.parentElement && mutation.target.parentElement.closest('.metric-data-row');
      if (row) cards.add(row.closest('.metric'));
    });
    cards.forEach(updateMetricCard);
  });

  observer.observe(grid, { childList: true, characterData: true, subtree: true });
}

function startPowerAIStatusTimer() {
  if (powerAiStatusTimer) {
    clearInterval(powerAiStatusTimer);
  }
  powerAiStatusTimer = setInterval(loadPowerAISystemStatus, 60 * 1000);
}

function totalPowerAIHistoryRows(history) {
  if (!history) return 0;
  if (typeof history.rows === 'number') return history.rows;
  if (typeof history.total_rows === 'number') return history.total_rows;
  if (history.meters && typeof history.meters === 'object') {
    return Object.values(history.meters)
      .reduce((total, value) => total + (Number(value) || 0), 0);
  }
  return Object.values(history)
    .filter(value => typeof value === 'number')
    .reduce((total, value) => total + value, 0);
}

function powerAIServiceValueLabel(value) {
  return {
    development: 'Môi trường phát triển',
    production: 'Môi trường vận hành',
    staging: 'Môi trường thử nghiệm',
    test: 'Môi trường kiểm thử',
    ok: 'Bình thường',
    healthy: 'Bình thường',
    ready: 'Sẵn sàng',
    degraded: 'Suy giảm',
    offline: 'Mất kết nối',
    unknown: 'Chưa xác định'
  }[String(value || '').toLowerCase()] || String(value || 'Chưa xác định');
}

async function loadPowerAISystemStatus() {
  const $status = $('#powerAiSystemStatus');
  if (!$status.length) return;

  $status.addClass('is-loading');
  $('#powerAiStatusRefresh i').addClass('fa-spin');

  try {
    const response = await $.getJSON('/api/power-ai/status');
    const payload = response && response.success ? response.data : null;
    const service = payload && payload.service ? payload.service : {};
    const model = payload && payload.model ? payload.model : {};
    const version = payload && payload.version ? payload.version : {};
    const health = payload && payload.model_health ? payload.model_health : {};
    const modelStatus = model.status || health.active || {};
    const modelLoaded = Boolean(modelStatus.loaded ?? health.active?.loaded);
    const history = model.history || service.history;
    const appVersion = version.powerai_version || service.powerai_version || '--';
    const modelVersion = version.model_version
      || modelStatus.model_version
      || (model.metadata && model.metadata.model_version)
      || '--';
    const mode = String(version.mode || health.mode || 'active').toLowerCase();

    window.powerAiRuntimeVersion = { ...version, model_version: modelVersion, mode };
    $status
      .removeClass('is-loading is-offline is-degraded is-online')
      .addClass(modelLoaded ? 'is-online' : 'is-degraded');
    $('#powerAiServiceLabel').text(
      mode === 'maintenance'
        ? 'PowerAI đang bảo trì · Rule Engine vẫn hoạt động'
        : modelLoaded
          ? 'PowerAI đang hoạt động'
          : 'PowerAI hoạt động, mô hình chưa sẵn sàng'
    );
    $('#powerAiServiceMeta').text(
      `${powerAIServiceValueLabel(service.environment)} · ${powerAIServiceValueLabel(health.status || service.status)}`
    );
    $('#powerAiModelLabel').text(modelLoaded ? 'Đã tải' : 'Chưa tải');
    $('#powerAiAppVersion, #powerAiClientAppVersion').text(`v${appVersion}`);
    $('#powerAiVersion, #powerAiClientModelVersion').text(modelVersion);
    $('#powerAiMode, #powerAiClientMode')
      .text(mode.toUpperCase())
      .removeClass('active shadow maintenance')
      .addClass(mode);
    $('#powerAiHistoryRows').text(totalPowerAIHistoryRows(history));
    $('#powerAiStatusTime').text(new Date().toLocaleTimeString('vi-VN'));
  } catch (err) {
    $status.removeClass('is-loading is-online is-degraded').addClass('is-offline');
    $('#powerAiServiceLabel').text('Không thể kết nối PowerAI');
    $('#powerAiServiceMeta').text('Màn hình SCADA vẫn hoạt động bình thường');
    $('#powerAiModelLabel').text('Không xác định');
    $('#powerAiAppVersion, #powerAiClientAppVersion').text(`Client v${POWER_AI_CLIENT_VERSION}`);
    $('#powerAiVersion, #powerAiClientModelVersion').text('--');
    $('#powerAiMode, #powerAiClientMode').text('OFFLINE').removeClass('active shadow maintenance');
    $('#powerAiHistoryRows').text('--');
    $('#powerAiStatusTime').text(new Date().toLocaleTimeString('vi-VN'));
  } finally {
    $('#powerAiStatusRefresh i').removeClass('fa-spin');
  }
}

window.addEventListener('smartgrid:socket-status', function (event) {
  const detail = event.detail || {};
  const $status = $('#powerAiSystemStatus');
  if (!$status.length) return;
  if (detail.stale) {
    $status.removeClass('is-online is-offline').addClass('is-degraded');
    $('#powerAiServiceMeta').text('Dữ liệu realtime bị gián đoạn · Đang kết nối lại');
    return;
  }
  if (!detail.connected) {
    $status.removeClass('is-online').addClass('is-degraded');
    $('#powerAiServiceMeta').text('Mất kết nối realtime · Đang thử lại');
    return;
  }
  loadPowerAISystemStatus();
});

function updatePowerAIChatDevice() {
  const idThietBi = getSelectedDeviceId();
  $('#powerAiChatDevice').text(
    idThietBi ? `Thiết bị: ${idThietBi}` : 'Chưa chọn thiết bị'
  );
}

function getTodayVN() {
  const d = new Date();
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear()
  ].join('/');
}

function parseAiRows(response) {
  if (!Array.isArray(response)) return [];

  return response
    .map(r => {
      const raw = r.JSON_DATA || r.json_data;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    })
    .filter(Boolean);
}

function powerAIReportDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - Math.max(0, Number(daysAgo) || 0));
  return [
    String(date.getDate()).padStart(2, '0'),
    String(date.getMonth() + 1).padStart(2, '0'),
    date.getFullYear()
  ].join('/');
}

function calculatePowerAIResidualCurrent(ia, ib, ic, angleA, angleB, angleC) {
  if (window.POWER_AI_DERIVED_I0_ENABLED !== true) return null;
  const values = [ia, ib, ic, angleA, angleB, angleC].map(Number);
  if (!values.every(Number.isFinite)) return null;

  const [currentA, currentB, currentC, phaseA, phaseB, phaseC] = values;
  const toRadians = angle => angle * Math.PI / 180;
  // IOA 5050..5052 là góc lệch của dòng so với điện áp từng pha,
  // không phải ba góc vector tuyệt đối. Quy đổi về hệ A/B/C trước khi cộng.
  const absolutePhaseA = -phaseA;
  const absolutePhaseB = -120 - phaseB;
  const absolutePhaseC = 120 - phaseC;
  const real =
    currentA * Math.cos(toRadians(absolutePhaseA)) +
    currentB * Math.cos(toRadians(absolutePhaseB)) +
    currentC * Math.cos(toRadians(absolutePhaseC));
  const imaginary =
    currentA * Math.sin(toRadians(absolutePhaseA)) +
    currentB * Math.sin(toRadians(absolutePhaseB)) +
    currentC * Math.sin(toRadians(absolutePhaseC));

  // I0 đúng nghĩa là một phần ba tổng vector; 3I0 mới là dòng dư.
  return Math.sqrt(real * real + imaginary * imaginary) / 3;
}

function buildPowerAIHistoricalReadings(ioaData, meterId) {
  const fieldByIOA = {
    0: 'ua', 1: 'ub', 2: 'uc',
    7: 'ia', 8: 'ib', 9: 'ic',
    23: 'cos_a', 24: 'cos_b', 25: 'cos_c',
    5000: 'ua', 5001: 'ub', 5002: 'uc',
    5006: 'ia', 5007: 'ib', 5008: 'ic',
    5030: 'frequency',
    5040: 'cos_a', 5041: 'cos_b', 5042: 'cos_c',
    5050: 'angle_a', 5051: 'angle_b', 5052: 'angle_c',
    5070: 'p_total', 5071: 'q_total',
    5200: 'thd_ua', 5300: 'thd_ub', 5400: 'thd_uc',
    5500: 'thd_ia', 5600: 'thd_ib', 5700: 'thd_ic',
    1008: 'terminal_temperature_a',
    1009: 'terminal_temperature_b',
    1010: 'terminal_temperature_c',
    1011: 'ambient_temperature'
  };
  const buckets = new Map();

  (ioaData || []).forEach(item => {
    const field = fieldByIOA[Number(item.ioa_diachi)];
    if (!field || !Array.isArray(item.cambien)) return;
    item.cambien.forEach(raw => {
      const reading = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const match = String(reading && reading.time || '').match(
        /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
      );
      const value = Number(reading && reading.value);
      if (!match || !Number.isFinite(value)) return;
      const timestamp = new Date(
        Number(match[3]),
        Number(match[2]) - 1,
        Number(match[1]),
        Number(match[4]),
        Math.floor(Number(match[5]) / 15) * 15,
        0
      );
      const key = timestamp.toISOString();
      const snapshot = buckets.get(key) || {
        meter_id: String(meterId),
        time: key
      };
      snapshot[field] = value;
      buckets.set(key, snapshot);
    });
  });

  return Array.from(buckets.values())
    .map(snapshot => {
      const powerFactors = [snapshot.cos_a, snapshot.cos_b, snapshot.cos_c]
        .filter(Number.isFinite);
      const i0 = calculatePowerAIResidualCurrent(
        snapshot.ia,
        snapshot.ib,
        snapshot.ic,
        snapshot.angle_a,
        snapshot.angle_b,
        snapshot.angle_c
      );
      const result = {
        meter_id: snapshot.meter_id,
        time: snapshot.time,
        ua: snapshot.ua,
        ub: snapshot.ub,
        uc: snapshot.uc,
        ia: snapshot.ia,
        ib: snapshot.ib,
        ic: snapshot.ic,
        i0,
        p_total: Number.isFinite(snapshot.p_total) ? snapshot.p_total : null,
        q_total: Number.isFinite(snapshot.q_total) ? snapshot.q_total : null,
        power_factor: powerFactors.length ? avg(powerFactors) : null,
        cos_a: Number.isFinite(snapshot.cos_a) ? snapshot.cos_a : null,
        cos_b: Number.isFinite(snapshot.cos_b) ? snapshot.cos_b : null,
        cos_c: Number.isFinite(snapshot.cos_c) ? snapshot.cos_c : null,
        frequency: snapshot.frequency,
        terminal_temperature_a: Number.isFinite(snapshot.terminal_temperature_a)
          ? snapshot.terminal_temperature_a : null,
        terminal_temperature_b: Number.isFinite(snapshot.terminal_temperature_b)
          ? snapshot.terminal_temperature_b : null,
        terminal_temperature_c: Number.isFinite(snapshot.terminal_temperature_c)
          ? snapshot.terminal_temperature_c : null,
        ambient_temperature: Number.isFinite(snapshot.ambient_temperature)
          ? snapshot.ambient_temperature : null,
        thd_ua: Number.isFinite(snapshot.thd_ua) ? snapshot.thd_ua : null,
        thd_ub: Number.isFinite(snapshot.thd_ub) ? snapshot.thd_ub : null,
        thd_uc: Number.isFinite(snapshot.thd_uc) ? snapshot.thd_uc : null,
        thd_ia: Number.isFinite(snapshot.thd_ia) ? snapshot.thd_ia : null,
        thd_ib: Number.isFinite(snapshot.thd_ib) ? snapshot.thd_ib : null,
        thd_ic: Number.isFinite(snapshot.thd_ic) ? snapshot.thd_ic : null
      };
      return result;
    })
    .filter(snapshot => [
      snapshot.ua, snapshot.ub, snapshot.uc,
      snapshot.ia, snapshot.ib, snapshot.ic
    ].every(Number.isFinite))
    .sort((left, right) => new Date(left.time) - new Date(right.time))
    .slice(-256);
}

async function bootstrapPowerAIHistory(meterId) {
  const response = await $.ajax({
    url: '/api/baocao_ai_vanhanh_ngay',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      v_idthietbi: String(meterId),
      v_tungay: powerAIReportDate(3),
      v_denngay: powerAIReportDate(0),
      v_max_points: 256
    })
  });
  const readings = buildPowerAIHistoricalReadings(parseAiRows(response), meterId);
  if (!readings.length) return null;
  const bootstrapKey = `${readings.length}:${readings[readings.length - 1].time}`;
  if (powerAiHistoryBootstrapKeys.get(String(meterId)) === bootstrapKey) return null;
  const result = await $.ajax({
    url: '/api/power-ai/history/bootstrap',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({ readings })
  });
  powerAiHistoryBootstrapKeys.set(String(meterId), bootstrapKey);
  return result;
}

function getValuesByDiaChi(ioaData, diachi) {
  const item = ioaData.find(x => Number(x.ioa_diachi) === Number(diachi));
  if (!item || !Array.isArray(item.cambien)) return [];

  return item.cambien
    .map(x => typeof x === 'string' ? JSON.parse(x) : x)
    .map(x => Number(x.value))
    .filter(x => !Number.isNaN(x));
}

function getLatestAiMeasurementTime(ioaData) {
  let latest = 0;

  (ioaData || []).forEach(item => {
    if (!Array.isArray(item.cambien)) return;
    item.cambien.forEach(raw => {
      const reading = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const match = String(reading && reading.time || '').match(
        /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
      );
      if (!match) return;
      const timestamp = new Date(
        Number(match[3]),
        Number(match[2]) - 1,
        Number(match[1]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6])
      ).getTime();
      if (timestamp > latest) latest = timestamp;
    });
  });

  return latest ? new Date(latest).toISOString() : new Date().toISOString();
}

function avg(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function max(arr) {
  return arr.length ? Math.max(...arr) : 0;
}

function round(v, n = 2) {
  return Number(Number(v || 0).toFixed(n));
}
function buildAiRecommendation(x) {
  const notes = [];

  if (x.score >= 90) {
    notes.push('Hệ thống đang vận hành ổn định, không phát hiện bất thường nghiêm trọng.');
  } else if (x.score >= 75) {
    notes.push('Hệ thống vận hành bình thường nhưng có một số thông số cần theo dõi.');
  } else {
    notes.push('Phát hiện dấu hiệu bất thường, cần kiểm tra thiết bị và chất lượng điện năng.');
  }

  notes.push(`Điện áp 3 pha hiện tại ${round(x.avgUa, 1)} / ${round(x.avgUb, 1)} / ${round(x.avgUc, 1)} V.`);

  if (x.imbalance > 20) {
    notes.push(`Dòng điện mất cân bằng ${round(x.imbalance)}%, cần kiểm tra phân bố tải.`);
  } else {
    notes.push(`Dòng điện các pha ở mức ${round(x.avgIa, 2)} / ${round(x.avgIb, 2)} / ${round(x.avgIc, 2)} A.`);
  }

  notes.push(`Công suất phụ tải hiện tại khoảng ${round(x.maxP, 2)} kW.`);

  if (x.avgPf >= 0.95) {
    notes.push(`Cosφ đạt ${round(x.avgPf, 2)}, hệ số công suất tốt.`);
  } else {
    notes.push(`Cosφ đạt ${round(x.avgPf, 2)}, nên tiếp tục theo dõi hệ thống bù.`);
  }

  notes.push(`Tần số ${round(x.avgFreq, 2)} Hz, THD trung bình ${round(x.avgThd, 2)}%.`);

  return notes.join(' ');
}

async function analyzeWithPowerAI(reading) {
  const response = await $.ajax({
    url: '/api/power-ai/analyze/hybrid',
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify(reading)
  });

  return response && response.success ? response.data : null;
}

function powerAISocketTimestamp(value) {
  const text = String(value || '').trim();
  const match = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/
  );
  if (!match) {
    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
  }
  return new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6])
  ).toISOString();
}

async function analyzePowerAIRealtime(meterId) {
  const meterKey = String(meterId);
  if (document.hidden || powerAiRealtimeInFlight.has(meterKey)) return;

  const lastAnalyzedAt = powerAiRealtimeLastAnalyzedAt.get(meterKey) || 0;
  if (Date.now() - lastAnalyzedAt < POWER_AI_REALTIME_ANALYSIS_INTERVAL_MS) return;

  const snapshot = powerAiRealtimeMeters.get(meterKey);
  if (!snapshot) return;

  const lowVoltageRequired = [0, 1, 2, 7, 8, 9];
  const legacyRequired = [5000, 5001, 5002, 5006, 5007, 5008];
  const usesLowVoltage = lowVoltageRequired.every(
    ioa => Number.isFinite(snapshot.values[ioa])
  );
  if (
    !usesLowVoltage &&
    !legacyRequired.every(ioa => Number.isFinite(snapshot.values[ioa]))
  ) return;

  const voltageIOAs = usesLowVoltage ? [0, 1, 2] : [5000, 5001, 5002];
  const currentIOAs = usesLowVoltage ? [7, 8, 9] : [5006, 5007, 5008];
  const cosIOAs = usesLowVoltage ? [23, 24, 25] : [5040, 5041, 5042];
  const powerFactors = cosIOAs
    .map(ioa => snapshot.values[ioa])
    .filter(Number.isFinite);
  const i0 = calculatePowerAIResidualCurrent(
    snapshot.values[currentIOAs[0]],
    snapshot.values[currentIOAs[1]],
    snapshot.values[currentIOAs[2]],
    snapshot.values[5050],
    snapshot.values[5051],
    snapshot.values[5052]
  );
  const reading = {
    meter_id: String(meterId),
    time: snapshot.time || new Date().toISOString(),
    ua: snapshot.values[voltageIOAs[0]],
    ub: snapshot.values[voltageIOAs[1]],
    uc: snapshot.values[voltageIOAs[2]],
    ia: snapshot.values[currentIOAs[0]],
    ib: snapshot.values[currentIOAs[1]],
    ic: snapshot.values[currentIOAs[2]],
    i0,
    p_total: Number.isFinite(snapshot.values[5070]) ? snapshot.values[5070] : null,
    q_total: Number.isFinite(snapshot.values[5071]) ? snapshot.values[5071] : null,
    power_factor: powerFactors.length ? avg(powerFactors) : null,
    cos_a: Number.isFinite(snapshot.values[cosIOAs[0]])
      ? snapshot.values[cosIOAs[0]] : null,
    cos_b: Number.isFinite(snapshot.values[cosIOAs[1]])
      ? snapshot.values[cosIOAs[1]] : null,
    cos_c: Number.isFinite(snapshot.values[cosIOAs[2]])
      ? snapshot.values[cosIOAs[2]] : null,
    frequency: Number.isFinite(snapshot.values[5030]) ? snapshot.values[5030] : null,
    terminal_temperature_a: Number.isFinite(snapshot.values[1008])
      ? snapshot.values[1008] : null,
    terminal_temperature_b: Number.isFinite(snapshot.values[1009])
      ? snapshot.values[1009] : null,
    terminal_temperature_c: Number.isFinite(snapshot.values[1010])
      ? snapshot.values[1010] : null,
    ambient_temperature: Number.isFinite(snapshot.values[1011])
      ? snapshot.values[1011] : null,
    thd_ua: Number.isFinite(snapshot.values[5200]) ? snapshot.values[5200] : null,
    thd_ub: Number.isFinite(snapshot.values[5300]) ? snapshot.values[5300] : null,
    thd_uc: Number.isFinite(snapshot.values[5400]) ? snapshot.values[5400] : null,
    thd_ia: Number.isFinite(snapshot.values[5500]) ? snapshot.values[5500] : null,
    thd_ib: Number.isFinite(snapshot.values[5600]) ? snapshot.values[5600] : null,
    thd_ic: Number.isFinite(snapshot.values[5700]) ? snapshot.values[5700] : null
  };
  const signature = JSON.stringify(reading);
  if (powerAiRealtimeLastSent.get(meterKey) === signature) return;

  powerAiRealtimeInFlight.add(meterKey);
  powerAiRealtimeLastAnalyzedAt.set(meterKey, Date.now());
  try {
    await analyzeWithPowerAI(reading);
    powerAiRealtimeLastSent.set(meterKey, signature);
    await loadPowerAIOperations(meterId);
  } catch (err) {
    console.warn('Không thể phân tích dữ liệu PowerAI realtime:', err);
  } finally {
    powerAiRealtimeInFlight.delete(meterKey);
  }
}

window.pushPowerAIRealtime = function (socketRows) {
  const selectedMeterId = String(getSelectedDeviceId() || '');
  if (!selectedMeterId || !Array.isArray(socketRows)) return;

  const trackedIOAs = new Set([
    0, 1, 2, 7, 8, 9, 23, 24, 25,
    5000, 5001, 5002,
    5006, 5007, 5008,
    5030, 5040, 5041, 5042,
    5050, 5051, 5052,
    5070, 5071,
    5200, 5300, 5400, 5500, 5600, 5700,
    1008, 1009, 1010, 1011
  ]);
  let updated = false;

  socketRows.forEach(row => {
    if (!Array.isArray(row) || String(row[1]) !== selectedMeterId) return;
    const ioa = Number(row[2]);
    const value = Number(row[3]);
    if (!trackedIOAs.has(ioa) || !Number.isFinite(value)) return;

    const snapshot = powerAiRealtimeMeters.get(selectedMeterId) || {
      values: {},
      time: null
    };
    snapshot.values[ioa] = value;
    snapshot.time = powerAISocketTimestamp(row[4]);
    powerAiRealtimeMeters.set(selectedMeterId, snapshot);
    updated = true;
  });

  if (!updated) return;
  updatePowerAILowVoltageTrend(selectedMeterId, powerAiRealtimeMeters.get(selectedMeterId));
  if (powerAiRealtimeTimers.has(selectedMeterId)) return;
  const elapsed = Date.now() - (powerAiRealtimeLastAnalyzedAt.get(selectedMeterId) || 0);
  const delay = Math.max(
    1500,
    POWER_AI_REALTIME_ANALYSIS_INTERVAL_MS - elapsed
  );
  powerAiRealtimeTimers.set(
    selectedMeterId,
    window.setTimeout(() => {
      powerAiRealtimeTimers.delete(selectedMeterId);
      analyzePowerAIRealtime(selectedMeterId);
    }, delay)
  );
};

document.addEventListener('visibilitychange', function () {
  if (document.hidden) return;
  const meterId = String(getSelectedDeviceId() || '');
  if (!meterId || !powerAiRealtimeMeters.has(meterId)) return;
  analyzePowerAIRealtime(meterId);
});

function thdRealtimeLabel(value) {
  const text = String(value || '').trim();
  if (text.includes(' ')) return text.split(' ')[1] || text;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime())
    ? text
    : parsed.toLocaleTimeString('vi-VN', { hour12: false });
}

function appendTHDRealtimePoint(chart, values, ioas, referenceLimit) {
  if (!chart || !chart.data || !Array.isArray(chart.data.labels)) return;

  const label = thdRealtimeLabel(values.time);
  if (!label) return;
  let index = chart.data.labels.lastIndexOf(label);

  if (index < 0) {
    chart.data.labels.push(label);
    index = chart.data.labels.length - 1;
    chart.data.datasets.forEach(dataset => dataset.data.push(null));
  }

  ioas.forEach((ioa, datasetIndex) => {
    if (Number.isFinite(values[ioa])) {
      chart.data.datasets[datasetIndex].data[index] = values[ioa];
    }
  });
  chart.data.datasets[3].data[index] = referenceLimit;

  while (chart.data.labels.length > THD_REALTIME_MAX_POINTS) {
    chart.data.labels.shift();
    chart.data.datasets.forEach(dataset => {
      dataset.data.shift();
      if (Array.isArray(dataset.harmonics)) dataset.harmonics.shift();
    });
  }

  chart.update(0);
}

function flushTHDRealtime(meterId) {
  const snapshot = thdRealtimeSnapshots.get(String(meterId));
  if (!snapshot) return;

  appendTHDRealtimePoint(
    window.chartTHDU,
    snapshot,
    [5200, 5300, 5400],
    5
  );
  appendTHDRealtimePoint(
    window.chartTHDI,
    snapshot,
    [5500, 5600, 5700],
    8
  );

  if (window.chartTHDU) {
    updateTHDSummary(
      'U',
      window.chartTHDU.data.datasets.slice(0, 3).map(dataset => dataset.data),
      window.chartTHDU.data.labels,
      5
    );
    $('#thdUUpdated').text(snapshot.time || '--');
  }
  if (window.chartTHDI) {
    updateTHDSummary(
      'I',
      window.chartTHDI.data.datasets.slice(0, 3).map(dataset => dataset.data),
      window.chartTHDI.data.labels,
      8
    );
    $('#thdIUpdated').text(snapshot.time || '--');
  }
}

window.pushTHDRealtime = function (socketRows) {
  const selectedMeterId = String(getSelectedDeviceId() || '');
  if (!selectedMeterId || !Array.isArray(socketRows)) return;

  const thdIOAs = new Set([5200, 5300, 5400, 5500, 5600, 5700]);
  let updated = false;
  let snapshot = thdRealtimeSnapshots.get(selectedMeterId) || {};

  socketRows.forEach(row => {
    if (!Array.isArray(row) || String(row[1]) !== selectedMeterId) return;
    const ioa = Number(row[2]);
    const value = Number(row[3]);
    if (!thdIOAs.has(ioa) || !Number.isFinite(value)) return;
    const rowTime = row[4] || new Date().toISOString();
    snapshot[ioa] = value;
    snapshot.time = rowTime;
    updated = true;
  });

  if (!updated) return;
  thdRealtimeSnapshots.set(selectedMeterId, snapshot);
  window.clearTimeout(thdRealtimeTimers.get(selectedMeterId));
  thdRealtimeTimers.set(
    selectedMeterId,
    window.setTimeout(() => {
      thdRealtimeTimers.delete(selectedMeterId);
      flushTHDRealtime(selectedMeterId);
    }, 500)
  );
};

function createElectricalRealtimeChart(canvasId, phasePrefix, unit, yAxisOptions) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof Chart === 'undefined') return null;

  return new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: `${phasePrefix}A (${unit})`,
          data: [],
          borderColor: '#f59e0b',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: .2
        },
        {
          label: `${phasePrefix}B (${unit})`,
          data: [],
          borderColor: '#22c55e',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: .2
        },
        {
          label: `${phasePrefix}C (${unit})`,
          data: [],
          borderColor: '#ef4444',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: .2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 0 },
      legend: {
        labels: {
          fontColor: '#dcecff',
          boxWidth: 24,
          padding: 12
        }
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (tooltipItem, data) {
            const dataset = data.datasets[tooltipItem.datasetIndex];
            return `${dataset.label}: ${Number(tooltipItem.yLabel).toFixed(2)}`;
          }
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8,
            maxRotation: 0,
            fontColor: '#9cabc0'
          },
          gridLines: { color: 'rgba(120, 170, 210, .08)' }
        }],
        yAxes: [{
          ticks: Object.assign({
            fontColor: '#9cabc0',
            callback: value => `${value} ${unit}`
          }, yAxisOptions),
          gridLines: { color: 'rgba(120, 170, 210, .1)' }
        }]
      }
    }
  });
}

function initElectricalRealtimeCharts() {
  if (!window.powerAiRealtimeVoltageChart) {
    window.powerAiRealtimeVoltageChart = createElectricalRealtimeChart(
      'realtimeVoltageChart',
      'U',
      'V',
      { suggestedMin: 190, suggestedMax: 250 }
    );
  }
  if (!window.powerAiRealtimeCurrentChart) {
    window.powerAiRealtimeCurrentChart = createElectricalRealtimeChart(
      'realtimeCurrentChart',
      'I',
      'A',
      { beginAtZero: true }
    );
  }
}

function loadElectricalChartsFromApi(ioaData) {
  const trackedIOAs = new Set([5000, 5001, 5002, 5006, 5007, 5008]);
  const points = {};

  (ioaData || []).forEach(item => {
    const ioa = Number(item.ioa_diachi);
    if (!trackedIOAs.has(ioa) || !Array.isArray(item.cambien)) return;
    item.cambien.forEach(raw => {
      const reading = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const time = reading && reading.time;
      const value = Number(reading && reading.value);
      if (!time || !Number.isFinite(value)) return;
      if (!points[time]) points[time] = { time };
      points[time][ioa] = value;
    });
  });

  const rows = Object.values(points)
    .sort((a, b) => parseDateVN(a.time) - parseDateVN(b.time))
    .slice(-ELECTRICAL_REALTIME_MAX_POINTS);
  if (!rows.length) return;

  initElectricalRealtimeCharts();
  const setChartData = (chart, ioas) => {
    if (!chart) return;
    chart.data.labels = rows.map(row => getOnlyTime(row.time));
    ioas.forEach((ioa, index) => {
      chart.data.datasets[index].data = rows.map(row => (
        Number.isFinite(row[ioa]) ? row[ioa] : null
      ));
    });
    chart.update(0);
  };
  setChartData(window.powerAiRealtimeVoltageChart, [5000, 5001, 5002]);
  setChartData(window.powerAiRealtimeCurrentChart, [5006, 5007, 5008]);

  const latest = rows[rows.length - 1];
  const selectedMeterId = String(getSelectedDeviceId() || '');
  if (selectedMeterId) {
    electricalRealtimeSnapshots.set(selectedMeterId, { ...latest });
  }
  const valueBindings = {
    5000: '#realtimeUA',
    5001: '#realtimeUB',
    5002: '#realtimeUC',
    5006: '#realtimeIA',
    5007: '#realtimeIB',
    5008: '#realtimeIC'
  };
  Object.entries(valueBindings).forEach(([ioa, selector]) => {
    if (Number.isFinite(latest[ioa])) {
      $(selector).text(Number(latest[ioa]).toFixed(2));
    }
  });
  $('#realtimeUUpdated, #realtimeIUpdated').text(latest.time);
  $('#realtimeUStatus, #realtimeIStatus')
    .removeClass('warning')
    .addClass('normal')
    .text('Đã tải lịch sử');
}

function resetElectricalRealtimeCharts() {
  [window.powerAiRealtimeVoltageChart, window.powerAiRealtimeCurrentChart].forEach(chart => {
    if (!chart) return;
    chart.data.labels.length = 0;
    chart.data.datasets.forEach(dataset => {
      dataset.data.length = 0;
    });
    chart.update(0);
  });
  $('#realtimeUA, #realtimeUB, #realtimeUC, #realtimeIA, #realtimeIB, #realtimeIC').text('--');
  $('#realtimeUUpdated, #realtimeIUpdated').text('--');
  $('#realtimeUStatus, #realtimeIStatus')
    .removeClass('normal warning')
    .text('Chờ dữ liệu');
}

function appendElectricalRealtimePoint(chart, snapshot, ioas) {
  if (!chart) return;
  const label = thdRealtimeLabel(snapshot.time);
  if (!label) return;

  let index = chart.data.labels.lastIndexOf(label);
  if (index < 0) {
    chart.data.labels.push(label);
    index = chart.data.labels.length - 1;
    chart.data.datasets.forEach(dataset => dataset.data.push(null));
  }
  ioas.forEach((ioa, datasetIndex) => {
    if (Number.isFinite(snapshot[ioa])) {
      chart.data.datasets[datasetIndex].data[index] = snapshot[ioa];
    }
  });

  while (chart.data.labels.length > ELECTRICAL_REALTIME_MAX_POINTS) {
    chart.data.labels.shift();
    chart.data.datasets.forEach(dataset => dataset.data.shift());
  }
  chart.update(0);
}

function flushElectricalRealtime(meterId) {
  const snapshot = electricalRealtimeSnapshots.get(String(meterId));
  if (!snapshot) return;
  const required = [5000, 5001, 5002, 5006, 5007, 5008];
  if (!required.every(ioa => Number.isFinite(snapshot[ioa]))) return;
  initElectricalRealtimeCharts();

  appendElectricalRealtimePoint(
    window.powerAiRealtimeVoltageChart,
    snapshot,
    [5000, 5001, 5002]
  );
  appendElectricalRealtimePoint(
    window.powerAiRealtimeCurrentChart,
    snapshot,
    [5006, 5007, 5008]
  );

  const valueBindings = {
    5000: '#realtimeUA',
    5001: '#realtimeUB',
    5002: '#realtimeUC',
    5006: '#realtimeIA',
    5007: '#realtimeIB',
    5008: '#realtimeIC'
  };
  Object.entries(valueBindings).forEach(([ioa, selector]) => {
    if (Number.isFinite(snapshot[ioa])) {
      $(selector).text(Number(snapshot[ioa]).toFixed(2));
    }
  });
  $('#realtimeUUpdated, #realtimeIUpdated').text(snapshot.time || '--');
  $('#realtimeUStatus, #realtimeIStatus')
    .removeClass('warning')
    .addClass('normal')
    .text('Đang cập nhật');
}

window.pushElectricalRealtime = function (socketRows) {
  const selectedMeterId = String(getSelectedDeviceId() || '');
  if (!selectedMeterId || !Array.isArray(socketRows)) return;

  const electricalIOAs = new Set([5000, 5001, 5002, 5006, 5007, 5008]);
  let updated = false;
  let snapshot = electricalRealtimeSnapshots.get(selectedMeterId) || {};

  socketRows.forEach(row => {
    if (!Array.isArray(row) || String(row[1]) !== selectedMeterId) return;
    const ioa = Number(row[2]);
    const value = Number(row[3]);
    if (!electricalIOAs.has(ioa) || !Number.isFinite(value)) return;
    const rowTime = row[4] || new Date().toISOString();
    snapshot[ioa] = value;
    snapshot.time = rowTime;
    updated = true;
  });

  if (!updated) return;
  electricalRealtimeSnapshots.set(selectedMeterId, snapshot);
  window.clearTimeout(electricalRealtimeTimers.get(selectedMeterId));
  electricalRealtimeTimers.set(
    selectedMeterId,
    window.setTimeout(() => {
      electricalRealtimeTimers.delete(selectedMeterId);
      flushElectricalRealtime(selectedMeterId);
    }, 500)
  );
};

function updatePowerAILowVoltageTrend(meterId, snapshot) {
  const temperatures = [1008, 1009, 1010]
    .map(ioa => Number(snapshot && snapshot.values && snapshot.values[ioa]));
  if (!temperatures.every(Number.isFinite)) return;
  const currents = [7, 8, 9]
    .map(ioa => Number(snapshot && snapshot.values && snapshot.values[ioa]));
  const ambient = Number(snapshot.values[1011]);
  const hottest = Math.max(...temperatures);
  const spread = hottest - Math.min(...temperatures);
  const maximumRise = Number.isFinite(ambient) ? hottest - ambient : 0;
  const currentAverage = currents.every(Number.isFinite) ? avg(currents) : 0;
  const currentUnbalance = currentAverage > 0
    ? Math.max(...currents.map(value => Math.abs(value - currentAverage)))
      / currentAverage * 100
    : 0;
  let severity = 'normal';
  let condition = 'Tốt';
  let riskScore = 0;
  let diagnosis = 'Nhiệt độ cân bằng và phù hợp với tải hiện tại';
  let recommendation = 'Tiếp tục theo dõi tương quan tải–nhiệt từng pha.';
  if (hottest >= 85 || maximumRise >= 45 || spread >= 25) {
    severity = 'critical';
    condition = 'Nguy hiểm';
    riskScore = 95;
    diagnosis = `Quá nhiệt/điểm nóng nghiêm trọng, lệch pha ${round(spread, 1)}°C`;
    recommendation = 'Giảm tải và kiểm tra đầu nối, lực siết, thông gió ngay khi an toàn.';
  } else if (hottest >= 70 || maximumRise >= 30 || spread >= 15) {
    severity = 'warning';
    condition = 'Cần chú ý';
    riskScore = spread >= 15 ? 70 : 60;
    diagnosis = spread >= 15 && currentUnbalance < 20
      ? `Điểm nóng lệch ${round(spread, 1)}°C, nghi ngờ tiếp xúc kém`
      : `Nhiệt độ tăng cao theo tải, ΔT lớn nhất ${round(maximumRise, 1)}°C`;
    recommendation = 'Kiểm tra pha nóng nhất và đối chiếu ảnh nhiệt trong kỳ gần nhất.';
  }
  updatePowerAILowVoltageAnalysis({
    assessment: { condition, risk_score: riskScore },
    severity,
    diagnosis,
    recommendation
  });
  const average = avg(temperatures);
  const history = powerAiLowVoltageThermalHistory.get(String(meterId)) || [];
  const previous = history.length ? history[history.length - 1] : null;
  if (!previous || Math.abs(previous.value - average) >= 0.01) {
    history.push({ value: average, time: Date.now() });
    powerAiLowVoltageThermalHistory.set(String(meterId), history.slice(-24));
  }
  if (!previous) {
    $('#powerAiLvTrend b').text('Cần thêm mẫu để xác định xu hướng');
    return;
  }
  const delta = average - previous.value;
  const label = delta > 0.2
    ? `Đang tăng +${round(delta, 1)}°C`
    : delta < -0.2
      ? `Đang giảm ${round(delta, 1)}°C`
      : 'Ổn định';
  $('#powerAiLvTrend')
    .removeClass('normal warning critical')
    .addClass(delta > 1 ? 'warning' : 'normal')
    .find('b').text(label);
}

function updatePowerAILowVoltageAnalysis({
  assessment,
  severity,
  diagnosis,
  recommendation
} = {}) {
  if (assessment) {
    const riskScore = Number(assessment.risk_score);
    $('#powerAiLvAssessment')
      .removeClass('normal warning critical')
      .addClass(severity || 'normal')
      .find('b').text(assessment.condition || powerAIStatusLabel(severity));
    $('#powerAiLvAssessment strong').text(
      Number.isFinite(riskScore) ? `${riskScore}/100` : '--'
    );
  }
  if (diagnosis) {
    $('#powerAiLvAlert')
      .removeClass('normal warning critical')
      .addClass(severity || 'normal')
      .find('b').text(diagnosis);
  }
  if (recommendation) {
    $('#powerAiLvRecommendation').text(recommendation);
  }
}

function applyPowerAIResult(data, result) {
  if (!result) return data;

  const severity = result.status;
  const reasons = result.rule_result && Array.isArray(result.rule_result.reasons)
    ? result.rule_result.reasons
    : [];
  const aiResult = result.ai_result || {};
  const ruleResult = result.rule_result || {};
  const assessment = ruleResult.assessment || {};
  const recommendations = Array.isArray(diagnosis.recommendations)
    ? diagnosis.recommendations
    : [];
  const thermalMetrics = assessment.metrics
    && assessment.metrics.terminal_temperature_c;
  const notes = [];

  if (severity === 'critical') {
    data.score = Math.min(data.score, 50);
    data.status = 'Nguy cơ cao';
  } else if (severity === 'warning') {
    data.score = Math.min(data.score, 75);
    data.status = 'Cần theo dõi';
  }

  if (reasons.length) {
    notes.push(`PowerAI phát hiện: ${reasons.join('; ')}.`);
  }
  if (Number.isFinite(Number(assessment.risk_score))) {
    notes.push(`Điểm rủi ro điện–nhiệt: ${Number(assessment.risk_score)}/100.`);
  }
  if (recommendations.length) {
    notes.push(`Khuyến nghị: ${recommendations.join('; ')}.`);
  }
  if (thermalMetrics) {
    updatePowerAILowVoltageAnalysis({
      assessment,
      severity,
      diagnosis: reasons[0] || 'Điện–nhiệt khoang hạ thế bình thường',
      recommendation: recommendations[0] || reasons[0]
    });
  }

  if (aiResult.ready && aiResult.is_anomaly) {
    notes.push(`Mô hình AI ghi nhận dấu hiệu bất thường (điểm ${round(aiResult.score, 4)}).`);
  } else if (aiResult.ready) {
    notes.push('Mô hình AI chưa ghi nhận dấu hiệu bất thường.');
  } else if (aiResult.reason) {
    notes.push(`AI đang tích lũy dữ liệu: ${aiResult.reason}.`);
  }

  data.warning_count = severity === 'normal'
    ? data.warning_count
    : Math.max(Number(data.warning_count) || 0, 1);
  data.power_ai = {
    status: severity,
    source: result.source,
    ready: Boolean(aiResult.ready),
    history_rows: result.history_rows
  };

  if (notes.length) {
    data.recommendation = `${notes.join(' ')} ${data.recommendation || ''}`.trim();
  }

  return data;
}

function escapePowerAIText(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function powerAIStatusLabel(status) {
  return {
    normal: 'Bình thường',
    warning: 'Cảnh báo',
    critical: 'Nghiêm trọng',
    good: 'Tốt',
    attention: 'Cần chú ý',
    excellent: 'Xuất sắc'
  }[String(status || '').toLowerCase()] || 'Cần xem xét';
}

function powerAISourceLabel(source) {
  return {
    rule: 'Thuật toán vận hành',
    ai: 'Trí tuệ nhân tạo',
    ai_anomaly: 'AI phát hiện bất thường',
    hybrid: 'Thuật toán kết hợp AI',
    rule_and_ai: 'Thuật toán kết hợp AI',
    'rule+ai': 'Thuật toán kết hợp AI'
  }[String(source || '').toLowerCase()] || 'PowerAI';
}

function powerAIFieldLabel(field) {
  return {
    ua: 'Điện áp pha A',
    ub: 'Điện áp pha B',
    uc: 'Điện áp pha C',
    ia: 'Dòng điện pha A',
    ib: 'Dòng điện pha B',
    ic: 'Dòng điện pha C',
    i0: 'Dòng điện thứ tự không',
    p_total: 'Tổng công suất tác dụng',
    q_total: 'Tổng công suất phản kháng',
    power_factor: 'Hệ số công suất',
    frequency: 'Tần số'
  }[String(field || '').toLowerCase()] || String(field || '');
}

function powerAILevelLabel(level) {
  return {
    excellent: 'Xuất sắc',
    good: 'Tốt',
    attention: 'Cần chú ý',
    critical: 'Nguy cơ cao'
  }[level] || 'Chưa xác định';
}

function renderPowerAIHealth(health) {
  window.currentPowerAiHealth = health || null;
  const missingFields = Array.isArray(health.missing_fields)
    ? health.missing_fields
    : [];
  const assessment = health.operational_assessment || {};
  const voltage = assessment.voltage || {};
  const current = assessment.current || {};
  const powerFactor = assessment.power_factor || {};

  $('#powerAiHealth')
    .attr({
      'data-health-clickable': 'true',
      role: 'button',
      tabindex: '0',
      title: 'Nhấn để xem cách tính và diễn giải sức khỏe thiết bị'
    })
    .removeClass('power-ai-loading').html(`
    <div class="power-ai-health-overview">
      <div class="power-ai-health-score level-${escapePowerAIText(health.level)}">
        <strong>${escapePowerAIText(health.score)}</strong>
        <span>/100</span>
      </div>
      <div class="power-ai-health-detail">
        <b>${escapePowerAIText(powerAILevelLabel(health.level))}</b>
        <span>${escapePowerAIText(health.events_24h)} lần phân tích trong 24 giờ</span>
        <div class="power-ai-health-kpis">
          <span><small>Cảnh báo</small><b>${escapePowerAIText(health.warnings_24h)}</b></span>
          <span><small>Nghiêm trọng</small><b>${escapePowerAIText(health.criticals_24h)}</b></span>
          <span><small>Bất thường AI</small><b>${escapePowerAIText(health.ai_anomalies_24h)}</b></span>
        </div>
        ${missingFields.length
          ? `<small>Thiếu: ${escapePowerAIText(missingFields.map(powerAIFieldLabel).join(', '))}</small>`
          : '<small>Đầy đủ thông số vận hành chính.</small>'}
      </div>
    </div>
    ${assessment.samples ? `
      <div class="power-ai-history-assessment level-${escapePowerAIText(assessment.level)}">
        <div class="power-ai-history-head">
          <b>Đánh giá lịch sử 24 giờ</b>
          <i class="fas fa-history"></i>
        </div>
        <span>${escapePowerAIText(assessment.summary)}</span>
        <div class="power-ai-history-metrics">
          <small><i class="fas fa-bolt"></i><span>Điện áp đạt chuẩn</span><strong>${powerAIChatValue(voltage.compliance_percent, 1, '%')}</strong></small>
          <small><i class="fas fa-wave-square"></i><span>Dòng trung bình</span><strong>${powerAIChatValue(current.average, 2, 'A')}</strong></small>
          <small><i class="fas fa-tachometer-alt"></i><span>Cosφ trung bình</span><strong>${powerAIChatValue(powerFactor.average, 3, '')}</strong></small>
        </div>
      </div>` : ''}
  `);
}

function openPowerAIHealthDetail() {
  const health = window.currentPowerAiHealth;
  if (!health) return;
  window.powerAiHealthReturnFocus = document.activeElement;
  const assessment = health.operational_assessment || {};
  const voltage = assessment.voltage || {};
  const current = assessment.current || {};
  const powerFactor = assessment.power_factor || {};
  const deductions = Array.isArray(health.deductions) ? health.deductions : [];
  const level = powerAILevelLabel(health.level);
  const assessmentLevel = {
    stable: 'Ổn định',
    attention: 'Cần chú ý',
    warning: 'Bất thường'
  }[assessment.level] || 'Chưa đủ dữ liệu';

  $('#powerAiHealthDetailBody').html(`
    <div class="power-ai-health-explain-score">
      <div class="power-ai-health-explain-main">
        <strong>${powerAIChatValue(health.score, 0, '/100')}</strong>
        <small>${escapePowerAIText(level)}</small>
      </div>
      <div class="power-ai-health-explain-kpis">
        <span>Lần phân tích 24 giờ<b>${escapePowerAIText(health.events_24h || 0)}</b></span>
        <span>Cảnh báo<b>${escapePowerAIText(health.warnings_24h || 0)}</b></span>
        <span>Sự kiện nghiêm trọng<b>${escapePowerAIText(health.criticals_24h || 0)}</b></span>
        <span>Bất thường AI<b>${escapePowerAIText(health.ai_anomalies_24h || 0)}</b></span>
      </div>
    </div>
    <div class="power-ai-alert-detail-section">
      <h4>Điểm sức khỏe được tính như thế nào?</h4>
      <p>Điểm bắt đầu từ 100. PowerAI trừ điểm theo số cảnh báo, sự kiện nghiêm trọng, bất thường AI, dữ liệu bị thiếu và chất lượng vận hành trong 24 giờ gần nhất.</p>
      ${deductions.length ? `
        <div class="power-ai-deduction-list">
          ${deductions.map(item => `
            <span>${escapePowerAIText(item.reason)}<b>-${escapePowerAIText(item.points)} điểm</b></span>
          `).join('')}
        </div>` : '<p><i class="fas fa-check-circle"></i> Không có khoản trừ điểm tại thời điểm đánh giá.</p>'}
      <p><i class="fas fa-info-circle"></i> Điểm sức khỏe là chỉ số hỗ trợ vận hành, không thay thế kết quả kiểm định thiết bị.</p>
    </div>
    <div class="power-ai-alert-detail-section">
      <h4>Đánh giá lịch sử điện áp, dòng điện và Cosφ</h4>
      <div class="power-ai-reading-grid">
        <span>Trạng thái lịch sử <b>${escapePowerAIText(assessmentLevel)}</b></span>
        <span>Số mẫu <b>${escapePowerAIText(assessment.samples || 0)}</b></span>
        <span>Điện áp trung bình <b>${powerAIChatValue(voltage.average, 2, 'V')}</b></span>
        <span>Điện áp đạt chuẩn <b>${powerAIChatValue(voltage.compliance_percent, 1, '%')}</b></span>
        <span>Dòng trung bình <b>${powerAIChatValue(current.average, 2, 'A')}</b></span>
        <span>Mất cân bằng lớn nhất <b>${powerAIChatValue(current.maximum_unbalance_percent, 1, '%')}</b></span>
        <span>Cosφ trung bình <b>${powerAIChatValue(powerFactor.average, 3, '')}</b></span>
        <span>Cosφ đạt chuẩn <b>${powerAIChatValue(powerFactor.compliance_percent, 1, '%')}</b></span>
      </div>
      <p>${escapePowerAIText(assessment.summary || 'Chưa đủ dữ liệu lịch sử để kết luận.')}</p>
    </div>
    <div class="power-ai-alert-detail-section">
      <h4>Cách đọc mức sức khỏe</h4>
      <p><b>90–100:</b> Xuất sắc · <b>75–89:</b> Tốt · <b>50–74:</b> Cần chú ý · <b>Dưới 50:</b> Nguy cơ cao.</p>
    </div>
  `);
  $('#powerAiHealthDetail, #powerAiHealthBackdrop')
    .addClass('open')
    .attr('aria-hidden', 'false');
  $('body').addClass('power-ai-modal-open');
  $('#powerAiHealthDetailClose').focus();
}

function closePowerAIHealthDetail() {
  $('#powerAiHealthDetail, #powerAiHealthBackdrop').removeClass('open');
  $('#powerAiHealthDetail, #powerAiHealthBackdrop').attr('aria-hidden', 'true');
  $('body').removeClass('power-ai-modal-open');
  if (
    window.powerAiHealthReturnFocus &&
    typeof window.powerAiHealthReturnFocus.focus === 'function'
  ) {
    window.powerAiHealthReturnFocus.focus();
  }
}

function powerAITranslateAlertText(value) {
  const text = String(value || '').trim();
  if (!text) return text;

  const exactLabels = {
    'DATA STREAM TIMEOUT': 'Mất dữ liệu thời gian thực',
    'Data Stream Timeout': 'Mất dữ liệu thời gian thực',
    'Current Unbalance': 'Mất cân bằng dòng điện',
    'Current Unbalance High': 'Mất cân bằng dòng điện cao',
    'Thd Current High': 'Độ méo hài dòng điện cao',
    'THD Current High': 'Độ méo hài dòng điện cao',
    'Thd Voltage High': 'Độ méo hài điện áp cao',
    'THD Voltage High': 'Độ méo hài điện áp cao',
    'Invalid Data': 'Dữ liệu không hợp lệ',
    'Low Voltage': 'Điện áp thấp',
    'High Voltage': 'Điện áp cao',
    'Low Power Factor': 'Hệ số công suất thấp',
    'Overload': 'Quá tải',
    'Terminal Hotspot': 'Quá nhiệt đầu cực',
    'Residual Current Warning': 'Cảnh báo dòng điện dư',
    'Residual Current Critical': 'Dòng điện dư nghiêm trọng'
  };

  if (exactLabels[text]) return exactLabels[text];

  return text
    .replace(/\bCurrent Unbalance\b/gi, 'Mất cân bằng dòng điện')
    .replace(/\bVoltage Unbalance\b/gi, 'Mất cân bằng điện áp')
    .replace(/\bTHD Current High\b/gi, 'Độ méo hài dòng điện cao')
    .replace(/\bTHD Voltage High\b/gi, 'Độ méo hài điện áp cao')
    .replace(/\bInvalid Data\b/gi, 'Dữ liệu không hợp lệ')
    .replace(/\bData Stream Timeout\b/gi, 'Mất dữ liệu thời gian thực');
}

function normalizePowerAIAlert(rawAlert) {
  const alert = rawAlert || {};
  const incident = alert.incident || alert.alert_incident || alert.alert_decision?.incident || {};
  const latestDetail = alert.latest_detail || incident.latest_detail || {};
  const dashboardAlert = alert.dashboard_alert || latestDetail.dashboard_alert || {};
  const diagnosis = alert.diagnosis || latestDetail.diagnosis || dashboardAlert || alert.explanation || {};
  const ruleResult = alert.rule_result || latestDetail.rule_result || {};
  const aiResult = alert.ai_result || latestDetail.ai_result || {};
  const ruleReasons = Array.isArray(ruleResult.reasons) ? ruleResult.reasons : [];
  const rootCauses = Array.isArray(diagnosis.root_causes) ? diagnosis.root_causes : [];
  const recommendations = (Array.isArray(diagnosis.recommendations)
    ? diagnosis.recommendations
    : (Array.isArray(ruleResult.recommendations) ? ruleResult.recommendations : []))
    .map(powerAITranslateAlertText);
  const incidentType = diagnosis.incident_type
    || dashboardAlert.incident_type
    || alert.incident_type
    || incident.incident_type
    || ruleResult.label
    || 'AI_ANOMALY_UNCLASSIFIED';
  const rawTitle = diagnosis.title || dashboardAlert.title || alert.title || incident.title
    || (incidentType === 'AI_ANOMALY_UNCLASSIFIED'
      ? 'Quan sát bất thường AI'
      : String(incidentType).replace(/_/g, ' '));
  const title = powerAITranslateAlertText(rawTitle);
  const rawCause = diagnosis.summary || diagnosis.cause || dashboardAlert.cause || alert.cause
    || ruleReasons[0] || rootCauses[0]
    || (incidentType === 'AI_ANOMALY_UNCLASSIFIED'
      ? 'AI ghi nhận độ lệch bất thường nhưng chưa đủ bằng chứng để phân loại.'
      : 'PowerAI đã phân loại cảnh báo từ dữ liệu vận hành.');
  const cause = powerAITranslateAlertText(rawCause);
  const confidence = Number(
    diagnosis.confidence_percent ?? dashboardAlert.confidence_percent
      ?? alert.confidence_percent ?? incident.confidence_percent
      ?? aiResult.confidence_percent
  );
  const source = diagnosis.source || dashboardAlert.source || alert.source || incident.source
    || latestDetail.source || (ruleReasons.length ? 'rule' : 'ai_anomaly');
  const severity = diagnosis.severity || dashboardAlert.severity || alert.severity || alert.status
    || incident.severity || 'warning';
  const operationalLevel = String(
    diagnosis.operational_level || dashboardAlert.operational_level || alert.operational_level
      || (incidentType === 'AI_ANOMALY_UNCLASSIFIED' ? 'observation' : severity)
  ).toLowerCase();
  const realEventId = alert.event_id
    || alert.latest_event_id
    || incident.latest_event_id
    || incident.event_id
    || latestDetail.event_id
    || null;
  const incidentId = alert.incident_id || incident.incident_id || null;
  const eventTime = dashboardAlert.event_time || dashboardAlert.time
    || alert.event_time || alert.time || latestDetail.event_time
    || latestDetail.time || incident.last_seen_at || incident.first_seen_at
    || alert.created_at || null;
  const reading = alert.snapshot || dashboardAlert.snapshot || alert.reading
    || latestDetail.snapshot || latestDetail.reading || incident.snapshot
    || diagnosis.snapshot || {};
  const clientKey = realEventId
    || incidentId
    || `${alert.meter_id || incident.meter_id || 'device'}-${eventTime || Date.now()}-${incidentType}`;

  return {
    ...alert,
    event_id: realEventId ? String(realEventId) : null,
    incident_id: incidentId ? String(incidentId) : null,
    client_key: String(clientKey),
    meter_id: alert.meter_id || incident.meter_id || reading.meter_id || null,
    time: eventTime,
    event_time: eventTime,
    reading,
    snapshot: reading,
    status: String(severity).toLowerCase(),
    operational_level: operationalLevel,
    requires_operator_action: diagnosis.requires_operator_action
      ?? dashboardAlert.requires_operator_action
      ?? (operationalLevel !== 'observation'),
    source,
    diagnosis: {
      ...diagnosis,
      incident_type: incidentType,
      title,
      summary: cause,
      root_causes: rootCauses,
      recommendations,
      confidence_percent: Number.isFinite(confidence) ? confidence : null,
      classification_status: diagnosis.classification_status || (
        incidentType === 'AI_ANOMALY_UNCLASSIFIED' ? 'needs_review' : 'classified'
      ),
      operational_level: operationalLevel,
      requires_operator_action: diagnosis.requires_operator_action
        ?? dashboardAlert.requires_operator_action
        ?? (operationalLevel !== 'observation'),
      default_visibility: diagnosis.default_visibility
        || dashboardAlert.default_visibility
        || (operationalLevel === 'observation' ? 'engineering' : 'operations')
    },
    incident_type: incidentType,
    title,
    cause,
    confidence_percent: Number.isFinite(confidence) ? confidence : null,
    recommendations,
    rule_result: ruleResult,
    ai_result: aiResult
  };
}

function powerAIIncidentLabel(value) {
  const key = String(value || '').toUpperCase();
  const labels = {
    CURRENT_UNBALANCE: 'Mất cân bằng dòng',
    VOLTAGE_UNBALANCE: 'Mất cân bằng điện áp',
    THD_CURRENT_HIGH: 'THD dòng cao',
    THD_VOLTAGE_HIGH: 'THD điện áp cao',
    RESIDUAL_CURRENT_WARNING: 'Dòng dư tăng',
    RESIDUAL_CURRENT_CRITICAL: 'Dòng dư nghiêm trọng',
    I0_HIGH: 'Dòng I0 cao',
    TERMINAL_HOTSPOT: 'Quá nhiệt đầu cực',
    OVERLOAD: 'Quá tải',
    LOW_POWER_FACTOR: 'Hệ số công suất thấp',
    VOLTAGE_LOW: 'Điện áp thấp',
    VOLTAGE_HIGH: 'Điện áp cao',
    AI_ANOMALY_UNCLASSIFIED: 'Quan sát bất thường AI'
  };
  return labels[key] || String(value || 'Bất thường vận hành').replace(/_/g, ' ');
}

function renderPowerAIAlerts(payload) {
  const rawAlerts = payload && Array.isArray(payload.alerts)
    ? payload.alerts
    : (Array.isArray(payload) ? payload : []);
  const sourceAlerts = rawAlerts.map(normalizePowerAIAlert);
  const groups = new Map();

  sourceAlerts.forEach(alert => {
    const groupKey = JSON.stringify([
      alert.meter_id,
      alert.status,
      alert.incident_type
    ]);
    const existing = groups.get(groupKey);
    const occurrence = {
      event_id: alert.event_id,
      client_key: alert.client_key,
      time: alert.time
    };
    if (existing) {
      if (!existing.occurrences.some(item => item.client_key === occurrence.client_key)) {
        existing.occurrences.push(occurrence);
      }
      if (new Date(alert.time || 0).getTime() >= new Date(existing.time || 0).getTime()) {
        Object.assign(existing, alert, { occurrences: existing.occurrences, group_key: groupKey });
      }
      return;
    }
    groups.set(groupKey, { ...alert, group_key: groupKey, occurrences: [occurrence] });
  });

  const alerts = [...groups.values()].map(alert => {
    alert.occurrences.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));
    alert.occurrence_count = alert.occurrences.length;
    alert.first_occurrence = alert.occurrences.at(-1)?.time;
    alert.last_occurrence = alert.occurrences[0]?.time;
    return alert;
  }).sort((a, b) => new Date(b.last_occurrence || 0) - new Date(a.last_occurrence || 0));

  window.powerAiAlertsById = new Map(
    alerts.map(alert => [String(alert.client_key), alert])
  );
  $('#powerAiAlertCount').text(alerts.length);

  if (!alerts.length) {
    $('#powerAiAlerts').html('<tr><td colspan="5" class="power-ai-empty">Không có cảnh báo đang hoạt động cho thiết bị này.</td></tr>');
    return;
  }

  $('#powerAiAlerts').html(alerts.map(alert => {
    const time = alert.time ? new Date(alert.time).toLocaleString('vi-VN') : 'Chưa có thời gian';
    const displayLevel = alert.operational_level === 'observation'
      ? { text: 'Quan sát', className: 'observation' }
      : { text: powerAIStatusLabel(alert.status), className: alert.status };
    const recommendation = alert.recommendations[0] || 'Mở chi tiết để xem hướng xử lý.';
    return `
      <tr class="power-ai-alert-row" data-client-key="${escapePowerAIText(alert.client_key)}"
        tabindex="0" title="Xem chẩn đoán và khuyến nghị">
        <td>${escapePowerAIText(time)}</td>
        <td><b class="power-ai-incident-type">${escapePowerAIText(powerAIIncidentLabel(alert.incident_type))}</b></td>
        <td><span class="power-ai-severity ${escapePowerAIText(displayLevel.className)}">${escapePowerAIText(displayLevel.text)}</span></td>
        <td>${escapePowerAIText(powerAISourceLabel(alert.source))}</td>
        <td title="${escapePowerAIText(`${alert.cause} ${recommendation}`)}">
          ${alert.occurrence_count > 1 ? `<span class="power-ai-occurrence-badge">${alert.occurrence_count} lần</span>` : ''}
          <b>${escapePowerAIText(alert.title)}</b>
          <small>${escapePowerAIText(alert.cause)}</small>
          <em>${escapePowerAIText(recommendation)}</em>
        </td>
      </tr>`;
  }).join(''));
}

function powerAIDriftStatusLabel(status) {
  const labels = {
    normal: 'Ổn định',
    warning: 'Có thay đổi',
    critical: 'Thay đổi lớn',
    insufficient_data: 'Chưa đủ dữ liệu'
  };
  return labels[String(status || '').toLowerCase()] || 'Chưa đủ dữ liệu';
}

function powerAIDriftDescription(value, status, readyFeatures) {
  const numeric = Number(value);
  const valueText = Number.isFinite(numeric) ? numeric.toFixed(3) : '--';
  return `Độ thay đổi dữ liệu AI: ${powerAIDriftStatusLabel(status)}; chỉ số ${valueText}; ${readyFeatures || 0} đặc trưng đã đủ mẫu. Chỉ số càng gần 0 thì dữ liệu hiện tại càng giống dữ liệu dùng để huấn luyện model.`;
}

function renderPowerAIEvaluationMetrics(metrics) {
  const value = metrics || {};
  const precision = value.precision_percent == null ? '--' : `${value.precision_percent}%`;
  $('#powerAiPrecision').text(precision);
  const runtime = window.powerAiRuntimeVersion || {};
  if (!$('#powerAiClientAppVersion').text().trim() || $('#powerAiClientAppVersion').text() === '--') {
    $('#powerAiClientAppVersion').text(runtime.powerai_version ? `v${runtime.powerai_version}` : `Client v${POWER_AI_CLIENT_VERSION}`);
  }
  if (!$('#powerAiClientModelVersion').text().trim()) $('#powerAiClientModelVersion').text(runtime.model_version || '--');
  if (!$('#powerAiClientMode').text().trim()) $('#powerAiClientMode').text(String(runtime.mode || '--').toUpperCase());
}

function powerAIReviewer() {
  try {
    const user = JSON.parse(localStorage.getItem('login_user') || '{}');
    return String(user.taikhoan || user.username || 'operator').slice(0, 128);
  } catch (_error) {
    return 'operator';
  }
}

function powerAILocalDateTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function powerAIAlertTarget(alert) {
  const label = String(alert && alert.rule_result && alert.rule_result.label || '').toLowerCase();
  const reasons = alert && alert.rule_result && Array.isArray(alert.rule_result.reasons)
    ? alert.rule_result.reasons.join(' ').toLowerCase()
    : '';
  const context = `${label} ${reasons}`;

  if (context.includes('voltage') || context.includes('điện áp')) {
    return '.metric[data-metric-type="voltage"]';
  }
  if (
    context.includes('current') ||
    context.includes('dòng') ||
    context.includes('i0')
  ) {
    return '.metric[data-metric-type="current"]';
  }
  if (context.includes('power_factor') || context.includes('hệ số công suất')) {
    return '.metric[data-metric-type="power-factor"]';
  }
  if (context.includes('thd')) {
    return '.bottom-grid';
  }
  if (
    context.includes('temperature') ||
    context.includes('nhiệt') ||
    context.includes('đầu cực')
  ) {
    return '.content-grid';
  }
  return '.content-grid';
}

function focusPowerAIAlertContext(alert) {
  const target = document.querySelector(powerAIAlertTarget(alert));
  if (target) {
    document.getElementById('sidebar')?.classList.remove('mobile-open');
    document.body.classList.remove('sidebar-mobile-backdrop');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('power-ai-context-focus');
    window.setTimeout(() => target.classList.remove('power-ai-context-focus'), 3500);
  }

  const meterId = String(alert.meter_id || '');
  const svgElement = meterId
    ? document.querySelector(`#SVGContainer [id*="_${CSS.escape(meterId)}_"]`)
    : null;
  const svgTarget = svgElement && (svgElement.closest('g') || svgElement);
  if (svgTarget) {
    svgTarget.classList.add('power-ai-svg-focus');
    window.setTimeout(() => svgTarget.classList.remove('power-ai-svg-focus'), 3500);
  }
}

function powerAIAlertLifecycleLabel(alert) {
  const state = String(alert.state || alert.incident?.state || alert.alert_incident?.state || 'active').toLowerCase();
  if (['recovered', 'resolved', 'closed'].includes(state)) return 'Đã kết thúc';
  if (state === 'pending') return 'Đang xác nhận';
  return 'Đang xảy ra';
}

function powerAIAlertOperatingMetric(alert) {
  const evidence = Array.isArray(alert.diagnosis?.feature_contributions)
    ? alert.diagnosis.feature_contributions : [];
  const item = evidence.find(entry => String(entry.incident_type || '').toUpperCase()
    === String(alert.incident_type || '').toUpperCase()) || evidence[0] || {};
  const metrics = alert.rule_result?.assessment?.metrics || {};
  const definitions = {
    CURRENT_UNBALANCE: ['current_unbalance_percent', '%'], VOLTAGE_UNBALANCE: ['voltage_unbalance_percent', '%'],
    VOLTAGE_LOW: ['voltage_min_v', 'V'], VOLTAGE_HIGH: ['voltage_max_v', 'V'],
    RESIDUAL_CURRENT_WARNING: ['i0_unbalance_percent', '%'], RESIDUAL_CURRENT_CRITICAL: ['i0_unbalance_percent', '%'],
    I0_HIGH: ['i0_unbalance_percent', '%'], THD_CURRENT_HIGH: ['thd_current_max_percent', '%'],
    THD_VOLTAGE_HIGH: ['thd_voltage_max_percent', '%'], LOW_POWER_FACTOR: ['power_factor', ''],
    FREQUENCY_ABNORMAL: ['frequency_hz', 'Hz'], TERMINAL_TEMPERATURE_WARNING: ['terminal_temperature_max_c', '°C'],
    TERMINAL_TEMPERATURE_CRITICAL: ['terminal_temperature_max_c', '°C'], TERMINAL_HOTSPOT: ['temperature_spread_c', '°C'],
    OVERLOAD_WARNING: ['load_ratio', '%'], OVERLOAD_CRITICAL: ['load_ratio', '%']
  };
  const definition = definitions[String(alert.incident_type || '').toUpperCase()] || [];
  const feature = item.feature || definition[0];
  let value = item.value ?? metrics[feature];
  const unit = definition[1] || '';
  if (feature === 'load_ratio' && Number.isFinite(Number(value))) value = Number(value) * 100;
  return {
    value: Number.isFinite(Number(value))
      ? `${Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 2 })}${unit ? ` ${unit}` : ''}`
      : 'Chưa có dữ liệu',
    threshold: item.expected || 'Chưa có dữ liệu'
  };
}

function openPowerAIAlertDetail(alert) {
  window.powerAiAlertReturnFocus = document.activeElement;
  alert = normalizePowerAIAlert(alert);
  const diagnosis = alert.diagnosis || {};
  const reasons = Array.isArray(diagnosis.root_causes) && diagnosis.root_causes.length
    ? diagnosis.root_causes
    : [alert.cause];
  const reading = alert.snapshot || alert.reading || {};
  const ruleResult = alert.rule_result || {};
  const assessment = ruleResult.assessment || {};
  const recommendations = Array.isArray(diagnosis.recommendations)
    ? diagnosis.recommendations
    : [];
  const time = alert.time ? new Date(alert.time).toLocaleString('vi-VN') : '--';
  const lifecycle = powerAIAlertLifecycleLabel(alert);
  const operatingMetric = powerAIAlertOperatingMetric(alert);
  const aiModel = diagnosis.model || {};
  const runtime = window.powerAiRuntimeVersion || {};
  const anomalyScore = aiModel.anomaly_score ?? alert.ai_result?.anomaly_score ?? alert.ai_result?.score;
  const ruleCode = ruleResult.label || alert.incident_type || '--';
  const modelVersion = aiModel.model_version || alert.ai_result?.model_version || runtime.model_version || '--';
  const ruleEngineVersion = runtime.rule_engine_version || runtime.ruleset_version || runtime.rule_version || '--';
  const occurrences = Array.isArray(alert.occurrences) && alert.occurrences.length
    ? alert.occurrences
    : [{ event_id: alert.event_id, time: alert.time }];
  const occurrenceTimes = occurrences.map(item => (
    item.time ? new Date(item.time).toLocaleString('vi-VN') : '--'
  ));

  $('#powerAiAlertDetailTitle').text(alert.title || powerAIIncidentLabel(alert.incident_type));
  $('#powerAiAlertDetailBody').html(`
    <div class="power-ai-alert-operator-card">
      <div class="power-ai-alert-primary-meta">
        <span><small>Mức độ</small><b class="power-ai-detail-${escapePowerAIText(alert.status)}">${escapePowerAIText(powerAIStatusLabel(alert.status))}</b></span>
        <span><small>Trạng thái</small><b>${escapePowerAIText(lifecycle)}</b></span>
        <span><small>Thời gian</small><b>${escapePowerAIText(time)}</b></span>
        <span><small>Thiết bị</small><b>${escapePowerAIText(alert.meter_id || 'Thiết bị đang chọn')}</b></span>
        <span><small>Giá trị</small><b>${escapePowerAIText(operatingMetric.value)}</b></span>
        <span><small>Ngưỡng</small><b>${escapePowerAIText(operatingMetric.threshold)}</b></span>
      </div>
      <div class="power-ai-alert-action-copy">
        <h4>Nguyên nhân</h4>
        ${reasons.map(reason => `<p>${escapePowerAIText(reason)}</p>`).join('')}
        <h4>Khuyến nghị</h4>
        ${recommendations.length ? recommendations.map(item => `<p>${escapePowerAIText(item)}</p>`).join('')
          : '<p>Cần kiểm tra tại hiện trường theo quy trình vận hành.</p>'}
      </div>
    </div>
    <div class="power-ai-alert-detail-section power-ai-occurrence-section">
      <h4><i class="fas fa-layer-group"></i> Lịch sử lặp lại</h4>
      <div class="power-ai-occurrence-summary">
        <span><small>Số lần xảy ra</small><b>${occurrences.length}</b></span>
        <span><small>Lần đầu</small><b>${escapePowerAIText(occurrenceTimes[occurrenceTimes.length - 1])}</b></span>
        <span><small>Gần nhất</small><b>${escapePowerAIText(occurrenceTimes[0])}</b></span>
      </div>
      <details class="power-ai-occurrence-list">
        <summary>Xem tất cả ${occurrences.length} thời điểm</summary>
        <ol>
          ${occurrences.map((item, index) => `
            <li>
              <time>${escapePowerAIText(occurrenceTimes[index])}</time>
              <small>${escapePowerAIText(item.event_id)}</small>
            </li>
          `).join('')}
        </ol>
      </details>
    </div>
    <details class="power-ai-advanced-details">
      <summary><i class="fas fa-microchip"></i> Advanced / AI details</summary>
      <div class="power-ai-technical-grid">
        <span><small>Detection source</small><b>${escapePowerAIText(powerAISourceLabel(alert.source))}</b></span>
        <span><small>Rule</small><b>${escapePowerAIText(ruleCode)}</b></span>
        <span><small>AI anomaly score</small><b>${escapePowerAIText(Number.isFinite(Number(anomalyScore)) ? Number(anomalyScore).toFixed(2) : '--')}</b></span>
        <span><small>Model</small><b>${escapePowerAIText(modelVersion)}</b></span>
        <span><small>Rule Engine</small><b>${escapePowerAIText(ruleEngineVersion)}</b></span>
        <span><small>Risk score</small><b>${escapePowerAIText(assessment.risk_score == null ? '--' : `${assessment.risk_score}/100`)}</b></span>
      </div>
      <h4>Thông số tại thời điểm cảnh báo</h4>
      <div class="power-ai-reading-grid">
        <span>UA <b>${escapePowerAIText(reading.ua ?? '--')} V</b></span>
        <span>IA <b>${escapePowerAIText(reading.ia ?? '--')} A</b></span>
        <span>UB <b>${escapePowerAIText(reading.ub ?? '--')} V</b></span>
        <span>IB <b>${escapePowerAIText(reading.ib ?? '--')} A</b></span>
        <span>UC <b>${escapePowerAIText(reading.uc ?? '--')} V</b></span>
        <span>IC <b>${escapePowerAIText(reading.ic ?? '--')} A</b></span>
        <span>COS <b>${escapePowerAIText(reading.power_factor ?? '--')}</b></span>
        <span>Tần số <b>${escapePowerAIText(reading.frequency ?? '--')} Hz</b></span>
        <span>Nhiệt cực A <b>${escapePowerAIText(reading.terminal_temperature_a ?? '--')} °C</b></span>
        <span>Nhiệt cực B <b>${escapePowerAIText(reading.terminal_temperature_b ?? '--')} °C</b></span>
        <span>Nhiệt cực C <b>${escapePowerAIText(reading.terminal_temperature_c ?? '--')} °C</b></span>
        <span>Nhiệt môi trường <b>${escapePowerAIText(reading.ambient_temperature ?? '--')} °C</b></span>
      </div>
    </details>
    <div class="power-ai-alert-detail-section power-ai-feedback-section">
      <h4><i class="fas fa-clipboard-check"></i> Xác minh cảnh báo</h4>
      <p class="power-ai-feedback-help">Đánh giá này được lưu làm nhãn thực tế để đo độ chính xác và cải thiện model.</p>
      ${occurrences.length > 1
        ? `<p class="power-ai-group-review-note"><i class="fas fa-layer-group"></i> Một lần lưu sẽ áp dụng cho toàn bộ <b>${occurrences.length}</b> cảnh báo trong nhóm.</p>`
        : ''}
      <div class="power-ai-verdict-options" role="group" aria-label="Kết quả xác minh">
        <button type="button" data-verdict="true_positive">
          <i class="fas fa-check-circle"></i> Cảnh báo đúng
        </button>
        <button type="button" data-verdict="false_positive">
          <i class="fas fa-times-circle"></i> Cảnh báo sai
        </button>
        <button type="button" data-verdict="uncertain">
          <i class="fas fa-question-circle"></i> Chưa xác định
        </button>
      </div>
      <label class="power-ai-field">
        <span>Ghi chú xác minh</span>
        <textarea id="powerAiFeedbackNotes" maxlength="4000"
          placeholder="Kết quả kiểm tra tại hiện trường..."></textarea>
      </label>
      <label class="power-ai-incident-toggle">
        <input type="checkbox" id="powerAiCreateIncident">
        <span>Ghi nhận đây là một sự cố thực tế</span>
      </label>
      <div id="powerAiIncidentFields" class="power-ai-incident-fields" hidden>
        <label class="power-ai-field">
          <span>Thời điểm sự cố</span>
          <input type="datetime-local" id="powerAiIncidentTime"
            value="${escapePowerAIText(powerAILocalDateTime(alert.time))}">
        </label>
        <label class="power-ai-field">
          <span>Loại sự cố</span>
          <input type="text" id="powerAiIncidentType" maxlength="128"
            placeholder="Ví dụ: Mất điện, quá nhiệt, chất lượng điện năng">
        </label>
        <label class="power-ai-field">
          <span>Mức độ</span>
          <select id="powerAiIncidentSeverity">
            <option value="warning">Cảnh báo</option>
            <option value="critical">Nghiêm trọng</option>
          </select>
        </label>
        <label class="power-ai-field power-ai-field-wide">
          <span>Mô tả sự cố</span>
          <textarea id="powerAiIncidentDescription" maxlength="4000"
            placeholder="Hiện tượng và phạm vi ảnh hưởng..."></textarea>
        </label>
        <label class="power-ai-field power-ai-field-wide">
          <span>Kết luận kỹ thuật</span>
          <textarea id="powerAiIncidentConclusion" maxlength="4000"
            placeholder="Nguyên nhân sau khi kiểm tra..."></textarea>
        </label>
      </div>
      <div id="powerAiFeedbackMessage" class="power-ai-feedback-message" aria-live="polite"></div>
      <button type="button" id="powerAiFeedbackSave" class="power-ai-feedback-save">
        <i class="fas fa-save"></i> Lưu kết quả xác minh
      </button>
    </div>
    <button type="button" id="powerAiAlertLocate" class="power-ai-alert-locate">
      <i class="fas fa-crosshairs"></i> Đi tới khu vực liên quan
    </button>
  `);

  $('#powerAiAlertDetail').addClass('open').attr('aria-hidden', 'false');
  $('#powerAiAlertBackdrop').addClass('open').attr('aria-hidden', 'false');
  $('body').addClass('power-ai-modal-open');
  $('#powerAiAlertDetailClose').focus();
  window.currentPowerAiAlert = alert;
}

function closePowerAIAlertDetail(restoreFocus = true) {
  $('#powerAiAlertDetail, #powerAiAlertBackdrop').removeClass('open');
  $('#powerAiAlertDetail').attr('aria-hidden', 'true');
  $('#powerAiAlertBackdrop').attr('aria-hidden', 'true');
  $('body').removeClass('power-ai-modal-open');
  if (
    restoreFocus &&
    window.powerAiAlertReturnFocus &&
    typeof window.powerAiAlertReturnFocus.focus === 'function'
  ) {
    window.powerAiAlertReturnFocus.focus();
  }
}

function powerAIRiskLabel(level) {
  return {
    low: 'Thấp',
    moderate: 'Trung bình',
    high: 'Cao',
    critical: 'Rất cao'
  }[level] || 'Chưa xác định';
}

function renderPowerAIForecast(forecast, health) {
  window.currentPowerAiForecast = forecast || null;
  const eventCount = Number(health && health.events_24h) || 0;

  if (!forecast || !forecast.ready) {
    const requiredEvents = Math.max(
      1,
      Number(forecast && forecast.required_events) || 100
    );
    const availableEvents = Math.max(
      0,
      Number(forecast && forecast.available_events) || eventCount
    );
    const progress = Math.min(availableEvents, requiredEvents);
    const progressPercent = Math.min(
      100,
      Math.round(progress / requiredEvents * 100)
    );
    const reason = forecast && forecast.reason
      ? forecast.reason
      : 'Cần thêm dữ liệu phân tích để dự báo.';

    $('#powerAiForecast')
      .removeAttr('data-forecast-clickable role tabindex title')
      .removeClass('power-ai-loading').html(`
      <div class="power-ai-forecast-pending">
        <i class="fas fa-hourglass-half"></i>
        <div>
          <b>Đang tích lũy dữ liệu</b>
          <span>${escapePowerAIText(reason)}</span>
          <div class="power-ai-progress">
            <i style="width:${progressPercent}%"></i>
          </div>
          <small>${progress}/${requiredEvents} kết quả phân tích (${progressPercent}%)</small>
        </div>
      </div>
    `);
    return;
  }

  const riskIndex = Number(forecast.risk_index) || 0;
  const trend = Number(
    forecast.trend_per_sample !== undefined
      ? forecast.trend_per_sample
      : forecast.trend
  ) || 0;
  const trendLabel = trend > 0
    ? 'Rủi ro đang tăng'
    : trend < 0
      ? 'Rủi ro đang giảm'
      : 'Rủi ro ổn định';
  const trendIcon = trend > 0
    ? 'fa-arrow-up'
    : trend < 0
      ? 'fa-arrow-down'
      : 'fa-minus';

  $('#powerAiForecast')
    .attr({
      'data-forecast-clickable': 'true',
      role: 'button',
      tabindex: '0',
      title: 'Nhấn để xem diễn giải chỉ số dự báo'
    })
    .removeClass('power-ai-loading').html(`
    <div class="power-ai-risk risk-${escapePowerAIText(forecast.risk_level)}">
      <div class="power-ai-risk-value">
        <strong>${escapePowerAIText(round(riskIndex, 1))}</strong>
        <span>/100</span>
      </div>
      <div class="power-ai-risk-content">
        <b>${escapePowerAIText(powerAIRiskLabel(forecast.risk_level))}</b>
        <span><i class="fas ${trendIcon}"></i> ${escapePowerAIText(trendLabel)}</span>
        <small>Tỷ lệ cảnh báo: ${escapePowerAIText(round((forecast.recent_alert_rate || 0) * 100, 1))}%</small>
        <small>Bất thường AI: ${escapePowerAIText(round((forecast.recent_ai_anomaly_rate || 0) * 100, 1))}%</small>
      </div>
    </div>
  `);
  if ($('#powerAiForecastDetail').hasClass('open')) {
    openPowerAIForecastDetail(true);
  }
}

function openPowerAIForecastDetail(refreshOnly = false) {
  const forecast = window.currentPowerAiForecast;
  if (!forecast || !forecast.ready) return;
  if (!refreshOnly) {
    window.powerAiForecastReturnFocus = document.activeElement;
  }
  const riskIndex = Number(forecast.risk_index) || 0;
  const currentRisk = Number(forecast.current_risk) || 0;
  const confidence = Math.max(0, Math.min(100, Number(forecast.confidence) * 100 || 0));
  const difference = currentRisk - riskIndex;
  const interpretation = difference > 15
    ? `Điểm nền gần đây cao hơn điểm dự báo ${round(difference, 1)} điểm (${round(currentRisk, 1)} − ${round(riskIndex, 1)}). Con số ${round(difference, 1)} là độ chênh, không phải điểm rủi ro. Các mẫu gần đây đang có xu hướng trở lại bình thường.`
    : difference < -15
      ? `Điểm dự báo 24 giờ là ${round(riskIndex, 1)}/100, cao hơn điểm nền gần đây ${round(currentRisk, 1)}/100 một khoảng ${round(Math.abs(difference), 1)} điểm. Con số ${round(Math.abs(difference), 1)} là độ chênh, không phải điểm rủi ro. Xu hướng đang xấu đi và cần tăng cường theo dõi.`
      : `Điểm dự báo ${round(riskIndex, 1)}/100 và điểm nền gần đây ${round(currentRisk, 1)}/100 chênh ${round(Math.abs(difference), 1)} điểm. Đây là độ chênh, không phải một điểm rủi ro riêng.`;
  const confidenceText = confidence >= 85
    ? 'Chuỗi lịch sử dài và tương đối ổn định.'
    : confidence >= 70
      ? 'Dữ liệu tương đối tốt để tham khảo.'
      : confidence >= 50
        ? 'Có thể tham khảo nhưng cần tiếp tục tích lũy dữ liệu.'
        : 'Dữ liệu còn ít hoặc biến động mạnh; không nên dùng làm căn cứ duy nhất.';

  $('#powerAiForecastDetailBody').html(`
    <div class="power-ai-forecast-explain-score">
      <span>Điểm dự báo trung bình 24 giờ<strong>${powerAIChatValue(riskIndex, 1, '/100')}</strong></span>
      <span>Điểm nền từ dữ liệu gần đây<strong>${powerAIChatValue(currentRisk, 1, '/100')}</strong></span>
      <span>Độ tin cậy dữ liệu<strong>${powerAIChatValue(confidence, 0, '%')}</strong></span>
    </div>
    <div class="power-ai-alert-detail-section">
      <h4>Chỉ số rủi ro là gì?</h4>
      <p>Đây là điểm tổng hợp từ trạng thái Rule Engine, cảnh báo, sự kiện nghiêm trọng, kết quả anomaly và xu hướng gần đây. Điểm thể hiện mức rủi ro vận hành trung bình được dự báo trong ${escapePowerAIText(forecast.horizon_hours || 24)} giờ tới.</p>
      <div class="power-ai-risk-scale">
        <span>0–24<br>Thấp</span><span>25–49<br>Trung bình</span>
        <span>50–74<br>Cao</span><span>75–100<br>Nghiêm trọng</span>
      </div>
      <p><i class="fas fa-info-circle"></i> Đây không phải xác suất xảy ra sự cố.</p>
    </div>
    <div class="power-ai-alert-detail-section">
      <h4>Độ tin cậy là gì?</h4>
      <p>Độ tin cậy phản ánh số lượng mẫu lịch sử và độ ổn định của chuỗi dữ liệu dùng để dự báo. Nó không phải tỷ lệ dự báo chính xác đã được kiểm chứng bằng sự cố thực tế.</p>
      <p><i class="fas fa-database"></i> ${escapePowerAIText(confidenceText)}</p>
    </div>
    <div class="power-ai-alert-detail-section">
      <h4>Diễn giải trường hợp hiện tại</h4>
      <p>${escapePowerAIText(interpretation)}</p>
      <p><i class="fas fa-calculator"></i> Phép tính độ chênh: |${round(riskIndex, 1)} − ${round(currentRisk, 1)}| = <b>${round(Math.abs(difference), 1)} điểm</b>.</p>
      <p><i class="fas fa-sync-alt"></i> Nội dung được tính lại từ dữ liệu API mỗi khi dự báo cập nhật.</p>
      <p>Dự báo chỉ hỗ trợ theo dõi vận hành, không thay thế đánh giá kỹ thuật tại hiện trường.</p>
    </div>
  `);
  $('#powerAiForecastDetail, #powerAiForecastBackdrop')
    .addClass('open')
    .attr('aria-hidden', 'false');
  $('body').addClass('power-ai-modal-open');
  if (!refreshOnly) {
    $('#powerAiForecastDetailClose').focus();
  }
}

function closePowerAIForecastDetail() {
  $('#powerAiForecastDetail, #powerAiForecastBackdrop').removeClass('open');
  $('#powerAiForecastDetail, #powerAiForecastBackdrop').attr('aria-hidden', 'true');
  $('body').removeClass('power-ai-modal-open');
  if (
    window.powerAiForecastReturnFocus &&
    typeof window.powerAiForecastReturnFocus.focus === 'function'
  ) {
    window.powerAiForecastReturnFocus.focus();
  }
}

async function loadPowerAIOperations(meterId) {
  if (!meterId) return;
  window.currentPowerAIMeterId = String(meterId);

  const encodedMeterId = encodeURIComponent(String(meterId));

  const responses = await Promise.allSettled([
      $.getJSON(`/api/power-ai/devices/${encodedMeterId}/health`),
      $.getJSON('/api/power-ai/alerts', {
        meter_id: String(meterId),
        limit: powerAiAlertHistoryMode ? 100 : 20,
        active_only: powerAiAlertHistoryMode ? undefined : true,
        history: powerAiAlertHistoryMode,
        include_observations: powerAiShowObservations
      }),
      $.getJSON(`/api/power-ai/devices/${encodedMeterId}/forecast`, {
        horizon_hours: 24
      }),
      $.getJSON('/api/power-ai/p1/evaluation/metrics', {
        meter_id: String(meterId)
      }),
      $.getJSON('/api/power-ai/p1/evaluation/temporal', {
        meter_id: String(meterId),
        lead_window_hours: 24
      }),
      $.getJSON('/api/power-ai/model/drift'),
      $.getJSON('/api/power-ai/p1/feedback/readiness', {
        meter_id: String(meterId)
      })
  ]);

  const healthResponse = responses[0].status === 'fulfilled'
    ? responses[0].value
    : null;
  const alertResponse = responses[1].status === 'fulfilled'
    ? responses[1].value
    : null;
  const forecastResponse = responses[2].status === 'fulfilled'
    ? responses[2].value
    : null;
  const evaluationResponse = responses[3].status === 'fulfilled'
    ? responses[3].value
    : null;
  const temporalResponse = responses[4].status === 'fulfilled'
    ? responses[4].value
    : null;
  const driftResponse = responses[5].status === 'fulfilled'
    ? responses[5].value
    : null;
  const feedbackResponse = responses[6].status === 'fulfilled'
    ? responses[6].value
    : null;
  const health = healthResponse && healthResponse.success
    ? healthResponse.data
    : null;

  if (health) {
    renderPowerAIHealth(health);
  } else {
    $('#powerAiHealth')
      .addClass('power-ai-loading')
      .text('PowerAI chưa có dữ liệu sức khỏe cho thiết bị.');
  }

  if (alertResponse && alertResponse.success) {
    renderPowerAIAlerts(alertResponse.data);
  } else {
    $('#powerAiAlertCount').text('0');
    $('#powerAiAlerts').html(`
      <tr><td colspan="5" class="power-ai-empty">Chưa thể tải cảnh báo PowerAI.</td></tr>
    `);
  }

  if (forecastResponse && forecastResponse.success) {
    renderPowerAIForecast(forecastResponse.data, health);
  } else {
    $('#powerAiForecast')
      .addClass('power-ai-loading')
      .text('Chưa thể tải dự báo PowerAI.');
  }

  if (evaluationResponse && evaluationResponse.success) {
    renderPowerAIEvaluationMetrics(evaluationResponse.data);
  } else {
    renderPowerAIEvaluationMetrics(null);
  }
  const temporal = temporalResponse && temporalResponse.success
    ? temporalResponse.data
    : null;
  const driftPayload = driftResponse && driftResponse.success
    ? driftResponse.data && driftResponse.data.drift
    : null;
  const fallbackDrift = temporal && temporal.score_drift_psi;
  const driftValue = driftPayload && driftPayload.max_psi !== null
    ? driftPayload.max_psi
    : fallbackDrift;
  const driftStatus = driftPayload
    ? driftPayload.status
    : (temporal && temporal.score_drift_level);
  const driftReadyFeatures = driftPayload?.ready_features || 0;
  const driftDisplay = driftValue === null || driftValue === undefined
    ? '--'
    : `${powerAIDriftStatusLabel(driftStatus)} (${round(driftValue, 3)})`;
  $('#powerAiScoreDrift')
    .text(driftDisplay)
    .attr('data-status', driftStatus || 'insufficient_data')
    .attr(
      'title',
      driftValue === null || driftValue === undefined
        ? 'Chưa đủ dữ liệu để đánh giá độ ổn định của dữ liệu AI.'
        : powerAIDriftDescription(driftValue, driftStatus, driftReadyFeatures)
    );

  const feedback = feedbackResponse && feedbackResponse.success
    ? feedbackResponse.data && feedbackResponse.data.feedback_learning
    : null;
  $('#powerAiFeedbackReadiness')
    .text(feedback
      ? `${feedback.labeled_alerts || 0}/${feedback.minimum_labeled_required || 100}`
      : '--')
    .attr(
      'title',
      feedback
        ? `${feedback.status === 'ready' ? 'Đủ dữ liệu tạo candidate' : 'Đang thu thập'}; còn ${feedback.remaining_labels || 0} nhãn`
        : 'Chưa có dữ liệu feedback'
    );
}

async function loadBaoCaoAI(v_idthietbi) {
  try {
    const today = getTodayVN();

    showBaoCaoAILoading();
    try {
      await bootstrapPowerAIHistory(v_idthietbi);
    } catch (bootstrapError) {
      console.warn('Không thể bootstrap lịch sử PowerAI:', bootstrapError);
    }

    const res = await $.ajax({
      url: '/api/baocao_ai_vanhanh_ngay',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        v_idthietbi: String(v_idthietbi),
        v_tungay: today,
        v_denngay: today,
        v_max_points: 512
      })
    });
    
    let data = null;

    // Kiểu mới: backend đã xử lý rule
    if (res && res.success === true && res.data) {
      data = res.data;
    }

    // Kiểu cũ: API trả mảng json_data
    if (!data && Array.isArray(res)) {
      const ioaData = parseAiRows(res);
      loadElectricalChartsFromApi(ioaData);

      const ia = getValuesByDiaChi(ioaData, 5006);
      const ib = getValuesByDiaChi(ioaData, 5007);
      const ic = getValuesByDiaChi(ioaData, 5008);

      const ua = getValuesByDiaChi(ioaData, 5000);
      const ub = getValuesByDiaChi(ioaData, 5001);
      const uc = getValuesByDiaChi(ioaData, 5002);

      const CT_RATIO = 1;
      const pTotal = getValuesByDiaChi(ioaData, 5070);
      const pfA = getValuesByDiaChi(ioaData, 5040);
      const pfB = getValuesByDiaChi(ioaData, 5041);
      const pfC = getValuesByDiaChi(ioaData, 5042);
      const freq = getValuesByDiaChi(ioaData, 5030);

      const thdUa =  getValuesByDiaChi(ioaData, 5200);
      const thdUb = getValuesByDiaChi(ioaData, 5300);
      const thdUc = getValuesByDiaChi(ioaData, 5400);
      const thdIa = getValuesByDiaChi(ioaData, 5500);
      const thdIb = getValuesByDiaChi(ioaData, 5600);
      const thdIc = getValuesByDiaChi(ioaData, 5700);

      const avgUa = avg(ua);
      const avgUb = avg(ub);
      const avgUc = avg(uc);

      const avgIa = avg(ia) * CT_RATIO;
      const avgIb = avg(ib) * CT_RATIO;
      const avgIc = avg(ic) * CT_RATIO;

      // const avgIa = avg(ia);
      // const avgIb = avg(ib);
      // const avgIc = avg(ic);

      const avgPf = avg([avg(pfA), avg(pfB), avg(pfC)].filter(x => x !== 0));
      const avgFreq = avg(freq);
      const avgThd = avg([avg(thdUa), avg(thdUb), avg(thdUc)].filter(x => x > 0));
      const maxPValue = max(pTotal) * CT_RATIO;

      const noElectricalData =
        avgUa === 0 &&
        avgUb === 0 &&
        avgUc === 0 &&
        avgIa === 0 &&
        avgIb === 0 &&
        avgIc === 0 &&
        maxPValue === 0;

      const avgI = avg([avgIa, avgIb, avgIc].filter(x => x > 0));

      const imbalance = avgI > 0
        ? Math.max(
          Math.abs(avgIa - avgI),
          Math.abs(avgIb - avgI),
          Math.abs(avgIc - avgI)
        ) / avgI * 100
        : 0;

      let score = 100;

      if (noElectricalData) {
        score = 0;
      } else {
        const voltageBad = [avgUa, avgUb, avgUc].some(v => v > 0 && (v < 198 || v > 242));

        if (voltageBad) score -= 10;
        if (avgPf > 0 && avgPf < 0.9) score -= 10;
        if (avgFreq > 0 && (avgFreq < 49.5 || avgFreq > 50.5)) score -= 10;
        if (avgThd > 5) score -= 15;
        if (imbalance > 20) score -= 15;

        score = Math.max(score, 0);
      }

      const voltageStatus = noElectricalData
        ? 'Không có dữ liệu'
        : [avgUa, avgUb, avgUc].some(v => v > 0 && (v < 198 || v > 242))
          ? 'Bất thường'
          : 'Bình thường';

      const currentStatus = noElectricalData
        ? 'Không có dữ liệu'
        : imbalance > 20
          ? 'Mất cân bằng'
          : imbalance > 10
            ? 'Cần theo dõi'
            : 'Cân bằng';

      const pfStatus =
        avgPf >= 0.95 ? 'Tốt' :
          avgPf >= 0.9 ? 'Khá' :
            avgPf > 0 ? 'Cần theo dõi' :
              'Chưa có dữ liệu';

      const status = noElectricalData
        ? 'Không có dữ liệu'
        : score >= 90 ? 'Tốt'
          : score >= 75 ? 'Cần theo dõi'
            : score >= 60 ? 'Bất thường'
              : 'Nguy cơ cao';

      const recommendation = noElectricalData
        ? 'Không ghi nhận dữ liệu điện áp, dòng điện và công suất trong khoảng thời gian đánh giá. Có thể thiết bị đang OFF, mất nguồn đo lường, mất kết nối Gateway/RTU hoặc chưa phát sinh dữ liệu SCADA. Khuyến nghị kiểm tra trạng thái thiết bị, nguồn cấp và đường truyền SCADA.'
        : buildAiRecommendation({
          score,
          avgUa,
          avgUb,
          avgUc,
          avgIa,
          avgIb,
          avgIc,
          avgPf,
          avgFreq,
          avgThd,
          imbalance,
          maxP: maxPValue
        });

      data = {
        score,
        status,
        voltage_status: voltageStatus,
        current_status: currentStatus,
        pf_status: pfStatus,

        avg_ua: round(avgUa, 1),
        avg_ub: round(avgUb, 1),
        avg_uc: round(avgUc, 1),

        avg_ia: round(avgIa, 2),
        avg_ib: round(avgIb, 2),
        avg_ic: round(avgIc, 2),

        max_p: round(maxPValue, 2),
        avg_pf: round(avgPf, 2),
        avg_freq: round(avgFreq, 2),
        avg_thd: round(avgThd, 2),

        warning_count: noElectricalData ? 1 : 0,
        no_electrical_data: noElectricalData,

        recommendation
      };

      if (!noElectricalData) {
        try {
          const powerAIResult = await analyzeWithPowerAI({
            meter_id: String(v_idthietbi),
            time: getLatestAiMeasurementTime(ioaData),
            ua: round(avgUa, 4),
            ub: round(avgUb, 4),
            uc: round(avgUc, 4),
            ia: round(avgIa, 4),
            ib: round(avgIb, 4),
            ic: round(avgIc, 4),
            p_total: round(maxPValue, 4),
            power_factor: avgPf ? round(avgPf, 4) : null,
            frequency: avgFreq ? round(avgFreq, 4) : null,
            thd_ua: thdUa.length ? round(avg(thdUa), 4) : null,
            thd_ub: thdUb.length ? round(avg(thdUb), 4) : null,
            thd_uc: thdUc.length ? round(avg(thdUc), 4) : null,
            thd_ia: thdIa.length ? round(avg(thdIa), 4) : null,
            thd_ib: thdIb.length ? round(avg(thdIb), 4) : null,
            thd_ic: thdIc.length ? round(avg(thdIc), 4) : null
          });
          data = applyPowerAIResult(data, powerAIResult);
        } catch (powerAIError) {
          console.warn(
            'PowerAI không sẵn sàng, tiếp tục dùng báo cáo hiện tại:',
            powerAIError.status || powerAIError.statusText || powerAIError
          );
        }
      }
    }

    if (!data) {
      throw new Error('API không trả dữ liệu báo cáo AI');
    }

    $('#aiScore').text(data.score ?? '--');

    $('#aiStatus')
      .removeClass()
      .addClass(
        data.no_electrical_data ? 'ai-status warning' :
          data.score >= 90 ? 'ai-status good' :
            data.score >= 75 ? 'ai-status warning' :
              'ai-status danger'
      )
      .html(
        data.no_electrical_data
          ? '<i class="fas fa-exclamation-triangle"></i> Không có dữ liệu'
          : data.score >= 90
            ? '<i class="fas fa-circle"></i> Tốt'
            : data.score >= 75
              ? '<i class="fas fa-exclamation-triangle"></i> Cần theo dõi'
              : '<i class="fas fa-bolt"></i> Bất thường'
      );

    const recommendation = data.recommendation || 'Chưa có khuyến nghị.';
    window.currentAiRecommendation = recommendation;

    const shortRecommendation = recommendation.length > 90
      ? recommendation.substring(0, 90) + '...'
      : recommendation;

    $('#aiSummary').html(`
      <div class="ai-kpi-list">
        <div class="ai-kpi-item">
          <span>⚡ Điện áp</span>
          <b>${data.voltage_status || 'Chưa có dữ liệu'}</b>
        </div>

        <div class="ai-kpi-item">
          <span>UA / UB / UC</span>
          <b>${data.avg_ua || 0} / ${data.avg_ub || 0} / ${data.avg_uc || 0} V</b>
        </div>

        <div class="ai-kpi-item">
          <span>🔌 Dòng điện</span>
          <b>${data.current_status || 'Chưa có dữ liệu'}</b>
        </div>

        <div class="ai-kpi-item">
          <span>IA / IB / IC</span>
          <b>${data.avg_ia || 0} / ${data.avg_ib || 0} / ${data.avg_ic || 0} A</b>
        </div>

        <div class="ai-kpi-item">
          <span>⚙ Công suất</span>
          <b>${data.max_p || 0} kW</b>
        </div>

        <div class="ai-kpi-item">
          <span>📈 Cosφ</span>
          <b>${data.pf_status || 'Chưa có dữ liệu'} (${data.avg_pf || 0})</b>
        </div>

        <div class="ai-kpi-item">
          <span>🌐 Tần số</span>
          <b>${data.avg_freq ? data.avg_freq + ' Hz' : 'Chưa có dữ liệu'}</b>
        </div>

        <div class="ai-kpi-item">
          <span>📊 THD</span>
          <b>${data.avg_thd ? data.avg_thd + ' %' : 'Chưa có dữ liệu'}</b>
        </div>

        <div class="ai-kpi-item">
          <span>⚠ Cảnh báo</span>
          <b>${data.warning_count || 0}</b>
        </div>
      </div>

      <div class="ai-recommend ai-recommend-click" id="aiRecommendBox">
        <div class="ai-recommend-title">💡 Khuyến nghị</div>
        <div>${shortRecommendation}</div>
        <div class="ai-view-more">Xem chi tiết</div>
      </div>
    `);
    $('#aiLastUpdate').text(
      'Cập nhật: ' +
      new Date().toLocaleTimeString('vi-VN')
    );
    await loadPowerAIOperations(v_idthietbi);

  } catch (err) {
    console.error(err);

    $('#aiScore').text('--');

    $('#aiStatus')
      .removeClass()
      .addClass('ai-status danger')
      .html('<i class="fas fa-times-circle"></i> Lỗi');

    $('#aiSummary').html(`
      <div class="ai-recommend">
        Không thể tải báo cáo thông minh.
      </div>
    `);
  }
}

$(document).on('click', '#aiRecommendBox', function () {
  const text = window.currentAiRecommendation || 'Không có nội dung khuyến nghị.';

  $('#aiModalBody').html(`
        <div class="ai-modal-section">
            ${text
      .split('. ')
      .filter(Boolean)
      .map(x => `<p>• ${x.trim()}${x.endsWith('.') ? '' : '.'}</p>`)
      .join('')}
        </div>
    `);

  $('#aiReportModal').fadeIn(150);
});

$(document).on('click', '#aiModalClose', function () {
  $('#aiReportModal').fadeOut(150);
});

$(document).on('click', '#aiReportModal', function (e) {
  if (e.target.id === 'aiReportModal') {
    $('#aiReportModal').fadeOut(150);
  }
});

$(document).on('click', '#powerAiRefresh', function (event) {
  event.preventDefault();
  event.stopPropagation();
  loadPowerAIOperations(getSelectedDeviceId());
});

$(document).on('keydown', '#powerAiRefresh', function (event) {
  event.stopPropagation();
});

$(document).on('click', '#powerAiStatusRefresh', function () {
  loadPowerAISystemStatus();
});

$(document).on('click', '#powerAiObservationToggle', async function () {
  powerAiShowObservations = !powerAiShowObservations;
  $(this)
    .attr('aria-pressed', String(powerAiShowObservations))
    .html(powerAiShowObservations
      ? '<i class="fas fa-eye-slash" aria-hidden="true"></i> Ẩn quan sát AI'
      : '<i class="fas fa-eye" aria-hidden="true"></i> Hiện quan sát AI');
  const meterId = window.currentPowerAIMeterId || window.currentMeterId || localStorage.getItem('selectedMeterId');
  if (meterId) await loadPowerAIOperations(meterId);
});

$(document).on('click', '#powerAiAlertHistoryToggle', function () {
  powerAiAlertHistoryMode = !powerAiAlertHistoryMode;
  $(this)
    .attr('aria-pressed', String(powerAiAlertHistoryMode))
    .html(
      powerAiAlertHistoryMode
        ? '<i class="fas fa-bell" aria-hidden="true"></i> Cảnh báo hiện tại'
        : '<i class="fas fa-history" aria-hidden="true"></i> Xem lịch sử'
    );
  loadPowerAIOperations(getSelectedDeviceId());
});

$(document).on('click', '.power-ai-alert-row', function () {
  const clientKey = $(this).attr('data-client-key');
  const alert = window.powerAiAlertsById && window.powerAiAlertsById.get(String(clientKey));
  if (alert) openPowerAIAlertDetail(alert);
});

$(document).on('keydown', '.power-ai-alert-row', function (event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    $(this).trigger('click');
  }
});

$(document).on('click', '.power-ai-verdict-options button', function () {
  const verdict = $(this).attr('data-verdict');
  $('.power-ai-verdict-options button')
    .removeClass('selected')
    .attr('aria-pressed', 'false');
  $(this).addClass('selected').attr('aria-pressed', 'true');
  $('#powerAiFeedbackMessage').removeClass('error success').text('');
  if (verdict !== 'true_positive') {
    $('#powerAiCreateIncident').prop('checked', false);
    $('#powerAiIncidentFields').prop('hidden', true);
  }
});

$(document).on('change', '#powerAiCreateIncident', function () {
  const checked = $(this).is(':checked');
  $('#powerAiIncidentFields').prop('hidden', !checked);
  if (checked) {
    $('.power-ai-verdict-options button[data-verdict="true_positive"]').trigger('click');
    $('#powerAiIncidentFields').prop('hidden', false);
    const alert = window.currentPowerAiAlert || {};
    const reasons = alert.rule_result && Array.isArray(alert.rule_result.reasons)
      ? alert.rule_result.reasons
      : [];
    const label = String(alert.rule_result && alert.rule_result.label || '').trim();
    if (!String($('#powerAiIncidentType').val() || '').trim()) {
      $('#powerAiIncidentType').val(
        label && label !== 'NORMAL' ? label : 'Sự cố vận hành'
      );
    }
    if (!String($('#powerAiIncidentDescription').val() || '').trim()) {
      $('#powerAiIncidentDescription').val(
        reasons.join('; ') || 'Sự cố được xác nhận từ cảnh báo PowerAI'
      );
    }
  }
});

function isPowerAIUuid(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function collectPowerAIEventIds(alert) {
  const ids = [];
  const add = value => {
    const id = String(value || '').trim();
    if (isPowerAIUuid(id) && !ids.includes(id)) ids.push(id);
  };

  add(alert && alert.event_id);
  if (Array.isArray(alert && alert.occurrences)) {
    alert.occurrences.forEach(item => add(item && item.event_id));
  }
  return ids;
}

$(document).on('click', '#powerAiFeedbackSave', async function () {
  const alert = window.currentPowerAiAlert;
  const verdict = $('.power-ai-verdict-options button.selected').attr('data-verdict');
  const message = $('#powerAiFeedbackMessage');
  if (!alert || !verdict) {
    message.addClass('error').removeClass('success')
      .text('Vui lòng chọn kết quả xác minh.');
    return;
  }

  const button = $(this);
  button.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Đang lưu...');
  message.removeClass('error success').text('');

  try {
    let incidentId = null;
    if ($('#powerAiCreateIncident').is(':checked')) {
      const occurredValue = $('#powerAiIncidentTime').val();
      const reasons = alert.rule_result && Array.isArray(alert.rule_result.reasons)
        ? alert.rule_result.reasons
        : [];
      const label = String(alert.rule_result && alert.rule_result.label || '').trim();
      const incidentType = String($('#powerAiIncidentType').val() || '').trim()
        || (label && label !== 'NORMAL' ? label : 'Sự cố vận hành');
      const description = String($('#powerAiIncidentDescription').val() || '').trim()
        || reasons.join('; ')
        || 'Sự cố được xác nhận từ cảnh báo PowerAI';
      const occurredAt = occurredValue && !Number.isNaN(new Date(occurredValue).getTime())
        ? new Date(occurredValue).toISOString()
        : alert.time;
      if (!occurredAt) {
        throw new Error('Không xác định được thời điểm sự cố.');
      }
      const incidentResponse = await $.ajax({
        url: '/api/power-ai/p1/incidents',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          meter_id: alert.meter_id,
          occurred_at: occurredAt,
          incident_type: incidentType,
          severity: $('#powerAiIncidentSeverity').val(),
          description,
          technical_conclusion: String($('#powerAiIncidentConclusion').val() || '').trim(),
          created_by: powerAIReviewer()
        })
      });
      incidentId = incidentResponse.data.incident_id;
    }

    const eventIds = collectPowerAIEventIds(alert);
    const feedbackIncidentId = isPowerAIUuid(incidentId)
      ? incidentId
      : (isPowerAIUuid(alert.incident_id) ? alert.incident_id : null);

    if (!eventIds.length && !feedbackIncidentId) {
      throw new Error(
        'Cảnh báo chưa có event_id hoặc incident_id hợp lệ. Hãy tải lại danh sách cảnh báo trước khi đánh giá.'
      );
    }

    await $.ajax({
      url: '/api/power-ai/p1/alert-feedback/bulk',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        event_ids: eventIds,
        incident_id: feedbackIncidentId,
        verdict,
        reviewer: powerAIReviewer(),
        notes: String($('#powerAiFeedbackNotes').val() || '').trim(),
        group_key: alert.group_key || ''
      })
    });

    message.addClass('success').removeClass('error')
      .text(eventIds.length
        ? `Đã lưu kết quả xác minh cho ${eventIds.length} sự kiện trong nhóm.`
        : 'Đã lưu kết quả xác minh cho incident.');
    const metricsResponse = await $.getJSON('/api/power-ai/p1/evaluation/metrics', {
      meter_id: String(alert.meter_id)
    });
    if (metricsResponse.success) {
      renderPowerAIEvaluationMetrics(metricsResponse.data);
    }
  } catch (error) {
    const detail = error.responseJSON && (
      error.responseJSON.detail || error.responseJSON.message
    );
    message.addClass('error').removeClass('success')
      .text(typeof detail === 'string' ? detail : (error.message || 'Không thể lưu kết quả xác minh.'));
  } finally {
    button.prop('disabled', false)
      .html('<i class="fas fa-save"></i> Lưu kết quả xác minh');
  }
});

$(document).on('click', '#powerAiAlertLocate', function () {
  if (window.currentPowerAiAlert) {
    focusPowerAIAlertContext(window.currentPowerAiAlert);
  }
  closePowerAIAlertDetail(false);
});

$(document).on('click', '#powerAiAlertDetailClose, #powerAiAlertBackdrop', function () {
  closePowerAIAlertDetail();
});

$(document).on('click', '#powerAiForecast[data-forecast-clickable="true"]', function () {
  openPowerAIForecastDetail();
});

$(document).on(
  'click',
  '.power-ai-sidebar-section[data-power-ai-section="forecast"] > summary',
  function (event) {
    if (!window.currentPowerAiForecast || !window.currentPowerAiForecast.ready) return;
    event.preventDefault();
    openPowerAIForecastDetail();
  }
);

$(document).on('keydown', '#powerAiForecast[data-forecast-clickable="true"]', function (event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openPowerAIForecastDetail();
  }
});

$(document).on('click', '#powerAiForecastDetailClose, #powerAiForecastBackdrop', function () {
  closePowerAIForecastDetail();
});

$(document).on('click', '#powerAiHealth[data-health-clickable="true"]', function () {
  openPowerAIHealthDetail();
});

$(document).on(
  'click',
  '.power-ai-sidebar-section[data-power-ai-section="health"] > summary',
  function (event) {
    if (!window.currentPowerAiHealth) return;
    event.preventDefault();
    openPowerAIHealthDetail();
  }
);

$(document).on('keydown', '#powerAiHealth[data-health-clickable="true"]', function (event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openPowerAIHealthDetail();
  }
});

$(document).on('click', '#powerAiHealthDetailClose, #powerAiHealthBackdrop', function () {
  closePowerAIHealthDetail();
});

$(document).on('keydown', function (event) {
  if (event.key === 'Escape' && $('#powerAiHealthDetail').hasClass('open')) {
    closePowerAIHealthDetail();
    return;
  }

  if (event.key === 'Escape' && $('#powerAiForecastDetail').hasClass('open')) {
    closePowerAIForecastDetail();
    return;
  }

  if (event.key === 'Escape' && $('#powerAiAlertDetail').hasClass('open')) {
    closePowerAIAlertDetail();
    return;
  }

  if (event.key === 'Tab' && $('#powerAiAlertDetail').hasClass('open')) {
    const focusable = $('#powerAiAlertDetail')
      .find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      .filter(':visible')
      .toArray();
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

function renderPowerAIChatMarkdown(text) {
  let html = escapePowerAIText(stripAIThinking(text));
  html = html
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^###\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^##\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(?:<li>[\s\S]*?<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\n/g, '<br>');
  return html;
}

function appendPowerAIChatMessage(role, text, meta = null) {
  const messageClass = role === 'user' ? 'user' : 'assistant';
  const $messages = $('#powerAiChatMessages');
  const messageId = `ai-msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const body = role === 'user' ? escapePowerAIText(text) : renderPowerAIChatMarkdown(text);
  const source = meta && meta.source
    ? `<div class="power-ai-answer-meta"><span>Nguồn: ${escapePowerAIText(meta.source)}</span>${meta.context_collected_at ? `<span>${escapePowerAIText(new Date(meta.context_collected_at).toLocaleString('vi-VN'))}</span>` : ''}</div>`
    : '';
  const copy = role === 'assistant'
    ? `<button type="button" class="power-ai-copy-answer" data-copy-target="${messageId}" title="Sao chép câu trả lời"><i class="far fa-copy"></i></button>`
    : '';

  $messages.append(`
    <div class="power-ai-message ${messageClass}" id="${messageId}">
      <div class="power-ai-message-content">${body}</div>
      ${source}${copy}
    </div>
  `);
  $messages.scrollTop($messages[0].scrollHeight);
  return $(`#${messageId}`);
}

function powerAIChatValue(value, digits, suffix) {
  const number = Number(value);
  if (!Number.isFinite(number)) return '--';
  return `${number.toFixed(digits)}${suffix ? ` ${suffix}` : ''}`;
}

function powerAIChatLevel(level) {
  const levels = {
    excellent: ['Rất tốt', ''],
    good: ['Tốt', ''],
    attention: ['Cần chú ý', 'warning'],
    low: ['Thấp', ''],
    moderate: ['Trung bình', 'warning'],
    high: ['Cao', 'critical'],
    critical: ['Nghiêm trọng', 'critical']
  };
  return levels[String(level || '').toLowerCase()] || ['Chưa xác định', 'warning'];
}

function powerAIChatMetric(label, value) {
  return `<div class="power-ai-chat-metric"><small>${escapePowerAIText(label)}</small><b>${escapePowerAIText(value)}</b></div>`;
}

function appendPowerAIChatResult(payload) {
  const intent = payload && payload.intent;
  const data = payload && payload.data;
  if (!data || !intent) {
    appendPowerAIChatMessage('assistant', payload && payload.answer
      ? payload.answer
      : 'PowerAI chưa thể trả lời câu hỏi này.');
    return;
  }

  let title = 'Kết quả phân tích';
  let icon = 'fa-robot';
  let content = '';

  if (intent === 'latest_reading') {
    title = 'Thông số điện mới nhất';
    icon = 'fa-tachometer-alt';
    content = `
      <div class="power-ai-chat-metric-grid">
        ${powerAIChatMetric('Điện áp pha A', powerAIChatValue(data.ua, 2, 'V'))}
        ${powerAIChatMetric('Dòng điện pha A', powerAIChatValue(data.ia, 2, 'A'))}
        ${powerAIChatMetric('Điện áp pha B', powerAIChatValue(data.ub, 2, 'V'))}
        ${powerAIChatMetric('Dòng điện pha B', powerAIChatValue(data.ib, 2, 'A'))}
        ${powerAIChatMetric('Điện áp pha C', powerAIChatValue(data.uc, 2, 'V'))}
        ${powerAIChatMetric('Dòng điện pha C', powerAIChatValue(data.ic, 2, 'A'))}
        ${powerAIChatMetric('Hệ số công suất', powerAIChatValue(data.power_factor, 3, ''))}
        ${powerAIChatMetric('Tần số', powerAIChatValue(data.frequency, 2, 'Hz'))}
      </div>`;
  } else if (intent === 'forecast' && data.ready) {
    const level = powerAIChatLevel(data.risk_level);
    title = `Dự báo ${escapePowerAIText(data.horizon_hours || 24)} giờ`;
    icon = 'fa-chart-line';
    content = `
      <div class="power-ai-chat-summary">
        <div><small>Chỉ số rủi ro</small><div class="power-ai-chat-score">${powerAIChatValue(data.risk_index, 1, '')}<small>/100</small></div></div>
        <span class="power-ai-chat-badge ${level[1]}">${level[0]}</span>
      </div>
      <div class="power-ai-chat-metric-grid">
        ${powerAIChatMetric('Rủi ro hiện tại', powerAIChatValue(data.current_risk, 1, '/100'))}
        ${powerAIChatMetric('Độ tin cậy', powerAIChatValue(Number(data.confidence) * 100, 0, '%'))}
      </div>
      <div class="power-ai-chat-note">Dự báo hỗ trợ theo dõi vận hành, không thay thế đánh giá kỹ thuật tại hiện trường.</div>`;
  } else if (intent === 'health') {
    const level = powerAIChatLevel(data.level);
    const assessment = data.operational_assessment || {};
    const assessmentVoltage = assessment.voltage || {};
    const assessmentCurrent = assessment.current || {};
    const assessmentPowerFactor = assessment.power_factor || {};
    title = 'Sức khỏe thiết bị';
    icon = 'fa-heartbeat';
    content = `
      <div class="power-ai-chat-summary">
        <div><small>Điểm sức khỏe</small><div class="power-ai-chat-score">${powerAIChatValue(data.score, 0, '')}<small>/100</small></div></div>
        <span class="power-ai-chat-badge ${level[1]}">${level[0]}</span>
      </div>
      <div class="power-ai-chat-metric-grid">
        ${powerAIChatMetric('Cảnh báo 24 giờ', String(data.warnings_24h || 0))}
        ${powerAIChatMetric('Sự kiện nghiêm trọng', String(data.criticals_24h || 0))}
        ${powerAIChatMetric('Bất thường AI', String(data.ai_anomalies_24h || 0))}
        ${powerAIChatMetric('Tổng sự kiện', String(data.events_24h || 0))}
        ${assessment.samples
          ? powerAIChatMetric('Điện áp đạt chuẩn', powerAIChatValue(assessmentVoltage.compliance_percent, 1, '%'))
          : ''}
        ${assessment.samples
          ? powerAIChatMetric('Dòng điện trung bình', powerAIChatValue(assessmentCurrent.average, 2, 'A'))
          : ''}
        ${assessment.samples
          ? powerAIChatMetric('Cosφ trung bình', powerAIChatValue(assessmentPowerFactor.average, 3, ''))
          : ''}
      </div>
      ${assessment.summary
        ? `<div class="power-ai-chat-note">${escapePowerAIText(assessment.summary)}</div>`
        : ''}`;
  } else if (intent === 'alerts') {
    const alerts = Array.isArray(data.alerts) ? data.alerts : [];
    title = 'Cảnh báo gần nhất';
    icon = 'fa-bell';
    content = alerts.length
      ? `<div class="power-ai-chat-summary"><span>Đã ghi nhận</span><div class="power-ai-chat-score">${alerts.length}</div></div>
         <div class="power-ai-chat-note">Mở khối Cảnh báo gần nhất trên dashboard để xem chi tiết từng sự kiện.</div>`
      : '<div class="power-ai-chat-summary"><span>Không có cảnh báo được ghi nhận</span><span class="power-ai-chat-badge">Bình thường</span></div>';
  } else {
    appendPowerAIChatMessage('assistant', payload.answer || 'Chưa có đủ dữ liệu để phân tích.');
    return;
  }

  const $messages = $('#powerAiChatMessages');
  $messages.append(`
    <div class="power-ai-message assistant power-ai-chat-result">
      <div class="power-ai-chat-result-head"><i class="fas ${icon}"></i><span>${title}</span></div>
      <div class="power-ai-chat-result-body">${content}</div>
    </div>
  `);
  $messages.scrollTop($messages[0].scrollHeight);
}

function getAIConversationId() {
  let id = localStorage.getItem('iss_ai_conversation_id');
  if (!id) {
    id = (window.crypto && window.crypto.randomUUID)
      ? window.crypto.randomUUID()
      : `iss-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem('iss_ai_conversation_id', id);
  }
  return id;
}

async function checkAIChatStatus() {
  const $status = $('#ollamaChatStatus');
  $status.removeClass('online offline').addClass('checking').text('Đang kiểm tra AI');
  try {
    const response = await $.getJSON('/api/ai/health');
    const data = response && response.data ? response.data : {};
    if (response.success && data.connected && data.ready) {
      $status.removeClass('checking offline').addClass('online').text('AI đang hoạt động');
      return true;
    }
    $status.removeClass('checking online').addClass('offline').text('AI chưa sẵn sàng');
  } catch (error) {
    $status.removeClass('checking online').addClass('offline').text('AI Offline');
  }
  return false;
}


function stripAIThinking(text) {
  return String(text || '')
    .replace(/<think(?:\s[^>]*)?>[\s\S]*?<\/think>/gi, '')
    .replace(/<thinking(?:\s[^>]*)?>[\s\S]*?<\/thinking>/gi, '')
    .replace(/^[\s\S]*?<\/think>/i, '')
    .replace(/^[\s\S]*?<\/thinking>/i, '')
    .trim();
}

async function sendPowerAIChatMessage(message) {
  const meterId = getSelectedDeviceId();
  const cleanMessage = String(message || '').trim();
  if (!cleanMessage) return;

  appendPowerAIChatMessage('user', cleanMessage);
  $('#powerAiChatInput').val('').prop('disabled', true);
  $('#powerAiChatForm button').prop('disabled', true);

  const $typing = $(`
    <div class="power-ai-message assistant typing" role="status" aria-live="polite">
      <span class="power-ai-thinking-icon"><i class="fas fa-robot"></i></span>
      <span class="power-ai-thinking-text">Đang phân tích câu hỏi...</span>
      <span class="power-ai-thinking-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    </div>
  `);
  $('#powerAiChatMessages').append($typing);

  let $answer = null;
  let answerText = '';
  let finalMeta = null;

  try {
    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: cleanMessage,
        meter_id: meterId ? String(meterId) : null,
        conversation_id: getAIConversationId()
      })
    });

    if (!response.ok || !response.body) throw new Error('Không mở được luồng phản hồi từ AI');
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let currentEvent = 'message';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() || '';

      for (const block of blocks) {
        let dataLine = '';
        currentEvent = 'message';
        block.split('\n').forEach((line) => {
          if (line.startsWith('event:')) currentEvent = line.slice(6).trim();
          if (line.startsWith('data:')) dataLine += line.slice(5).trim();
        });
        if (!dataLine) continue;
        const payload = JSON.parse(dataLine);

        if (currentEvent === 'status') {
          $typing.find('.power-ai-thinking-text').text(payload.message || 'Đang suy nghĩ...');
        } else if (currentEvent === 'token') {
          // Không hiển thị token thô để tránh lộ reasoning từ model.
          continue;
        } else if (currentEvent === 'done') {
          finalMeta = payload;
          answerText = stripAIThinking(payload.answer || answerText);
          if (!$answer) {
            $typing.remove();
            $answer = appendPowerAIChatMessage('assistant', answerText, payload);
          } else {
            $answer.find('.power-ai-message-content').html(renderPowerAIChatMarkdown(answerText));
            if (payload.source) {
              $answer.append(`<div class="power-ai-answer-meta"><span>Nguồn: ${escapePowerAIText(payload.source)}</span>${payload.context_collected_at ? `<span>${escapePowerAIText(new Date(payload.context_collected_at).toLocaleString('vi-VN'))}</span>` : ''}</div>`);
            }
          }
          $('#ollamaChatStatus').removeClass('checking offline').addClass('online')
            .text('AI đang hoạt động');
        } else if (currentEvent === 'error') {
          throw new Error(payload.message || 'Trợ lý AI chưa thể trả lời');
        }
      }
    }

    if (!$answer && !finalMeta) throw new Error('AI không trả về nội dung');
  } catch (err) {
    $typing.remove();
    if (!$answer) appendPowerAIChatMessage('assistant', err.message || 'Không thể kết nối dịch vụ AI. Vui lòng thử lại sau.');
    $('#ollamaChatStatus').removeClass('checking online').addClass('offline').text('AI Offline');
  } finally {
    $('#powerAiChatInput').prop('disabled', false).focus();
    $('#powerAiChatForm button').prop('disabled', false);
  }
}

$(document).on('click', '#powerAiChatToggle', function () {
  const isOpen = $('#powerAiChatPanel').hasClass('open');
  $('#powerAiChatPanel').toggleClass('open', !isOpen).attr('aria-hidden', isOpen);
  $(this).attr('aria-expanded', !isOpen);
  updatePowerAIChatDevice();
  if (!isOpen) {
    checkAIChatStatus();
    $('#powerAiChatInput').focus();
  }
});

$(document).on('click', '#powerAiChatClose', function () {
  $('#powerAiChatPanel').removeClass('open').attr('aria-hidden', 'true');
  $('#powerAiChatToggle').attr('aria-expanded', 'false').focus();
});

$(document).on('submit', '#powerAiChatForm', function (event) {
  event.preventDefault();
  sendPowerAIChatMessage($('#powerAiChatInput').val());
});

$(document).on('click', '#powerAiChatReset', async function () {
  const conversationId = localStorage.getItem('iss_ai_conversation_id');
  try {
    await $.ajax({
      url: '/api/ai/reset',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ conversation_id: conversationId })
    });
  } catch (error) {
    console.warn('Không thể reset hội thoại trên server:', error);
  }
  localStorage.removeItem('iss_ai_conversation_id');
  $('#powerAiChatMessages').html(`
    <div class="power-ai-message assistant power-ai-chat-welcome">
      <span class="power-ai-chat-message-label"><i class="fas fa-robot"></i> Trợ lý AI</span>
      <b>Đã bắt đầu hội thoại mới</b>
      <span>Bạn có thể hỏi về sức khỏe, cảnh báo và dự báo của thiết bị.</span>
    </div>
  `);
});

$(document).on('click', '.power-ai-chat-suggestions button', function () {
  sendPowerAIChatMessage($(this).data('question'));
});

function reloadDashboardByNhaMay(child_code) {
  if (!child_code) return;
  showBaoCaoAILoading();
  // load_bdpt(child_code);
  // loadDuLieuSongHai_KH(child_code);
  loadDuLieu_THD(child_code);
  f_canhbao(child_code);
}


// function getSoCongToByChildCode(child_code) {
//   const map = {
//     "001003001004": "2527990001", // NHÀ MÁY 1
//     "001003001002": "2527990002", // Nhà máy 2
//     "001003001001": "2527990001"  // Lộ 01, chỉnh lại nếu lộ có công tơ riêng
//   };

//   return map[child_code] || "2527990001";
// }

async function getSoCongToByChildCode(child_code) {
  const result = await $.ajax({
    url: "/api/get_meter_by_child_code",
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    data: JSON.stringify({
      child_code: child_code
    })
  });

  return {
    meterId: result.METERID,
    soCongTo: result.SOCONGTO,
    code: result.CODE
  };
}

// THD ĐIỆN ÁP và DÒNG ĐIỆN
// async function loadDuLieuSongHai_KH(child_code) {
//   const meterInfo = await getSoCongToByChildCode(child_code);
//   console.log("Meter info for child_code", child_code, meterInfo);
//   // lấy ngày hiện tại
//   const today = new Date();
//   // format dd/MM/yyyy
//   const currentDate =
//     String(today.getDate()).padStart(2, '0') + '/' +
//     String(today.getMonth() + 1).padStart(2, '0') + '/' +
//     today.getFullYear();
//   var tungay = currentDate;


//   //kiểm tra từ ngày đến ngày
//   var DulieuSongHai = new Object();
//   //DulieuSongHai.MeterId = 13124352;
//   DulieuSongHai.MeterId = meterInfo.meterId || 13124352;
//   // DulieuSongHai.SoCongTo = "2527990001";
//   DulieuSongHai.SoCongTo = meterInfo.soCongTo || "2527990001";
//   DulieuSongHai.TuNgay = tungay;
//   DulieuSongHai.SoTrang = 0;
//   DulieuSongHai.SoDong = 100000;
//   DulieuSongHai.gio = "";
//   DulieuSongHai.mataikhoan = 1;

//   $.ajax({
//     url: "/api/khaithacdulieu_laydulieusonghai",
//     data: JSON.stringify(DulieuSongHai),
//     type: "POST",
//     contentType: "application/json;charset=utf-8",
//     dataType: "json",
//     success: function (result) {
//       lstSongHai = result;
//        
//       drawData_bdsh_v2(lstSongHai);

//     },
//     error: function (errormessage) {
//     }
//   });
// }
async function loadDuLieu_THD(child_code) {
  setTHDLoadingState('Đang tải dữ liệu');
  var Dulieu = new Object();
  Dulieu.code = child_code;
  $.ajax({
    url: "/api/sodomotsoi/dulieusonghai_ioa",
    data: JSON.stringify(Dulieu),
    type: "POST",
    contentType: "application/json;charset=utf-8",
    dataType: "json",
    success: function (result) {
      lstdata = result;

      drawData_bdsh_v2(lstdata);

    },
    error: function (errormessage) {
      setTHDLoadingState('Không thể tải dữ liệu');
    }
  });
}

function setTHDLoadingState(message) {
  $('#thdUAvg, #thdUMax, #thdIAvg, #thdIMax').text('--');
  $('#thdUUpdated, #thdIUpdated').text('--');
  $('#thdUStatus, #thdIStatus')
    .removeClass('normal warning')
    .text(message);
}

function drawData_bdsh_v2(data) {
  const IOA = {
     THD_IA: 5500,
    THD_IB: 5600,
    THD_IC: 5700,
    THD_UA: 5200,
    THD_UB: 5300,
    THD_UC: 5400
  };

  const map = {};

  function addPoint(ioa, value, time) {
    if (!time) return;

    if (!map[time]) {
      map[time] = {
        time,
        THD_IA: null,
        THD_IB: null,
        THD_IC: null,
        THD_UA: null,
        THD_UB: null,
        THD_UC: null
      };
    }

    ioa = Number(ioa);
    value = Number(value);

    if (Number.isNaN(value)) value = 0;

    if (ioa === IOA.THD_IA) map[time].THD_IA = value;
    if (ioa === IOA.THD_IB) map[time].THD_IB = value;
    if (ioa === IOA.THD_IC) map[time].THD_IC = value;

    if (ioa === IOA.THD_UA) map[time].THD_UA = value;
    if (ioa === IOA.THD_UB) map[time].THD_UB = value;
    if (ioa === IOA.THD_UC) map[time].THD_UC = value;
  }

  $.each(data || [], function (_, row) {
    // Dạng array: [TEN_TRAM, ID_THIETBI, IOA, VALUE, THOIDIEM]
    if (Array.isArray(row)) {
      addPoint(row[2], row[3], row[4]);
      return;
    }

    // Dạng object nếu backend trả JSON object
    const ioa =
      row.IOA || row.ioa || row.ioa_diachi || row.DIACHI || row.diachi;

    const value =
      row.VALUE || row.value || row.GIATRI || row.giatri || row.VAL;

    const time =
      row.THOIDIEM || row.thoidiem || row.TIME || row.time || row.NGAYGIO || row.ngaygio;

    addPoint(ioa, value, time);
  });

  const rows = Object.values(map).sort(function (a, b) {
    return parseDateVN(a.time) - parseDateVN(b.time);
  });

  const ar_THD_time = [];
  const ar_THDI_a = [];
  const ar_THDI_b = [];
  const ar_THDI_c = [];

  const ar_THD_U_a = [];
  const ar_THD_U_b = [];
  const ar_THD_U_c = [];

  rows.forEach(function (x) {
    ar_THD_time.push(x.time);

    ar_THDI_a.push(toFixed2(x.THD_IA));
    ar_THDI_b.push(toFixed2(x.THD_IB));
    ar_THDI_c.push(toFixed2(x.THD_IC));

    ar_THD_U_a.push(toFixed2(x.THD_UA));
    ar_THD_U_b.push(toFixed2(x.THD_UB));
    ar_THD_U_c.push(toFixed2(x.THD_UC));
  });

  updateTHDSummary('U', [ar_THD_U_a, ar_THD_U_b, ar_THD_U_c], ar_THD_time, 5);
  updateTHDSummary('I', [ar_THDI_a, ar_THDI_b, ar_THDI_c], ar_THD_time, 8);

  drawBD_THD_U_v2(
    ar_THD_U_a,
    ar_THD_U_b,
    ar_THD_U_c,
    ar_THD_time,
    [],
    [],
    []
  );

  drawBD_THD_I_v2(
    ar_THDI_a,
    ar_THDI_b,
    ar_THDI_c,
    ar_THD_time,
    [],
    [],
    []
  );
}

function updateTHDSummary(kind, series, times, referenceLimit) {
  const values = series
    .flat()
    .filter(value => value !== null && value !== undefined && value !== '')
    .map(Number)
    .filter(Number.isFinite);
  const prefix = kind === 'U' ? 'thdU' : 'thdI';
  const hasData = values.length > 0 && Array.isArray(times) && times.length > 0;

  if (!hasData) {
    $(`#${prefix}Avg, #${prefix}Max`).text('--');
    $(`#${prefix}Updated`).text('--');
    $(`#${prefix}Status`).removeClass('normal warning').text('Không có dữ liệu');
    return;
  }

  const average = values.reduce((total, value) => total + value, 0) / values.length;
  const maximum = Math.max(...values);
  const exceeded = maximum > referenceLimit;

  $(`#${prefix}Avg`).text(`${average.toFixed(2)}%`);
  $(`#${prefix}Max`).text(`${maximum.toFixed(2)}%`);
  $(`#${prefix}Updated`).text(times[times.length - 1] || '--');
  $(`#${prefix}Status`)
    .removeClass('normal warning')
    .addClass(exceeded ? 'warning' : 'normal')
    .text(exceeded ? 'Vượt tham chiếu' : 'Trong giới hạn');

  const canvas = document.getElementById(kind === 'U' ? 'myLineChart' : 'myLineChart_I');
  if (canvas) {
    canvas.setAttribute(
      'aria-label',
      `Biểu đồ THD ${kind === 'U' ? 'điện áp' : 'dòng điện'} ba pha. ` +
      `Trung bình ${average.toFixed(2)} phần trăm, cao nhất ${maximum.toFixed(2)} phần trăm. ` +
      `${exceeded ? 'Vượt' : 'Trong'} ngưỡng tham chiếu ${referenceLimit} phần trăm.`
    );
  }
}

function parseDateVN(str) {
  if (!str) return 0;

  const value = String(str).trim();
  if (!value.includes('/')) {
    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  // format: dd/MM/yyyy HH:mm:ss
  const parts = value.split(" ");
  const d = parts[0].split("/");
  const t = (parts[1] || "00:00:00").split(":");

  return new Date(
    Number(d[2]),
    Number(d[1]) - 1,
    Number(d[0]),
    Number(t[0] || 0),
    Number(t[1] || 0),
    Number(t[2] || 0)
  ).getTime();
}
function drawBD_THD_U_v2(
  THD_UA,
  THD_UB,
  THD_UC,
  Time,
  harmonicsUAByTime = [],
  harmonicsUBByTime = [],
  harmonicsUCByTime = []
) {

  const canvas = document.getElementById("myLineChart");
  if (!canvas) {
    console.warn("Không tìm thấy canvas #myLineChart");
    return;
  }

  const labels = [...Time].map(getOnlyTime);
  const dataUA = [...THD_UA];
  const dataUB = [...THD_UB];
  const dataUC = [...THD_UC];
  const referenceLimit = 5;

  const hsUA = [...harmonicsUAByTime];
  const hsUB = [...harmonicsUBByTime];
  const hsUC = [...harmonicsUCByTime];

  if (window.chartTHDU) {
    window.chartTHDU.destroy();
    window.chartTHDU = null;
  }
  ensureTooltipStyle();
  const ctx = canvas.getContext("2d");

  window.chartTHDU = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "THD UA (%)",
          data: dataUA,
          borderColor: "#f59e0b",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: 0.25,
          harmonics: hsUA
        },
        {
          label: "THD UB (%)",
          data: dataUB,
          borderColor: "#22c55e",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: 0.25,
          harmonics: hsUB
        },
        {
          label: "THD UC (%)",
          data: dataUC,
          borderColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: 0.25,
          harmonics: hsUC
        },
        {
          label: "Ngưỡng tham chiếu 5%",
          data: labels.map(() => referenceLimit),
          borderColor: "rgba(248, 250, 252, .55)",
          borderWidth: 1,
          borderDash: [6, 5],
          pointRadius: 0,
          fill: false,
          lineTension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
        mode: "index",
        intersect: false,
        displayColors: false,
        custom: function (tooltipModel) {
          const tooltipEl = getOrCreateTooltipEl();

          if (!tooltipModel || tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          if (!tooltipModel.dataPoints || !tooltipModel.dataPoints.length) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const chart = this._chart;
          const index = tooltipModel.dataPoints[0].index;
          const label = chart.config.data.labels[index] || "";
          const phaseLines = chart.config.data.datasets
            .slice(0, 3)
            .map(dataset => {
              const rawValue = dataset.data[index];
              if (rawValue === null || rawValue === undefined || !Number.isFinite(Number(rawValue))) {
                return '';
              }
              const color = dataset.borderColor || '#fff';
              return `
                <div class="tt-line">
                  <span class="tt-color" style="background:${color}"></span>
                  <span>${dataset.label}: ${Number(rawValue).toFixed(2)}%</span>
                </div>`;
            })
            .join('');

          tooltipEl.querySelector(".tooltip-content").innerHTML = `
            <div class="tt-title">Thời điểm: ${label}</div>
            ${phaseLines}
          `;

          const position = chart.canvas.getBoundingClientRect();

          let left = position.left + window.pageXOffset + tooltipModel.caretX;
          let top = position.top + window.pageYOffset + tooltipModel.caretY;

          tooltipEl.style.opacity = 1;
          tooltipEl.style.left = left + "px";
          tooltipEl.style.top = top + "px";

          requestAnimationFrame(() => {
            const rect = tooltipEl.getBoundingClientRect();
            const vw = window.pageXOffset + window.innerWidth;
            const vh = window.pageYOffset + window.innerHeight;

            let finalLeft = left;
            let finalTop = top;

            if (finalLeft - rect.width / 2 < window.pageXOffset + 8) {
              finalLeft = window.pageXOffset + rect.width / 2 + 8;
            }

            if (finalLeft + rect.width / 2 > vw - 8) {
              finalLeft = vw - rect.width / 2 - 8;
            }

            if (finalTop - rect.height - 16 < window.pageYOffset) {
              tooltipEl.style.transform = "translate(-50%, 10px)";
            } else {
              tooltipEl.style.transform = "translate(-50%, calc(-100% - 10px))";
            }

            if (finalTop + rect.height > vh - 8) {
              finalTop = vh - rect.height - 8;
            }

            tooltipEl.style.left = finalLeft + "px";
            tooltipEl.style.top = finalTop + "px";
          });
        }
      },
      legend: {
        onClick: function (e, legendItem) {
          const ci = this.chart;
          const index = legendItem.datasetIndex;
          const meta = ci.getDatasetMeta(index);

          // toggle ẩn/hiện line
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          ci.update();
        },
        labels: {
          generateLabels: function (chart) {
            const datasets = chart.data.datasets || [];

            return datasets.map(function (ds, i) {
              const meta = chart.getDatasetMeta(i);
              const hidden = meta.hidden === true || ds.hidden === true;

              return {
                text: ds.label,
                fillStyle: hidden ? "rgba(255, 250, 250, 0)" : (ds.backgroundColor || ds.borderColor),
                strokeStyle: hidden ? "rgba(180,180,180,0.35)" : (ds.borderColor || ds.backgroundColor),
                lineWidth: 2,
                hidden: false, // không cho text bị strike/mờ mặc định
                datasetIndex: i,

                // giữ style box ổn định
                lineCap: ds.borderCapStyle,
                lineDash: ds.borderDash || [],
                lineDashOffset: ds.borderDashOffset || 0,
                lineJoin: ds.borderJoinStyle,

                // Chart.js v2 có thể dùng thêm
                pointStyle: ds.pointStyle || "rect"
              };
            });
          },
          fontColor: "#f9f9f9",
          boxWidth: 30,
          padding: 12
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: false,
            labelString: "Thời điểm",
            fontColor: "#f9f9f9"
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8,
            maxRotation: 0,
            minRotation: 0,
            fontColor: "#9c9b9b"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "THDU (%)",
            fontColor: "#f9f9f9"
          },
          ticks: {
            fontColor: "#9c9b9b",
            callback: function (value) {
              return value + " %";
            }
          }
        }]
      }
    }
  });
}
function drawBD_THD_I_v2(
  THDI_IA,
  THDI_IB,
  THDI_IC,
  Time,
  harmonicsIAByTime = [],
  harmonicsIBByTime = [],
  harmonicsICByTime = []
) {
  const canvas = document.getElementById("myLineChart_I");

  if (!canvas) return;

  const labels = [...Time].map(getOnlyTime);
  const dataIA = [...THDI_IA];
  const dataIB = [...THDI_IB];
  const dataIC = [...THDI_IC];
  const referenceLimit = 8;

  const hsIA = [...harmonicsIAByTime];
  const hsIB = [...harmonicsIBByTime];
  const hsIC = [...harmonicsICByTime];

  if (window.chartTHDI) {
    window.chartTHDI.destroy();
    window.chartTHDI = null;
  }
  ensureTooltipStyle();

  const ctx = canvas.getContext("2d");

  window.chartTHDI = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "THDI IA (%)",
          data: dataIA,
          borderColor: "#f59e0b",
          backgroundColor: "#f59e0b",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: 0.25,
          harmonics: hsIA
        },
        {
          label: "THDI IB (%)",
          data: dataIB,
          borderColor: "#22c55e",
          backgroundColor: "#22c55e",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: 0.25,
          harmonics: hsIB
        },
        {
          label: "THDI IC (%)",
          data: dataIC,
          borderColor: "#ef4444",
          backgroundColor: "#ef4444",
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 3,
          fill: false,
          spanGaps: true,
          lineTension: 0.25,
          harmonics: hsIC
        },
        {
          label: "Ngưỡng tham chiếu 8%",
          data: labels.map(() => referenceLimit),
          borderColor: "rgba(248, 250, 252, .55)",
          backgroundColor: "rgba(248, 250, 252, .55)",
          borderWidth: 1,
          borderDash: [6, 5],
          pointRadius: 0,
          fill: false,
          lineTension: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        enabled: false,
        mode: "index",
        intersect: false,
        displayColors: false,
        custom: function (tooltipModel) {
          const tooltipEl = getOrCreateTooltipEl();

          if (!tooltipModel || tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          if (!tooltipModel.dataPoints || !tooltipModel.dataPoints.length) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const chart = this._chart;
          const index = tooltipModel.dataPoints[0].index;
          const label = chart.config.data.labels[index] || "";
          const phaseLines = chart.config.data.datasets
            .slice(0, 3)
            .map(dataset => {
              const rawValue = dataset.data[index];
              if (rawValue === null || rawValue === undefined || !Number.isFinite(Number(rawValue))) {
                return '';
              }
              const color = dataset.borderColor || '#fff';
              return `
                <div class="tt-line">
                  <span class="tt-color" style="background:${color}"></span>
                  <span>${dataset.label}: ${Number(rawValue).toFixed(2)}%</span>
                </div>`;
            })
            .join('');

          tooltipEl.querySelector(".tooltip-content").innerHTML = `
            <div class="tt-title">Thời điểm: ${label}</div>
            ${phaseLines}
          `;

          const position = chart.canvas.getBoundingClientRect();

          let left = position.left + window.pageXOffset + tooltipModel.caretX;
          let top = position.top + window.pageYOffset + tooltipModel.caretY;

          tooltipEl.style.opacity = 1;
          tooltipEl.style.left = left + "px";
          tooltipEl.style.top = top + "px";

          requestAnimationFrame(() => {
            const rect = tooltipEl.getBoundingClientRect();
            const vw = window.pageXOffset + window.innerWidth;
            const vh = window.pageYOffset + window.innerHeight;

            let finalLeft = left;
            let finalTop = top;

            if (finalLeft - rect.width / 2 < window.pageXOffset + 8) {
              finalLeft = window.pageXOffset + rect.width / 2 + 8;
            }

            if (finalLeft + rect.width / 2 > vw - 8) {
              finalLeft = vw - rect.width / 2 - 8;
            }

            if (finalTop - rect.height - 16 < window.pageYOffset) {
              tooltipEl.style.transform = "translate(-50%, 10px)";
            } else {
              tooltipEl.style.transform = "translate(-50%, calc(-100% - 10px))";
            }

            if (finalTop + rect.height > vh - 8) {
              finalTop = vh - rect.height - 8;
            }

            tooltipEl.style.left = finalLeft + "px";
            tooltipEl.style.top = finalTop + "px";
          });
        }
      },
      legend: {
        onClick: function (e, legendItem) {
          const ci = this.chart;
          const index = legendItem.datasetIndex;
          const meta = ci.getDatasetMeta(index);

          // toggle ẩn/hiện line
          meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;

          ci.update();
        },
        labels: {
          generateLabels: function (chart) {
            const datasets = chart.data.datasets || [];

            return datasets.map(function (ds, i) {
              const meta = chart.getDatasetMeta(i);
              const hidden = meta.hidden === true || ds.hidden === true;

              return {
                text: ds.label,
                fillStyle: hidden ? "rgba(0,0,0,0)" : (ds.backgroundColor || ds.borderColor),
                strokeStyle: hidden ? "rgba(180,180,180,0.35)" : (ds.borderColor || ds.backgroundColor),
                lineWidth: 2,
                hidden: false, // không cho text bị strike/mờ mặc định
                datasetIndex: i,

                // giữ style box ổn định
                lineCap: ds.borderCapStyle,
                lineDash: ds.borderDash || [],
                lineDashOffset: ds.borderDashOffset || 0,
                lineJoin: ds.borderJoinStyle,

                // Chart.js v2 có thể dùng thêm
                pointStyle: ds.pointStyle || "rect"
              };
            });
          },
          fontColor: "#f9f9f9",
          boxWidth: 30,
          padding: 12
        }
      },
      scales: {
        xAxes: [{
          scaleLabel: {
            display: false,
            labelString: "Thời điểm",
            fontColor: "#f9f9f9"
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8,
            maxRotation: 0,
            minRotation: 0,
            fontColor: "#9c9b9b"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: "THDI (%)",
            fontColor: "#d6d4d4"
          },
          ticks: {
            fontColor: "#9c9b9b",
            callback: function (value) {
              return value + " %";
            }
          }
        }]
      }
    }
  });
}
function getOrCreateTooltipEl() {
  let tooltipEl = document.getElementById("chartjs-tooltip-thdi");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "chartjs-tooltip-thdi";
    tooltipEl.className = "chartjs-tooltip-thdi";
    tooltipEl.innerHTML = "<div class='tooltip-content'></div>";
    document.body.appendChild(tooltipEl);
  }

  return tooltipEl;
}
function groupByTime(array) {
  // Tạo một đối tượng để lưu trữ các nhóm
  var groups = {};

  // Duyệt qua từng phần tử trong mảng
  $.each(array, function (index, item) {
    // Lấy giá trị của trường time
    var time = item.thoidiem;

    // Nếu nhóm với giá trị time này chưa tồn tại, tạo mới
    if (!groups[time]) {
      groups[time] = [];
    }

    // Thêm phần tử vào nhóm tương ứng
    groups[time].push(item);
  });

  // Chuyển đổi đối tượng thành mảng các nhóm
  var result = $.map(groups, function (value, key) {
    return [value];
  });

  return result;
}
function toFixed2(val) {
  const num = Number(val);
  return isNaN(num) ? 0 : Number(num.toFixed(2));
}
function cal_THD(data) {
  var V1
  data[0] == null || data[0] == 0 ? V1 = 1 : V1 = data[0];

  var sum = 0;

  for (var i = 1; i < data.length; i++) {
    sum += Math.pow(data[i] / V1, 2);
  }

  var THD = Math.sqrt(sum) * 100;
  //console.log('THD: ' + THD.toFixed(2) + '%');
  return THD.toFixed(2);
}

function cal_TDD(data) {
  var I1 = data[0]; // Fundamental frequency RMS value
  var fullLoadCurrent = 15; // Example full load current
  var sum = 0;

  for (var i = 1; i < data.length; i++) {
    sum += Math.pow(data[i] / fullLoadCurrent, 2);
  }

  var TDD = Math.sqrt(sum) * 100;
  return TDD;
}
function cal_THDI(arr) {

  if (!Array.isArray(arr) || arr.length === 0) return 0;
  /*arr[0] = I1 (bậc 1 – fundamental)
  Nếu I1 = 0 → không thể chia → trả về 0 */
  const i1 = Number(arr[0] || 0);
  if (!i1) return 0;
  //Tính tổng bình phương các bậc sóng hài:I22​+I32​+...+In2​​
  let sum = 0;
  for (let i = 1; i < arr.length; i++) {
    const val = Number(arr[i] || 0);
    sum += Math.pow(val, 2);
  }
  //Áp dụng công thức THDI:
  return Number(((Math.sqrt(sum) / i1) * 100).toFixed(2));
}

function ensureTooltipStyle() {
  if (document.getElementById("chartjs-tooltip-thdi-style")) return;

  const style = document.createElement("style");
  style.id = "chartjs-tooltip-thdi-style";
  style.innerHTML = `
            .chartjs-tooltip-thdi {
                position: absolute;
                background: rgba(33, 33, 33, 0.95);
                color: #fff;
                border-radius: 8px;
                padding: 10px 12px;
                font-size: 12px;
                line-height: 1.45;
                pointer-events: none;
                opacity: 0;
                z-index: 99999;
                min-width: 360px;
                max-width: 520px;
                box-shadow: 0 4px 14px rgba(0,0,0,.25);
                transform: translate(-50%, calc(-100% - 10px));
                transition: opacity .08s ease;
            }

            .chartjs-tooltip-thdi .tt-title {
                font-weight: 700;
                margin-bottom: 6px;
            }

            .chartjs-tooltip-thdi .tt-line {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
            }

            .chartjs-tooltip-thdi .tt-color {
                width: 10px;
                height: 10px;
                display: inline-block;
                border-radius: 2px;
                flex: 0 0 10px;
            }

            .chartjs-tooltip-thdi .tt-h-title {
                text-align: center;
                font-weight: 700;
                margin: 4px 0 8px;
            }

            .chartjs-tooltip-thdi .tt-grid {
                display: grid;
                grid-template-columns: repeat(4, minmax(72px, 1fr));
                gap: 4px 14px;
                font-family: monospace;
                white-space: nowrap;
            }

            .chartjs-tooltip-thdi .tt-cell {
                text-align: left;
            }
        `;
  document.head.appendChild(style);
}
async function f_canhbao() {
  // code = "001003001002";
  var user = localStorage.getItem("login_user");
  user = JSON.parse(user);
  var code = user.danhmucid;
  try {
    const data = await $.ajax({
      url: "/api/sodomotsoi/laysukiencanhbao",
      type: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify({
        code: code,
      }),
    });

    var xxx = data;
  } catch (err) {
    console.error("Lỗi lấy dữ liệu sơ đồ 1 sợi:", err);
  } finally {
    isLoadingData = false;
  }
}




// biểu đồ phụ tải
async function load_bdpt() {

  // lấy ngày hiện tại
  const today = new Date();
  // format dd/MM/yyyy
  const currentDate =
    String(today.getDate()).padStart(2, '0') + '/' +
    String(today.getMonth() + 1).padStart(2, '0') + '/' +
    today.getFullYear();

  const ChiSoParameter = {
    v_meterid: 13124352,
    v_socongto: "-1",
    v_tungay: currentDate,
    v_denngay: currentDate,
    v_sotrang: 0,
    v_sodong: 100000,
    v_mataikhoan: 1
  };
  try {
    const data = await $.ajax({
      url: "/api/khaithacdulieu_laybieudophutai_chitiet",
      type: "POST",
      contentType: "application/json;charset=utf-8",
      dataType: "json",
      data: JSON.stringify(ChiSoParameter),
    });

    // console.log("data biểu đồ phụ tải", data);
    render_bdpt(data);
  } catch (err) {
    console.error("Lỗi xxload bdpt:", err);
    $("#bdptBody").html(`<tr><td colspan="6">Không tải được dữ liệu</td></tr>`);
  }
}

let bdptPage = 1;
const bdptPageSize = 10;
let feeders = [];

function render_bdpt(data) {
  const rows = Array.isArray(data) ? data : (data?.data || data?.rows || data?.result || []);

  feeders = rows.map((x, i) => {

    const starttime = x.starttime || "--";

    let onlyDate = "--";
    let onlyTime = "--";

    if (starttime.includes(" ")) {
      const arr = starttime.split(" ");
      onlyDate = arr[0];
      onlyTime = arr[1];
    }

    return {
      stt: x.stt || i + 1,
      starttime,
      onlyDate,
      timeOnly: onlyTime,

      pgiao: Number(x.pgiao || 0),
      pnhan: Number(x.pnhan || 0),
      qgiao: Number(x.qgiao || 0),
      qnhan: Number(x.qnhan || 0),
    };
  });

  bdptPage = 1;
  if (feeders.length > 0) {
    $("#bdptDate").text(feeders[0].onlyDate);
  }
  renderBdptPage();
  drawLoadChart(data);
}

function renderBdptPage() {
  const total = feeders.length;
  const totalPage = Math.max(1, Math.ceil(total / bdptPageSize));
  const start = (bdptPage - 1) * bdptPageSize;
  const pageRows = feeders.slice(start, start + bdptPageSize);

  const html = pageRows.map((f, i) => `
    <tr>
      <td>${start + i + 1}</td>
    <td>${f.timeOnly}</td>
      <td>${f.pgiao.toFixed(1)}</td>
      <td>${f.pnhan.toFixed(1)}</td>
      <td>${f.qgiao.toFixed(2)}</td>
      <td>${f.qnhan.toFixed(2)}</td>
    </tr>
  `).join("");

  $("#bdptBody").html(html || `<tr><td colspan="6">Không có dữ liệu</td></tr>`);

  const from = total ? start + 1 : 0;
  const to = Math.min(start + bdptPageSize, total);

  $("#bdptInfo").text(`Đang xem ${from} đến ${to} trong tổng số ${total} bản ghi`);
  $("#bdptPageText").text(`${bdptPage}/${totalPage}`);

  $("#bdptPrev").prop("disabled", bdptPage <= 1);
  $("#bdptNext").prop("disabled", bdptPage >= totalPage);
}

function getOnlyTime(value) {
  if (!value) return "";

  const s = String(value).trim();

  if (s.includes(" ")) {
    return s.split(" ")[1] || s;
  }

  if (s.includes("T")) {
    const parsed = new Date(s);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString('vi-VN', { hour12: false });
    }
  }

  return s;
}

function drawLoadChart(data) {
  lstTsvh_bdpt = data;
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Không có dữ liệu vẽ biểu đồ");
    return;
  }

  var date_ar = [];
  var sl_ar = [];
  var background_color = [];
  var donvi_doluong = "";

  var data1 = [...data].reverse();

  $.each(data1, function (k, v) {
    if (!v.starttime) return;

    var timeLabel = v.starttime.substr(11, 5); // HH:mm

    if (!date_ar.includes(timeLabel)) {
      date_ar.push(timeLabel);
    }
  });

  var chartType = $("[name=charttype_bdpt]:checked").val() || "PTongGiao";

  for (var i = 0; i < date_ar.length; i++) {
    var sl_tong_pgiao = 0;
    var sl_tong_pnhan = 0;
    var sl_tong_qgiao = 0;
    var sl_tong_qnhan = 0;
    var sl_pgiao = 0;
    var sl_pnhan = 0;
    var sl_qgiao = 0;
    var sl_qnhan = 0;

    for (var j = 0; j < data1.length; j++) {
      if (!data1[j].starttime) continue;

      if (date_ar[i] == data1[j].starttime.substr(11, 5)) {
        sl_tong_pgiao += Number(data1[j].pgiao || 0);
        sl_tong_pnhan += Number(data1[j].pnhan || 0);
        sl_tong_qgiao += Number(data1[j].qgiao || 0);
        sl_tong_qnhan += Number(data1[j].qnhan || 0);

        sl_pgiao += Number(data1[j].sl_pgiaotong || 0);
        sl_pnhan += Number(data1[j].sl_pnhantong || 0);
        sl_qgiao += Number(data1[j].sl_qgiaotong || 0);
        sl_qnhan += Number(data1[j].sl_qnhantong || 0);
      }
    }

    background_color.push(GetColorByTimeDl(data1[i]?.starttime || data1[0].starttime));

    if (chartType == "PTongGiao") {
      sl_ar.push(Number(sl_tong_pgiao.toFixed(3)));
      donvi_doluong = "P tổng giao (kW)";
    } else if (chartType == "PTongNhan") {
      sl_ar.push(Number(sl_tong_pnhan.toFixed(3)));
      donvi_doluong = "P tổng nhận (kW)";
    } else if (chartType == "QTongGiao") {
      sl_ar.push(Number(sl_tong_qgiao.toFixed(3)));
      donvi_doluong = "Q tổng giao (kVAR)";
    } else if (chartType == "QTongNhan") {
      sl_ar.push(Number(sl_tong_qnhan.toFixed(3)));
      donvi_doluong = "Q tổng nhận (kVAR)";
    } else if (chartType == "SLPGiao") {
      sl_ar.push(Number(sl_pgiao.toFixed(3)));
      donvi_doluong = "SL P Giao";
    } else if (chartType == "SLPNhan") {
      sl_ar.push(Number(sl_pnhan.toFixed(3)));
      donvi_doluong = "SL P Nhận";
    } else if (chartType == "SLQGiao") {
      sl_ar.push(Number(sl_qgiao.toFixed(3)));
      donvi_doluong = "SL Q Giao";
    } else if (chartType == "SLQNhan") {
      sl_ar.push(Number(sl_qnhan.toFixed(3)));
      donvi_doluong = "SL Q Nhận";
    }
  }

  $("#modal_chart_bdpt").html(
    '<div style="width:100%;height:300px;position:relative;">' +
    '<canvas id="canvas_bdpt" style="width:100%;height:100%;"></canvas>' +
    '</div>'
  );

  var ctx = document.getElementById("canvas_bdpt").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: date_ar,
      datasets: [{
        label: donvi_doluong,
        data: sl_ar,
        backgroundColor: background_color,
        type: "bar"
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: false,
        labels: {
          fontColor: "#fff"
        }
      },
      scales: {
        xAxes: [{
          ticks: {
            fontColor: "#fff"
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: donvi_doluong,
            fontColor: "#fff"
          },
          ticks: {
            beginAtZero: true,
            fontColor: "#fff"
          }
        }]
      }
    }
  });
}
// lấy màu sắc theo time
function GetColorByTimeDl(time) {
  //1. Giờ bình thường: màu cam
  /*  a) Gồm các ngày từ thứ Hai đến thứ Bảy:
      - Từ 04 giờ 00 đến 9 giờ 30 (05 giờ 30 phút);
      - Từ 11 giờ 30 đến 17 giờ 00 (05 giờ 30 phút);
      - Từ 20 giờ 00 đến 22 giờ 00 (02 giờ).
      b) Ngày Chủ nhật:
      Từ 04 giờ 00 đến 22 giờ 00 (18 giờ).
  */
  // 2. Giờ cao điểm: Màu đỏ
  /*
       a) Gồm các ngày từ thứ Hai đến thứ Bảy:
       - Từ 09 giờ 30 đến 11 giờ 30 (02 giờ);
       - Từ 17 giờ 00 đến 20 giờ 00 (03 giờ).
       b) Ngày Chủ nhật: không có giờ cao điểm.
 
   */
  //3. Giờ thấp điểm: Màu xanh
  //Tất cả các ngày trong tuần: từ 22 giờ 00 đến 04 giờ 00(06 giờ) sáng ngày hôm sau

  var datetime = moment(time, 'DD/MM/YYYY HH:mm');

  var day = datetime.day();
  var timeTemp = time.split(' ')[1].split(':');
  var minuteCheck = (parseInt(timeTemp[0]) * 60) + parseInt(timeTemp[1]);
  // Khung giờ thấp điểm  - Tất cả các ngày trong tuần
  var thapdiem1Tu = 22 * 60;
  var thapdiem1Den = 24 * 60;
  var thapdiem2Tu = 0;
  var thapdiem2Den = 4 * 60;
  if ((minuteCheck >= thapdiem1Tu && minuteCheck <= thapdiem1Den) || (minuteCheck >= thapdiem2Tu && minuteCheck < thapdiem2Den)) {
    return "#8bbc21";//màu xanh
  }
  else {
    // Ngày chủ nhật
    if (day == 0) {
      // Giờ bình thường
      return "#f58220";
    } else {
      var binhthuong1Tu = 4 * 60;
      var binhthuong1Den = (9 * 60) + 30;

      var binhthuong2Tu = (11 * 60) + 30;
      var binhthuong2Den = (17 * 60);

      var binhthuong3Tu = (20 * 60);
      var binhthuong3Den = (22 * 60);

      if ((minuteCheck >= binhthuong1Tu && minuteCheck < binhthuong1Den) || (minuteCheck >= binhthuong2Tu && minuteCheck < binhthuong2Den) || (minuteCheck >= binhthuong3Tu && minuteCheck < binhthuong3Den)) {
        return "#f58220";//màu cam
      } else {
        return "#ff0000";//màu đỏ
      }
    }
  }
}
function GetColorByTimeNhan(time) {
  //1. Giờ bình thường: màu cam
  /*  a) Gồm các ngày từ thứ Hai đến thứ Bảy:
      - Từ 04 giờ 00 đến 9 giờ 30 (05 giờ 30 phút);
      - Từ 11 giờ 30 đến 17 giờ 00 (05 giờ 30 phút);
      - Từ 20 giờ 00 đến 22 giờ 00 (02 giờ).
      b) Ngày Chủ nhật:
      Từ 04 giờ 00 đến 22 giờ 00 (18 giờ).
  */
  // 2. Giờ cao điểm: Màu đỏ
  /*
       a) Gồm các ngày từ thứ Hai đến thứ Bảy:
       - Từ 09 giờ 30 đến 11 giờ 30 (02 giờ);
       - Từ 17 giờ 00 đến 20 giờ 00 (03 giờ).
       b) Ngày Chủ nhật: không có giờ cao điểm.
 
   */
  //3. Giờ thấp điểm: Màu xanh
  //Tất cả các ngày trong tuần: từ 22 giờ 00 đến 04 giờ 00(06 giờ) sáng ngày hôm sau

  let datetime = moment(time, 'DD/MM/YYYY HH:mm');

  var day = datetime.day();
  var timeTemp = time.split(' ')[1].split(':');
  var minuteCheck = (parseInt(timeTemp[0]) * 60) + parseInt(timeTemp[1]);
  // Khung giờ thấp điểm  - Tất cả các ngày trong tuần
  var thapdiem1Tu = 22 * 60;
  var thapdiem1Den = 24 * 60;
  var thapdiem2Tu = 0;
  var thapdiem2Den = 4 * 60;
  if ((minuteCheck >= thapdiem1Tu && minuteCheck <= thapdiem1Den) || (minuteCheck >= thapdiem2Tu && minuteCheck < thapdiem2Den)) {
    return "#597d0b";//màu xanh
  }
  else {
    // Ngày chủ nhật
    if (day == 0) {
      // Giờ bình thường
      return "#e86b00";//màu cam
    } else {
      var binhthuong1Tu = 4 * 60;
      var binhthuong1Den = (9 * 60) + 30;

      var binhthuong2Tu = (11 * 60) + 30;
      var binhthuong2Den = (17 * 60);

      var binhthuong3Tu = (20 * 60);
      var binhthuong3Den = (22 * 60);

      if ((minuteCheck >= binhthuong1Tu && minuteCheck < binhthuong1Den) || (minuteCheck >= binhthuong2Tu && minuteCheck < binhthuong2Den) || (minuteCheck >= binhthuong3Tu && minuteCheck < binhthuong3Den)) {
        return "#d64a09";//màu cam
      } else {
        return "#bf1212";//màu đỏ
      }
    }
  }
}
function chartTypeChange_bdpt() {
  setTimeout(function () {
    drawLoadChart(lstTsvh_bdpt.reverse());
  }, 100);
}


$(document).on('click', '.power-ai-copy-answer', async function () {
  const id = $(this).data('copy-target');
  const text = $(`#${id} .power-ai-message-content`).text().trim();
  try {
    await navigator.clipboard.writeText(text);
    const $icon = $(this).find('i');
    $icon.removeClass('far fa-copy').addClass('fas fa-check');
    setTimeout(() => $icon.removeClass('fas fa-check').addClass('far fa-copy'), 1200);
  } catch (error) {
    console.warn('Không thể sao chép câu trả lời:', error);
  }
});
