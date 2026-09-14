import { state } from '../core/state.js';
import { $, esc, fmt, render, toast, download } from '../core/dom.js';
import { chart, replaceChart } from '../core/charts.js';
import { icon } from '../components/ui.js';

let activeTab = 'Tổng quan';

function data() { return state.module || {}; }

function renderTabs() {
  render('#m7-tabs', `<div class="tabs" role="tablist">${(data().viewTabs || []).map(item => `<button class="tab ${item===activeTab?'active':''}" role="tab" aria-selected="${item===activeTab}" data-tab="m7-view" data-value="${esc(item)}">${esc(item)}</button>`).join('')}</div>`);
}

function renderKpis() {
  render('#m7-kpis', (data().kpis || []).map(item => `<article class="m7-kpi ${esc(item.tone || 'blue')}">
    <span class="m7-kpi-icon">${icon(item.icon)}</span>
    <div class="m7-kpi-content"><div class="m7-kpi-label">${esc(item.label)}</div><div class="m7-kpi-value">${esc(item.value)}${item.unit ? ` <small>${esc(item.unit)}</small>` : ''}</div>${item.progress != null ? `<div class="m7-kpi-progress"><i style="width:${Math.min(100,item.progress)}%"></i></div>` : ''}<div class="m7-kpi-note">${item.delta ? `<b>${esc(item.delta)}</b>` : ''}${item.context ? ` <span>${esc(item.context)}</span>` : ''}</div></div>
  </article>`).join(''));
}

function statusBadge(item) {
  const glyph = item.statusKey === 'done' ? 'check-circle-fill' : item.statusKey === 'ongoing' ? 'clock-fill' : item.statusKey === 'prep' ? 'circle-fill' : 'plus-circle-fill';
  return `<span class="m7-status ${esc(item.statusKey)}">${icon(glyph)} ${esc(item.status)}</span>`;
}

function filteredProjects() {
  const status = document.querySelector('#m7-status')?.value || 'all';
  return (data().projects || []).filter(item => status === 'all' || item.statusKey === status);
}

function renderProjects() {
  render('#m7-projects-table', `<div class="table-wrap"><table class="m7-projects-table"><thead><tr><th>STT</th><th>Mã GP</th><th>Tên giải pháp</th><th>Khu vực</th><th>Tiềm năng<br>(MWh/năm)</th><th>Tiết kiệm thực tế<br>(MWh/năm)</th><th>Tỷ lệ<br>(%)</th><th>Chi phí đầu tư<br>(tỷ VND)</th><th>Thời gian<br>hoàn vốn</th><th>Trạng thái</th></tr></thead><tbody>${filteredProjects().map((item,index)=>`<tr><td>${index+1}</td><td><b>${esc(item.id)}</b></td><td>${esc(item.name)}</td><td>${esc(item.area)}</td><td>${fmt(item.potential)}</td><td>${item.actual == null ? '–' : fmt(item.actual)}</td><td class="${item.ratio == null ? '' : item.ratio >= 90 ? 'good' : 'warn'}">${item.ratio == null ? '–' : `${item.ratio}%`}</td><td>${fmt(item.investment,1)}</td><td>${esc(item.payback)}</td><td>${statusBadge(item)}</td></tr>`).join('')}</tbody></table></div>`);
}

function renderProgress() {
  const summary = data().progressSummary || { total:0, items:[] };
  render('#m7-progress', `<div class="m7-progress-layout"><div id="m7-progress-chart"></div><div class="m7-progress-legend">${summary.items.map(item=>`<div><i class="${esc(item.tone)}"></i><span>${esc(item.label)}</span><b>${item.value} <small>(${item.percent}%)</small></b></div>`).join('')}</div></div>`);
  replaceChart('m7-progress-chart');
  chart('m7-progress-chart','donut',summary.items.map(x=>x.value),{
    height:190,
    labels:summary.items.map(x=>x.label),
    colors:['#12aa79','#ffad19','#178ce5','#7f56d9'],
    legend:{show:false},stroke:{width:1,colors:['#fff']},dataLabels:{enabled:false},
    plotOptions:{pie:{donut:{size:'66%',labels:{show:true,name:{show:true,fontSize:'10px',offsetY:18,formatter:()=> 'giải pháp'},value:{show:true,fontSize:'21px',fontWeight:700,offsetY:-12,formatter:()=>String(summary.total)},total:{show:false}}}}}
  });
}

function renderIpmpv() {
  const tones=['blue','green','orange','purple'];
  render('#m7-ipmvp-steps', `<div class="m7-ipmvp">${(data().ipmvpSteps || []).map((step,index)=>`<article class="${tones[index] || 'blue'}"><header><b>${index+1}. ${esc(step.title)}</b><span>${index < 3 ? icon('arrow-right') : ''}</span></header><ul>${step.items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}</div>`);
}

function renderYearlyImpact() {
  const spec = data().yearlyImpact || {};
  replaceChart('m7-yearly-impact');
  chart('m7-yearly-impact','line',[
    {name:'Sản lượng tiết kiệm (MWh)',type:'column',data:spec.energy || []},
    {name:'Giá trị tiết kiệm (tỷ VND)',type:'line',data:spec.value || []}
  ],{
    height:240,categories:spec.categories || [],colors:['#1db07c','#087ee0'],
    stroke:{width:[0,2.4],curve:'straight'},markers:{size:[0,3],strokeWidth:0},
    plotOptions:{bar:{columnWidth:'42%',borderRadius:2}},
    dataLabels:{enabled:true,enabledOnSeries:[1],offsetY:-8,style:{fontSize:'8px',colors:['#174f72']},formatter:v=>fmt(v,1)},
    yaxis:[{title:{text:'MWh/năm',style:{fontSize:'8px'}},labels:{style:{fontSize:'8px'},formatter:v=>fmt(v)}},{opposite:true,title:{text:'Tỷ VND',style:{fontSize:'8px'}},labels:{style:{fontSize:'8px'},formatter:v=>fmt(v,1)}}],
    legend:{position:'top',horizontalAlign:'left',fontSize:'8px'}
  });
}

function renderMvResults() {
  render('#m7-mv-results', `<div class="table-wrap"><table class="m7-results-table"><thead><tr><th>Mã GP</th><th>Khu vực</th><th>Phương pháp M&V</th><th>Thời gian đo</th><th>Tiết kiệm<br>(MWh/năm)</th><th>Tiết kiệm<br>(tỷ VND/năm)</th><th>Giảm CO₂<br>(tấn/năm)</th><th>Ghi chú</th></tr></thead><tbody>${(data().mvResults || []).map(item=>`<tr><td><b>${esc(item.id)}</b></td><td>${esc(item.area)}</td><td>${esc(item.method)}</td><td>${esc(item.period)}</td><td>${fmt(item.energy)}</td><td>${fmt(item.value,2)}</td><td>${fmt(item.co2)}</td><td><span class="m7-verified">${esc(item.note)}</span></td></tr>`).join('')}</tbody></table></div>`);
}

function renderContribution() {
  const items = data().contribution || [];
  render('#m7-contribution', `<div class="m7-contribution-layout"><div id="m7-contribution-chart"></div><div class="m7-contribution-legend">${items.map(item=>`<div><i style="background:${esc(item.color)}"></i><span>${esc(item.label)}</span><b>${item.value}%</b></div>`).join('')}</div></div>`);
  replaceChart('m7-contribution-chart');
  chart('m7-contribution-chart','donut',items.map(x=>x.value),{height:180,labels:items.map(x=>x.label),colors:items.map(x=>x.color),legend:{show:false},stroke:{width:1,colors:['#fff']},dataLabels:{enabled:false},plotOptions:{pie:{donut:{size:'66%',labels:{show:true,name:{show:true,fontSize:'9px',offsetY:20,formatter:()=> 'MWh/năm'},value:{show:true,fontSize:'19px',fontWeight:700,offsetY:-12,formatter:()=>esc(data().totalSaving || '3,760')},total:{show:false}}}}}});
}

function renderRecommendations() {
  render('#m7-recommendations', `<div class="m7-rec-list">${(data().recommendations || []).map((item,index)=>`<button data-action="m7-recommendation" data-index="${index}"><b>${index+1}</b><span>${esc(item)}</span>${icon('chevron-right')}</button>`).join('')}</div>`);
}

function exportProjects() {
  const XLSX = window.XLSX;
  if (!XLSX) { toast('Thư viện XLSX chưa được tải.'); return true; }
  const rows = data().projects || [];
  const aoa = [
    ['M7 - TIẾT KIỆM NĂNG LƯỢNG & M&V - NHÀ MÁY XI MĂNG LAM THẠCH II'],['Năm','2025'],[],
    ['STT','Mã GP','Tên giải pháp','Khu vực','Tiềm năng (MWh/năm)','Tiết kiệm thực tế (MWh/năm)','Tỷ lệ (%)','Chi phí đầu tư (tỷ VND)','Thời gian hoàn vốn','Trạng thái'],
    ...rows.map((x,i)=>[i+1,x.id,x.name,x.area,x.potential,x.actual ?? '',x.ratio ?? '',x.investment,x.payback,x.status])
  ];
  const ws = XLSX.utils.aoa_to_sheet(aoa); ws['!cols']=[{wch:6},{wch:12},{wch:34},{wch:16},{wch:18},{wch:22},{wch:10},{wch:20},{wch:16},{wch:18}];
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Giai phap'); XLSX.writeFile(wb,'ENMS_M7_Tiet_kiem_nang_luong_MV.xlsx');
  toast('Đã xuất danh mục giải pháp M&V.'); return true;
}

function focusTab(value) {
  const map = {'Danh mục giải pháp':'.m7-projects-panel','M&V chi tiết':'.m7-mv-process-panel','Kết quả & Lợi ích':'.m7-results-panel','Bài học & Nhân rộng':'.m7-next-panel'};
  document.querySelector(map[value] || '.m7-projects-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
}

export async function mount() {
  document.querySelector('.page-heading h1').textContent='M7 - TIẾT KIỆM NĂNG LƯỢNG & M&V';
  renderTabs(); renderKpis(); renderProjects(); renderProgress(); renderIpmpv(); renderYearlyImpact(); renderMvResults(); renderContribution(); renderRecommendations();
}

export async function onTab(group,value) { if (group!=='m7-view') return false; activeTab=value; focusTab(value); return true; }
export async function onChange(target) {
  if (target.id === 'm7-status') { renderProjects(); toast('Đã lọc danh mục giải pháp.'); return true; }
  if (target.id === 'm7-year') { toast('Đã áp dụng năm trên dữ liệu preview.'); return true; }
  return false;
}
export async function onAction(name,target) {
  if (name==='export-module' || name==='m7-export') return exportProjects();
  if (name==='m7-create-solution') { window.EnmsCommon?.showDialog('Đề xuất giải pháp tiết kiệm năng lượng', '<p>Biểu mẫu đề xuất giải pháp đã sẵn sàng để kết nối API ghi dữ liệu ở giai đoạn tích hợp PostgreSQL.</p><p class="muted">Các trường dự kiến: khu vực, mô tả giải pháp, baseline, tiềm năng, CAPEX, ROI, phương pháp M&V.</p>'); return true; }
  if (name==='m7-recommendation') { const item=(data().recommendations||[])[Number(target.dataset.index)]; window.EnmsCommon?.showDialog('Khuyến nghị & Hành động tiếp theo', `<p>${esc(item || '')}</p><p class="muted">Có thể liên kết hành động này với M5 - Mục tiêu & Hành động khi dùng dữ liệu thực.</p>`); return true; }
  return false;
}
