import { state } from '../core/state.js';
import { $, csv, esc, render, toast } from '../core/dom.js';
import { allRows, request } from '../core/api.js';
import { chart, donut, replaceChart } from '../core/charts.js';
import { badge, button, levelColors, levelNames, pagination, panel, row, select, stationSelect, stat, table, tabs } from '../components/ui.js';

function alertParams() {
  const period = $('#alert-period')?.value || '7';
  return {
    search: $('#alert-search')?.value || '',
    status: $('#alert-status')?.value || '',
    stationId: $('#alert-station')?.value || '',
    severity: $('#alert-severity')?.value || '',
    page: state.alertPage,
    pageSize: 10,
    from: period === '1' ? '2025-06-10' : period === '7' ? '2025-06-04' : '2025-05-12',
    to: '2025-06-10'
  };
}

async function loadAlerts() {
  const result = (await request('alerts', alertParams())).data;
  state.filteredAlerts = result;
  render('#alert-table', table(
    ['STT','Thời gian','Trạm / Khu vực','Thiết bị / Đường đo','Nội dung sự kiện','Giá trị đo','Mức độ','Trạng thái',''],
    result.items.map((item,index)=>row([
      (result.page-1)*10+index+1,
      `${item.time.slice(0,10)}<br>${item.time.slice(11)}`,
      esc(item.station),
      esc(item.device),
      esc(item.message),
      esc(item.value),
      badge(levelNames[item.severity],item.severity),
      badge(item.status,item.status==='Chưa xử lý'?'critical':item.status==='Đang xử lý'?'info':''),
      button('Xem','alert-detail',false,`data-id="${item.id}"`)
    ],`style="--level:${levelColors[item.severity]}"`)),
    'alert-table'
  ) + pagination(result,'alert'));
}

async function showAlert(id) {
  const alert = (await request(`alerts/${id}`)).data;
  state.selectedAlert = id;
  replaceChart('alert-trend');
  render('#alert-detail', `<div class="detail">${badge(levelNames[alert.severity],alert.severity)}<h3 style="margin-top:9px">${esc(alert.message)}</h3><dl><dt>Thời gian</dt><dd>${esc(alert.time.replace('T',' '))}</dd><dt>Trạm / Khu vực</dt><dd>${esc(alert.station)}</dd><dt>Thiết bị / Đường đo</dt><dd>${esc(alert.device)}</dd><dt>Giá trị đo</dt><dd><b>${esc(alert.value)}</b> / Ngưỡng ${esc(alert.threshold)}</dd></dl><h4>Biểu đồ xu hướng (dữ liệu minh họa)</h4><div id="alert-trend"></div><h4>Nguyên nhân sơ bộ</h4><ul><li>Tải thiết bị thay đổi so với chế độ vận hành chuẩn.</li><li>Cần kiểm tra dữ liệu đo và trạng thái thiết bị tại trạm.</li></ul><h4>Đề xuất hành động</h4><ol><li>Kiểm tra tình trạng vận hành và kết nối thiết bị.</li><li>Đối chiếu giá trị đo với ngưỡng cảnh báo.</li><li>Ghi nhận kết quả và cập nhật trạng thái xử lý.</li></ol><div class="divider"></div><form id="alert-form"><div class="toolbar">${select('detail-status','Trạng thái xử lý',['Chưa xử lý','Đang xử lý','Đã xác nhận','Đã khôi phục'],alert.status)}${select('detail-assignee','Người phụ trách',['Đội vận hành','Phòng kỹ thuật','Quản lý năng lượng'],alert.assignee)}</div><label class="field">Ghi chú xử lý<textarea id="detail-note" maxlength="2000" placeholder="Nhập ghi chú xử lý…">${esc(alert.note || '')}</textarea></label><button class="btn primary" type="submit" style="margin-top:10px;width:100%"><i class="bi bi-check2-circle"></i> Cập nhật trạng thái</button></form></div>`);
  chart('alert-trend','line',[{name:'Giá trị minh họa',data:[84,90,95,100,106,111,117,125]}],{height:180,colors:[levelColors[alert.severity]],categories:['03/06','04/06','05/06','06/06','07/06','08/06','09/06','10/06'],annotations:{yaxis:[{y:100,borderColor:'#098dee',strokeDashArray:4}]},stroke:{width:2,curve:'straight'}});
}

export async function mount() {
  const counts={critical:3,warning:7,minor:5,info:12};
  render('#alerts-summary', Object.entries(counts).map(([key,count],index)=>stat(
    ['Cảnh báo nghiêm trọng','Cảnh báo','Cảnh báo nhẹ','Sự kiện thông tin'][index],
    count,
    '',
    ['exclamation-triangle-fill','lightning-charge-fill','exclamation-triangle','info-circle-fill'][index],
    ['red','orange','orange',''][index],
    index<2?`↑ ${index+1}`:`↓ ${index-1}`,
    'so với 7 ngày trước'
  )).join('') + stat('Tổng số sự kiện','27','sự kiện','pie-chart','purple','4 cấp độ','đang được theo dõi'));
  render('#alerts-tabs', tabs(['Danh sách sự kiện','Biểu đồ xu hướng','Thống kê theo trạm','Thống kê theo loại'],'alerts'));
  render('#alert-status-filter', select('alert-status','Trạng thái',[['','Tất cả trạng thái'],'Chưa xử lý','Đang xử lý','Đã xác nhận','Đã khôi phục']));
  render('#alert-station-filter', stationSelect('alert-station'));
  await loadAlerts();
  await showAlert(state.selectedAlert);
}

export async function onAction(name, target) {
  if (name === 'alert-detail') { await showAlert(target.dataset.id); return true; }
  if (name === 'alert-page') { state.alertPage = +target.dataset.page; await loadAlerts(); return true; }
  if (name === 'export-alerts') {
    const rows = await allRows('alerts', alertParams());
    csv('enms-su-kien',['Thời gian','Trạm','Thiết bị','Nội dung','Giá trị','Ngưỡng','Mức độ','Trạng thái','Phụ trách','Ghi chú'],rows.map(item=>[item.time,item.station,item.device,item.message,item.value,item.threshold,levelNames[item.severity],item.status,item.assignee,item.note]));
    return true;
  }
  return false;
}

export async function onTab(group, value) {
  if (group !== 'alerts') return false;
  $('#alert-workspace').hidden = value !== 'Danh sách sự kiện';
  $('#alert-analysis').hidden = value === 'Danh sách sự kiện';
  if (value !== 'Danh sách sự kiện') {
    replaceChart('alert-analysis-chart');
    render('#alert-analysis', panel(value,'<div class="panel-body"><div id="alert-analysis-chart"></div></div>'));
    if (value === 'Thống kê theo loại') {
      donut('alert-analysis-chart',[3,7,5,12],'27','sự kiện',Object.values(levelNames));
    } else {
      const byStation = value === 'Thống kê theo trạm';
      chart('alert-analysis-chart',byStation?'bar':'area',[{name:'Sự kiện',data:byStation?state.stations.map(station=>state.alerts.filter(item=>item.stationId===station.id).length):[2,1,3,4,3,5,9]}],{height:360,categories:byStation?state.stations.map(station=>station.name):['04/06','05/06','06/06','07/06','08/06','09/06','10/06']});
    }
  }
  return true;
}

let searchTimer;
export async function onInput(target) {
  if (target.id !== 'alert-search') return false;
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.alertPage = 1;
    loadAlerts().catch(window.EnmsCommon?.showError || console.error);
  }, 200);
  return true;
}

export async function onChange(target) {
  if (!['alert-status','alert-station','alert-severity','alert-period'].includes(target.id)) return false;
  state.alertPage = 1;
  await loadAlerts();
  return true;
}

export async function onSubmit(form) {
  if (form.id !== 'alert-form') return false;
  const submit = form.querySelector('button[type=submit]');
  submit.disabled = true;
  try {
    await request(`alerts/${state.selectedAlert}`, {
      status: $('#detail-status').value,
      assignee: $('#detail-assignee').value,
      note: $('#detail-note').value
    }, 'PATCH');
    await loadAlerts();
    toast('Đã lưu trạng thái xử lý trong dữ liệu mock của phiên.');
  } finally {
    submit.disabled = false;
  }
  return true;
}
