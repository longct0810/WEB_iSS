'use strict';

/**
 * Menu EnMS v1.0.1.
 * `demo: true` tương ứng 7 màn hình nghiệp vụ được dựng theo bộ ảnh mẫu.
 * Settings giữ vai trò cổng vào các màn hình quản trị sẵn có của project gốc.
 */
module.exports = Object.freeze([
  { id: 'overview', title: 'Tổng quan', icon: 'house-door', demo: true },
  { id: 'realtime', title: 'Giám sát thời gian thực', icon: 'graph-up', demo: true },
  { id: 'map', title: 'Bản đồ & Sơ đồ trạm', icon: 'diagram-3', demo: true },
  { id: 'seu', title: 'SEU & EnPI', icon: 'bar-chart-line', demo: true },
  { id: 'reports', title: 'Báo cáo', icon: 'file-earmark-bar-graph', demo: true },
  { id: 'alerts', title: 'Cảnh báo & Sự kiện', icon: 'bell', demo: true },
  { id: 'data', title: 'Quản lý dữ liệu', icon: 'hdd-stack', demo: true },
  { id: 'settings', title: 'Cài đặt hệ thống', icon: 'gear', demo: false }
]);
