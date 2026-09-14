import { state } from '../core/state.js';
import { esc, fmt, render, toast, download } from '../core/dom.js';
import { chart, replaceChart } from '../core/charts.js';
import { icon } from '../components/ui.js';

let activeTab = 'Tổng quan';
function data(){ return state.module || {}; }

function renderTabs(){
  render('#m8-tabs', `<div class="tabs" role="tablist">${(data().viewTabs||[]).map(item=>`<button class="tab ${item===activeTab?'active':''}" role="tab" aria-selected="${item===activeTab}" data-tab="m8-view" data-value="${esc(item)}">${esc(item)}</button>`).join('')}</div>`);
}

function renderKpis(){
  render('#m8-kpis',(data().kpis||[]).map(item=>`<article class="m8-kpi ${esc(item.tone||'blue')}"><span class="m8-kpi-icon">${icon(item.icon)}</span><div class="m8-kpi-content"><div class="m8-kpi-label">${esc(item.label)}</div><div class="m8-kpi-value">${esc(item.value)}${item.unit?` <small>${esc(item.unit)}</small>`:''}</div>${item.progress!=null?`<div class="m8-kpi-progress"><i style="width:${item.progress}%"></i><span>Đạt ${item.progress}% kế hoạch</span></div>`:`<div class="m8-kpi-note"><b>${esc(item.delta||'')}</b> <span>${esc(item.context||'')}</span></div>`}</div></article>`).join(''));
}

function renderTrend(){
  const spec=data().trend||{}; replaceChart('m8-emission-trend');
  chart('m8-emission-trend','line',[
    {name:'Phát thải CO₂ (tCO₂)',type:'column',data:spec.emissions||[]},
    {name:'Cường độ phát thải (kgCO₂/tấn clinker)',type:'line',data:spec.intensity||[]}
  ],{
    height:225,categories:spec.categories||[],colors:['#20ad72','#087fe0'],stroke:{width:[0,2.3],curve:'straight'},markers:{size:[0,3],strokeWidth:0},plotOptions:{bar:{columnWidth:'46%',borderRadius:1}},
    dataLabels:{enabled:true,enabledOnSeries:[0,1],offsetY:-8,style:{fontSize:'8px',colors:['#24506e']},formatter:v=>fmt(v)},
    yaxis:[{title:{text:'tCO₂',style:{fontSize:'8px'}},labels:{style:{fontSize:'8px'},formatter:v=>fmt(v)}},{opposite:true,min:0,max:1000,title:{text:'kgCO₂/tấn clinker',style:{fontSize:'8px'}},labels:{style:{fontSize:'8px'},formatter:v=>fmt(v)}}],
    legend:{position:'top',horizontalAlign:'left',fontSize:'8px'}
  });
}

function renderBreakdown(){
  const items=data().breakdown||[];
  render('#m8-source-breakdown', `<div class="m8-source-layout"><div id="m8-source-chart"></div><div class="m8-source-legend">${items.map(item=>`<div><i style="background:${esc(item.color)}"></i><span>${esc(item.label)}</span><b>${item.value}%</b></div>`).join('')}</div></div>`);
  replaceChart('m8-source-chart');
  chart('m8-source-chart','donut',items.map(x=>x.value),{height:205,labels:items.map(x=>x.label),colors:items.map(x=>x.color),legend:{show:false},stroke:{width:1,colors:['#fff']},dataLabels:{enabled:false},plotOptions:{pie:{donut:{size:'65%',labels:{show:true,name:{show:true,fontSize:'9px',offsetY:20,formatter:()=> 'tCO₂/năm'},value:{show:true,fontSize:'20px',fontWeight:700,offsetY:-12,formatter:()=>esc(data().totalEmission||'2,950')},total:{show:false}}}}}});
}

function renderBenchmark(){
  const spec=data().benchmark||{}; replaceChart('m8-benchmark');
  chart('m8-benchmark','bar',[{name:'kgCO₂/tấn clinker',data:spec.values||[]}],{
    height:190,categories:spec.categories||[],colors:['#24af70','#8499aa','#0b7ee4','#718799'],plotOptions:{bar:{distributed:true,columnWidth:'48%',borderRadius:1}},legend:{show:false},grid:{show:true},
    dataLabels:{enabled:true,offsetY:-10,style:{fontSize:'9px',colors:['#244f6c']},formatter:v=>fmt(v)},yaxis:{min:0,max:900,labels:{style:{fontSize:'8px'},formatter:v=>fmt(v)}}
  });
  render('#m8-benchmark-note', `<span class="m8-benchmark-good">Tốt hơn ${esc(spec.betterThan || '13.1%')}<small>so với trung bình VN</small></span>`);
}

function renderDetails(){
  render('#m8-details', `<div class="table-wrap"><table class="m8-detail-table"><thead><tr><th>STT</th><th>Hạng mục</th><th>Hoạt động/Tiêu mục</th><th>Phát thải<br>(tCO₂/năm)</th><th>Tỷ lệ<br>(%)</th><th>So với 2024</th><th>Ghi chú</th></tr></thead><tbody>${(data().details||[]).map((item,index)=>`<tr><td>${index+1}</td><td><b>${esc(item.category)}</b></td><td>${esc(item.activity)}</td><td>${fmt(item.emission)}</td><td>${item.share.toFixed(1)}</td><td class="${item.change>0?'bad':'good'}">${item.change>0?'▲':'▼'} ${Math.abs(item.change).toFixed(1)}%</td><td>${esc(item.note)}</td></tr>`).join('')}</tbody></table></div>`);
}

function renderTarget(){
  const spec=data().targetProgress||{}; replaceChart('m8-target-progress');
  chart('m8-target-progress','line',[
    {name:'Thực tế',data:spec.actual||[]},{name:'Kế hoạch',data:spec.plan||[]},{name:'Kịch bản BAU',data:spec.bau||[]}
  ],{
    height:205,categories:spec.categories||[],colors:['#087fe0','#12ae7d','#ef4b5e'],stroke:{width:[2.3,1.6,1.6],curve:'straight',dashArray:[0,5,5]},markers:{size:[2.5,0,0],strokeWidth:0},legend:{position:'top',horizontalAlign:'center',fontSize:'8px'},
    annotations:{points:[{x:'12',y:(spec.plan||[]).at(-1),marker:{size:0},label:{text:'Mục tiêu 2025: -8% so với 2024',borderColor:'#a8e7ca',style:{fontSize:'8px',background:'#eaf9f2',color:'#087a57'}}}]},
    yaxis:{labels:{style:{fontSize:'8px'},formatter:v=>fmt(v)}}
  });
}

function renderEsg(){
  render('#m8-esg-metrics', `<div class="table-wrap"><table class="m8-esg-table"><thead><tr><th>Chỉ số</th><th>Giá trị 2025</th><th>So với 2024</th><th>Đánh giá</th></tr></thead><tbody>${(data().esgMetrics||[]).map(item=>`<tr><td>${esc(item.label)}</td><td><b>${esc(item.value)}</b></td><td class="good">${item.change>0?'▲':'▼'} ${Math.abs(item.change).toFixed(1)}%</td><td><span class="m8-good">${esc(item.rating)}</span></td></tr>`).join('')}</tbody></table></div>`);
}

function renderInitiatives(){
  render('#m8-initiatives', `<div class="table-wrap"><table class="m8-init-table"><thead><tr><th>STT</th><th>Sáng kiến</th><th>Hiệu quả dự kiến</th><th>Tiến độ</th><th>Thời gian hoàn thành</th></tr></thead><tbody>${(data().initiatives||[]).map((item,index)=>`<tr><td>${index+1}</td><td><b>${esc(item.name)}</b></td><td class="good">${esc(item.impact)}</td><td><span class="m8-init-status ${esc(item.statusKey)}">${icon(item.statusKey==='done'?'check-circle-fill':item.statusKey==='research'?'circle-fill':'clock-fill')} ${esc(item.status)}</span></td><td>${esc(item.due)}</td></tr>`).join('')}</tbody></table></div>`);
}

function renderCompliance(){
  render('#m8-compliance', `<ul class="m8-compliance-list">${(data().compliance||[]).map(item=>`<li>${icon('check-circle-fill')}<span>${esc(item)}</span></li>`).join('')}</ul>`);
}

function renderDocuments(){
  render('#m8-documents', `<div class="m8-doc-list">${(data().documents||[]).map((item,index)=>`<div><span>${icon('file-earmark-text')} ${esc(item.name)}</span><button class="icon-button" title="Tải xuống" data-action="m8-download-doc" data-index="${index}">${icon('download')}</button></div>`).join('')}</div>`);
}

function exportEsg(){
  const XLSX=window.XLSX; if(!XLSX){toast('Thư viện XLSX chưa được tải.');return true;}
  const rows=data().details||[];
  const aoa=[['M8 - PHÁT THẢI CO₂ & ESG - NHÀ MÁY XI MĂNG LAM THẠCH II'],['Năm','2025'],['Kỳ','Tháng 06/2025'],[],['STT','Hạng mục','Hoạt động/Tiêu mục','Phát thải (tCO₂/năm)','Tỷ lệ (%)','So với 2024 (%)','Ghi chú'],...rows.map((x,i)=>[i+1,x.category,x.activity,x.emission,x.share,x.change,x.note])];
  const ws=XLSX.utils.aoa_to_sheet(aoa);ws['!cols']=[{wch:6},{wch:18},{wch:28},{wch:20},{wch:12},{wch:18},{wch:28}];const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Phat thai CO2');XLSX.writeFile(wb,'ENMS_M8_Phat_thai_CO2_ESG.xlsx');toast('Đã xuất báo cáo ESG.');return true;
}

function focusTab(value){
  const map={'Phát thải CO₂':'.m8-trend-panel','Phân tích theo nguồn':'.m8-source-panel','So sánh & Benchmark':'.m8-benchmark-panel','Quản lý dữ liệu':'.m8-detail-panel','Báo cáo ESG':'.m8-esg-panel','Sáng kiến giảm phát thải':'.m8-initiatives-panel'};
  document.querySelector(map[value]||'.m8-trend-panel')?.scrollIntoView({behavior:'smooth',block:'start'});
}

export async function mount(){
  document.querySelector('.page-heading h1').textContent='M8 - PHÁT THẢI CO₂ & ESG';
  renderTabs();renderKpis();renderTrend();renderBreakdown();renderBenchmark();renderDetails();renderTarget();renderEsg();renderInitiatives();renderCompliance();renderDocuments();
}
export async function onTab(group,value){if(group!=='m8-view')return false;activeTab=value;focusTab(value);return true;}
export async function onChange(target){if(['m8-year','m8-period'].includes(target.id)){toast('Đã áp dụng bộ lọc phát thải trên dữ liệu preview.');return true;}return false;}
export async function onAction(name,target){
  if(name==='export-module'||name==='m8-export-esg')return exportEsg();
  if(name==='m8-download-doc'){const doc=(data().documents||[])[Number(target.dataset.index)];download(`${doc?.id||'esg-document'}.txt`,`${doc?.name||'Tài liệu ESG'}\nNhà máy Xi măng Lam Thạch II\nDữ liệu preview EnMS v1.1.9`, 'text/plain;charset=utf-8');toast('Đã tạo tài liệu mẫu.');return true;}
  return false;
}
