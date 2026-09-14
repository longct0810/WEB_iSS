import { state } from '../core/state.js';
import { esc, fmt, render, toast, download } from '../core/dom.js';
import { chart, replaceChart } from '../core/charts.js';
import { icon } from '../components/ui.js';

let activeTab = 'Tổng quan';
let activeMetric = 'sec';
const data = () => state.module || {};

function renderTabs() {
  render('#m9-tabs', `<div class="tabs" role="tablist">${(data().viewTabs || []).map(item => `<button class="tab ${item===activeTab?'active':''}" role="tab" aria-selected="${item===activeTab}" data-tab="m9-view" data-value="${esc(item)}">${esc(item)}</button>`).join('')}</div>`);
}

function renderKpis() {
  render('#m9-kpis', (data().kpis || []).map(item => `<article class="m9-kpi ${esc(item.tone || 'blue')}">
    <span class="m9-kpi-icon">${icon(item.icon)}</span>
    <div class="m9-kpi-content"><div class="m9-kpi-label">${esc(item.label)}</div><div class="m9-kpi-value">${esc(item.value)}${item.unit ? ` <small>${esc(item.unit)}</small>` : ''}</div><div class="m9-kpi-note">${item.delta ? `<b>${esc(item.delta)}</b>` : ''}${item.context ? ` <span>${esc(item.context)}</span>` : ''}</div></div>
  </article>`).join(''));
}

function reportStatus(item) {
  const glyph = item.statusKey === 'done' ? 'check-circle-fill' : item.statusKey === 'pending' ? 'clock-fill' : 'dash-circle-fill';
  return `<span class="m9-report-status ${esc(item.statusKey)}">${icon(glyph)} ${esc(item.status)}</span>`;
}

function renderPeriodicReports() {
  render('#m9-periodic-reports', `<div class="table-wrap"><table class="m9-periodic-table"><thead><tr><th>STT</th><th>Tên báo cáo</th><th>Tần suất</th><th>Kỳ báo cáo gần nhất</th><th>Trạng thái</th><th>Thao tác</th></tr></thead><tbody>${(data().periodicReports || []).map((item,index)=>`<tr><td>${index+1}</td><td><b>${esc(item.name)}</b></td><td>${esc(item.frequency)}</td><td>${esc(item.latest)}</td><td>${reportStatus(item)}</td><td><span class="m9-actions"><button class="pdf" data-action="m9-download-report" data-format="pdf" data-id="${esc(item.id)}" title="PDF">${icon('file-earmark-pdf-fill')}</button><button class="xlsx" data-action="m9-download-report" data-format="xlsx" data-id="${esc(item.id)}" title="Excel">${icon('file-earmark-excel-fill')}</button><button data-action="m9-view-report" data-id="${esc(item.id)}" title="Xem">${icon('eye-fill')}</button></span></td></tr>`).join('')}</tbody></table></div>`);
}

function renderTrendTabs() {
  const metrics = data().trend?.metrics || {};
  render('#m9-trend-tabs', Object.entries(metrics).map(([key,item])=>`<button class="${key===activeMetric?'active':''}" data-action="m9-trend-metric" data-metric="${esc(key)}">${esc(item.label)}</button>`).join(''));
}

function renderTrend() {
  const spec = data().trend || {};
  const metric = spec.metrics?.[activeMetric];
  if (!metric) return;
  renderTrendTabs();
  replaceChart('m9-trend-chart');
  chart('m9-trend-chart','line',[
    {name:'Giá trị thực tế',type:'column',data:metric.actual},
    {name:'Kế hoạch',type:'line',data:metric.plan},
    {name:'Trung bình 2024',type:'line',data:metric.average}
  ],{
    height:205,categories:spec.categories || [],colors:['#20ad79','#0c87df','#f5a117'],
    stroke:{width:[0,2,2],curve:'straight',dashArray:[0,4,4]},markers:{size:[0,2,2],strokeWidth:0},
    plotOptions:{bar:{columnWidth:'52%',borderRadius:2}},legend:{position:'top',horizontalAlign:'left',fontSize:'8px'},
    annotations:{points:[{x:(spec.categories||[]).at(-1),y:metric.actual.at(-1),marker:{size:0},label:{text:`${metric.improvement}\n${metric.context}`,borderColor:'#aee7cb',style:{background:'#eaf9f2',color:'#088f66',fontSize:'8px'}}}]},
    yaxis:{labels:{style:{fontSize:'8px'},formatter:v=>activeMetric==='co2'?Number(v).toFixed(3):fmt(v,0)}}
  });
}

function renderCategories() {
  const items = data().categories || [];
  render('#m9-report-categories', `<div class="m9-category-layout"><div id="m9-category-chart"></div><div class="m9-category-legend">${items.map(item=>`<div><i style="background:${esc(item.color)}"></i><span>${esc(item.label)}</span><b>${item.value} <small>(${item.percent}%)</small></b></div>`).join('')}</div></div>`);
  replaceChart('m9-category-chart');
  chart('m9-category-chart','donut',items.map(x=>x.value),{height:190,labels:items.map(x=>x.label),colors:items.map(x=>x.color),legend:{show:false},stroke:{width:1,colors:['#fff']},dataLabels:{enabled:false},plotOptions:{pie:{donut:{size:'66%',labels:{show:true,name:{show:true,fontSize:'9px',offsetY:18,formatter:()=> 'báo cáo'},value:{show:true,fontSize:'20px',fontWeight:700,offsetY:-12,formatter:()=>String(items.reduce((n,x)=>n+x.value,0))},total:{show:false}}}}}});
}

function renderTemplates() {
  render('#m9-templates', `<div class="m9-template-grid">${(data().reportTemplates || []).map((item,index)=>`<article class="m9-template"><div class="m9-cover"><div class="m9-cover-title">${esc(item.name)}<br><small>${esc(item.period)}</small></div><img src="/enms/assets/factory.png" alt=""><span class="m9-cover-badge">LAM THẠCH II · ${index===3?'ISO 50001':'INFRAS CONSULT'}</span></div><footer><button class="btn" data-action="m9-template-download" data-index="${index}">${icon('file-earmark-pdf-fill')} Tải PDF</button></footer></article>`).join('')}</div>`);
}

function renderEsgReports() {
  render('#m9-esg-reports', `<div class="table-wrap"><table class="m9-esg-table"><thead><tr><th>STT</th><th>Hạng mục</th><th>Chỉ số chính</th><th>Tần suất</th><th>Trạng thái</th></tr></thead><tbody>${(data().esgReports || []).map((item,index)=>`<tr><td>${index+1}</td><td><b>${esc(item.category)}</b></td><td>${esc(item.indicator)}</td><td>${esc(item.frequency)}</td><td>${reportStatus(item)}</td></tr>`).join('')}</tbody></table></div>`);
}

function renderExportConfig() {
  const cfg=data().exportConfig || {};
  render('#m9-export-config', `<div class="m9-export-form">
    <label>Loại báo cáo<select id="m9-export-type">${(cfg.types||[]).map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>
    <label>Định dạng<select id="m9-export-format">${(cfg.formats||[]).map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>
    <label>Khoảng thời gian<select id="m9-export-period">${(cfg.periods||[]).map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>
    <div class="m9-export-checks"><label><input type="checkbox" id="m9-inc-chart" ${cfg.includeCharts?'checked':''}> Bao gồm biểu đồ</label><label><input type="checkbox" id="m9-inc-compare" ${cfg.includeComparison?'checked':''}> Bao gồm phân tích so sánh</label><label><input type="checkbox" id="m9-inc-data" ${cfg.includeData?'checked':''}> Đính kèm dữ liệu chi tiết</label></div>
    <button class="btn primary" data-action="m9-export-custom">${icon('download')} Xuất báo cáo</button>
  </div>`);
}

function renderHistory() {
  render('#m9-history', `<div class="table-wrap"><table class="m9-history-table"><thead><tr><th>Thời gian</th><th>Tên báo cáo</th><th>Người tạo</th><th>Định dạng</th><th>Dung lượng</th><th>Thao tác</th></tr></thead><tbody>${(data().history || []).map((item,index)=>`<tr><td>${esc(item.time)}</td><td>${esc(item.name)}</td><td>${esc(item.creator)}</td><td>${esc(item.format)}</td><td>${esc(item.size)}</td><td><button class="icon-button" data-action="m9-history-download" data-index="${index}" title="Tải xuống">${icon('download')}</button></td></tr>`).join('')}</tbody></table></div>`);
}

function renderNotifications() {
  render('#m9-notifications', `<div class="m9-notice-list">${(data().notifications || []).map(item=>`<div class="m9-notice-item ${esc(item.level)}">${icon(item.icon)}<span>${esc(item.text)}</span></div>`).join('')}</div>`);
}

function renderSharing() {
  render('#m9-sharing', `<div class="m9-sharing-list">${(data().sharing || []).map((item,index)=>`<button class="m9-share-item" data-action="m9-share" data-index="${index}">${icon(item.icon)}<span>${esc(item.text)}</span></button>`).join('')}</div>`);
}

function createExcel(name='ENMS_M9_Bao_cao_quan_tri.xlsx') {
  const XLSX=window.XLSX;
  if(!XLSX){toast('Thư viện XLSX chưa được tải.');return;}
  const rows=data().periodicReports||[];
  const aoa=[['M9 - BÁO CÁO & DASHBOARD QUẢN TRỊ'],['Nhà máy','Nhà máy Xi măng Lam Thạch II'],['Kỳ','Tháng 06/2025'],[],['STT','Tên báo cáo','Tần suất','Kỳ gần nhất','Trạng thái'],...rows.map((x,i)=>[i+1,x.name,x.frequency,x.latest,x.status])];
  const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!cols']=[{wch:7},{wch:38},{wch:16},{wch:18},{wch:18}];const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Bao cao');XLSX.writeFile(wb,name);
}

function focusTab(value){const map={'Báo cáo định kỳ':'.m9-periodic-panel','Dashboard điều hành':'.m9-trend-panel','Báo cáo ISO 50001':'.m9-template-panel','Báo cáo ESG':'.m9-esg-panel','Tùy chỉnh báo cáo':'.m9-export-panel'};document.querySelector(map[value]||'.m9-periodic-panel')?.scrollIntoView({behavior:'smooth',block:'start'});}

export async function mount(){document.querySelector('.page-heading h1').textContent='M9 - BÁO CÁO & DASHBOARD QUẢN TRỊ';renderTabs();renderKpis();renderPeriodicReports();renderTrend();renderCategories();renderTemplates();renderEsgReports();renderExportConfig();renderHistory();renderNotifications();renderSharing();}
export async function onTab(group,value){if(group!=='m9-view')return false;activeTab=value;focusTab(value);return true;}
export async function onChange(target){if(['m9-period','m9-compare'].includes(target.id)){toast('Đã cập nhật bộ lọc báo cáo trên dữ liệu preview.');return true;}return false;}
export async function onAction(name,target){
  if(name==='m9-trend-metric'){activeMetric=target.dataset.metric;renderTrend();return true;}
  if(name==='m9-create-report'){window.EnmsCommon?.showDialog('Tạo báo cáo mới','<p>Biểu mẫu tạo báo cáo đã sẵn sàng để nối API lưu cấu hình báo cáo.</p><div class="notice">Nguồn dữ liệu preview hiện chưa ghi database.</div>');return true;}
  if(name==='m9-view-report'){const item=(data().periodicReports||[]).find(x=>x.id===target.dataset.id);window.EnmsCommon?.showDialog(item?.name||'Báo cáo',`<p>Kỳ báo cáo: <b>${esc(item?.latest||'')}</b></p><p>Tần suất: ${esc(item?.frequency||'')}</p><p>Trạng thái: ${esc(item?.status||'')}</p><div class="notice">Preview báo cáo quản trị EnMS v1.1.9.</div>`);return true;}
  if(name==='m9-download-report'){const item=(data().periodicReports||[]).find(x=>x.id===target.dataset.id);if(target.dataset.format==='xlsx')createExcel(`${item?.id||'ENMS'}_Bao_cao.xlsx`);else download(`${item?.id||'ENMS'}_Bao_cao.txt`,`${item?.name||'Báo cáo'}\nKỳ: ${item?.latest||''}\nEnMS v1.1.9`, 'text/plain;charset=utf-8');toast('Đã tạo file báo cáo mẫu.');return true;}
  if(name==='m9-template-download'){const item=(data().reportTemplates||[])[Number(target.dataset.index)];download(`${item?.id||'report-template'}.txt`,`${item?.name||'Mẫu báo cáo'}\n${item?.period||''}\nEnMS v1.1.9`, 'text/plain;charset=utf-8');toast('Đã tạo mẫu báo cáo.');return true;}
  if(name==='m9-history-download'){const item=(data().history||[])[Number(target.dataset.index)];download(`Bao_cao_${Number(target.dataset.index)+1}.txt`,`${item?.name||'Báo cáo'}\n${item?.time||''}\n${item?.creator||''}`, 'text/plain;charset=utf-8');toast('Đã tạo bản lịch sử báo cáo mẫu.');return true;}
  if(name==='m9-export-custom'){const format=document.querySelector('#m9-export-format')?.value||'PDF';if(format.startsWith('Excel'))createExcel();else if(format==='PDF')window.print();else download('ENMS_M9_Bao_cao.doc.txt','Báo cáo quản trị EnMS v1.1.9\nDữ liệu preview.', 'text/plain;charset=utf-8');toast(`Đã xử lý xuất ${format}.`);return true;}
  if(name==='m9-show-templates'){window.EnmsCommon?.showDialog('Thư viện mẫu báo cáo',`<ul>${(data().reportTemplates||[]).map(x=>`<li>${esc(x.name)} – ${esc(x.period)}</li>`).join('')}</ul>`);return true;}
  if(name==='m9-share'){const item=(data().sharing||[])[Number(target.dataset.index)];toast(`${item?.text||'Chia sẻ'}: chức năng đã sẵn sàng nối API thực.`);return true;}
  return false;
}
