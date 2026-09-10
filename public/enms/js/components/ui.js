import { state } from '../core/state.js';
import { esc, fmt } from '../core/dom.js';
import { colors } from '../core/charts.js';

export const levelNames = Object.freeze({
  critical: 'Nghiêm trọng',
  warning: 'Cảnh báo',
  minor: 'Cảnh báo nhẹ',
  info: 'Thông tin'
});

export const levelColors = Object.freeze({
  critical: '#ed5368',
  warning: '#ffab20',
  minor: '#efd546',
  info: '#129deb'
});

export function icon(name) {
  const mapped = ({
    buildings: 'building',
    'graph-up-arrow': 'graph-up',
    database: 'hdd-stack',
    leaf: 'tree-fill',
    'device-hdd': 'hdd',
    'device-ssd': 'hdd',
    'filetype-csv': 'file-earmark-spreadsheet',
    'filetype-pdf': 'file-earmark-richtext'
  })[name] || name;
  return `<i class="bi bi-${mapped}" aria-hidden="true"></i>`;
}

export function button(label, action, primary = false, extra = '') {
  return `<button class="btn ${primary ? 'primary' : ''}" data-action="${action}" ${extra}>${label}</button>`;
}

export function select(id, label, options, value = '') {
  return `<label class="field">${label}<select id="${id}">${options.map(option => {
    const [optionValue, title] = Array.isArray(option) ? option : [option, option];
    return `<option value="${esc(optionValue)}" ${optionValue === value ? 'selected' : ''}>${esc(title)}</option>`;
  }).join('')}</select></label>`;
}

export function dateInput(id, label, value) {
  return `<label class="field">${label}<input type="date" id="${id}" value="${value}" required></label>`;
}

export function stationSelect(id = 'station-filter') {
  return select(id, 'Trạm điện', [['', 'Tất cả trạm'], ...state.stations.map(item => [item.id, item.name])]);
}

export function panel(title, body, extra = '', cssClass = '') {
  return `<section class="panel ${cssClass}"><div class="panel-head"><h2>${title}</h2>${extra}</div>${body}</section>`;
}

export function table(headers, rows, cssClass = '') {
  return `<div class="table-wrap"><table class="${cssClass}"><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.join('') : `<tr><td colspan="${headers.length}" class="empty">Không có dữ liệu phù hợp với bộ lọc</td></tr>`}</tbody></table></div>`;
}

export function row(cells, attrs = '') {
  return `<tr ${attrs}>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
}

export function badge(text, type = '') {
  const glyph = type === 'critical' ? 'exclamation-triangle-fill' : type === 'info' ? 'info-circle-fill' : 'circle-fill';
  return `<span class="status ${type}">${icon(glyph)} ${esc(text)}</span>`;
}

export function tabs(items, group, active = items[0]) {
  return `<div class="tabs" role="tablist" aria-label="${esc(group)}">${items.map(item => `<button class="tab ${item === active ? 'active' : ''}" role="tab" aria-selected="${item === active}" data-tab="${esc(group)}" data-value="${esc(item)}">${esc(item)}</button>`).join('')}</div>`;
}

export function stat(label, value, unit, glyph, color = '', note = '↓ 3.2%', context = 'so với kỳ trước') {
  return `<article class="stat ${color}"><span class="stat-icon">${icon(glyph)}</span><div><div class="stat-label">${label}</div><div class="stat-value">${value}<small>${unit}</small></div><div class="stat-note"><strong>${note}</strong>${context}</div></div></article>`;
}

export function energyStats(kind = 'default') {
  const summary = state.summary;
  let cards = [
    stat('Tổng tiêu thụ điện năng', fmt(summary.energy), 'kWh', 'lightning-charge-fill'),
    stat('Sản lượng clinker (hôm nay)', fmt(summary.clinker), 'tấn', 'buildings', 'green', '↑ 1.8%', 'so với hôm qua'),
    stat('Chỉ số EnPI (Clinker)', fmt(summary.enpi), 'kWh/tấn', 'graph-up-arrow', 'green', '↓ 2.5%'),
    stat('Tổng số điểm đo', summary.meters, 'điểm đo', 'speedometer2', '', '69 hoạt động', ' · 2 lỗi'),
    stat('Tổng số trạm điện', summary.stations, 'trạm', 'diagram-3', 'purple', '16 hoạt động', ' · 0 lỗi')
  ];

  if (kind === 'realtime') {
    cards = [
      cards[0],
      stat('Công suất tức thời (P)', fmt(summary.power, 1), 'MW', 'buildings', '', '79.4%', 'công suất đặt'),
      cards[1],
      cards[2],
      stat('Phát thải CO₂ (ước tính)', summary.co2, 'tCO₂', 'cloud', 'purple', '↓ 3.1%')
    ];
  }

  if (kind === 'seu' || kind === 'reports') {
    cards = [
      cards[0],
      kind === 'reports' ? cards[2] : cards[1],
      kind === 'reports' ? stat('Chi phí năng lượng', fmt(summary.cost), 'triệu VNĐ', 'coin', 'orange', '↓ 2.1%') : cards[2],
      kind === 'reports' ? stat('Phát thải CO₂ (ước tính)', summary.co2, 'tCO₂', 'cloud', 'purple', '↓ 3.1%') : stat('Tổng chi phí năng lượng', fmt(summary.cost), 'triệu VNĐ', 'coin', 'orange', '↓ 2.1%'),
      kind === 'reports' ? stat('Tỷ lệ hoàn thành mục tiêu', '96', '%', 'bullseye', 'green', '↑ 4%', 'so với kỳ trước') : stat('Phát thải CO₂ (ước tính)', summary.co2, 'tCO₂', 'cloud', 'purple', '↓ 3.1%')
    ];
  }

  return cards.join('');
}

export function distribution(id = 'distribution', type = 'area') {
  const labels = type === 'load'
    ? ['Động cơ', 'Máy biến áp', 'Chiếu sáng', 'Phụ trợ']
    : ['Nghiền liệu 1&2', 'Đuôi lò 1&2', 'Nghiền xi 1', 'Đầu lò 1', 'Nghiền xi 2', 'Đóng bao 2', 'Cảng', 'Khác'];
  const values = type === 'load' ? [62, 21, 5, 12] : [22, 18, 16, 12, 11, 7, 6, 8];
  return `<div class="donut-layout"><div id="${id}"></div><div class="donut-legend">${labels.map((label, index) => `<div><i class="swatch" style="background:${colors[index]}"></i>${label}<b>${values[index]}%</b></div>`).join('')}</div></div>`;
}

export function stationTable(stations = state.stations) {
  return table(
    ['STT', 'Tên trạm điện', 'Điểm đo', 'Trạng thái'],
    stations.map(item => row([
      item.id,
      `<a href="#" data-action="station" data-id="${item.id}">${esc(item.name)}</a>`,
      item.meters,
      '<span class="green-text"><i class="dot"></i>Hoạt động</span>'
    ])),
    'compact'
  );
}

export function bars(stations = state.stations.slice(0, 11)) {
  return `<div class="bar-list">${stations.map(item => `<div class="bar-row"><span>${esc(item.name)}</span><div class="bar-track"><span style="width:${item.power / item.capacity * 100}%"></span></div><b>${item.power}</b><small>${item.capacity}</small></div>`).join('')}</div><div class="legend"><span><i class="dot blue"></i>Công suất hiện tại (MW)</span><span>▰ Công suất đặt (MW)</span></div>`;
}

export function recentAlerts(base) {
  return table(
    ['Thời gian', 'Trạm / Thiết bị', 'Nội dung', 'Mức độ'],
    state.alerts.slice(0, 5).map(item => row([
      item.time.slice(11),
      esc(item.station),
      `<a href="${base}alerts">${esc(item.message)}</a>`,
      badge(levelNames[item.severity], item.severity)
    ])),
    'compact'
  );
}

export function pagination(result, kind) {
  const pageCount = Math.ceil(result.total / result.pageSize);
  return `<div class="pagination"><span>Hiển thị ${result.total ? ((result.page - 1) * result.pageSize + 1) : 0}–${Math.min(result.page * result.pageSize, result.total)} / ${result.total} bản ghi</span><button data-action="${kind}-page" data-page="${result.page - 1}" ${result.page === 1 ? 'disabled' : ''} aria-label="Trang trước">‹</button>${Array.from({ length: Math.min(5, pageCount) }, (_, index) => `<button class="${result.page === index + 1 ? 'active' : ''}" data-action="${kind}-page" data-page="${index + 1}">${index + 1}</button>`).join('')}<button data-action="${kind}-page" data-page="${result.page + 1}" ${result.page * result.pageSize >= result.total ? 'disabled' : ''} aria-label="Trang sau">›</button></div>`;
}

export function seuTable(rows = state.seu) {
  return table(
    ['STT', 'SEU', 'Loại năng lượng', 'Tiêu thụ (kWh)', 'Sản lượng (tấn)', 'EnPI', 'So với kỳ trước'],
    rows.map((item, index) => row([
      index + 1,
      `<a href="#" data-action="station" data-id="${item.id}">${esc(item.name)}</a>`,
      'Điện',
      fmt(item.energy),
      item.production ? fmt(item.production) : '—',
      item.production ? item.enpi : '—',
      '<span class="green-text">↓ 2.5%</span>'
    ])),
    'compact'
  );
}
