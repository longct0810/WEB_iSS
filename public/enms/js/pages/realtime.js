import { base, preview } from '../core/config.js';
import { state } from '../core/state.js';
import { $, $$, render, showError } from '../core/dom.js';
import { request } from '../core/api.js';
import { connectRealtime } from '../core/realtime.js';
import { donut, line, replaceChart } from '../core/charts.js';
import { bars, distribution, energyStats, recentAlerts, stationTable, tabs } from '../components/ui.js';
import { factoryMap } from '../components/factory.js';

function filterMap() {
  const query = ($('#map-search')?.value || '').toLocaleLowerCase('vi');
  $$('.factory:not(.map-mini) .map-marker').forEach(element => {
    const station = state.stations.find(item => item.id === element.dataset.id);
    element.hidden = !station.name.toLocaleLowerCase('vi').includes(query) || (state.mapScope === 'production' && [1,15,16].includes(+station.id));
  });
}

function setSocketStatus(detail = {}) {
  if (preview) return;
  if (detail.authError) { $('#connection-state').textContent = 'Socket HES: phiên xác thực không hợp lệ'; return; }
  if (detail.connected && detail.stale) { $('#connection-state').textContent = 'Socket HES đã xác thực · dữ liệu đang trễ'; return; }
  if (detail.connected) { $('#connection-state').textContent = 'Socket HES đã xác thực'; return; }
  $('#connection-state').textContent = 'Socket HES chưa kết nối';
}

function startPolling() {
  clearInterval(state.timer);
  const seconds = +($('#refresh-interval')?.value || 0);
  if (!seconds) return;
  state.timer = setInterval(async () => {
    if (document.hidden || state.polling) return;
    state.polling = true;
    try {
      state.summary = (await request('summary')).data;
      render('#realtime-summary', energyStats('realtime'));
      const load = state.charts.find(chart => chart.el?.id === 'load-chart');
      if (load && state.loadMetric === 'power') {
        load.updateSeries([{ name: 'Công suất (MW)', data: state.summary.series }], false);
      }
      $('#last-update').textContent = `API kiểm tra: ${new Date().toLocaleTimeString('vi-VN')} · Dữ liệu mẫu 06/2025`;
    } catch (error) {
      showError(error);
    } finally {
      state.polling = false;
    }
  }, seconds * 1000);
}

function startRealtimeSocket() {
  if (preview) return;
  if (state.realtime) { state.realtime.close(); state.realtime = null; }
  const deviceIds = [...new Set(state.meters
    .map(meter => meter.hesDeviceId ?? meter.deviceId ?? meter.id_thietbi)
    .filter(value => value !== undefined && value !== null && String(value).trim() !== '')
    .map(String))];
  if (!deviceIds.length) {
    $('#connection-state').textContent = 'Socket HES sẵn sàng · chưa ánh xạ deviceId cho EnMS';
    return;
  }
  state.realtime = connectRealtime(deviceIds, rows => {
    window.dispatchEvent(new CustomEvent('enms:telemetry', { detail: { rows } }));
    $('#last-update').textContent = `HES realtime: ${new Date().toLocaleTimeString('vi-VN')}`;
  }, setSocketStatus);
}

export async function mount() {
  render('#realtime-summary', energyStats('realtime'));
  render('#realtime-map-tabs', tabs(['Toàn nhà máy', 'Khu vực sản xuất', 'Trạm điện'], 'map-scope'));
  render('#realtime-factory', factoryMap({ tall: true }));
  render('#realtime-bars', bars());
  render('#realtime-load-tabs', tabs(['Công suất (MW)', 'Điện năng (kWh)', 'Suất tiêu hao'], 'load'));
  render('#realtime-distribution-tabs', tabs(['Theo khu vực', 'Theo loại tải'], 'distribution'));
  render('#distribution-body', distribution());
  render('#realtime-alerts', recentAlerts(base));
  line('load-chart');
  donut('distribution', [22,18,16,12,11,7,6,8], '8,524,630');
  startPolling();
  startRealtimeSocket();
}

export async function onTab(group, value) {
  if (group === 'load') {
    state.loadMetric = value.startsWith('Công') ? 'power' : value.startsWith('Điện') ? 'energy' : 'enpi';
    replaceChart('load-chart');
    line('load-chart', state.loadMetric);
    return true;
  }
  if (group === 'distribution') {
    replaceChart('distribution');
    const load = value === 'Theo loại tải';
    render('#distribution-body', distribution('distribution', load ? 'load' : 'area'));
    donut('distribution', load ? [62,21,5,12] : [22,18,16,12,11,7,6,8], '8,524,630', 'kWh', load ? ['Động cơ','Máy biến áp','Chiếu sáng','Phụ trợ'] : []);
    return true;
  }
  if (group === 'map-scope') {
    state.mapScope = value === 'Khu vực sản xuất' ? 'production' : 'all';
    filterMap();
    if (value === 'Trạm điện') window.EnmsCommon?.showDialog('Trạm điện & công suất', stationTable());
    return true;
  }
  return false;
}

export async function onInput(target) {
  if (target.id !== 'map-search') return false;
  filterMap();
  return true;
}

export async function onChange(target) {
  if (target.id !== 'refresh-interval') return false;
  startPolling();
  return true;
}

export function dispose() {
  clearInterval(state.timer);
  state.timer = null;
  state.realtime?.close();
  state.realtime = null;
}

window.addEventListener('enms:socket-status', event => setSocketStatus(event.detail));
window.addEventListener('smartgrid:socket-status', event => setSocketStatus(event.detail));
