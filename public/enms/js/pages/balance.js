import { state } from '../core/state.js';
import { $, $$, esc, fmt, render, toast } from '../core/dom.js';
import { chart, colors, replaceChart } from '../core/charts.js';
import { icon, row, table, tabs } from '../components/ui.js';

const VIEW_TABS = ['Tổng quan','Bản đồ năng lượng','Energy Balance','Sơ đồ Sankey','Phân bổ năng lượng','So sánh theo thời gian'];
const UNIT_TABS = ['MWh','GJ','toe'];
const TABLE_TABS = ['Theo công đoạn','Theo loại năng lượng','Theo đơn vị','So sánh kỳ trước'];
const DIST_TABS = ['Công đoạn','Loại năng lượng'];
const UNIT_FACTOR = Object.freeze({ MWh:1, GJ:3.6, toe:1/11.63 });
let activeUnit = 'MWh';
let activeTable = 'Theo công đoạn';
let activeDistribution = 'Công đoạn';

function data() { return state.module || {}; }

function metricValue(value, unit = activeUnit) {
  const converted = Number(value || 0) * (UNIT_FACTOR[unit] || 1);
  if (unit === 'toe') return fmt(converted, converted < 100 ? 1 : 0);
  return fmt(converted, 0);
}

function renderViewTabs(active = 'Energy Balance') {
  render('#m3-view-tabs', tabs(VIEW_TABS, 'm3-view', active));
}

function renderKpis() {
  render('#m3-kpis', (data().kpis || []).map(item => `<article class="m3-kpi ${esc(item.tone || 'blue')}">
    <span class="m3-kpi-icon">${icon(item.icon || 'activity')}</span>
    <div class="m3-kpi-copy">
      <div class="m3-kpi-label">${esc(item.label)}</div>
      <div class="m3-kpi-value">${esc(item.value)} <small>${esc(item.unit || '')}</small></div>
      <div class="m3-kpi-note ${String(item.delta || '').includes('▲') || String(item.delta || '').includes('↑') ? 'up' : 'down'}"><strong>${esc(item.delta || '')}</strong><span>${esc(item.context || '')}</span></div>
    </div>
  </article>`).join(''));
}

function sourceIcon(kind) {
  return ({ electricity:'lightning-charge-fill', coal:'fire', oil:'droplet-fill', steam:'wind', water:'droplet-half' })[kind] || 'activity';
}

function processIcon(kind) {
  return ({ raw:'cloud-haze2-fill', kiln:'building', cement:'gear-fill', packing:'building-fill', common:'fan' })[kind] || 'activity';
}

function lossIcon(kind) {
  return ({ heat:'fire', surface:'info-circle-fill', other:'cash-stack' })[kind] || 'exclamation-circle-fill';
}

function renderEnergyBalance() {
  const balance = data().energyBalance || {};
  render('#m3-unit-tabs', tabs(UNIT_TABS, 'm3-unit', activeUnit));
  const inputs = balance.inputs || [];
  const processes = balance.processes || [];
  const outputs = balance.usefulOutputs || [];
  const losses = balance.losses || [];

  const sourceRows = inputs.map(item => `<article class="m3-flow-row source ${esc(item.kind)}">
    <span class="m3-flow-icon">${icon(sourceIcon(item.kind))}</span>
    <div><b>${esc(item.label)}</b><strong>${metricValue(item.value)} ${esc(activeUnit)}</strong></div>
    <em>${fmt(item.share,1)}%</em>
  </article>`).join('');

  const processRows = processes.map(item => `<article class="m3-process-row ${esc(item.kind)}">
    <span class="m3-process-icon">${icon(processIcon(item.kind))}</span>
    <div><b>${esc(item.label)}</b><strong>${metricValue(item.value)} ${esc(activeUnit)}</strong><small>(${fmt(item.share,1)}%)</small></div>
  </article>`).join('');

  const outputRows = outputs.map(item => `<article class="m3-output-row">
    <span>${icon(processIcon(item.kind))}</span><div><b>${esc(item.label)}</b><strong>${metricValue(item.value)} ${esc(activeUnit)}</strong><small>(${fmt(item.share,1)}%)</small></div>
  </article>`).join('');

  const lossRows = losses.map(item => `<article class="m3-loss-row">
    <span>${icon(lossIcon(item.kind))}</span><div><b>${esc(item.label)}</b><strong>${metricValue(item.value)} ${esc(activeUnit)}</strong></div><small>(${fmt(item.share,1)}%)</small>
  </article>`).join('');

  render('#m3-energy-balance', `<div class="m3-sankey-stage">
    <svg class="m3-sankey-svg" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="m3blue" x1="0" x2="1"><stop offset="0" stop-color="#1596e8"/><stop offset="1" stop-color="#69c5f0"/></linearGradient>
        <linearGradient id="m3red" x1="0" x2="1"><stop offset="0" stop-color="#f25250"/><stop offset="1" stop-color="#f69a76"/></linearGradient>
        <linearGradient id="m3orange" x1="0" x2="1"><stop offset="0" stop-color="#ffad21"/><stop offset="1" stop-color="#ffd36c"/></linearGradient>
        <linearGradient id="m3slate" x1="0" x2="1"><stop offset="0" stop-color="#73889b"/><stop offset="1" stop-color="#b3c3cf"/></linearGradient>
        <linearGradient id="m3green" x1="0" x2="1"><stop offset="0" stop-color="#3fbe76"/><stop offset="1" stop-color="#95d5aa"/></linearGradient>
      </defs>
      <path class="band electricity" d="M248 90 C330 90 350 64 447 66"/>
      <path class="band electricity thin" d="M248 90 C335 105 360 355 447 390"/>
      <path class="band coal" d="M248 176 C332 174 360 164 447 160"/>
      <path class="band oil" d="M248 262 C330 260 363 250 447 252"/>
      <path class="band steam" d="M248 347 C328 342 360 256 447 252"/>
      <path class="band water" d="M248 430 C330 430 360 345 447 344"/>
      <path class="band water thin" d="M248 430 C336 438 367 430 447 432"/>
      <path class="band useful raw" d="M620 66 C700 65 720 112 776 126"/>
      <path class="band useful kiln" d="M620 160 C705 156 718 142 776 140"/>
      <path class="band useful cement" d="M620 252 C703 250 725 220 776 220"/>
      <path class="band useful packing" d="M620 344 C705 343 726 226 776 220"/>
      <path class="band loss heat" d="M620 160 C708 175 720 315 776 322"/>
      <path class="band loss surface" d="M620 252 C706 265 725 370 776 373"/>
      <path class="band loss other" d="M620 432 C705 432 728 426 776 426"/>
    </svg>
    <section class="m3-flow-column m3-input-column">
      <header>ĐẦU VÀO NĂNG LƯỢNG<small>(Tổng: ${metricValue(balance.inputTotal)} ${esc(activeUnit)})</small></header>${sourceRows}
    </section>
    <section class="m3-process-column">${processRows}</section>
    <section class="m3-result-column">
      <div class="m3-output-box"><header>ĐẦU RA CÓ ÍCH<small>(Tổng: ${metricValue(balance.usefulTotal)} ${esc(activeUnit)})</small></header>${outputRows}</div>
      <div class="m3-loss-box"><header>TỔN THẤT NĂNG LƯỢNG<small>(Tổng: ${metricValue(balance.lossTotal)} ${esc(activeUnit)} - ${fmt(balance.lossRate,1)}%)</small></header>${lossRows}</div>
    </section>
  </div>`);
}

function zoneTone(zone, mode) {
  if (mode === 'loss') return zone.loss > 15 ? 'red' : zone.loss > 10 ? 'orange' : 'blue';
  if (mode === 'intensity') return zone.intensity > 900 ? 'red' : zone.intensity > 700 ? 'orange' : 'blue';
  return zone.tone || 'blue';
}

function zoneValue(zone, mode) {
  if (mode === 'loss') return `${fmt(zone.loss,1)}% tổn thất`;
  if (mode === 'intensity') return `${fmt(zone.intensity,0)} kWh/t`;
  return `${fmt(zone.share,1)}%`;
}

function renderEnergyMap(mode = $('#m3-map-mode')?.value || 'area') {
  const zones = data().energyMap || [];
  const labels = zones.map(zone => `<button type="button" class="m3-map-zone ${zoneTone(zone,mode)}" style="--x:${zone.x}%;--y:${zone.y}%" data-action="m3-zone-detail" data-id="${esc(zone.id)}"><b>${esc(zone.name)}</b><strong>${esc(zoneValue(zone,mode))}</strong></button>`).join('');
  const connectors = zones.map(zone => `<line x1="${zone.x}" y1="${zone.y}" x2="${zone.targetX}" y2="${zone.targetY}" class="${zoneTone(zone,mode)}"/>`).join('');
  render('#m3-energy-map', `<img src="/enms/assets/factory.png" alt="Bản đồ năng lượng Nhà máy Xi măng Lam Thạch II">
    <svg class="m3-map-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${connectors}</svg>
    ${labels}<div class="m3-compass"><b>N</b><i></i></div><div class="m3-map-zoom"><button type="button" aria-label="Phóng to">+</button><button type="button" aria-label="Thu nhỏ">−</button></div>`);
}

function deltaClass(item) { return Number(item.delta || 0) > 0 && item.goodDirection !== 'up' ? 'bad' : 'good'; }

function renderEfficiency() {
  render('#m3-efficiency', (data().efficiency || []).map(item => `<article class="m3-efficiency-item">
    <span>${esc(item.label)}</span><b>${esc(item.value)} <small>${esc(item.unit || '')}</small></b>
    <em class="${deltaClass(item)}">${item.arrow || (Number(item.delta) > 0 ? '↑' : Number(item.delta) < 0 ? '↓' : '→')} ${Math.abs(Number(item.delta || 0)).toFixed(1)}%</em>
  </article>`).join(''));
}

function processTableRows() {
  return (data().balanceTable?.process || []).map((item,index) => row([
    `${index+1}. ${esc(item.name)}`, fmt(item.electricity), fmt(item.coal), fmt(item.oil), fmt(item.steam), fmt(item.water), `<b>${fmt(item.total)}</b>`, `${fmt(item.share,1)}`
  ]));
}

function energyTableRows() {
  return (data().balanceTable?.energy || []).map((item,index) => row([
    `${index+1}. ${esc(item.name)}`, fmt(item.input), fmt(item.useful), fmt(item.loss), `${fmt(item.lossRate,1)}%`, esc(item.note)
  ]));
}

function unitTableRows() {
  return (data().balanceTable?.unit || []).map((item,index) => row([
    index+1, esc(item.unit), fmt(item.input), fmt(item.allocated), fmt(item.unallocated), `${fmt(item.balanceRate,1)}%`, esc(item.status)
  ]));
}

function compareTableRows() {
  return (data().balanceTable?.compare || []).map((item,index) => row([
    index+1, esc(item.metric), esc(item.current), esc(item.previous), `<span class="${item.good ? 'green-text' : 'm3-bad-text'}">${esc(item.change)}</span>`, esc(item.status)
  ]));
}

function renderBalanceTable(tab = activeTable) {
  activeTable = tab;
  render('#m3-table-tabs', tabs(TABLE_TABS, 'm3-table', activeTable));
  if (tab === 'Theo loại năng lượng') {
    render('#m3-balance-table', table(['Loại năng lượng','Đầu vào (MWh)','Hữu ích (MWh)','Tổn thất (MWh)','Tỷ lệ tổn thất','Ghi chú'], energyTableRows(), 'compact m3-table'));
    return;
  }
  if (tab === 'Theo đơn vị') {
    render('#m3-balance-table', table(['STT','Đơn vị / Khu vực','Đầu vào','Đã phân bổ','Chưa phân bổ','Cân bằng','Trạng thái'], unitTableRows(), 'compact m3-table'));
    return;
  }
  if (tab === 'So sánh kỳ trước') {
    render('#m3-balance-table', table(['STT','Chỉ tiêu','Kỳ này','Kỳ trước','Thay đổi','Đánh giá'], compareTableRows(), 'compact m3-table'));
    return;
  }
  const process = data().balanceTable?.process || [];
  const totals = data().balanceTable?.totals || {};
  const rows = processTableRows();
  rows.push(`<tr class="m3-total-row"><td><b>Tổng cộng</b></td><td><b>${fmt(totals.electricity)}</b></td><td><b>${fmt(totals.coal)}</b></td><td><b>${fmt(totals.oil)}</b></td><td><b>${fmt(totals.steam)}</b></td><td><b>${fmt(totals.water)}</b></td><td><b>${fmt(totals.total)}</b></td><td><b>100.0</b></td></tr>`);
  render('#m3-balance-table', table(['Công đoạn','Điện (MWh)','Than (MWh)','Dầu (MWh)','Hơi (MWh)','Nước (MWh)','Tổng (MWh)','Tỷ lệ (%)'], rows, 'compact m3-table'));
}

function distributionPayload(mode) {
  const dist = data().distribution || {};
  return mode === 'Loại năng lượng' ? dist.energy || {} : dist.process || {};
}

function renderDistribution(mode = activeDistribution) {
  activeDistribution = mode;
  render('#m3-distribution-tabs', tabs(DIST_TABS, 'm3-dist', mode));
  const dist = distributionPayload(mode);
  replaceChart('m3-distribution-chart');
  chart('m3-distribution-chart','donut',dist.values || [],{
    height:188,
    labels:dist.labels || [],
    colors:dist.colors || colors,
    legend:{show:false},
    stroke:{width:1,colors:['#fff']},
    plotOptions:{pie:{donut:{size:'62%',labels:{show:true,name:{show:true,fontSize:'9px',offsetY:24},value:{show:true,fontSize:'17px',fontWeight:700,offsetY:-9,formatter:()=>fmt(data().energyBalance?.inputTotal || 0)},total:{show:true,showAlways:true,label:'MWh\n(Tổng đầu vào)',fontSize:'9px',color:'#536f85',formatter:()=>fmt(data().energyBalance?.inputTotal || 0)}}}}}
  });
  render('#m3-distribution-legend',(dist.labels || []).map((label,index)=>`<div><i style="background:${(dist.colors || colors)[index % (dist.colors || colors).length]}"></i><span>${esc(label)}</span><b>${fmt((dist.values || [])[index],1)}%</b></div>`).join(''));
}

function renderTrend(metric = $('#m3-trend-metric')?.value || 'lossRate') {
  const trend = data().trend || {};
  const spec = trend.metrics?.[metric] || trend.metrics?.lossRate || {label:'Tỷ lệ tổn thất năng lượng',unit:'%',data:[]};
  replaceChart('m3-trend-chart');
  chart('m3-trend-chart','line',[{name:spec.label,data:spec.data || []}],{
    height:190,
    categories:trend.categories || [],
    colors:[metric === 'lossRate' ? '#ef3f48' : '#0aa77d'],
    stroke:{width:2.4,curve:'straight'},
    markers:{size:3,strokeWidth:0},
    legend:{position:'top',horizontalAlign:'center',fontSize:'9px',markers:{width:7,height:7}},
    yaxis:{min:spec.min,max:spec.max,tickAmount:5,labels:{style:{fontSize:'8px',colors:'#7890a2'},formatter:value=>`${fmt(value,metric==='sec'?0:1)}${spec.unit === '%' ? '%' : ''}`}},
    dataLabels:{enabled:false},
    tooltip:{y:{formatter:value=>`${fmt(value,metric==='sec'?1:1)} ${spec.unit}`}}
  });
}

function renderAll() {
  renderViewTabs();
  renderKpis();
  renderEnergyBalance();
  renderEnergyMap();
  renderEfficiency();
  renderBalanceTable();
  renderDistribution();
  renderTrend();
}

function scrollToSection(selector) {
  const element = $(selector);
  element?.scrollIntoView({behavior:'smooth',block:'start'});
}

function exportExcel() {
  const XLSX = window.XLSX;
  if (!XLSX) { toast('Thư viện XLSX chưa được tải.'); return true; }
  const rows = data().balanceTable?.process || [];
  const aoa = [
    ['BẢNG CÂN ĐỐI NĂNG LƯỢNG - THÁNG 06/2025'],
    [],
    ['Công đoạn','Điện (MWh)','Than (MWh)','Dầu (MWh)','Hơi (MWh)','Nước (MWh)','Tổng (MWh)','Tỷ lệ (%)'],
    ...rows.map(item=>[item.name,item.electricity,item.coal,item.oil,item.steam,item.water,item.total,item.share])
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols'] = [{wch:26},{wch:14},{wch:14},{wch:14},{wch:14},{wch:14},{wch:15},{wch:12}];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'Energy Balance');
  XLSX.writeFile(wb,'ENMS_M3_Energy_Balance_2025-06.xlsx');
  return true;
}

export async function mount() { renderAll(); }

export async function onTab(group, value) {
  if (group === 'm3-unit') { activeUnit = value; renderEnergyBalance(); return true; }
  if (group === 'm3-table') { renderBalanceTable(value); return true; }
  if (group === 'm3-dist') { renderDistribution(value); return true; }
  if (group === 'm3-view') {
    const selector = ({
      'Tổng quan':'#m3-kpis',
      'Bản đồ năng lượng':'#m3-map-section',
      'Energy Balance':'#m3-balance-section',
      'Sơ đồ Sankey':'#m3-energy-balance',
      'Phân bổ năng lượng':'#m3-distribution-section',
      'So sánh theo thời gian':'#m3-trend-section'
    })[value];
    if (selector) scrollToSection(selector);
    return true;
  }
  return false;
}

export async function onChange(target) {
  if (target.id === 'm3-map-mode') { renderEnergyMap(target.value); return true; }
  if (target.id === 'm3-trend-metric') { renderTrend(target.value); return true; }
  if (target.id === 'period') { toast(`Đã chọn kỳ ${target.options[target.selectedIndex]?.text || target.value}. Dữ liệu preview đang dùng bộ mẫu 06/2025.`); return true; }
  if (target.id === 'balance-scenario') { toast(`Kịch bản: ${target.options[target.selectedIndex]?.text || target.value}. API scenario đã sẵn sàng để ánh xạ dữ liệu thực.`); return true; }
  return false;
}

export async function onAction(name, target) {
  if (name === 'm3-recalculate') { renderEnergyBalance(); renderEfficiency(); renderTrend(); toast('Đã tái tính Energy Balance từ bộ dữ liệu hiện tại.'); return true; }
  if (name === 'm3-export-excel' || name === 'export-module') return exportExcel();
  if (name === 'm3-efficiency-detail') { scrollToSection('#m3-table-section'); return true; }
  if (name === 'm3-zone-detail') {
    const zone = (data().energyMap || []).find(item=>item.id===target.dataset.id);
    if (zone) window.EnmsCommon?.showDialog(zone.name, `<div class="mini-stats"><div class="mini-stat">Tỷ trọng năng lượng<b>${fmt(zone.share,1)}%</b></div><div class="mini-stat">SEC khu vực<b>${fmt(zone.intensity)} kWh/t</b></div><div class="mini-stat">Tổn thất<b>${fmt(zone.loss,1)}%</b></div></div><p>Khu vực được hiển thị trên bản đồ năng lượng M3. Khi nối dữ liệu thực, các chỉ số sẽ lấy từ điểm đo và cấu hình SEU tương ứng.</p>`);
    return true;
  }
  return false;
}

export function dispose() {
  activeUnit = 'MWh';
  activeTable = 'Theo công đoạn';
  activeDistribution = 'Công đoạn';
}
