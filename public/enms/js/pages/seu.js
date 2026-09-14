import { state } from '../core/state.js';
import { $, $$, esc, fmt, render, toast } from '../core/dom.js';
import { chart, replaceChart } from '../core/charts.js';
import { icon, tabs } from '../components/ui.js';

const VIEW_TABS = ['Tổng quan','Danh sách SEU','EnPI chi tiết','Đường cơ sở năng lượng (EnB)','So sánh & Benchmark','Phân tích xu hướng'];
let activeTab = 'Tổng quan';
let activeSeuId = 'SEU-01';
let activeMetric = 'sec-electric';
let activeGroup = 'all';
let expandedGroups = new Set(['kiln','cement','aux']);

function data() { return state.module || {}; }

function deltaClass(delta) { return Number(delta) > 0 ? 'bad' : 'good'; }
function deltaArrow(delta) { return Number(delta) > 0 ? '▲' : '▼'; }

function renderViewTabs() {
  render('#m4-tabs', tabs(VIEW_TABS, 'm4-view', activeTab));
}

function renderKpis() {
  render('#m4-kpis', (data().kpis || []).map(item => {
    const delta = String(item.delta || '');
    const bad = item.goodDirection === 'down'
      ? /▲|↑|\+/.test(delta)
      : item.goodDirection === 'up'
        ? /▼|↓|-/.test(delta)
        : false;
    return `<article class="m4-kpi ${esc(item.tone || 'blue')}">
      <span class="m4-kpi-icon">${icon(item.icon || 'activity')}</span>
      <div class="m4-kpi-copy">
        <div class="m4-kpi-label">${esc(item.label)}</div>
        <div class="m4-kpi-value">${esc(item.value)} <small>${esc(item.unit || '')}</small></div>
        <div class="m4-kpi-note ${bad ? 'bad' : 'good'}"><strong>${esc(delta)}</strong><span>${esc(item.context || '')}</span></div>
      </div>
    </article>`;
  }).join(''));
}

function filteredRows() {
  const rows = data().enpi?.rows || [];
  if (activeGroup === 'all') return rows;
  return rows.filter(item => item.group === activeGroup);
}

function renderTree(query = $('#m4-tree-search')?.value || '') {
  const structure = data().structure || {};
  const normalized = query.trim().toLocaleLowerCase('vi');
  const groups = (structure.groups || []).filter(group => {
    if (!normalized) return true;
    return group.name.toLocaleLowerCase('vi').includes(normalized)
      || (group.children || []).some(child => child.name.toLocaleLowerCase('vi').includes(normalized) || child.code.toLocaleLowerCase('vi').includes(normalized));
  });

  render('#m4-seu-tree', `<div class="m4-tree-root">
    <button type="button" class="m4-tree-root-row ${activeGroup === 'all' ? 'selected' : ''}" data-action="m4-filter-group" data-group="all">
      <span class="m4-tree-caret">⌄</span>${icon('building')}<b>${esc(structure.name || 'Nhà máy Xi măng Lam Thạch II')}</b><em>${fmt(structure.total || 0)} SEU</em>
    </button>
    <div class="m4-tree-groups">${groups.map((group,index) => {
      const opened = expandedGroups.has(group.id) || Boolean(normalized);
      const children = (group.children || []).filter(child => !normalized || child.name.toLocaleLowerCase('vi').includes(normalized) || child.code.toLocaleLowerCase('vi').includes(normalized));
      return `<div class="m4-tree-group">
        <button type="button" class="m4-tree-group-row ${activeGroup === group.id ? 'selected' : ''}" data-action="m4-toggle-group" data-group="${esc(group.id)}">
          <span class="m4-tree-caret">${opened ? '⌄' : '›'}</span>${icon(group.icon || 'folder-fill')}<b>${index + 1}. ${esc(group.name)}</b><em>${group.count}</em>
        </button>
        <div class="m4-tree-children" ${opened ? '' : 'hidden'}>${children.map(child => `<button type="button" class="m4-tree-child ${activeSeuId === child.id ? 'active' : ''}" data-action="m4-select-seu" data-id="${esc(child.id)}">
          ${icon('file-earmark-text')}<span><small>${esc(child.code)}:</small> ${esc(child.name)}</span>
        </button>`).join('')}</div>
      </div>`;
    }).join('')}</div>
  </div>`);
}

function metricDefinition() {
  return (data().enpi?.metrics || []).find(item => item.id === activeMetric) || data().enpi?.metrics?.[0] || { label: 'SEC - Điện năng / tấn clinker', unit: 'kWh/tấn', factor: 1 };
}

function metricValue(value) {
  return +(Number(value || 0) * Number(metricDefinition().factor || 1)).toFixed(metricDefinition().digits ?? 1);
}

function renderMetricOptions() {
  const options = data().enpi?.metrics || [];
  const html = options.map(item => `<option value="${esc(item.id)}" ${item.id === activeMetric ? 'selected' : ''}>${esc(item.label)} (${esc(item.unit)})</option>`).join('');
  render('#m4-enpi-metric', html);
  render('#m4-trend-metric', html);
  $('#m4-enpi-unit').textContent = metricDefinition().unit || '';
}

function renderEnpiTable() {
  const metric = metricDefinition();
  const periodSelect = $('#m4-period');
  const periodLabel = periodSelect?.selectedOptions?.[0]?.textContent || data().enpi?.period || 'Tháng 06/2025';
  const title = $('#m4-enpi-title');
  if (title) title.textContent = `Chỉ số EnPI theo SEU (${periodLabel})`;
  const rows = filteredRows();
  const body = rows.map((item,index) => {
    const actual = metricValue(item.enpi);
    const baseline = metricValue(item.baseline);
    const delta = actual - baseline;
    const percent = baseline ? delta / baseline * 100 : 0;
    const status = delta <= 0 ? 'Tốt' : 'Cần chú ý';
    const selected = activeSeuId === item.id ? 'selected' : '';
    return `<tr class="${selected}" data-action="m4-select-seu" data-id="${esc(item.id)}">
      <td>${index + 1}</td><td><b>${esc(item.name)}</b></td><td>${fmt(item.production)}</td><td>${fmt(item.energy)}</td>
      <td class="m4-enpi-value">${fmt(actual, metric.digits ?? 1)}</td><td>${fmt(baseline, metric.digits ?? 1)}</td>
      <td class="${deltaClass(delta)}"><b>${delta >= 0 ? '+' : ''}${fmt(delta, metric.digits ?? 1)}</b> (${percent >= 0 ? '+' : ''}${fmt(percent,1)}%)</td>
      <td class="${deltaClass(delta)} m4-trend-arrow">${deltaArrow(delta)}</td>
      <td><span class="m4-status ${delta <= 0 ? 'good' : 'warn'}"><i class="bi bi-${delta <= 0 ? 'check-circle-fill' : 'exclamation-circle-fill'}"></i> ${status}</span></td>
    </tr>`;
  }).join('');

  render('#m4-enpi-table', `<div class="table-wrap"><table class="m4-enpi-table"><thead><tr>
    <th>STT</th><th>SEU</th><th>Sản lượng<br>(tấn)</th><th>Điện năng<br>(kWh)</th><th>EnPI<br>(${esc(metric.unit)})</th><th>Đường cơ sở<br>EnB</th><th>Chênh lệch</th><th>Xu hướng</th><th>Trạng thái</th>
  </tr></thead><tbody>${body || `<tr><td colspan="9" class="empty">Không có SEU phù hợp với bộ lọc.</td></tr>`}</tbody></table></div>`);
}

function selectedRow() {
  return (data().enpi?.rows || []).find(item => item.id === activeSeuId) || data().enpi?.rows?.[0];
}

function scaledSeries(values) {
  const factor = Number(metricDefinition().factor || 1);
  return (values || []).map(value => +(Number(value) * factor).toFixed(metricDefinition().digits ?? 1));
}

function renderTrend() {
  const selected = selectedRow();
  const trend = data().trend || {};
  if (!selected) return;
  const metric = metricDefinition();
  const baseActual = trend.bySeu?.[selected.id]?.actual || trend.actual || [];
  const baseBaseline = trend.bySeu?.[selected.id]?.baseline || trend.baseline || [];
  const targetBase = trend.bySeu?.[selected.id]?.target ?? selected.target ?? trend.target ?? 130;
  const categories = trend.categories || [];
  const period = $('#m4-trend-period')?.value || '6m';
  const count = period === '12m' ? Math.min(12,categories.length) : Math.min(6,categories.length);
  const cats = categories.slice(-count);
  const actual = scaledSeries(baseActual.slice(-count));
  const baseline = scaledSeries(baseBaseline.slice(-count));
  const target = Array(count).fill(metricValue(targetBase));

  $('#m4-trend-title').textContent = `Xu hướng EnPI – ${selected.name}`;
  replaceChart('m4-trend-chart');
  chart('m4-trend-chart','line',[
    {name:'EnPI thực tế',data:actual},
    {name:'Đường cơ sở EnB',data:baseline},
    {name:'Mục tiêu',data:target}
  ],{
    categories:cats,
    height:198,
    colors:['#0a82df','#12ae80','#ef3944'],
    stroke:{width:[2.3,1.6,1.5],curve:'straight',dashArray:[0,5,5]},
    markers:{size:[3,0,0],strokeWidth:0},
    yaxis:{min:metric.chartMin || undefined,max:metric.chartMax || undefined,labels:{style:{fontSize:'8px',colors:'#7b91a4'},formatter:value=>fmt(value,metric.digits ?? 1)}},
    legend:{position:'top',horizontalAlign:'left',fontSize:'8px',markers:{width:7,height:7},itemMargin:{horizontal:8,vertical:1}}
  });

  const actualNow = metricValue(selected.enpi);
  const baselineNow = metricValue(selected.baseline);
  const delta = actualNow - baselineNow;
  const pct = baselineNow ? delta / baselineNow * 100 : 0;
  render('#m4-analysis-summary', `<div class="m4-analysis-grid">
      <span>EnPI kỳ này</span><b>${fmt(actualNow,metric.digits ?? 1)} ${esc(metric.unit)}</b>
      <span>Đường cơ sở (EnB)</span><b>${fmt(baselineNow,metric.digits ?? 1)} ${esc(metric.unit)}</b>
      <span>Chênh lệch</span><b class="${deltaClass(delta)}">${delta >= 0 ? '+' : ''}${fmt(delta,metric.digits ?? 1)} (${pct >= 0 ? '+' : ''}${fmt(pct,1)}%)</b>
    </div>
    <div class="m4-causes"><strong>Nguyên nhân chính</strong><ul>${(selected.causes || []).map(item => `<li>${esc(item)}</li>`).join('')}</ul></div>`);
}

function renderCompareFilters() {
  const rowOptions = (data().enpi?.rows || []).map(item => `<option value="${esc(item.id)}">${esc(item.name)}</option>`).join('');
  render('#m4-compare-filters', `<label>Chọn SEU<select id="m4-compare-seu"><option value="all">Toàn nhà máy</option>${rowOptions}</select></label>
    <label>EnPI<select id="m4-compare-metric"><option value="sec-electric">SEC - kWh/tấn clinker</option></select></label>
    <label>Loại so sánh<select id="m4-compare-type"><option value="month">Theo tháng</option><option value="baseline">So với EnB</option></select></label>`);
}

function renderCompareChart() {
  const compare = data().comparison || {};
  const seuId = $('#m4-compare-seu')?.value || 'all';
  const source = compare.bySeu?.[seuId] || compare.overall || { actual:[],baseline:[] };
  replaceChart('m4-compare-chart');
  chart('m4-compare-chart','bar',[
    {name:'EnPI thực tế',data:source.actual || []},
    {name:'Đường cơ sở EnB',data:source.baseline || []}
  ],{
    categories:compare.categories || [],
    height:190,
    colors:['#168fe5','#31b987'],
    plotOptions:{bar:{columnWidth:'52%',borderRadius:1}},
    dataLabels:{enabled:true,style:{fontSize:'8px',colors:['#205071']},offsetY:-8,formatter:value=>fmt(value,0)},
    legend:{position:'top',horizontalAlign:'right',fontSize:'8px'},
    yaxis:{min:400,max:1000,tickAmount:3,labels:{style:{fontSize:'8px',colors:'#7b91a4'},formatter:value=>fmt(value,0)}}
  });
}

function renderPotential() {
  const rows = data().potential || [];
  render('#m4-potential-table', `<div class="table-wrap"><table class="m4-small-table"><thead><tr><th>STT</th><th>SEU</th><th>EnPI<br>hiện tại</th><th>EnPI mục<br>tiêu</th><th>Tiềm năng<br>(%)</th><th>Tiềm năng<br>(kWh/tháng)</th></tr></thead><tbody>${rows.map((item,index)=>`<tr><td>${index+1}</td><td><b>${esc(item.name)}</b></td><td>${fmt(item.current,1)}</td><td>${fmt(item.target,1)}</td><td class="bad"><b>${fmt(item.potential,1)}%</b></td><td>${fmt(item.saving)}</td></tr>`).join('')}</tbody></table></div>`);
}

function renderPerformance() {
  const rows = data().performance || [];
  render('#m4-performance-table', `<div class="table-wrap"><table class="m4-small-table"><thead><tr><th>Chỉ số</th><th>Giá trị</th><th>Đơn vị</th><th>So với kỳ trước</th></tr></thead><tbody>${rows.map(item=>`<tr><td>${esc(item.name)}</td><td><b>${esc(item.value)}</b></td><td>${esc(item.unit)}</td><td class="good"><b>▼ ${fmt(item.change,1)}%</b></td></tr>`).join('')}</tbody></table></div>`);
}

function applyUnitFilter(value) {
  activeGroup = value || 'all';
  renderTree();
  renderEnpiTable();
}

function focusSection(tab) {
  const target = tab === 'Danh sách SEU' ? $('.m4-enpi-panel')
    : tab === 'EnPI chi tiết' || tab === 'Phân tích xu hướng' ? $('.m4-trend-panel')
      : tab === 'Đường cơ sở năng lượng (EnB)' || tab === 'So sánh & Benchmark' ? $('.m4-compare-panel')
        : null;
  target?.scrollIntoView({behavior:'smooth',block:'start'});
}

function exportExcel() {
  const XLSX = window.XLSX;
  if (!XLSX) { toast('Thư viện XLSX chưa được tải.'); return true; }
  const metric = metricDefinition();
  const rows = data().enpi?.rows || [];
  const aoa = [
    ['BÁO CÁO SEU & EnPI - NHÀ MÁY XI MĂNG LAM THẠCH II'],
    ['Kỳ dữ liệu','Tháng 06/2025'],
    ['EnPI',metric.label,metric.unit],
    [],
    ['STT','SEU','Sản lượng (tấn)','Điện năng (kWh)',`EnPI (${metric.unit})`,'Đường cơ sở EnB','Chênh lệch','Trạng thái'],
    ...rows.map((item,index)=>{
      const current=metricValue(item.enpi), base=metricValue(item.baseline), delta=current-base;
      return [index+1,item.name,item.production,item.energy,current,base,delta,delta<=0?'Tốt':'Cần chú ý'];
    })
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{wch:6},{wch:24},{wch:16},{wch:18},{wch:16},{wch:18},{wch:16},{wch:14}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'SEU EnPI');
  XLSX.writeFile(wb,'ENMS_M4_SEU_EnPI_2025-06.xlsx');
  toast('Đã xuất báo cáo EnPI.');
  return true;
}

function renderAll() {
  renderViewTabs();
  renderKpis();
  renderMetricOptions();
  renderTree();
  renderEnpiTable();
  renderTrend();
  renderCompareFilters();
  renderCompareChart();
  renderPotential();
  renderPerformance();
}

export async function mount() {
  document.querySelector('.page-heading h1').textContent = 'M4 – SEU & EnPI';
  renderAll();
}

export async function onTab(group,value) {
  if (group !== 'm4-view') return false;
  activeTab = value;
  focusSection(value);
  return true;
}

export async function onInput(target) {
  if (target.id !== 'm4-tree-search') return false;
  renderTree(target.value);
  return true;
}

export async function onChange(target) {
  if (target.id === 'm4-enpi-metric' || target.id === 'm4-trend-metric') {
    activeMetric = target.value;
    renderMetricOptions();
    renderEnpiTable();
    renderTrend();
    return true;
  }
  if (target.id === 'm4-trend-period') { renderTrend(); return true; }
  if (target.id === 'm4-period') { renderEnpiTable(); renderTrend(); renderCompareChart(); return true; }
  if (target.id === 'm4-compare-seu' || target.id === 'm4-compare-type') { renderCompareChart(); return true; }
  if (target.id === 'm4-unit-filter') { applyUnitFilter(target.value); return true; }
  return false;
}

export async function onAction(name,target) {
  if (name === 'm4-toggle-group') {
    const group = target.dataset.group;
    if (expandedGroups.has(group)) expandedGroups.delete(group); else expandedGroups.add(group);
    activeGroup = group;
    const shellFilter = $('#m4-unit-filter'); if (shellFilter) shellFilter.value = group;
    renderTree(); renderEnpiTable();
    return true;
  }
  if (name === 'm4-filter-group') {
    activeGroup = target.dataset.group || 'all';
    const shellFilter = $('#m4-unit-filter'); if (shellFilter) shellFilter.value = activeGroup;
    renderTree(); renderEnpiTable();
    return true;
  }
  if (name === 'm4-select-seu') {
    activeSeuId = target.dataset.id;
    const row = selectedRow();
    if (row?.group) {
      activeGroup = 'all';
      const shellFilter = $('#m4-unit-filter'); if (shellFilter) shellFilter.value = 'all';
    }
    renderTree(); renderEnpiTable(); renderTrend();
    return true;
  }
  if (name === 'm4-open-savings') {
    window.location.href = `${location.pathname.includes('/preview/') ? '/enms/preview' : '/enms'}/savings`;
    return true;
  }
  if (name === 'm4-config-enpi') {
    window.EnmsCommon?.showDialog('Cấu hình EnPI / EnB', `<p>Module cấu hình đã được chuẩn bị cho bước kết nối dữ liệu thực.</p><div class="mini-stats" style="margin-top:14px"><div class="mini-stat">SEU cấu hình<b>${fmt(data().structure?.total || 0)}</b></div><div class="mini-stat">EnPI đang dùng<b>${esc(metricDefinition().unit)}</b></div><div class="mini-stat">Kỳ cơ sở<b>2025</b></div></div>`);
    return true;
  }
  if (name === 'm4-export-enpi' || name === 'export-module') return exportExcel();
  return false;
}
