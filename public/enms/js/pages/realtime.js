import { base, preview } from '../core/config.js';
import { state } from '../core/state.js';
import { $, $$, esc, fmt, render, toast } from '../core/dom.js';
import { request } from '../core/api.js';
import { connectRealtime } from '../core/realtime.js';
import { chart, replaceChart } from '../core/charts.js';
import { badge, icon, row, table, tabs } from '../components/ui.js';

const SYSTEM_TABS = ['Sơ đồ tổng thể','Điện','Nhiệt (Than/Dầu/Khí)','Hơi','Nước','Năng lượng tái tạo','Tùy chỉnh'];
const SYSTEM_MODE = Object.freeze({
  'Sơ đồ tổng thể':'all', 'Điện':'electricity', 'Nhiệt (Than/Dầu/Khí)':'thermal',
  'Hơi':'steam', 'Nước':'water', 'Năng lượng tái tạo':'renewable', 'Tùy chỉnh':'custom'
});

function data() { return state.module || {}; }

function toneIconClass(tone='blue') { return `m2-kpi-icon ${esc(tone)}`; }

function renderKpis() {
  render('#m2-kpis', (data().kpis || []).map(item => `<article class="m2-kpi">
    <span class="${toneIconClass(item.tone)}">${icon(item.icon || 'activity')}</span>
    <div class="m2-kpi-copy">
      <div class="m2-kpi-label">${esc(item.label)}</div>
      <div class="m2-kpi-value">${esc(item.value)} <small>${esc(item.unit || '')}</small></div>
      <div class="m2-kpi-note ${String(item.delta || '').includes('▲') || String(item.delta || '').includes('↑') ? 'up' : 'down'}"><strong>${esc(item.delta || '')}</strong><span>${esc(item.context || '')}</span></div>
    </div>
  </article>`).join(''));
}

function renderViewbar(active='Sơ đồ tổng thể') {
  render('#m2-system-tabs', tabs(SYSTEM_TABS, 'm2-system', active));
  const health = data().systemStatus || {normal:69,warning:5,fault:2};
  render('#m2-system-state', `<span><i class="dot"></i>Bình thường: ${fmt(health.normal)}</span><span><i class="dot warning"></i>Cảnh báo: ${fmt(health.warning)}</span><span><i class="dot danger"></i>Sự cố: ${fmt(health.fault)}</span>`);
}

function sourceIcon(kind) {
  return ({electricity:'lightning-charge-fill', coal:'cloud-haze2-fill', oil:'droplet-fill', steam:'wind', water:'droplet-half', renewable:'sun-fill'})[kind] || 'activity';
}

function renderFlow(mode='all') {
  const flow = data().flow || {};
  const sources = (flow.sources || []).filter(item => mode === 'all' || mode === 'custom' || mode === 'thermal' && ['coal','oil'].includes(item.kind) || item.kind === mode);
  const visibleKinds = new Set(sources.map(item => item.kind));
  const processNodes = flow.processes || [];
  const utilities = flow.utilities || [];
  const sourceHtml = sources.map(item => `<article class="m2-source-card ${esc(item.kind)}" data-kind="${esc(item.kind)}"><span>${icon(sourceIcon(item.kind))}</span><div><b>${esc(item.label)}</b><strong>${esc(item.value)}</strong></div></article>`).join('');
  const nodeHtml = processNodes.map(item => `<button type="button" class="m2-process-node ${item.status === 'warning' ? 'warning' : ''}" data-action="m2-process" data-id="${esc(item.id)}" style="--x:${item.x}%;--y:${item.y}%"><span>${esc(item.order)}. ${esc(item.name)}</span><b>${esc(item.value)}</b></button>`).join('');
  const utilityHtml = utilities.map(item => `<article class="m2-utility ${esc(item.kind || '')}">${icon(item.icon || 'activity')}<div><b>${esc(item.label)}</b><span>${esc(item.value)}</span></div></article>`).join('');
  const sourceLines = (flow.lines || []).filter(line => mode === 'all' || mode === 'custom' || visibleKinds.has(line.kind) || mode === 'thermal' && ['coal','oil'].includes(line.kind)).map(line => `<polyline class="m2-flow-line ${esc(line.kind)}" points="${esc(line.points)}" />`).join('');

  render('#m2-energy-flow', `<div class="m2-flow-stage" data-energy-mode="${esc(mode)}">
    <aside class="m2-source-column"><h3>Nguồn năng lượng đầu vào</h3>${sourceHtml || '<div class="m2-no-source">Chưa cấu hình nguồn</div>'}</aside>
    <div class="m2-factory-zone">
      <img src="/enms/assets/factory.png" alt="Sơ đồ tổng thể nhà máy Lam Thạch II">
      <div class="m2-area-label m2-area-extraction">1. Khai thác đá</div>
      ${nodeHtml}
      <svg class="m2-flow-svg" viewBox="0 0 1000 520" preserveAspectRatio="none" aria-hidden="true">${sourceLines}</svg>
      <article class="m2-product-card"><b>Thành phẩm</b><span>${esc(flow.product?.name || 'Clinker / Xi măng')}</span><strong>${esc(flow.product?.value || '3,250 tấn/ngày')}</strong>${icon('building')}</article>
      <div class="m2-utilities">${utilityHtml}</div>
    </div>
  </div>`);
}

function renderPowerChart(range='24h') {
  const rt = data().realtimeTrend || {};
  const allCategories = rt.categories || [];
  const take = range === '4h' ? 5 : range === '8h' ? 9 : allCategories.length;
  const start = Math.max(0, allCategories.length - take);
  const series = (rt.series || []).map(item => ({...item, data:(item.data || []).slice(start)}));
  replaceChart('m2-power-chart');
  chart('m2-power-chart', 'line', series, {
    height: 192,
    categories: allCategories.slice(start),
    colors: ['#168ee5','#ef4f45','#13a875','#7f58db'],
    stroke: { width: [2.2,2,2,2], curve: 'smooth' },
    markers: { size: 2.6, strokeWidth: 0 },
    legend: { position:'top', horizontalAlign:'center', fontSize:'9px', markers:{width:7,height:7} },
    xaxis: { categories: allCategories.slice(start), labels:{style:{fontSize:'8px',colors:'#7890a2'},rotate:0}, axisBorder:{show:false}, axisTicks:{show:false}, tickAmount:6 },
    yaxis: { min:0, max:100, tickAmount:5, labels:{style:{fontSize:'8px',colors:'#7890a2'},formatter:value=>fmt(value)} },
    tooltip: { shared:true, intersect:false }
  });
}

function renderShiftTabs(active='Hôm nay') {
  render('#m2-shift-tabs', tabs(['Hôm nay','Hôm qua'], 'm2-shift', active));
}

function renderShiftChart(key='today') {
  const shift = data().shiftProduction || {};
  const source = shift[key] || shift.today || {};
  replaceChart('m2-shift-chart');
  chart('m2-shift-chart', 'bar', source.series || [], {
    height: 186,
    categories: shift.categories || [],
    colors: ['#168ee5','#16b78e','#f3a11a'],
    stroke: { width:0 },
    plotOptions: { bar: { columnWidth:'56%', borderRadius:2 } },
    dataLabels: { enabled:true, offsetY:-10, style:{fontSize:'8px',colors:['#274d69']}, formatter:value=>fmt(value) },
    legend: { position:'top', horizontalAlign:'center', fontSize:'9px', markers:{width:7,height:7} },
    yaxis: { labels:{style:{fontSize:'8px',colors:'#7890a2'},formatter:value=>fmt(value)} }
  });
}

function stationStatusBadge(status) {
  if (status === 'Sự cố') return badge(status,'critical');
  if (status === 'Cảnh báo') return badge(status,'warning');
  return `<span class="m2-online"><i class="dot"></i>${esc(status || 'Hoạt động')}</span>`;
}

function renderStations() {
  const query = ($('#m2-station-search')?.value || '').trim().toLocaleLowerCase('vi');
  const status = $('#m2-station-status')?.value || '';
  let items = data().stations || [];
  items = items.filter(item => (!query || item.name.toLocaleLowerCase('vi').includes(query)) && (!status || item.status === status));
  render('#m2-stations', table(
    ['STT','Tên trạm','Điện áp','Công suất (MVA)','P (MW)','Q (MVAr)','Cosφ','Trạng thái'],
    items.map((item,index) => row([
      index+1, `<a href="#" data-action="station" data-id="${esc(item.id)}">${esc(item.name)}</a>`, esc(item.voltage), fmt(item.capacity,1), fmt(item.p,2), fmt(item.q,2), fmt(item.pf,2), stationStatusBadge(item.status)
    ])),
    'compact m2-station-table'
  ) + `<div class="m2-mini-pagination"><span>${items.length ? `Hiển thị ${items.length} / ${(data().stations || []).length} trạm` : 'Không có trạm phù hợp'}</span><button type="button" disabled>‹</button><button type="button" class="active">1</button><button type="button">2</button><button type="button">›</button></div>`);
}

function renderParameters() {
  const rows = data().parameters || [];
  render('#m2-parameters', table(['Hệ thống','Thông số','Giá trị','Đơn vị','Trạng thái'], rows.map(item => row([
    `<b>${esc(item.group)}</b>`, esc(item.name), `<strong>${esc(item.value)}</strong>`, esc(item.unit), `<span class="m2-param-ok"><i class="dot ${item.status === 'Cảnh báo' ? 'warning' : item.status === 'Sự cố' ? 'danger' : ''}"></i>${esc(item.status)}</span>`
  ])), 'compact m2-param-table'));
}

function alertLevel(level) {
  if (level === 'Cao') return '<span class="m2-level critical"><i class="bi bi-exclamation-circle-fill"></i>Cao</span>';
  return '<span class="m2-level warning"><i class="bi bi-exclamation-circle-fill"></i>Trung bình</span>';
}

function renderAlerts() {
  const items = data().realtimeAlerts || [];
  render('#m2-alerts', table(['Thời gian','Thiết bị / Khu vực','Nội dung','Mức độ','Trạng thái'], items.map(item => row([
    esc(item.time), esc(item.area), `<span class="${item.level === 'Cao' ? 'm2-alert-text' : ''}">${esc(item.message)}</span>`, alertLevel(item.level), `<span class="m2-alert-status ${esc(item.statusType || '')}">${icon(item.statusIcon || 'circle-fill')}${esc(item.status)}</span>`
  ])), 'compact m2-alert-table'));
}

function renderAll() {
  renderKpis();
  renderViewbar();
  renderFlow('all');
  renderPowerChart($('#m2-power-range')?.value || '24h');
  renderShiftTabs();
  renderShiftChart('today');
  renderStations();
  renderParameters();
  renderAlerts();
}

function setSocketStatus(detail = {}) {
  if (preview) return;
  if (detail.authError) { $('#connection-state').textContent = 'Socket HES: phiên xác thực không hợp lệ'; return; }
  if (detail.connected && detail.stale) { $('#connection-state').textContent = 'Socket HES đã xác thực · dữ liệu đang trễ'; return; }
  if (detail.connected) { $('#connection-state').textContent = 'Socket HES đã xác thực · realtime'; return; }
  $('#connection-state').textContent = 'Socket HES chưa kết nối';
}

function startPolling() {
  clearInterval(state.timer);
  state.timer = setInterval(async () => {
    if (document.hidden || state.polling) return;
    state.polling = true;
    try {
      const result = await request('modules/realtime');
      state.module = result.data;
      renderKpis();
      renderPowerChart($('#m2-power-range')?.value || '24h');
      $('#last-update').textContent = `Realtime API: ${new Date().toLocaleTimeString('vi-VN')} · EnMS v1.1.9`;
    } finally { state.polling = false; }
  }, 5000);
}

function startRealtimeSocket() {
  if (preview) return;
  if (state.realtime) { state.realtime.close(); state.realtime = null; }
  const deviceIds = [...new Set(state.meters.map(meter => meter.hesDeviceId ?? meter.deviceId ?? meter.id_thietbi).filter(value => value !== undefined && value !== null && String(value).trim() !== '').map(String))];
  if (!deviceIds.length) {
    $('#connection-state').textContent = 'Socket HES sẵn sàng · chưa ánh xạ deviceId cho EnMS';
    return;
  }
  state.realtime = connectRealtime(deviceIds, rows => {
    window.dispatchEvent(new CustomEvent('enms:telemetry', { detail: { rows } }));
    $('#last-update').textContent = `HES realtime: ${new Date().toLocaleTimeString('vi-VN')} · EnMS v1.1.9`;
  }, setSocketStatus);
}

export async function mount() {
  renderAll();
  startPolling();
  startRealtimeSocket();
}

export async function onTab(group, value) {
  if (group === 'm2-system') {
    renderFlow(SYSTEM_MODE[value] || 'all');
    return true;
  }
  if (group === 'm2-shift') {
    renderShiftChart(value === 'Hôm qua' ? 'yesterday' : 'today');
    return true;
  }
  return false;
}

export async function onInput(target) {
  if (target.id !== 'm2-station-search') return false;
  renderStations();
  return true;
}

export async function onChange(target) {
  if (target.id === 'm2-station-status') { renderStations(); return true; }
  if (target.id === 'm2-power-range') { renderPowerChart(target.value); return true; }
  if (target.id === 'realtime-period') {
    renderPowerChart(target.value === 'realtime' ? '4h' : '24h');
    return true;
  }
  if (target.id === 'realtime-display') {
    const map = {overview:'Sơ đồ tổng thể',electricity:'Điện',thermal:'Nhiệt (Than/Dầu/Khí)',steam:'Hơi',water:'Nước'};
    const label = map[target.value] || 'Sơ đồ tổng thể';
    const tab = $$('[data-tab="m2-system"]').find(button => button.dataset.value === label);
    if (tab) tab.click();
    return true;
  }
  return false;
}

export async function onAction(name, target) {
  if (name === 'm2-fullscreen') {
    const element = document.querySelector('main');
    if (!document.fullscreenElement) await element?.requestFullscreen(); else await document.exitFullscreen();
    return true;
  }
  if (name === 'm2-legend') {
    window.EnmsCommon?.showDialog('Chú thích giám sát thời gian thực', `<div class="m2-dialog-legend"><p><i class="dot"></i><b>Bình thường:</b> thiết bị và điểm đo đang hoạt động trong giới hạn cấu hình.</p><p><i class="dot warning"></i><b>Cảnh báo:</b> thông số vượt ngưỡng cảnh báo hoặc kết nối chập chờn.</p><p><i class="dot danger"></i><b>Sự cố:</b> mất dữ liệu, lỗi thiết bị hoặc vượt ngưỡng nghiêm trọng.</p><p><b>Đường màu:</b> xanh dương = điện/nước; cam = nhiên liệu/nhiệt; đỏ = hơi; xanh lá nét đứt = môi trường/năng lượng tái tạo.</p></div>`);
    return true;
  }
  if (name === 'm2-process') {
    const item = (data().flow?.processes || []).find(process => process.id === target.dataset.id);
    if (item) window.EnmsCommon?.showDialog(`${item.order}. ${item.name}`, `<div class="mini-stats"><div class="mini-stat">Giá trị hiện tại<b>${esc(item.value)}</b></div><div class="mini-stat">Trạng thái<b>${esc(item.status === 'warning' ? 'Cảnh báo' : 'Bình thường')}</b></div><div class="mini-stat">Nguồn<b>Realtime / Mock API</b></div></div>`);
    return true;
  }
  if (name === 'm2-history') { location.href = `${base}data`; return true; }
  if (name === 'm2-quick-report') { location.href = `${base}reports`; return true; }
  if (name === 'm2-alert-config') { location.href = `${base}alerts`; return true; }
  return false;
}

export function dispose() {
  clearInterval(state.timer);
  state.timer = null;
  state.realtime?.close();
  state.realtime = null;
}

window.addEventListener('enms:socket-status', event => setSocketStatus(event.detail));
window.addEventListener('smartgrid:socket-status', event => setSocketStatus(event.detail));
