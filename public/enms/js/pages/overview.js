import { base } from '../core/config.js';
import { state } from '../core/state.js';
import { esc, fmt, render } from '../core/dom.js';
import { chart, colors, donut, replaceChart } from '../core/charts.js';
import { icon, tabs } from '../components/ui.js';

const productionTabs = Object.freeze({
  'Sản lượng': 'production',
  'EnPI': 'enpi',
  'Chi phí/Tấn': 'cost',
  'Phát thải/Tấn': 'emission'
});

const trendTabs = Object.freeze({
  'Điện': 'electricity',
  'Than': 'coal',
  'Hơi': 'steam',
  'Nhiệt': 'heat',
  'Tổng (quy đổi)': 'total'
});

function moduleData() {
  return state.module || {};
}

function renderKpis() {
  const data = moduleData();
  render('#m1-kpis', (data.kpis || []).map((item, index) => {
    const progress = Number(item.progress || 0);
    return `<article class="m1-kpi ${esc(item.tone || '')}">
      <span class="m1-kpi-icon">${icon(item.icon || 'activity')}</span>
      <div>
        <div class="m1-kpi-label">${esc(item.label)}</div>
        <div class="m1-kpi-value">${esc(item.value)}<small>${esc(item.unit || '')}</small></div>
        ${progress ? '' : `<div class="m1-kpi-note"><strong>${esc(item.delta || '')}</strong>${esc(item.context || '')}</div>`}
      </div>
      ${progress ? `<div class="m1-kpi-progress"><div class="progress"><span style="width:${Math.min(100, Math.max(0, progress))}%"></span></div><p>${esc(item.delta || 'Đạt kế hoạch')}</p></div>` : ''}
    </article>`;
  }).join(''));
}

function renderPlantInfo() {
  const plant = moduleData().plant || {};
  const rows = [
    ['building', 'Công suất thiết kế', plant.designCapacity],
    ['boxes', 'Sản phẩm chính', plant.mainProduct],
    ['bullseye', 'Số trạm đo', plant.stations],
    ['speedometer2', 'Số điểm đo', plant.meters],
    ['fire', 'Nguồn năng lượng', plant.energySources],
    ['calendar-check', 'Vận hành từ', plant.operatingSince]
  ];
  render('#m1-plant-info', `<h3>Thông tin nhà máy</h3>${rows.map(([glyph, label, value]) => `<div class="m1-plant-info-row">${icon(glyph)}<span>${esc(label)}</span><b>${esc(value ?? '—')}</b></div>`).join('')}`);
}

function renderProductionTabs(active = 'Sản lượng') {
  render('#m1-production-tabs', tabs(Object.keys(productionTabs), 'm1-production', active));
}

function renderProductionChart(metric = 'production') {
  const production = moduleData().production || {};
  const metrics = production.metrics || {};
  replaceChart('m1-production-chart');

  if (metric === 'production') {
    const volume = metrics.production?.series || [];
    const enpi = metrics.enpi?.series || [];
    chart('m1-production-chart', 'line', [
      { name: metrics.production?.label || 'Sản lượng clinker (tấn)', type: 'column', data: volume },
      { name: metrics.enpi?.label || 'EnPI (kWh/tấn)', type: 'line', data: enpi }
    ], {
      height: 188,
      categories: production.categories || [],
      colors: ['#38a9f4', '#0a9d7c'],
      stroke: { width: [0, 2.4], curve: 'smooth' },
      markers: { size: [0, 3], strokeWidth: 0 },
      plotOptions: { bar: { borderRadius: 2, columnWidth: '42%' } },
      yaxis: [
        { labels: { style: { fontSize: '8px', colors: '#7b91a4' }, formatter: value => `${Math.round(value / 1000)}K` } },
        { opposite: true, min: 0, max: 1000, labels: { style: { fontSize: '8px', colors: '#7b91a4' }, formatter: value => fmt(value) } }
      ],
      legend: { position: 'top', horizontalAlign: 'left', fontSize: '9px', markers: { width: 7, height: 7 } }
    });
    return;
  }

  const selected = metrics[metric] || metrics.enpi || { label: metric, series: [] };
  chart('m1-production-chart', 'area', [{ name: selected.label, data: selected.series || [] }], {
    height: 188,
    categories: production.categories || [],
    colors: [metric === 'emission' ? '#895edc' : metric === 'cost' ? '#f2a211' : '#0aa47f'],
    stroke: { width: 2.3, curve: 'smooth' },
    legend: { position: 'top', horizontalAlign: 'left', fontSize: '9px' }
  });
}

function renderMixTabs(active = 'Theo năng lượng') {
  render('#m1-mix-tabs', tabs(['Theo năng lượng', 'Theo khu vực'], 'm1-mix', active));
}

function renderMix(mode = 'energy') {
  const mix = moduleData().energyMix?.[mode] || { labels: [], values: [], total: '0', unit: 'MWh' };
  replaceChart('m1-mix-chart');
  donut('m1-mix-chart', mix.values || [], mix.total || '0', mix.unit || 'MWh', mix.labels || []);
  render('#m1-mix-legend', (mix.labels || []).map((label, index) => `<div class="m1-mix-legend-row"><i style="background:${colors[index % colors.length]}"></i><span>${esc(label)}</span><b>${fmt(mix.values[index], 1)}%</b></div>`).join(''));
}

function renderTrendTabs(active = 'Điện') {
  render('#m1-trend-tabs', tabs(Object.keys(trendTabs), 'm1-trend', active));
}

function renderTrend(metric = 'electricity') {
  const trend = moduleData().energyTrend || {};
  const selected = trend.metrics?.[metric] || { label: metric, unit: '', current: [], previous: [] };
  replaceChart('m1-energy-trend');
  chart('m1-energy-trend', 'line', [
    { name: 'Tháng 06/2025', data: selected.current || [] },
    { name: 'Tháng 05/2025', data: selected.previous || [] }
  ], {
    height: 175,
    categories: trend.categories || [],
    colors: ['#138ee7', '#a7bfce'],
    stroke: { width: [2.2, 1.6], curve: 'smooth', dashArray: [0, 5] },
    markers: { size: [2, 0], strokeWidth: 0 },
    yaxis: { title: { text: selected.unit || '', style: { fontSize: '8px', color: '#6f8799', fontWeight: 500 } }, labels: { style: { fontSize: '8px', colors: '#7b91a4' }, formatter: value => fmt(value) } },
    legend: { position: 'top', horizontalAlign: 'right', fontSize: '9px', markers: { width: 7, height: 7 } }
  });
}

function renderEfficiency() {
  const rows = moduleData().efficiency || [];
  render('#m1-efficiency', `<div class="m1-efficiency-list">${rows.map(item => `<div class="m1-efficiency-row ${item.bad ? 'bad' : ''}">
    <span>${esc(item.name)}</span>
    <div class="m1-efficiency-track"><i style="width:${Math.max(3, Math.min(100, Number(item.ratio || 0)))}%"></i></div>
    <b>${fmt(item.enpi)}</b>
    <span class="m1-efficiency-delta">${Number(item.delta) <= 0 ? '▼' : '▲'} ${fmt(Math.abs(Number(item.delta || 0)), 1)}%</span>
  </div>`).join('')}</div>`);
}

function alertStatus(status) {
  const className = status === 'Chưa xử lý' ? 'open' : status === 'Đang xử lý' ? 'processing' : '';
  const glyph = status === 'Chưa xử lý' ? 'exclamation-circle-fill' : status === 'Đang xử lý' ? 'arrow-repeat' : 'check-circle-fill';
  return `<span class="m1-alert-status ${className}">${icon(glyph)} ${esc(status)}</span>`;
}

function renderAlerts() {
  const rows = moduleData().alertHighlights || [];
  render('#m1-alerts', `<div class="table-wrap"><table><thead><tr><th>Thời gian</th><th>Khu vực</th><th>Nội dung</th><th>Mức độ</th><th>Trạng thái</th></tr></thead><tbody>${rows.map(item => `<tr><td>${esc(item.time)}</td><td>${esc(item.area)}</td><td>${esc(item.message)}</td><td><span class="m1-alert-level">${icon('exclamation-circle-fill')} ${esc(item.level)}</span></td><td>${alertStatus(item.status)}</td></tr>`).join('')}</tbody></table></div>`);
}

function renderTargets() {
  const rows = moduleData().targets || [];
  render('#m1-targets', `<div class="m1-target-head"><span>Chỉ tiêu</span><span>Đơn vị</span><span>Mục tiêu</span><span>Thực hiện</span><span>Tiến độ</span></div>${rows.map(item => `<div class="m1-target-row good">
    <span>${esc(item.name)}</span><span>${esc(item.unit)}</span><span>${esc(item.target)}</span><span>${esc(item.actual)}</span>
    <div class="m1-target-progress"><div class="progress"><span style="width:${Math.max(0, Math.min(100, Number(item.progress || 0)))}%"></span></div><b>${fmt(item.progress)}%</b></div>
  </div>`).join('')}`);
}

function renderImpacts() {
  const impacts = moduleData().impacts || [];
  render('#m1-impact', `<div class="m1-impact-grid">${impacts.map(item => `<article class="m1-impact-item ${esc(item.tone || '')}"><span class="m1-impact-icon">${icon(item.icon || 'activity')}</span><div><span>${esc(item.label)}</span><b>${esc(item.value)}</b><small>${esc(item.unit || '')}</small>${item.delta ? `<em>${esc(item.delta)}</em>` : ''}</div></article>`).join('')}</div>`);
}

export async function mount() {
  renderKpis();
  renderPlantInfo();
  renderProductionTabs();
  renderProductionChart();
  renderMixTabs();
  renderMix();
  renderTrendTabs();
  renderTrend();
  renderEfficiency();
  renderAlerts();
  renderTargets();
  renderImpacts();
}

export async function onTab(group, value) {
  if (group === 'm1-production') {
    renderProductionChart(productionTabs[value] || 'production');
    return true;
  }
  if (group === 'm1-mix') {
    renderMix(value === 'Theo khu vực' ? 'area' : 'energy');
    return true;
  }
  if (group === 'm1-trend') {
    renderTrend(trendTabs[value] || 'electricity');
    return true;
  }
  return false;
}

export async function onAction(name) {
  if (name !== 'm1-report') return false;
  location.href = `${base}reports`;
  return true;
}
