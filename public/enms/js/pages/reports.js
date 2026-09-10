import { state } from '../core/state.js';
import { $, csv, esc, render, showDialog, toast } from '../core/dom.js';
import { allRows, request } from '../core/api.js';
import { chart, days, donut } from '../core/charts.js';
import { badge, button, distribution, energyStats, icon, row, seuTable, table, tabs } from '../components/ui.js';

function reportTable(reports) {
  return table(['STT','Tên báo cáo','Loại báo cáo','Khoảng thời gian','Ngày tạo','Trạng thái','Thao tác'],reports.map((item,index)=>row([
    index+1,esc(item.name),esc(item.type),`${esc(item.from)} – ${esc(item.to)}`,esc(item.createdAt.slice(0,16).replace('T',' ')),badge(item.status),button(icon('eye'),'view-report',false,`data-id="${item.id}" aria-label="Xem báo cáo ${item.id}"`)
  ])),'compact');
}

function renderReportInsight() {
  const copy = {
    'Định kỳ':'Tổng hợp tiêu thụ, EnPI và hiệu quả năng lượng theo kỳ báo cáo.',
    'Tùy chọn':'Chọn loại báo cáo và khoảng thời gian ở phía trên, sau đó bấm Tạo báo cáo.',
    'So sánh':'So sánh cùng kỳ: điện năng giảm 3.2%, EnPI giảm 2.5% trong bộ dữ liệu mẫu.',
    'Phát thải':'Phát thải CO₂ ước tính: 652 tCO₂. Hệ số phát thải cần được xác nhận khi kết nối dữ liệu thực.',
    'Tuân thủ':'Theo dõi dữ liệu phục vụ quản lý năng lượng ISO 50001. Báo cáo mẫu chưa phải chứng nhận tuân thủ.',
    'Quản trị':'Mục tiêu tiết kiệm: 3% · Tiến độ: 62% · Tổng cơ hội tiết kiệm: 342,000 kWh/năm.'
  };
  render('#report-insight', `<div class="notice">${copy[state.reportTab]}</div>`);
}

export async function mount() {
  state.reports = (await request('reports')).data;
  render('#reports-tabs', tabs(['Định kỳ','Tùy chọn','So sánh','Phát thải','Tuân thủ','Quản trị'],'reports',state.reportTab));
  render('#reports-summary', energyStats('reports'));
  render('#report-distribution-body', distribution('report-distribution'));
  render('#report-seu-table', seuTable(state.seu.slice(0,8)));
  render('#report-enpi-summary', '<div class="mini-stats"><div class="mini-stat">EnPI trung bình<b>684 <small>kWh/tấn</small></b></div><div class="mini-stat">Mục tiêu kỳ này<b>700 <small>kWh/tấn</small></b></div><div class="mini-stat">Cải thiện<b class="green-text">↓ 2.5%</b></div></div>');
  render('#report-list', reportTable(state.reports));
  render('#report-export', `<div class="exports"><button class="export-card" data-action="export-excel">${icon('file-earmark-excel')}Xuất Excel (.xlsx)</button><button class="export-card" data-action="print-report">${icon('filetype-pdf')}In / Lưu PDF</button><button class="export-card" data-action="export-chart">${icon('file-earmark-image')}Biểu đồ PNG</button></div><div class="divider"></div><h3>${icon('clock')} Báo cáo định kỳ</h3><p>Bản 1.0.1 hỗ trợ tạo và xuất thủ công. Lịch gửi tự động sẽ được cấu hình khi nối nguồn dữ liệu thực.</p>`);
  chart('report-energy','area',[{name:'Tổng tiêu thụ',data:[740,882,870,976,925,835,879,883,967,968]},{name:'Sản xuất Clinker',data:[470,540,545,606,577,509,512,547,597,592]},{name:'Sản xuất Xi măng',data:[271,293,290,292,287,269,303,320,320,318]},{name:'Phụ trợ',data:[105,110,108,108,106,104,110,115,116,118]}],{categories:days(),height:245});
  donut('report-distribution',[22,18,16,12,11,7,6,8],'8,524,630');
  chart('report-enpi','bar',[{name:'EnPI thực tế',data:[681,685,678,690,676,685,680,682,688,684]}],{categories:days(),height:220,plotOptions:{bar:{columnWidth:'45%',borderRadius:2}},annotations:{yaxis:[{y:700,borderColor:'#0bb38a',label:{text:'Mục tiêu: 700',style:{color:'#079b76',background:'#eafff7'}}}]}});
  renderReportInsight();
}

export async function onTab(group, value) {
  if (group !== 'reports') return false;
  state.reportTab = value;
  renderReportInsight();
  if (['Phát thải','So sánh'].includes(value) && $('#report-type')) $('#report-type').value = value;
  return true;
}

export async function onAction(name, target) {
  if (name === 'export-seu') {
    csv('enms-bao-cao-nang-luong',['SEU','Điện năng (kWh)','Sản lượng (tấn)','EnPI (kWh/tấn)','Kỳ trước'],state.seu.map(item=>[item.name,item.energy,item.production,item.enpi,item.previous]));
    return true;
  }
  if (name === 'export-excel') {
    const sheet = XLSX.utils.aoa_to_sheet([['Khu vực / SEU','Điện năng (kWh)','Sản lượng (tấn)','EnPI (kWh/tấn)','Kỳ trước'],...state.seu.map(item=>[item.name,item.energy,item.production,item.enpi,item.previous])]);
    sheet['!cols']=[{wch:26},{wch:22},{wch:22},{wch:22},{wch:15}];
    const book=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book,sheet,'Báo cáo năng lượng');
    XLSX.writeFile(book,'EnMS-bao-cao-nang-luong.xlsx');
    toast('Đã xuất báo cáo Excel.');
    return true;
  }
  if (name === 'create-report') {
    const params={type:$('#report-type').value,from:$('#report-from').value,to:$('#report-to').value};
    const result=(await request('reports',params,'POST')).data;
    state.reports=(await request('reports')).data;
    render('#report-list',reportTable(state.reports));
    toast(`Đã tạo ${result.name} (dữ liệu mẫu).`);
    return true;
  }
  if (name === 'view-report') {
    const report=(await request(`reports/${target.dataset.id}`)).data;
    showDialog(report.name,`<div class="notice">Báo cáo minh họa · EnMS 1.0.1 · ${esc(report.from)} – ${esc(report.to)}</div><div class="mini-stats"><div class="mini-stat">Điện năng<b>8,524,630 kWh</b></div><div class="mini-stat">EnPI<b>684 kWh/tấn</b></div><div class="mini-stat">CO₂ ước tính<b>652 tCO₂</b></div></div><div class="divider"></div>${seuTable(state.seu)}<p>Ngày tạo: ${esc(report.createdAt)} · ${esc(report.creator)}</p><div style="margin-top:16px">${button(`${icon('printer')} In / Lưu PDF`,'print-report',true)}</div>`);
    return true;
  }
  if (name === 'print-report') { window.print(); return true; }
  if (name === 'export-chart') {
    const targetChart=state.charts.find(item=>item.el?.id==='report-energy');
    if (targetChart) {
      const {imgURI}=await targetChart.dataURI();
      const anchor=document.createElement('a');anchor.href=imgURI;anchor.download='enms-tieu-thu-dien.png';anchor.click();
      toast('Đã xuất biểu đồ PNG.');
    }
    return true;
  }
  return false;
}
