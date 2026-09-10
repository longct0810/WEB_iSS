import { state } from '../core/state.js';
import { $, csv, render, toast } from '../core/dom.js';
import { allRows, request } from '../core/api.js';
import { chart, replaceChart } from '../core/charts.js';
import { badge, button, dateInput, icon, pagination, row, select, stat, table, tabs } from '../components/ui.js';

function meterTree(search = '') {
  const query = search.toLocaleLowerCase('vi');
  const html = state.stations.map(station => {
    const meters = state.meters.filter(meter => meter.stationId === station.id && `${meter.name} ${meter.id} ${station.name}`.toLocaleLowerCase('vi').includes(query));
    if (!meters.length) return '';
    return `<details ${meters.some(meter=>meter.id===state.selectedMeter)||search?'open':''}><summary>${icon('building')} ${station.id}. ${station.name} (${meters.length})</summary>${meters.map(meter=>`<button class="meter ${meter.id===state.selectedMeter?'active':''}" data-action="select-meter" data-id="${meter.id}">${icon('check-square-fill')} ${meter.id} · ${meter.name}</button>`).join('')}</details>`;
  }).join('');
  return html || '<div class="empty">Không tìm thấy điểm đo</div>';
}

function readingParams() {
  return {
    meterId: state.selectedMeter,
    from: $('#data-from').value,
    to: $('#data-to').value,
    interval: $('#data-interval').value,
    page: state.readingPage,
    pageSize: 11
  };
}

async function loadReadings() {
  if (!state.meters.some(meter=>meter.id===state.selectedMeter)) state.selectedMeter = state.meters[0].id;
  const data = (await request('readings', readingParams())).data;
  state.readings = data;
  const meter = state.meters.find(item=>item.id===state.selectedMeter);
  $('#meter-title').textContent = `${meter.id} · ${meter.name} (${meter.station})`;
  $('#meter-status').textContent = meter.status;
  $('#meter-status').className = `status ${meter.status==='Lỗi'?'critical':''}`;
  render('#readings-table', table(
    ['Thời gian','P (MW)','Q (MVar)','S (MVA)','U (kV)','IA (A)','IB (A)','IC (A)','Cosφ','Tần số (Hz)','Điện năng (kWh)'],
    data.items.map(item=>row([item.time.slice(0,16).replace('T',' '),item.p.toFixed(2),item.q.toFixed(2),item.s.toFixed(2),item.u.toFixed(2),Math.round(item.ia),Math.round(item.ib),Math.round(item.ic),item.pf.toFixed(2),item.hz.toFixed(2),Math.round(item.energy)]))
  ) + pagination(data,'reading'));

  const readings=[...data.items].reverse();
  const categories=readings.map(item=>item.time.slice(11,16));
  ['meter-power-chart','meter-energy-chart','meter-pf-chart','readings-large-chart'].forEach(replaceChart);
  chart('meter-power-chart','area',[{name:'P (MW)',data:readings.map(item=>item.p)}],{height:220,categories,decimals:2});
  chart('meter-energy-chart','area',[{name:'kWh',data:readings.map(item=>item.energy)}],{height:160,categories,colors:['#08b489']});
  chart('meter-pf-chart','line',[{name:'Cosφ',data:readings.map(item=>item.pf)}],{height:160,categories,decimals:2,colors:['#8a62d7'],yaxis:{min:.8,max:1,labels:{formatter:value=>value.toFixed(2)}}});
  const current=data.items[0];
  render('#meter-current', current ? `<h3>Giá trị tại ${current.time.slice(11,16)}</h3><div class="mini-stats"><div class="mini-stat">P (MW)<b>${current.p}</b></div><div class="mini-stat">Q (MVar)<b>${current.q}</b></div><div class="mini-stat">Cosφ<b>${current.pf}</b></div></div>` : '<p>Không có dữ liệu</p>');
  if ($('#data-display').value === 'chart') {
    $('#readings-table').hidden = true;
    $('#readings-large-chart').hidden = false;
    chart('readings-large-chart','area',[{name:'P (MW)',data:readings.map(item=>item.p)}],{height:430,categories,decimals:2});
  } else {
    $('#readings-table').hidden = false;
    $('#readings-large-chart').hidden = true;
  }
}

function renderNotice(value) {
  const notes={
    'Dữ liệu thời gian thực':'Đang xem giá trị mẫu. Chưa có nguồn telemetry thực được ánh xạ vào điểm đo EnMS.',
    'Dữ liệu lịch sử':'',
    'Hiệu chỉnh dữ liệu':'Dữ liệu gốc được giữ nguyên. Hiệu chỉnh cần quy trình phê duyệt và API ghi dữ liệu thực; chưa bật trong bản mock.',
    'Nhật ký hệ thống':'Phiên preview không ghi nhật ký lên database. Thao tác xử lý cảnh báo chỉ lưu trong bộ nhớ phiên.',
    'Import/Export':'Chọn điểm đo và khoảng thời gian, bấm Xuất dữ liệu để tải CSV. Import chưa bật khi chưa xác nhận cấu trúc database.',
    'Cấu hình điểm đo':'Chọn điểm đo trong cây để xem thông tin. Khai báo thiết bị thực tại Cài đặt hệ thống → Quản lý điểm đo.'
  };
  render('#data-notice', notes[value] ? `<div class="notice">${notes[value]}</div>` : '');
}

export async function mount() {
  render('#data-summary', [
    stat('Tổng số điểm đo','71','','database','','69 hoạt động',' · 2 lỗi'),
    stat('Dữ liệu hôm nay','100','%','check-circle-fill','green','Đã thu thập','thành công'),
    stat('Thời gian dữ liệu mới nhất','10:24','10/06/2025','calendar3','purple','Mẫu lịch sử',''),
    stat('Dung lượng lưu trữ','245','GB / 1 TB','bar-chart','orange','25%','dung lượng'),
    stat('Thời gian lưu trữ','3','năm','clock','','Từ 01/01/2023','')
  ].join(''));
  render('#data-tabs', tabs(['Dữ liệu thời gian thực','Dữ liệu lịch sử','Hiệu chỉnh dữ liệu','Nhật ký hệ thống','Import/Export','Cấu hình điểm đo'],'data',state.dataTab));
  renderNotice(state.dataTab);
  render('#data-toolbar', `${dateInput('data-from','Từ ngày','2025-06-10')}${dateInput('data-to','Đến ngày','2025-06-10')}${select('data-interval','Khoảng thời gian hiển thị',[['60','1 giờ'],['15','15 phút'],['1440','1 ngày']])}${select('data-display','Dạng hiển thị',[['table','Bảng dữ liệu'],['chart','Biểu đồ']])}${button(`${icon('search')} Tìm kiếm`,'search-readings',true)}${button(`${icon('download')} Xuất dữ liệu`,'export-readings')}`);
  render('#meter-tree', meterTree());
  await loadReadings();
}

export async function onAction(name, target) {
  if (name === 'reading-page') { state.readingPage=+target.dataset.page; await loadReadings(); return true; }
  if (name === 'search-readings') { state.readingPage=1; await loadReadings(); toast('Đã cập nhật dữ liệu theo bộ lọc.'); return true; }
  if (name === 'select-meter') {
    state.selectedMeter=target.dataset.id;
    state.readingPage=1;
    document.querySelectorAll('.meter').forEach(item=>item.classList.toggle('active',item.dataset.id===state.selectedMeter));
    await loadReadings();
    return true;
  }
  if (name === 'export-readings') {
    const rows=await allRows('readings',readingParams());
    csv(`enms-${state.selectedMeter}`,['Thời gian','Điểm đo','P (MW)','Q (MVar)','S (MVA)','U (kV)','IA (A)','IB (A)','IC (A)','Cosφ','Hz','kWh'],rows.map(item=>[item.time,item.meterId,item.p,item.q,item.s,item.u,item.ia,item.ib,item.ic,item.pf,item.hz,item.energy]));
    return true;
  }
  return false;
}

export async function onTab(group, value) {
  if (group !== 'data') return false;
  state.dataTab=value;
  renderNotice(value);
  return true;
}

export async function onInput(target) {
  if (target.id !== 'meter-search') return false;
  render('#meter-tree', meterTree(target.value));
  return true;
}

export async function onChange(target) {
  if (target.id === 'data-display') { await loadReadings(); return true; }
  if (target.id === 'data-station') {
    const meter=state.meters.find(item=>!target.value||item.stationId===target.value);
    if (meter) state.selectedMeter=meter.id;
    state.readingPage=1;
    render('#meter-tree',meterTree());
    await loadReadings();
    return true;
  }
  return false;
}
