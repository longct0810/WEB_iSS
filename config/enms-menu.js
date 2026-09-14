'use strict';

/**
 * EnMS Advanced v1.1.9 – 17 module theo bộ giao diện 14/09/2026.
 * `label` dùng ở sidebar, `title` dùng ở tiêu đề trang.
 */
module.exports = Object.freeze([
  { id: 'overview', code: 'M1', label: 'Tổng quan', title: 'M1. EXECUTIVE DASHBOARD – TỔNG QUAN ĐIỀU HÀNH', icon: 'speedometer2', group: 'core', demo: true },
  { id: 'realtime', code: 'M2', label: 'Giám sát thời gian thực', title: 'M2 - GIÁM SÁT THỜI GIAN THỰC', icon: 'graph-up', group: 'core', demo: true },
  { id: 'balance', code: 'M3', label: 'Bản đồ & Energy Balance', title: 'M3 - BẢN ĐỒ NĂNG LƯỢNG & ENERGY BALANCE', icon: 'diagram-3', group: 'core', demo: true },
  { id: 'seu', code: 'M4', label: 'SEU & EnPI', title: 'SEU & EnPI', icon: 'bar-chart-line', group: 'core', demo: true },
  { id: 'targets', code: 'M5', label: 'Mục tiêu & Hành động', title: 'M5 - MỤC TIÊU & HÀNH ĐỘNG', icon: 'clipboard-check', group: 'core', demo: true },
  { id: 'alerts', code: 'M6', label: 'Phân tích & Cảnh báo', title: 'M6 - PHÂN TÍCH & CẢNH BÁO', icon: 'exclamation-triangle', group: 'core', demo: true },
  { id: 'savings', code: 'M7', label: 'Tiết kiệm năng lượng & M&V', title: 'Tiết kiệm năng lượng & M&V', icon: 'cash-stack', group: 'performance', demo: true },
  { id: 'emissions', code: 'M8', label: 'Phát thải CO₂ & ESG', title: 'Phát thải CO₂ & ESG', icon: 'cloud', group: 'performance', demo: true },
  { id: 'reports', code: 'M9', label: 'Báo cáo', title: 'M9 - BÁO CÁO & DASHBOARD QUẢN TRỊ', icon: 'file-earmark-bar-graph', group: 'performance', demo: true },
  { id: 'data', code: 'M10', label: 'Quản lý dữ liệu & Hệ thống', title: 'M10 - QUẢN LÝ DỮ LIỆU & HỆ THỐNG (DATA MANAGEMENT & IT/OT)', icon: 'hdd-stack', group: 'performance', demo: true },
  { id: 'forecast', code: 'M11', label: 'Dự báo & Kế hoạch năng lượng', title: 'M11 – DỰ BÁO & KẾ HOẠCH NĂNG LƯỢNG', icon: 'calendar3', group: 'advanced', demo: true },
  { id: 'optimization', code: 'M12', label: 'Tối ưu hóa & Hỗ trợ ra quyết định', title: 'M12 – TỐI ƯU HÓA & HỖ TRỢ RA QUYẾT ĐỊNH', icon: 'sliders', group: 'advanced', demo: true },
  { id: 'iso50001', code: 'M13', label: 'ISO 50001 & Kiểm toán', title: 'M13 – ISO 50001 & KIỂM TOÁN NĂNG LƯỢNG', icon: 'patch-check', group: 'advanced', demo: true },
  { id: 'analytics', code: 'M14', label: 'AI Analytics & Dự báo', title: 'M14 – AI ANALYTICS & PREDICTIVE INTELLIGENCE', icon: 'cpu', group: 'ai', demo: true },
  { id: 'digital-twin', code: 'M15', label: 'Digital Twin', title: 'M15 – ENERGY DIGITAL TWIN', icon: 'grid-3x3-gap', group: 'ai', demo: true },
  { id: 'ai-decision', code: 'M16', label: 'AI Optimization', title: 'M16 – AI OPTIMIZATION & DECISION INTELLIGENCE', icon: 'stars', group: 'ai', demo: true },
  { id: 'autonomous', code: 'M17', label: 'Tự động điều hành', title: 'M17 – AUTONOMOUS ENERGY MANAGEMENT', icon: 'gear-wide-connected', group: 'ai', demo: true }
]);
