(function () {
  'use strict';

  var ROW_ID = 'smartgridDataTimeoutRow';
  var BANNER_ID = 'smartgridDataTimeoutBanner';

  function formatDateTime(value) {
    if (!value) return '--';
    var date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return date.toLocaleString('vi-VN');
  }

  function updateAlertCount(delta) {
    var countNode = document.getElementById('powerAiAlertCount');
    if (!countNode) return;
    var current = Number.parseInt(countNode.textContent || '0', 10);
    if (!Number.isFinite(current)) current = 0;
    countNode.textContent = String(Math.max(0, current + delta));
  }

  function showBanner(detail) {
    var banner = document.getElementById(BANNER_ID);
    if (!banner) {
      banner = document.createElement('div');
      banner.id = BANNER_ID;
      banner.className = 'socket-data-timeout-banner';
      banner.setAttribute('role', 'alert');
      banner.setAttribute('aria-live', 'assertive');
      document.body.appendChild(banner);
    }

    banner.innerHTML =
      '<i class="fas fa-plug"></i>' +
      '<div><strong>MÁY CHỦ MẤT DỮ LIỆU THỜI GIAN THỰC</strong>' +
      '<span>Không nhận được dữ liệu socket trong hơn 2 phút. ' +
      'Dữ liệu trên màn hình có thể đã cũ.</span></div>' +
      '<small>Lần cuối: ' + formatDateTime(detail.lastMessageAt) + '</small>';
    banner.classList.add('active');
  }

  function hideBanner() {
    var banner = document.getElementById(BANNER_ID);
    if (banner) banner.classList.remove('active');
  }

  function showTableAlert(detail) {
    var tbody = document.getElementById('powerAiAlerts');
    if (!tbody) return;

    var existing = document.getElementById(ROW_ID);
    if (existing) {
      existing.querySelector('[data-time]').textContent = formatDateTime(detail.detectedAt);
      return;
    }

    var emptyRow = tbody.querySelector('.power-ai-empty');
    if (emptyRow && emptyRow.parentElement) emptyRow.parentElement.remove();

    var row = document.createElement('tr');
    row.id = ROW_ID;
    row.className = 'power-ai-alert-row socket-data-timeout-row';
    row.innerHTML =
      '<td data-time>' + formatDateTime(detail.detectedAt) + '</td>' +
      '<td><b class="power-ai-incident-type">Server mất dữ liệu</b></td>' +
      '<td><span class="power-ai-severity critical">Nghiêm trọng</span></td>' +
      '<td>Giám sát socket</td>' +
      '<td><b>MẤT DỮ LIỆU THỜI GIAN THỰC</b>' +
      '<small>Không nhận được dữ liệu thời gian thực trong hơn 2 phút.</small>' +
      '<em>Kiểm tra máy chủ socket, kết nối mạng và tiến trình thu thập dữ liệu.</em></td>';
    tbody.prepend(row);
    updateAlertCount(1);
  }

  function removeTableAlert() {
    var row = document.getElementById(ROW_ID);
    if (!row) return;
    row.remove();
    updateAlertCount(-1);
  }

  window.addEventListener('smartgrid:data-timeout', function (event) {
    var detail = event.detail || {};
    if (detail.active) {
      showBanner(detail);
      showTableAlert(detail);
      return;
    }
    if (detail.recovered) {
      hideBanner();
      removeTableAlert();
    }
  });
})();
