import { state } from '../core/state.js';
import { $, esc, render } from '../core/dom.js';
import { chart, colors } from '../core/charts.js';
import { stat, table, row, icon } from './ui.js';

function renderKpis(kpis = []) {
  return kpis.map(item => stat(item.label,item.value,item.unit,item.icon,item.tone,item.delta,item.context)).join('');
}

function renderFlow(panel) {
  return `<div class="module-flow">${(panel.nodes || []).map(node => `<div class="module-flow-node"><b>${esc(node[0])}</b><strong>${esc(node[1])}</strong></div>`).join('')}</div>`;
}

function renderGoals(panel) {
  return `<div class="module-goals">${(panel.items || []).map(item => `<div class="module-goal"><div class="module-goal-top"><span>${esc(item[0])}</span><b>${esc(item[1])}%</b></div><div class="progress"><span style="width:${Math.max(0,Math.min(100,Number(item[1]) || 0))}%"></span></div><small>Mục tiêu: ${esc(item[2])}</small></div>`).join('')}</div>`;
}

function renderScore(panel) {
  return `<div class="module-score">${(panel.items || []).map(item => `<div class="module-score-row"><span>${esc(item[0])}</span><div class="progress"><span style="width:${Math.max(0,Math.min(100,Number(item[1]) || 0))}%"></span></div><b>${esc(item[1])}%</b></div>`).join('')}</div>`;
}

function renderMatrix(panel) {
  return `<div class="module-matrix">${(panel.items || []).map((item,index)=>{
    const x=Math.max(8,Math.min(95,Number(item[1]) || 50));
    const y=Math.max(8,Math.min(95,Number(item[2]) || 50));
    const klass=x>80&&y>80?'high':x>60&&y>60?'mid':'';
    return `<button class="matrix-point ${klass}" style="--x:${x};--y:${y}" title="${esc(item[3] || '')}">${index+1}. ${esc(item[0])}</button>`;
  }).join('')}</div>`;
}

function renderTwin(panel) {
  const positions=[[14,25],[33,42],[46,24],[60,53],[78,41],[87,72]];
  return `<div class="module-twin"><img src="/enms/assets/factory.png" alt="Mô hình số minh họa nhà máy">${(panel.assets||[]).map((asset,i)=>`<div class="twin-asset" style="--x:${positions[i%positions.length][0]}%;--y:${positions[i%positions.length][1]}%"><b>${esc(asset[0])} · ${esc(asset[1])} ${esc(asset[3] || 'MW')}</b><small>Sync ${esc(asset[2])}%</small></div>`).join('')}</div>`;
}

function renderDonut(targetId, panel) {
  const values=panel.values||[];
  render(`#${targetId}`, `<div class="module-donut-layout"><div id="${targetId}-chart"></div><div class="module-donut-legend">${(panel.labels||[]).map((label,i)=>`<div><i style="background:${colors[i%colors.length]}"></i><span>${esc(label)}</span><b>${esc(values[i])}%</b></div>`).join('')}</div></div>`);
  chart(`${targetId}-chart`,'donut',values,{height:245,labels:panel.labels||[],legend:{show:false},stroke:{width:1,colors:['#fff']},plotOptions:{pie:{donut:{size:'64%'}}}});
}

function renderChart(targetId, panel) {
  render(`#${targetId}`, `<div id="${targetId}-chart"></div>`);
  chart(`${targetId}-chart`, panel.kind === 'line' ? 'area' : panel.kind, panel.series || [], {
    height:255,
    categories:panel.categories || [],
    stroke:{width:panel.kind==='bar'?0:2,curve:'smooth'},
    plotOptions:panel.kind==='bar'?{bar:{borderRadius:3,columnWidth:'52%'}}:undefined
  });
}

function renderPanel(targetId,panel={}) {
  if(['line','area','bar'].includes(panel.kind)) return renderChart(targetId,panel);
  if(panel.kind==='donut') return renderDonut(targetId,panel);
  if(panel.kind==='flow') return render(`#${targetId}`,renderFlow(panel));
  if(panel.kind==='goal') return render(`#${targetId}`,renderGoals(panel));
  if(panel.kind==='score') return render(`#${targetId}`,renderScore(panel));
  if(panel.kind==='matrix') return render(`#${targetId}`,renderMatrix(panel));
  if(panel.kind==='twin') return render(`#${targetId}`,renderTwin(panel));
  render(`#${targetId}`,'<div class="empty">Chưa có dữ liệu hiển thị</div>');
}

function renderDataTable(spec={}) {
  const headers=spec.headers||[];
  const rows=(spec.rows||[]).map(cells=>row(cells.map((cell,index)=>{
    const text=esc(cell);
    if(index===cells.length-1 && /Tốt|Đạt|Đồng bộ|Đã|Sẵn sàng|Online|Hoàn thành|Pass/i.test(String(cell))) return `<span class="module-table-status">${text}</span>`;
    if(index===cells.length-1 && /Theo dõi|Cảnh báo|Chờ|Trễ|Review/i.test(String(cell))) return `<span class="module-table-status warn">${text}</span>`;
    return text;
  })));
  return table(headers,rows,'compact');
}

function renderInsights(items=[]) {
  return items.map(item=>`<article class="module-insight ${item.status==='warn'?'warn':'good'}">${icon(item.icon || 'lightbulb')}<div><b>${esc(item.title)}</b><strong>${esc(item.value)}</strong><small>${esc(item.note || '')}</small></div></article>`).join('');
}

export async function mountModuleDashboard(expectedId) {
  const module=state.module;
  if(!module || module.id!==expectedId) throw new Error(`Không có dữ liệu module ${expectedId}`);
  render('#module-kpis',renderKpis(module.kpis));
  $('#module-primary-title').textContent=module.primary?.title||'Phân tích chính';
  $('#module-secondary-title').textContent=module.secondary?.title||'Phân tích bổ sung';
  $('#module-table-title').textContent=module.table?.title||'Chi tiết';
  $('#module-code-badge').textContent=`${module.code} · dữ liệu mẫu`;
  renderPanel('module-primary',module.primary);
  renderPanel('module-secondary',module.secondary);
  render('#module-table',renderDataTable(module.table));
  render('#module-insights',renderInsights(module.insights));
}

export async function moduleAction(action) {
  if(action==='module-detail') return true;
  return false;
}
