import { base, descriptions, page, preview } from './core/config.js';
import { state } from './core/state.js';
import { $, clearError, esc, fmt, render, showDialog, showError, toast } from './core/dom.js';
import { request } from './core/api.js';
import { destroyAllCharts } from './core/charts.js';
import { badge, button, dateInput, icon, levelNames, row, select, stationSelect, stationTable, table } from './components/ui.js';

let activePage;
const modulePage = !['map','settings'].includes(page);

function setupHeading() {
  $('#page-description').textContent = descriptions[page] || '';
  let tools = select('plant', 'Nhà máy', [['lt2', 'Nhà máy Xi măng Lam Thạch II']]);

  if (page === 'realtime') {
    tools += select('refresh-interval','Tần suất cập nhật',[['0','Tạm dừng'],['5','5 giây'],['15','15 giây'],['30','30 giây']],'5');
  } else if (page === 'map') {
    tools = select('map-mode','Chế độ xem',[['sld','Sơ đồ một sợi'],['factory','Bản đồ nhà máy']]) + button(`${icon('arrow-clockwise')} Làm mới`,'refresh',true);
  } else if (page === 'reports') {
    tools = dateInput('report-from','Từ ngày','2025-06-01') + dateInput('report-to','Đến ngày','2025-06-10') + select('report-type','Loại báo cáo',['Tổng hợp','EnPI','Phát thải','So sánh']) + button(`${icon('file-earmark-plus')} Tạo báo cáo`,'create-report',true);
  } else if (page === 'alerts') {
    tools = select('alert-period','Khoảng thời gian',[['7','7 ngày qua'],['1','Hôm nay'],['30','30 ngày qua']]) + select('alert-severity','Mức độ',[['','Tất cả'],...Object.entries(levelNames)]) + button(`${icon('arrow-clockwise')} Làm mới`,'refresh',true);
  } else if (page === 'data') {
    tools += stationSelect('data-station');
  } else if (page === 'forecast') {
    tools += select('forecast-horizon','Kỳ dự báo',[['7','7 ngày'],['30','30 ngày'],['90','90 ngày']],'30') + button(`${icon('arrow-repeat')} Chạy dự báo`,'run-analysis',true);
  } else if (page === 'digital-twin') {
    tools += select('twin-mode','Kịch bản',[['live','Trạng thái hiện tại'],['efficient','Tối ưu hiệu suất'],['peak','Giờ cao điểm']]) + button(`${icon('play-circle')} Mô phỏng`,'run-analysis',true);
  } else if (['analytics','ai-decision','autonomous','optimization'].includes(page)) {
    tools += select('analysis-period','Thời gian',[['today','Hôm nay'],['7d','7 ngày'],['30d','30 ngày']],'7d') + button(`${icon('stars')} Chạy phân tích`,'run-analysis',true);
  } else if (['balance','targets','savings','emissions','iso50001'].includes(page)) {
    tools += select('period','Thời gian',[['2025-06','Tháng 06/2025'],['2025-Q2','Quý II/2025'],['2025','Năm 2025']]) + button(`${icon('download')} Xuất dữ liệu`,'export-module');
  } else if (page === 'overview' || page === 'seu') {
    tools += button(`${icon('arrow-clockwise')} Làm mới`,'refresh');
  }
  render('#page-actions', tools);
}

async function refreshPage() {
  clearError();
  activePage?.dispose?.();
  destroyAllCharts();
  $('#content').setAttribute('aria-busy','true');

  const requests = [
    request('summary'),
    request('stations'),
    request('meters'),
    request('alerts',{pageSize:100}),
    request('seu')
  ];
  if (modulePage) requests.push(request(`modules/${page}`));
  const results = await Promise.all(requests);

  state.summary = results[0].data;
  state.stations = results[1].data;
  state.meters = results[2].data;
  state.alerts = results[3].data.items;
  state.seu = results[4].data;
  state.module = modulePage ? results[5].data : null;

  const source = results[0].meta.source;
  $('.demo-indicator').textContent = source === 'mock' ? 'DỮ LIỆU MẪU' : 'DỮ LIỆU THỰC';
  $('#connection-state').textContent = source === 'mock' ? 'Dữ liệu minh họa · Chưa kết nối nguồn thực' : `Dữ liệu API · ${source}`;
  $('#last-update').textContent = `Cập nhật: ${new Date().toLocaleTimeString('vi-VN')} · Kỳ mẫu 06/2025 · EnMS v1.1.0`;
  await activePage.mount();
  $('#content').setAttribute('aria-busy','false');
}

async function commonAction(name, target) {
  if (name === 'station') {
    const station = state.stations.find(item => item.id === target.dataset.id);
    if (!station) return true;
    showDialog(station.name, `<div class="mini-stats"><div class="mini-stat">Công suất<b>${station.power} MW</b></div><div class="mini-stat">Điện năng<b>${fmt(station.energy)} kWh</b></div><div class="mini-stat">Điểm đo<b>${station.meters}</b></div></div><div class="divider"></div>${table(['Điểm đo','Thiết bị','Công suất','Trạng thái'],state.meters.filter(meter=>meter.stationId===station.id).map(meter=>row([meter.id,esc(meter.name),`${meter.power} MW`,badge(meter.status,meter.status==='Lỗi'?'critical':'')])))}<p>Trạm thuộc nhóm ${esc(station.group)} · ${esc(station.distance)} · Dữ liệu mẫu</p>`);
    return true;
  }
  if (name === 'meter') {
    const meter = state.meters.find(item => item.id === target.dataset.id);
    if (!meter) return true;
    showDialog(`${meter.id} · ${meter.name}`, `<p>Trạm: ${esc(meter.station)}</p><div class="mini-stats" style="margin-top:15px"><div class="mini-stat">Công suất<b>${meter.power} MW</b></div><div class="mini-stat">Điện áp<b>${meter.voltage} kV</b></div><div class="mini-stat">Cosφ<b>${meter.pf}</b></div></div><p style="margin-top:16px"><a href="${base}data?meter=${meter.id}">Xem dữ liệu đo đếm →</a></p>`);
    return true;
  }
  if (name === 'fullscreen') {
    const element = $('#factory-map');
    if (!element) return true;
    if (!document.fullscreenElement) await element.requestFullscreen(); else await document.exitFullscreen();
    return true;
  }
  if (name === 'map-list') {
    showDialog('Danh sách 16 trạm điện', stationTable());
    return true;
  }
  if (name === 'legacy-preview') {
    toast('Màn hình quản trị gốc yêu cầu đăng nhập trên máy chủ chính.');
    return true;
  }
  if (name === 'refresh') {
    await refreshPage();
    toast('Đã tải lại dữ liệu.');
    return true;
  }
  if (name === 'export-module') {
    toast('Đã chuẩn bị dữ liệu xuất. API export sẽ kết nối nguồn dữ liệu thực ở bước tích hợp DB.');
    return true;
  }
  if (name === 'run-analysis') {
    toast('Đã chạy lại mô phỏng/phân tích với dữ liệu mẫu.');
    await refreshPage();
    return true;
  }
  return false;
}

function activateTab(target) {
  target.parentElement?.querySelectorAll('.tab').forEach(button => {
    button.classList.toggle('active', button === target);
    button.setAttribute('aria-selected', String(button === target));
  });
}

function setupShell() {
  $('#close-dialog').onclick = () => $('#detail-dialog').close();
  $('#detail-dialog').addEventListener('click', event => {
    if (event.target === $('#detail-dialog')) $('#detail-dialog').close();
  });
  $('#menu-toggle').onclick = () => {
    const open = $('#sidebar').classList.toggle('open');
    $('#menu-toggle').setAttribute('aria-expanded', String(open));
  };
  $('#user-menu').onclick = () => showDialog('Tài khoản', preview
    ? '<p>Bạn đang xem preview độc lập với dữ liệu minh họa.</p>'
    : '<p>Phiên đăng nhập sử dụng JWT hiện có của hệ thống.</p><button class="btn" id="logout">Đăng xuất</button>');

  function clock() {
    const now = new Date();
    $('#clock').innerHTML = `${now.toLocaleTimeString('vi-VN')}<br>${now.toLocaleDateString('vi-VN')}`;
  }
  clock();
  setInterval(clock,1000);

  if (!preview) {
    try {
      const user = JSON.parse(localStorage.getItem('login_user') || '{}');
      $('#user-name').textContent = user.tennguoidung || user.taikhoan || 'Người dùng';
      $('#user-role').textContent = 'Tài khoản hệ thống';
    } catch {}
  }
}

function bindEvents() {
  document.addEventListener('click', async event => {
    const target = event.target.closest('[data-action],[data-tab],#logout');
    if (!target) return;
    event.preventDefault();
    if (target.disabled) return;
    clearError();
    try {
      if (target.id === 'logout') {
        ['hes_login_token','login_user','us','ps','pmsion','id','lst_tb','id_thietbi'].forEach(key=>localStorage.removeItem(key));
        location.href='/login';
        return;
      }
      if (target.dataset.tab) {
        activateTab(target);
        await activePage.onTab?.(target.dataset.tab,target.dataset.value,target);
        return;
      }
      target.disabled = true;
      try {
        const handledByPage = await activePage.onAction?.(target.dataset.action,target);
        if (!handledByPage) await commonAction(target.dataset.action,target);
      } finally {
        target.disabled = false;
      }
    } catch (error) {
      showError(error);
    }
  });

  document.addEventListener('input', event => {
    Promise.resolve(activePage.onInput?.(event.target)).catch(showError);
  });

  document.addEventListener('change', event => {
    clearError();
    Promise.resolve(activePage.onChange?.(event.target)).catch(showError);
  });

  document.addEventListener('submit', event => {
    if (!activePage.onSubmit) return;
    event.preventDefault();
    clearError();
    Promise.resolve(activePage.onSubmit(event.target)).catch(showError);
  });
}

async function bootstrap() {
  if (!preview && !localStorage.getItem('hes_login_token')) {
    location.replace('/login');
    return;
  }

  setupShell();
  activePage = await import(`./pages/${page}.js`);
  window.EnmsCommon = { showDialog, showError };

  const initial = (await request('stations')).data;
  state.stations = initial;
  const requestedMeter = new URLSearchParams(location.search).get('meter');
  if (requestedMeter && /^MT-\d{3}$/.test(requestedMeter)) state.selectedMeter = requestedMeter;

  setupHeading();
  bindEvents();
  await refreshPage();
}

bootstrap().catch(error => {
  $('#content').setAttribute('aria-busy','false');
  render('#content','<div class="empty">Chưa tải được dữ liệu. Vui lòng kiểm tra kết nối rồi tải lại trang.</div>');
  showError(error);
});

window.addEventListener('pagehide',()=>activePage?.dispose?.());
