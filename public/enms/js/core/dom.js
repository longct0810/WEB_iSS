import { state } from './state.js';

export const $ = selector => document.querySelector(selector);
export const $$ = selector => [...document.querySelectorAll(selector)];

export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

export function fmt(value, digits = 0) {
  return Number(value).toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

export function render(selector, html) {
  const element = typeof selector === 'string' ? $(selector) : selector;
  if (element) element.innerHTML = html;
  return element;
}

export function showDialog(title, html) {
  $('#dialog-title').textContent = title;
  $('#dialog-content').innerHTML = html;
  $('#detail-dialog').showModal();
}

export function toast(message) {
  const target = $('#toast');
  target.textContent = message;
  target.hidden = false;
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => { target.hidden = true; }, 4000);
}

export function showError(error) {
  const target = $('#error-banner');
  target.textContent = error?.message || 'Không thể thực hiện thao tác';
  target.hidden = false;
}

export function clearError() {
  $('#error-banner').hidden = true;
}

export function download(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function csv(name, headers, rows) {
  const encode = value => {
    let text = String(value ?? '');
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  download(
    `${name}.csv`,
    `\ufeff${[headers, ...rows].map(row => row.map(encode).join(',')).join('\r\n')}`,
    'text/csv;charset=utf-8'
  );
  toast(`Đã xuất ${rows.length} bản ghi CSV.`);
}
