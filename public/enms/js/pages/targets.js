import { state } from '../core/state.js';
import { $, esc, fmt, render, toast, download } from '../core/dom.js';
import { chart, replaceChart } from '../core/charts.js';
import { icon } from '../components/ui.js';

let activeTab = 'Tổng quan';
let activeMetric = 'sec';

function data() { return state.module || {}; }

function statusBadge(item) {
  const glyph = item.statusKey === 'critical' ? 'exclamation-circle-fill' : item.statusKey === 'warning' ? 'clock-fill' : 'check-circle-fill';
  return `<span class="m5-status ${esc(item.statusKey)}">${icon(glyph)} ${esc(item.status)}</span>`;
}

function renderTabs() {
  const tabs = data().viewTabs || [];
  render('#m5-tabs', `<div class="tabs" role="tablist">${tabs.map((item,index)=>`<button class="tab ${item===activeTab?'active':''}" role="tab" aria-selected="${item===activeTab}" data-tab="m5-view" data-value="${esc(item)}">${esc(item)}</button>`).join('')}</div>`);
}

function renderKpis() {
  const tones = {blue:'',green:'green',orange:'orange',red:'red',purple:'purple'};
  render('#m5-kpis',(data().kpis || []).map(item=>`<article class="m5-kpi ${tones[item.tone] || ''}">
    <span class="m5-kpi-icon">${icon(item.icon)}</span>
    <div class="m5-kpi-content"><div class="m5-kpi-label">${esc(item.label)}</div><div class="m5-kpi-value">${esc(item.value)}${item.unit?` <small>${esc(item.unit)}</small>`:''}</div><div class="m5-kpi-note">${item.delta?`<b>${esc(item.delta)}</b>`:''}${item.context?` <span>${esc(item.context)}</span>`:''}</div></div>
  </article>`).join(''));
}

function filteredGoals() {
  const q = ($('#m5-goal-search')?.value || '').trim().toLocaleLowerCase('vi');
  const status = $('#m5-status')?.value || 'all';
  return (data().goals || []).filter(item => {
    const hay = `${item.id} ${item.name} ${item.indicator} ${item.owner}`.toLocaleLowerCase('vi');
    return (!q || hay.includes(q)) && (status === 'all' || item.statusKey === status);
  });
}

function renderGoals() {
  const rows = filteredGoals();
  render('#m5-goals-table', `<div class="table-wrap"><table class="m5-goals-table"><thead><tr>
    <th>STT</th><th>Mã mục tiêu</th><th>Nội dung mục tiêu</th><th>Chỉ số theo dõi</th><th>Mục tiêu</th><th>Hiện tại</th><th>Tiến độ</th><th>Trạng thái</th><th>Ngày hoàn thành</th><th>Owner</th>
  </tr></thead><tbody>${rows.map((item,index)=>`<tr>
    <td>${index+1}</td><td><b>${esc(item.id)}</b></td><td>${esc(item.name)}</td><td>${esc(item.indicator)}</td><td class="m5-target-value">${esc(item.target)}</td><td class="${item.statusKey==='critical'?'bad':item.statusKey==='warning'?'warn':'good'}"><b>${esc(item.current)}</b></td>
    <td><div class="m5-progress-cell"><div class="m5-progress"><span class="${esc(item.statusKey)}" style="width:${Math.min(100,item.progress)}%"></span></div><b>${esc(item.progress)}%</b></div></td>
    <td>${statusBadge(item)}</td><td>${esc(item.due)}</td><td>${esc(item.owner)}</td>
  </tr>`).join('') || '<tr><td colspan="10" class="empty">Không có mục tiêu phù hợp.</td></tr>'}</tbody></table></div>`);
}

function renderProgress() {
  const progress = data().progress || {total:0,items:[]};
  render('#m5-progress', `<div class="m5-progress-layout"><div id="m5-progress-chart"></div><div class="m5-progress-legend">${progress.items.map(item=>`<div><i class="${esc(item.tone)}"></i><span>${esc(item.label)}</span><b>${esc(item.value)} <small>(${esc(item.percent)}%)</small></b></div>`).join('')}</div></div>`);
  replaceChart('m5-progress-chart');
  chart('m5-progress-chart','donut',progress.items.map(item=>item.value),{
    height:150,
    labels:progress.items.map(item=>item.label),
    colors:['#0aaf7d','#ffad18','#ef3f55'],
    legend:{show:false},
    stroke:{width:1,colors:['#fff']},
    dataLabels:{enabled:false},
    plotOptions:{pie:{donut:{size:'65%',labels:{show:true,name:{show:false},value:{show:false},total:{show:true,showAlways:true,label:'mục tiêu',fontSize:'9px',fontWeight:500,color:'#6f8799',formatter:()=>String(progress.total)}}}}}
  });
}

function renderSavings() {
  render('#m5-savings', `<div class="m5-saving-grid">${(data().savings || []).map(item=>`<article class="m5-saving ${esc(item.tone)}"><span>${icon(item.icon)}</span><div><b>${esc(item.value)}</b><small>${esc(item.unit)}</small>${item.money?`<em>${esc(item.money)}</em>`:''}</div></article>`).join('')}</div>`);
}

function renderIsoLinks() {
  render('#m5-iso-links', `<ul class="m5-iso-list">${(data().isoLinks || []).map(item=>`<li>${icon('check-circle-fill')}<span>${esc(item)}</span></li>`).join('')}</ul>`);
}

function renderDocs() {
  render('#m5-docs', `<div class="m5-doc-list">${(data().documents || []).map(item=>`<div><span>${icon('file-earmark-text')} ${esc(item.name)}</span><button class="icon-button" title="Tải xuống" data-action="m5-download-doc" data-id="${esc(item.id)}"><i class="bi bi-download"></i></button></div>`).join('')}</div>`);
}

function metric() {
  return (data().trend?.metrics || []).find(item=>item.id===activeMetric) || data().trend?.metrics?.[0];
}

function renderTrendOptions() {
  const metrics = data().trend?.metrics || [];
  render('#m5-trend-metric', metrics.map(item=>`<option value="${esc(item.id)}" ${item.id===activeMetric?'selected':''}>${esc(item.label)}</option>`).join(''));
}

function renderTrend() {
  const spec = metric();
  if (!spec) return;
  replaceChart('m5-target-trend');
  chart('m5-target-trend','line',[
    {name:'Thực tế',data:spec.actual},
    {name:'Mục tiêu',data:spec.target},
    {name:'Kịch bản dự báo',data:spec.forecast}
  ],{
    height:205,
    categories:spec.categories,
    colors:['#0a82df','#0fb77f','#f4a619'],
    stroke:{width:[2.3,1.5,1.5],curve:'smooth',dashArray:[0,5,5]},
    markers:{size:[3,0,0],strokeWidth:0},
    legend:{position:'top',horizontalAlign:'right',fontSize:'8px'},
    annotations:{yaxis:[{y:spec.annualTarget,borderColor:'#0fb77f',strokeDashArray:4,label:{text:`Mục tiêu năm: ${spec.annualTarget}`,style:{fontSize:'8px',background:'#eaf8f3',color:'#078960'}}}]},
    yaxis:{labels:{style:{fontSize:'8px',colors:'#7890a3'},formatter:value=>Number(value).toFixed(spec.id==='thermal'?2:0)}}
  });
}

function renderActions() {
  const actions = data().actions || [];
  render('#m5-actions-table', `<div class="table-wrap"><table class="m5-actions-table"><thead><tr><th>STT</th><th>Mã hành động</th><th>Nội dung</th><th>Tiết kiệm dự kiến</th><th>Trạng thái</th></tr></thead><tbody>${actions.map((item,index)=>`<tr><td>${index+1}</td><td><b>${esc(item.id)}</b></td><td>${esc(item.name)}</td><td>${esc(item.saving)}</td><td><span class="m5-status ${esc(item.statusKey)}">${icon(item.statusKey==='info'?'circle-fill':item.statusKey==='warning'?'clock-fill':'check-circle-fill')} ${esc(item.status)}</span></td></tr>`).join('')}</tbody></table></div>`);
}

function exportGoals() {
  const XLSX = window.XLSX;
  if (!XLSX) { toast('Thư viện XLSX chưa được tải.'); return true; }
  const rows = data().goals || [];
  const aoa = [
    ['M5 - MỤC TIÊU & HÀNH ĐỘNG - NHÀ MÁY XI MĂNG LAM THẠCH II'],
    ['Năm','2025'],[],
    ['STT','Mã mục tiêu','Nội dung mục tiêu','Chỉ số theo dõi','Mục tiêu','Hiện tại','Tiến độ (%)','Trạng thái','Ngày hoàn thành','Owner'],
    ...rows.map((item,index)=>[index+1,item.id,item.name,item.indicator,item.target,item.current,item.progress,item.status,item.due,item.owner])
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws['!cols']=[{wch:6},{wch:14},{wch:34},{wch:20},{wch:12},{wch:12},{wch:13},{wch:18},{wch:17},{wch:16}];
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Muc tieu 2025');
  XLSX.writeFile(wb,'ENMS_M5_Muc_tieu_Hanh_dong_2025.xlsx');
  toast('Đã xuất báo cáo mục tiêu & hành động.');
  return true;
}

function showCreateTarget() {
  window.EnmsCommon?.showDialog('Tạo mục tiêu năng lượng mới', `<form id="m5-create-form" class="m5-dialog-form">
    <label>Nội dung mục tiêu<input name="name" required placeholder="Ví dụ: Giảm SEC nghiền liệu"></label>
    <div><label>Chỉ số theo dõi<input name="indicator" required placeholder="kWh/tấn"></label><label>Mục tiêu<input name="target" required placeholder="-5%"></label></div>
    <div><label>Ngày hoàn thành<input name="due" type="date" value="2025-12-31" required></label><label>Owner<input name="owner" placeholder="P. Sản xuất"></label></div>
    <button class="btn primary" type="submit">${icon('plus-circle')} Tạo mục tiêu</button>
  </form>`);
}

function showActions() {
  window.EnmsCommon?.showDialog('Kế hoạch hành động năm 2025', `<div class="table-wrap"><table><thead><tr><th>Mã</th><th>Nội dung</th><th>Tiết kiệm dự kiến</th><th>Trạng thái</th></tr></thead><tbody>${(data().actions||[]).map(item=>`<tr><td>${esc(item.id)}</td><td>${esc(item.name)}</td><td>${esc(item.saving)}</td><td>${esc(item.status)}</td></tr>`).join('')}</tbody></table></div>`);
}

function focusTab(value) {
  const map = {
    'Mục tiêu năng lượng':'.m5-goals-panel',
    'Kế hoạch hành động':'.m5-actions-panel',
    'Theo dõi thực hiện':'.m5-progress-panel',
    'Hiệu quả & Tiết kiệm':'.m5-saving-panel',
    'Liên quan ISO 50001':'.m5-iso-panel'
  };
  document.querySelector(map[value] || '.m5-goals-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
}

export async function mount() {
  document.querySelector('.page-heading h1').textContent='M5 - MỤC TIÊU & HÀNH ĐỘNG';
  renderTabs(); renderKpis(); renderGoals(); renderProgress(); renderSavings(); renderIsoLinks(); renderDocs(); renderTrendOptions(); renderTrend(); renderActions();
}

export async function onTab(group,value) {
  if (group !== 'm5-view') return false;
  activeTab=value; focusTab(value); return true;
}

export async function onInput(target) {
  if (target.id !== 'm5-goal-search') return false;
  renderGoals(); return true;
}

export async function onChange(target) {
  if (target.id === 'm5-trend-metric') { activeMetric=target.value; renderTrend(); return true; }
  if (target.id === 'm5-status') { renderGoals(); return true; }
  if (target.id === 'm5-year') { toast(`Đã chọn năm ${target.value}. Preview hiện sử dụng bộ dữ liệu mẫu 2025.`); return true; }
  return false;
}

export async function onAction(name,target) {
  if (name === 'm5-export-goals' || name === 'export-module') return exportGoals();
  if (name === 'm5-create-target') { showCreateTarget(); return true; }
  if (name === 'm5-show-actions') { showActions(); return true; }
  if (name === 'm5-download-doc') {
    const doc=(data().documents||[]).find(item=>item.id===target.dataset.id);
    if (!doc) return true;
    download(`${doc.id}.txt`,`${doc.name}\nNhà máy Xi măng Lam Thạch II\nBiểu mẫu demo EnMS v1.1.9`, 'text/plain;charset=utf-8');
    toast(`Đã tải ${doc.name}.`); return true;
  }
  return false;
}

export async function onSubmit(form) {
  if (form.id !== 'm5-create-form') return false;
  toast('Đã tạo mục tiêu trong chế độ preview. API ghi dữ liệu sẽ được nối ở bước tích hợp DB.');
  document.querySelector('#detail-dialog')?.close();
  return true;
}
