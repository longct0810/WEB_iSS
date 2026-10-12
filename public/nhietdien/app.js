'use strict';

const clock = document.getElementById('clock');
function updateClock() {
  if (!clock) return;
  clock.textContent = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(new Date());
}
updateClock();
window.setInterval(updateClock, 1000);

document.querySelectorAll('.nav-link.disabled').forEach(link => {
  link.addEventListener('click', event => event.preventDefault());
});

// Small data binding surface for future polling/WebSocket integrations. Only
// existing keys are accepted; units and equipment geometry stay in the SVG.
(() => {
  const diagrams = new Map(Array.from(document.querySelectorAll('[data-diagram]'),
    root => [root.dataset.diagram, root]));
  const labels = {running:'Đang vận hành', stopped:'Dừng (bảo dưỡng)', warning:'Cảnh báo'};

  function getData(name) {
    const root = diagrams.get(name);
    if (!root) return null;
    const result = {};
    root.querySelectorAll('[data-value]').forEach(node => {
      result[node.dataset.value] = node.dataset.kind === 'number'
        ? Number(node.dataset.raw) : node.dataset.raw;
    });
    root.querySelectorAll('[data-state]').forEach(node => {
      result[node.dataset.state] = Object.keys(labels).find(state => node.classList.contains(state));
    });
    return result;
  }

  function setData(name, patch) {
    const root = diagrams.get(name);
    if (!root || !patch || typeof patch !== 'object' || Array.isArray(patch)) return 0;
    let updated = 0;
    root.querySelectorAll('[data-value]').forEach(node => {
      const key = node.dataset.value;
      if (!Object.prototype.hasOwnProperty.call(patch, key)) return;
      const value = patch[key];
      if (node.dataset.kind === 'number') {
        if (typeof value !== 'number' || !Number.isFinite(value)) return;
        const decimals = Number(node.dataset.decimals) || 0;
        node.textContent = new Intl.NumberFormat('vi-VN', {
          minimumFractionDigits:decimals, maximumFractionDigits:decimals
        }).format(value);
      } else {
        if (typeof value !== 'string') return;
        node.textContent = value;
      }
      node.dataset.raw = String(value);
      updated++;
    });
    root.querySelectorAll('[data-state]').forEach(node => {
      const key = node.dataset.state;
      if (!Object.prototype.hasOwnProperty.call(patch, key)) return;
      const state = patch[key];
      if (!Object.prototype.hasOwnProperty.call(labels, state)) return;
      node.classList.remove(...Object.keys(labels));
      node.classList.add(state);
      node.querySelector('text').textContent = labels[state];
      root.querySelectorAll('[data-state-indicator]').forEach(indicator => {
        if (indicator.dataset.stateIndicator !== key) return;
        indicator.classList.remove(...Object.keys(labels));
        indicator.classList.add(state);
      });
      updated++;
    });
    return updated;
  }

  function update(payload) {
    if (!payload || typeof payload !== 'object') return 0;
    return Object.entries(payload).reduce((count,[name,patch]) => count + setData(name,patch),0);
  }

  window.NhietDienDiagrams = Object.freeze({getData,setData,update});
  document.addEventListener('nhietdien:data', event => update(event.detail));
})();
