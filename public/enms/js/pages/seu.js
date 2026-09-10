import { state } from '../core/state.js';
import { $, csv, render } from '../core/dom.js';
import { chart, colors, days, replaceChart } from '../core/charts.js';
import { bars, button, energyStats, icon, panel, select, seuTable, table, row, tabs } from '../components/ui.js';

function enpiDetail() {
  return panel('Chi tiết EnPI', `<div class="panel-body"><div class="toolbar">${select('seu-select','SEU',state.seu.map(item => [item.id,item.name]),'6')}${button(`${icon('download')} Xuất CSV`,'export-seu')}</div><div class="mini-stats" style="margin:14px 0"><div class="mini-stat">EnPI thực tế<b id="selected-enpi">4.41 <small>kWh/tấn</small></b></div><div class="mini-stat">So với kỳ trước<b class="green-text">↓ 2.5%</b></div><div class="mini-stat">Thời gian vận hành<b>720 <small>h</small></b></div></div><h3>Xu hướng EnPI</h3><div id="enpi-chart"></div></div>`);
}

function renderEnpiChart() {
  const selected = state.seu.find(item => item.id === ($('#seu-select')?.value || '6')) || state.seu[0];
  if (!selected) return;
  $('#selected-enpi').innerHTML = `${selected.enpi} <small>kWh/tấn</small>`;
  replaceChart('enpi-chart');
  chart('enpi-chart','line',[
    {name:'EnPI thực tế',data:Array.from({length:10},(_,index)=>+(selected.enpi+Math.sin(index)*.18).toFixed(2))},
    {name:'Kỳ trước',data:Array(10).fill(selected.previous)}
  ],{categories:days(),height:205,decimals:2,colors:['#0789ed','#afc2d0'],stroke:{width:[2,1],curve:'straight',dashArray:[0,5]}});
}

function renderSeuTab() {
  let html = '';
  const tab = state.seuTab;
  if (tab === 'Tổng quan' || tab === 'SEU') {
    html += `<div class="grid main-grid">${panel('Cây khu vực sử dụng năng lượng đáng kể (SEU)',`<div class="panel-body"><div class="seu-tree"><div class="seu-root">${icon('buildings')} Nhà máy Xi măng Lam Thạch II<br><b>8,524,630 kWh</b> &nbsp; (100%)</div><div class="seu-branches">${state.seu.slice(0,8).map((item,index)=>`<button class="seu-node" style="--node:${colors[index]}" data-action="station" data-id="${item.id}">${icon('buildings')}<b>${item.name}</b>${Number(item.energy).toLocaleString('en-US')} kWh<strong>${(item.energy/state.summary.energy*100).toFixed(1)}%</strong></button>`).join('')}</div></div></div>`)}${panel('Top 5 SEU theo mức tiêu thụ năng lượng',`<div class="panel-body">${bars([...state.stations].sort((a,b)=>b.energy-a.energy).slice(0,5))}</div>`)}</div>`;
    html += `<div class="grid two">${panel('Danh sách SEU',`<div class="toolbar"><input type="search" id="seu-search" placeholder="Tìm kiếm SEU…" aria-label="Tìm kiếm SEU"></div><div id="seu-list">${seuTable(state.seu.slice(0,8))}</div>`)}${enpiDetail()}</div>`;
  }
  if (tab === 'EnPI') html += enpiDetail();
  if (tab === 'So sánh & Đánh giá') html += panel('So sánh EnPI giữa các kỳ', table(['SEU','Kỳ này (kWh/tấn)','Kỳ trước (kWh/tấn)','Thay đổi'],state.seu.map(item=>row([item.name,item.enpi,item.previous,'<span class="green-text">↓ 2.5%</span>']))));
  if (tab === 'Mô hình & Phân tích') {
    html += `<div class="grid equal">${panel('Mối quan hệ sản lượng và tiêu thụ',`<div class="panel-body"><div id="regression-chart"></div><p class="chart-note">Mô hình hồi quy minh họa · Không dùng để đánh giá vận hành thực tế</p></div>`)}${panel('Đường cơ sở năng lượng',`<div class="panel-body"><div class="goal">Mô hình cơ sở<b>E = 4.92 × Sản lượng + 12,400</b><p>Hệ số xác định R²: 0.94 (mẫu)</p></div><div class="mini-stats" style="margin-top:15px"><div class="mini-stat">Số quan sát<b>30</b></div><div class="mini-stat">Sai số MAPE<b>3.2%</b></div><div class="mini-stat">Kỳ chuẩn<b>06/2025</b></div></div></div>`)}</div>`;
  }
  html += panel('Cơ hội cải tiến năng lượng',`<div class="panel-body"><div class="opportunities">${['Nghiền xi 1','Đuôi lò 1&2','Đầu lò 1','Nhà tuabin'].map((name,index)=>`<div class="opportunity"><b>${icon('lightbulb')} ${name}</b><p>${['Tối ưu vận hành quạt gió, giảm tải không cần thiết','Kiểm soát nhiệt độ tháp, giảm tổn thất nhiệt','Tối ưu tỷ lệ nhiên liệu, nâng cao hiệu suất','Cải thiện chế độ vận hành, giảm tiêu thụ điện phụ'][index]}</p><strong>${[120000,85000,72000,65000][index].toLocaleString('en-US')}</strong> kWh/năm</div>`).join('')}</div></div>`);
  render('#seu-content', html);
  if ($('#enpi-chart')) renderEnpiChart();
  if ($('#regression-chart')) chart('regression-chart','scatter',[{name:'Tiêu thụ (kWh)',data:Array.from({length:30},(_,index)=>[10000+index*500,12400+(10000+index*500)*4.92+Math.sin(index)*4000])}],{xaxis:{type:'numeric',title:{text:'Sản lượng (tấn)'}},height:300,markers:{size:4}});
}

export async function mount() {
  render('#seu-tabs', tabs(['Tổng quan','SEU','EnPI','Mô hình & Phân tích','So sánh & Đánh giá'],'seu',state.seuTab));
  render('#seu-summary', energyStats('seu'));
  renderSeuTab();
}

export async function onTab(group, value) {
  if (group !== 'seu') return false;
  state.seuTab = value;
  renderSeuTab();
  return true;
}

export async function onInput(target) {
  if (target.id !== 'seu-search') return false;
  const query = target.value.toLocaleLowerCase('vi');
  render('#seu-list', seuTable(state.seu.filter(item => item.name.toLocaleLowerCase('vi').includes(query))));
  return true;
}

export async function onChange(target) {
  if (target.id !== 'seu-select') return false;
  renderEnpiChart();
  return true;
}

export async function onAction(name) {
  if (name !== 'export-seu') return false;
  csv('enms-bao-cao-nang-luong',['SEU','Điện năng (kWh)','Sản lượng (tấn)','EnPI (kWh/tấn)','Kỳ trước'],state.seu.map(item=>[item.name,item.energy,item.production,item.enpi,item.previous]));
  return true;
}
