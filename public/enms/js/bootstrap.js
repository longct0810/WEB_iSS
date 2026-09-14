import { base, descriptions, page, preview } from './core/config.js';
import { state } from './core/state.js';
import { $, clearError, esc, fmt, render, showDialog, showError, toast } from './core/dom.js';
import { request } from './core/api.js';
import { destroyAllCharts } from './core/charts.js';
import { badge, button, icon, row, select, stationTable, table } from './components/ui.js';

let activePage;
const modulePage = !['map','settings'].includes(page);

function setupHeading() {
  $('#page-description').textContent = descriptions[page] || '';
  let tools = select('plant', 'Nhà máy', [['lt2', 'Nhà máy Xi măng Lam Thạch II']]);

  if (page === 'realtime') {
    tools += select('realtime-period','Khoảng thời gian',[['realtime','Thời gian thực'],['today','Hôm nay'],['24h','24 giờ gần nhất']],'realtime')
      + select('realtime-display','Chế độ hiển thị',[['overview','Sơ đồ tổng thể'],['electricity','Điện'],['thermal','Nhiệt (Than/Dầu/Khí)'],['steam','Hơi'],['water','Nước']],'overview')
      + button(`${icon('fullscreen')} Toàn màn hình`,'m2-fullscreen',true);
  } else if (page === 'map') {
    tools = select('map-mode','Chế độ xem',[['sld','Sơ đồ một sợi'],['factory','Bản đồ nhà máy']]) + button(`${icon('arrow-clockwise')} Làm mới`,'refresh',true);
  } else if (page === 'reports') {
    tools += select('m9-period','Khoảng thời gian',[['2025-06','Tháng 06/2025'],['2025-Q2','Quý II/2025'],['2025','Năm 2025']],'2025-06')
      + select('m9-compare','So sánh',[['2024-same','So với cùng kỳ 2024'],['previous','So với kỳ trước'],['plan','So với kế hoạch']],'2024-same')
      + button(`${icon('plus')} Tạo báo cáo mới`,'m9-create-report',true);
  } else if (page === 'alerts') {
    tools += select('m6-period','Khoảng thời gian',[['7','7 ngày qua'],['1','Hôm nay'],['30','30 ngày qua'],['90','90 ngày qua']],'7')
      + select('m6-scope','Phạm vi',[['all','Toàn nhà máy'],['raw','Nghiền liệu'],['kiln','Lò nung'],['cement','Nghiền xi'],['packing','Đóng bao']],'all')
      + button(`${icon('download')} Xuất báo cáo`,'m6-export-report',true);
  } else if (page === 'data') {
    tools += select('m10-year','Năm',[['2025','2025'],['2024','2024']],'2025')
      + select('m10-system-status','Trạng thái hệ thống',[['healthy','🟢 Đang vận hành tốt'],['warning','🟠 Cần theo dõi'],['all','Tất cả trạng thái']],'healthy')
      + button(`${icon('download')} Báo cáo hệ thống`,'m10-system-report',true);
  } else if (page === 'forecast') {
    tools += select('m11-year','Năm',[['2025','2025'],['2024','2024']],'2025')
      + select('m11-period','Khoảng thời gian',[['2025-06','Tháng 06/2025'],['2025-Q2','Quý II/2025'],['2025','Năm 2025']],'2025-06')
      + button(`${icon('plus')} Tạo kịch bản mới`,'m11-create-scenario',true);
  } else if (page === 'digital-twin') {
    tools += select('m15-scenario','Kịch bản',[['live','Hiện tại (As-is)'],['production','Tăng sản lượng clinker 10%'],['efficient','Tối ưu vận hành'],['afr','Tăng AFR 30%']],'live')
      + select('m15-period','Thời gian mô phỏng',[['2025-06','Tháng 06/2025'],['2025-Q2','Quý II/2025'],['2025','Năm 2025']],'2025-06')
      + button(`${icon('plus')} Tạo kịch bản mới`,'m15-run-sim',true);
  } else if (page === 'optimization') {
    tools += select('m12-period','Khoảng thời gian',[['2025-06','Tháng 06/2025'],['2025-Q2','Quý II/2025'],['2025','Năm 2025']],'2025-06')
      + select('m12-scenario','Kịch bản hiển thị',[['optimized','Kịch bản tối ưu'],['base','Hiện tại'],['fuel','Thay thế nhiên liệu'],['bess','Tích hợp BESS']],'optimized')
      + button(`${icon('play-circle')} Chạy mô phỏng mới`,'m12-run-simulation',true);
  } else if (page === 'analytics') {
    tools += select('m14-period','Khoảng thời gian',[['2025-06','Tháng 06/2025'],['7d','7 ngày gần nhất'],['30d','30 ngày gần nhất']],'2025-06')
      + select('m14-model','Mô hình AI',[['v2.1','Phiên bản v2.1'],['v2.0','Phiên bản v2.0']],'v2.1')
      + button(`${icon('play-circle')} Chạy phân tích mới`,'m14-run-analysis',true);
  } else if (page === 'ai-decision') {
    tools += select('m16-period','Thời gian',[['2025-06','Tháng 06/2025'],['2025-Q2','Quý II/2025']],'2025-06')
      + select('m16-scenario','Kịch bản',[['cost','Tối ưu chi phí'],['co2','Tối ưu CO₂'],['peak','Tối ưu phụ tải đỉnh'],['balanced','Tối ưu kết hợp']],'cost')
      + button(`${icon('play-circle')} Chạy tối ưu mới`,'m16-run-opt',true);
  } else if (page === 'autonomous') {
    tools += select('m17-mode','Chế độ vận hành',[['l3','Tự động có giám sát (L3)'],['l2','Đề xuất & Phê duyệt (L2)'],['l1','Tư vấn thông minh (L1)']],'l3')
      + select('m17-period','Thời gian',[['2025-06','Tháng 06/2025'],['30d','30 ngày gần nhất']],'2025-06')
      + button(`${icon('play-circle')} Chuyển chế độ`,'m17-switch-mode',true);
  } else if (page === 'balance') {
    tools += select('period','Thời gian',[['2025-06','Tháng 06/2025'],['2025-05','Tháng 05/2025'],['2025-Q2','Quý II/2025']],'2025-06')
      + select('balance-scenario','Kịch bản',[['actual','Thực tế'],['plan','Kế hoạch'],['optimized','Tối ưu']],'actual')
      + button(`${icon('download')} Xuất báo cáo`,'export-module',true);
  } else if (page === 'targets') {
    tools += select('m5-year','Năm',[['2025','2025'],['2024','2024']],'2025')
      + select('m5-status','Trạng thái',[['all','Tất cả'],['good','Đúng tiến độ / Vượt kế hoạch'],['warning','Nguy cơ chậm'],['critical','Chậm tiến độ']],'all')
      + button(`${icon('plus')} Tạo mục tiêu mới`,'m5-create-target',true);
  } else if (page === 'savings') {
    tools += select('m7-year','Năm',[['2025','2025'],['2024','2024']],'2025')
      + select('m7-status','Trạng thái',[['all','Tất cả'],['done','Đã triển khai'],['ongoing','Đang triển khai'],['prep','Chuẩn bị đầu tư'],['proposed','Đề xuất mới']],'all')
      + button(`${icon('plus')} Đề xuất giải pháp`,'m7-create-solution',true);
  } else if (page === 'emissions') {
    tools += select('m8-year','Năm',[['2025','2025'],['2024','2024']],'2025')
      + select('m8-period','Khoảng thời gian',[['2025-06','Tháng 06/2025'],['2025-Q2','Quý II/2025'],['2025','Năm 2025']],'2025-06')
      + button(`${icon('download')} Xuất báo cáo ESG`,'m8-export-esg',true);
  } else if (page === 'iso50001') {
    tools += select('m13-year','Năm',[['2025','2025'],['2024','2024']],'2025')
      + select('m13-cycle','Chu kỳ đánh giá',[['iso2024','Chu kỳ ISO 50001:2024'],['internal','Đánh giá nội bộ'],['external','Kiểm toán bên ngoài']],'iso2024')
      + button(`${icon('plus')} Tạo hồ sơ mới`,'m13-create-record',true);
  } else if (page === 'overview') {
    tools += select('overview-period','Thời gian',[['2025-06','Tháng 06/2025'],['2025-05','Tháng 05/2025'],['2025-Q2','Quý II/2025']],'2025-06')
      + select('overview-compare','So sánh với',[['2025-05','Tháng 05/2025'],['2024-06','Cùng kỳ 2024'],['target','Mục tiêu']],'2025-05')
      + button(`${icon('download')} Xuất báo cáo`,'export-module',true);
  } else if (page === 'seu') {
    tools += select('m4-period','Thời gian',[['2025-06','Tháng 06/2025'],['2025-05','Tháng 05/2025'],['2025-Q2','Quý II/2025']],'2025-06')
      + select('m4-unit-filter','Đơn vị',[['all','Tất cả SEU'],['raw','Khai thác & Nghiền liệu'],['kiln','Lò nung & Hệ thống nung'],['cement','Nghiền xi măng'],['packing','Đóng bao & Vận chuyển'],['aux','Hệ thống phụ trợ'],['other','Khác']],'all')
      + button(`${icon('download')} Xuất báo cáo`,'export-module',true);
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
  $('#last-update').textContent = `Cập nhật: ${new Date().toLocaleTimeString('vi-VN')} · Kỳ mẫu 06/2025 · EnMS v1.1.9`;
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
