import { state } from '../core/state.js';
import { $, esc, fmt, render, toast } from '../core/dom.js';
import { chart, replaceChart } from '../core/charts.js';
import { icon } from '../components/ui.js';

let activeTab='Tổng quan';
let activeArea='all';
let activeRca='raw-sec';
let activeTrend='raw-sec';
let trendPeriod='90';

function data(){ return state.module || {}; }

function renderTabs(){
  render('#m6-tabs',`<div class="tabs" role="tablist">${(data().viewTabs||[]).map(item=>`<button class="tab ${item===activeTab?'active':''}" role="tab" aria-selected="${item===activeTab}" data-tab="m6-view" data-value="${esc(item)}">${esc(item)}</button>`).join('')}</div>`);
}

function renderKpis(){
  const toneClass={blue:'',green:'green',orange:'orange',red:'red',purple:'purple'};
  render('#m6-kpis',(data().kpis||[]).map(item=>`<article class="m6-kpi ${toneClass[item.tone]||''}">
    <span class="m6-kpi-icon">${icon(item.icon)}</span><div><div class="m6-kpi-label">${esc(item.label)}</div><div class="m6-kpi-value">${esc(item.value)}${item.unit?` <small>${esc(item.unit)}</small>`:''}</div><div class="m6-kpi-note">${item.delta?`<b>${esc(item.delta)}</b>`:''}${item.context?` <span>${esc(item.context)}</span>`:''}</div></div>
  </article>`).join(''));
}

function areaTone(status){ return status==='critical'?'critical':status==='warning'?'warning':'good'; }
function renderMap(){
  const areas=data().areaAlerts||[];
  const totals=data().severitySummary||{critical:1,high:4,medium:5};
  render('#m6-map-legend',`<b>Mức độ cảnh báo</b><div><span><i class="critical"></i>Sự cố nghiêm trọng (${totals.critical})</span><span><i class="warning"></i>Cảnh báo cao (${totals.high})</span><span><i class="minor"></i>Cảnh báo trung bình (${totals.medium})</span><span><i class="good"></i>Bình thường</span></div>`);
  render('#m6-map-markers',areas.map(item=>`<button class="m6-map-marker ${areaTone(item.status)} ${activeArea===item.id?'active':''}" style="--x:${item.x}%;--y:${item.y}%" data-action="m6-area-filter" data-id="${esc(item.id)}"><span>${icon(item.status==='critical'?'exclamation-triangle-fill':item.status==='warning'?'exclamation-square-fill':'check-circle-fill')}</span><b>${esc(item.name)}</b><small>${item.count?`${item.count} cảnh báo`:'Bình thường'}</small></button>`).join(''));
}

function levelBadge(item){
  return `<span class="m6-badge ${esc(item.severityKey)}">${icon(item.severityKey==='critical'?'exclamation-circle-fill':item.severityKey==='minor'?'circle-fill':'exclamation-triangle-fill')} ${esc(item.severity)}</span>`;
}
function statusBadge(item){
  return `<span class="m6-status ${esc(item.statusKey)}">${icon(item.statusKey==='good'?'check-circle-fill':item.statusKey==='info'?'circle-fill':'clock-fill')} ${esc(item.status)}</span>`;
}
function filteredLatest(){
  if(activeArea==='all') return data().latestAlerts||[];
  const area=(data().areaAlerts||[]).find(x=>x.id===activeArea)?.name||'';
  const aliases={raw:'Nghiền liệu',kiln:'Lò nung',cement:'Nghiền xi',power:'Trạm điện',air:'Khí nén',packing:'Đóng bao',aux:'Khu phụ trợ'};
  return (data().latestAlerts||[]).filter(item=>item.area.includes(aliases[activeArea]||area));
}
function renderLatest(){
  const rows=filteredLatest();
  render('#m6-latest-alerts',`<div class="table-wrap"><table class="m6-alert-table"><thead><tr><th>Thời gian</th><th>Khu vực</th><th>Thiết bị</th><th>Nội dung cảnh báo</th><th>Mức độ</th><th>Trạng thái</th></tr></thead><tbody>${rows.map(item=>`<tr><td>${esc(item.time)}</td><td>${esc(item.area)}</td><td><b>${esc(item.device)}</b></td><td>${esc(item.message)}</td><td>${levelBadge(item)}</td><td>${statusBadge(item)}</td></tr>`).join('')||'<tr><td colspan="6" class="empty">Khu vực này hiện không có cảnh báo trong dữ liệu mẫu.</td></tr>'}</tbody></table></div>`);
}

function renderRcaOptions(){
  const cases=data().rca?.cases||[];
  render('#m6-rca-alert',cases.map(item=>`<option value="${esc(item.id)}" ${item.id===activeRca?'selected':''}>${esc(item.label)}</option>`).join(''));
}
function rcaCase(){ return (data().rca?.cases||[]).find(item=>item.id===activeRca)||data().rca?.cases?.[0]; }
function renderRca(){
  const item=rcaCase(); if(!item)return;
  const method=$('#m6-rca-method')?.value||'5why';
  const labels=method==='5why'?['1. Hiện tượng','2. Why 1','3. Why 2','4. Why 3','5. Why 4','Nguyên nhân gốc rễ']:['Hiện tượng','Con người','Máy móc','Vật liệu','Phương pháp','Nguyên nhân gốc rễ'];
  const values=[item.phenomenon,...item.whys,item.rootCause];
  render('#m6-rca-table',`<div class="m6-why-list">${labels.map((label,index)=>`<div class="${index===labels.length-1?'root':''}"><b>${esc(label)}</b><span>${esc(values[index]||item.rootCause)}</span></div>`).join('')}</div>`);
  render('#m6-rca-recommendation',`<h3>Khuyến nghị</h3><ul>${(item.recommendations||[]).map(text=>`<li>${esc(text)}</li>`).join('')}</ul><b>Dự kiến tiết kiệm: ${esc(item.saving)}</b><button class="btn primary" data-action="m6-create-action">${icon('hammer')} Tạo hành động khắc phục</button>`);
}

function renderTrendOptions(){
  const metrics=data().trend?.metrics||[];
  render('#m6-trend-metric',metrics.map(item=>`<option value="${esc(item.id)}" ${item.id===activeTrend?'selected':''}>${esc(item.label)}</option>`).join(''));
  render('#m6-trend-periods',['7','30','90','365'].map(value=>`<button class="${trendPeriod===value?'active':''}" data-action="m6-trend-period" data-period="${value}">${value==='365'?'1 năm':`${value} ngày`}</button>`).join(''));
}
function trendMetric(){return (data().trend?.metrics||[]).find(x=>x.id===activeTrend)||data().trend?.metrics?.[0];}
function renderTrend(){
  const spec=trendMetric(); if(!spec)return;
  const take=trendPeriod==='7'?6:trendPeriod==='30'?10:spec.categories.length;
  const slice=v=>(v||[]).slice(-take);
  replaceChart('m6-trend-chart');
  chart('m6-trend-chart','line',[
    {name:'Thực tế',data:slice(spec.actual)},
    {name:'Xu hướng',data:slice(spec.trend)},
    {name:'Ngưỡng cảnh báo',data:slice(spec.threshold)},
    {name:'Dự báo (AI)',data:slice(spec.forecast)}
  ],{
    height:215,categories:slice(spec.categories),colors:['#087fe0','#17b989','#ef4455','#f4a51c'],
    stroke:{width:[2.2,1.4,1.4,1.8],curve:'straight',dashArray:[0,5,5,5]},markers:{size:[2.5,0,0,0],strokeWidth:0},
    legend:{position:'top',horizontalAlign:'right',fontSize:'8px'},
    annotations:{points:[{x:slice(spec.categories).at(-1),y:slice(spec.forecast).filter(v=>v!==null).at(-1),marker:{size:0},label:{text:spec.annotation,borderColor:'#ffccd2',style:{fontSize:'8px',background:'#fff2f4',color:'#d83d50'}}}]},
    yaxis:{labels:{style:{fontSize:'8px',colors:'#7b91a4'},formatter:value=>fmt(value,0)}}
  });
}

function renderBenchmark(){
  const spec=data().benchmark||{};
  replaceChart('m6-benchmark-chart');
  chart('m6-benchmark-chart','bar',[{name:'SEC',data:spec.values||[]}],{
    height:150,categories:spec.categories||[],colors:['#087fe0','#12ae80','#45b96b','#849bad'],
    plotOptions:{bar:{distributed:true,columnWidth:'48%',borderRadius:1}},legend:{show:false},
    dataLabels:{enabled:true,offsetY:-10,style:{fontSize:'8px',colors:['#244e6a']},formatter:value=>fmt(value,1)},
    yaxis:{show:false},grid:{show:false}
  });
  render('#m6-benchmark-note',`<h3>Nhận xét</h3><ul>${(spec.notes||[]).map(note=>`<li>${esc(note)}</li>`).join('')}</ul>`);
}

function renderCorrelations(){
  render('#m6-correlation',`<div class="m6-corr-list">${(data().correlations||[]).map(item=>`<div><span>${esc(item.label)}</span><div class="m6-corr-track"><i class="${esc(item.tone)}" style="width:${Math.round(item.value*100)}%"></i></div><b>${item.value.toFixed(2)}</b></div>`).join('')}<small>Hệ số tương quan (R)</small></div>`);
}

function renderAi(){
  render('#m6-ai-recommendations',`<div class="m6-ai-list">${(data().aiRecommendations||[]).map((item,index)=>`<article class="${esc(item.level)}"><span>${icon(item.icon)}</span><p>${esc(item.text)}</p><button class="btn small" data-action="m6-ai-detail" data-index="${index}">Xem chi tiết</button></article>`).join('')}</div>`);
}

function exportReport(){
  const XLSX=window.XLSX; if(!XLSX){toast('Thư viện XLSX chưa được tải.');return true;}
  const rows=data().latestAlerts||[];
  const aoa=[['M6 - PHÂN TÍCH & CẢNH BÁO - NHÀ MÁY XI MĂNG LAM THẠCH II'],['Khoảng thời gian','7 ngày qua'],[],['Thời gian','Khu vực','Thiết bị','Nội dung cảnh báo','Mức độ','Trạng thái'],...rows.map(x=>[x.time,x.area,x.device,x.message,x.severity,x.status])];
  const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!cols']=[{wch:12},{wch:18},{wch:15},{wch:42},{wch:14},{wch:16}];
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Canh bao');XLSX.writeFile(wb,'ENMS_M6_Phan_tich_Canh_bao.xlsx');toast('Đã xuất báo cáo phân tích & cảnh báo.');return true;
}

function focusTab(value){
  const map={'Cảnh báo thời gian thực':'.m6-latest-panel','Phân tích nguyên nhân (RCA)':'.m6-rca-panel','Phân tích xu hướng':'.m6-trend-panel','Benchmark & AI':'.m6-benchmark-panel','Khuyến nghị tối ưu':'.m6-ai-panel'};
  document.querySelector(map[value]||'.m6-map-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
}

export async function mount(){
  document.querySelector('.page-heading h1').textContent='M6 - PHÂN TÍCH & CẢNH BÁO';
  renderTabs();renderKpis();renderMap();renderLatest();renderRcaOptions();renderRca();renderTrendOptions();renderTrend();renderBenchmark();renderCorrelations();renderAi();
}
export async function onTab(group,value){if(group!=='m6-view')return false;activeTab=value;focusTab(value);return true;}
export async function onChange(target){
  if(target.id==='m6-rca-alert'){activeRca=target.value;renderRca();return true;}
  if(target.id==='m6-rca-method'){renderRca();return true;}
  if(target.id==='m6-trend-metric'){activeTrend=target.value;renderTrend();return true;}
  if(target.id==='m6-period'||target.id==='m6-scope'){toast('Đã áp dụng bộ lọc trên dữ liệu preview.');return true;}
  return false;
}
export async function onAction(name,target){
  if(name==='export-module'||name==='m6-export-report')return exportReport();
  if(name==='m6-area-filter'){activeArea=activeArea===target.dataset.id?'all':target.dataset.id;renderMap();renderLatest();return true;}
  if(name==='m6-trend-period'){trendPeriod=target.dataset.period;renderTrendOptions();renderTrend();return true;}
  if(name==='m6-show-all-alerts'){activeArea='all';renderMap();renderLatest();document.querySelector('.m6-latest-panel')?.scrollIntoView({behavior:'smooth',block:'center'});return true;}
  if(name==='m6-create-action'){const item=rcaCase();window.EnmsCommon?.showDialog('Tạo hành động khắc phục',`<p><b>Nguồn RCA:</b> ${esc(item?.label||'')}</p><p><b>Nguyên nhân gốc:</b> ${esc(item?.rootCause||'')}</p><p>Biểu mẫu hành động đã sẵn sàng để nối API ghi dữ liệu thực ở bước tích hợp DB.</p><button class="btn primary" data-action="m6-confirm-action">${icon('check2-circle')} Xác nhận tạo</button>`);return true;}
  if(name==='m6-confirm-action'){toast('Đã tạo hành động khắc phục trong chế độ preview.');document.querySelector('#detail-dialog')?.close();return true;}
  if(name==='m6-ai-detail'){const item=(data().aiRecommendations||[])[Number(target.dataset.index)];window.EnmsCommon?.showDialog('Chi tiết khuyến nghị AI',`<p>${esc(item?.text||'')}</p><p class="muted">Khuyến nghị chỉ dùng để hỗ trợ quyết định; lệnh điều khiển vẫn tuân thủ cơ chế xác thực và phân quyền hiện có.</p>`);return true;}
  return false;
}
