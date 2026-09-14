'use strict';

/**
 * EnMS Advanced v1.1.0 – 17 module theo bộ giao diện 14/09/2026.
 * `label` dùng ở sidebar, `title` dùng ở tiêu đề trang.
 */
module.exports = Object.freeze([
  { id: 'overview', code: 'M1', label: 'Tổng quan', title: 'Executive Dashboard – Tổng quan điều hành', icon: 'speedometer2', group: 'core', demo: true },
  { id: 'realtime', code: 'M2', label: 'Giám sát thời gian thực', title: 'Giám sát thời gian thực', icon: 'graph-up', group: 'core', demo: true },
  { id: 'balance', code: 'M3', label: 'Bản đồ & Energy Balance', title: 'Bản đồ năng lượng & Energy Balance', icon: 'diagram-3', group: 'core', demo: true },
  { id: 'seu', code: 'M4', label: 'SEU & EnPI', title: 'SEU & EnPI', icon: 'bar-chart-line', group: 'core', demo: true },
  { id: 'targets', code: 'M5', label: 'Mục tiêu & Hành động', title: 'Mục tiêu & Hành động', icon: 'bullseye', group: 'core', demo: true },
  { id: 'alerts', code: 'M6', label: 'Phân tích & Cảnh báo', title: 'Phân tích & Cảnh báo', icon: 'bell', group: 'core', demo: true },
  { id: 'savings', code: 'M7', label: 'Tiết kiệm năng lượng & M&V', title: 'Tiết kiệm năng lượng & M&V', icon: 'cash-stack', group: 'performance', demo: true },
  { id: 'emissions', code: 'M8', label: 'Phát thải CO₂ & ESG', title: 'Phát thải CO₂ & ESG', icon: 'cloud', group: 'performance', demo: true },
  { id: 'reports', code: 'M9', label: 'Báo cáo', title: 'Báo cáo & Dashboard quản trị', icon: 'file-earmark-bar-graph', group: 'performance', demo: true },
  { id: 'data', code: 'M10', label: 'Quản lý dữ liệu & Hệ thống', title: 'Quản lý dữ liệu & Hệ thống', icon: 'hdd-stack', group: 'performance', demo: true },
  { id: 'forecast', code: 'M11', label: 'Dự báo & Kế hoạch năng lượng', title: 'Dự báo & Kế hoạch năng lượng', icon: 'calendar3', group: 'advanced', demo: true },
  { id: 'optimization', code: 'M12', label: 'Tối ưu hóa & Hỗ trợ ra quyết định', title: 'Tối ưu hóa & Hỗ trợ ra quyết định', icon: 'sliders', group: 'advanced', demo: true },
  { id: 'iso50001', code: 'M13', label: 'ISO 50001 & Kiểm toán', title: 'ISO 50001 & Kiểm toán năng lượng', icon: 'patch-check', group: 'advanced', demo: true },
  { id: 'analytics', code: 'M14', label: 'AI Analytics & Dự báo', title: 'AI Analytics & Predictive Intelligence', icon: 'cpu', group: 'ai', demo: true },
  { id: 'digital-twin', code: 'M15', label: 'Digital Twin', title: 'Energy Digital Twin', icon: 'grid-3x3-gap', group: 'ai', demo: true },
  { id: 'ai-decision', code: 'M16', label: 'AI Optimization', title: 'AI Optimization & Decision Intelligence', icon: 'stars', group: 'ai', demo: true },
  { id: 'autonomous', code: 'M17', label: 'Tự động điều hành', title: 'Autonomous Energy Management', icon: 'gear-wide-connected', group: 'ai', demo: true }
]);
