export const page = document.body.dataset.page;
export const preview = document.body.dataset.preview === 'true';
export const base = `/enms/${preview ? 'preview/' : ''}`;
export const VERSION = '1.0.1';

export const descriptions = Object.freeze({
  overview: 'Giám sát · Phân tích · Cải tiến hiệu quả năng lượng',
  realtime: 'Theo dõi liên tục thông số điện năng tại 16 trạm điện và 71 điểm đo trên toàn nhà máy',
  map: 'Sơ đồ một sợi (Single Line Diagram) và bản đồ 16 trạm điện của nhà máy',
  seu: 'Quản lý các khu vực sử dụng năng lượng đáng kể và chỉ số hiệu suất năng lượng',
  reports: 'Tạo, xem và xuất các báo cáo năng lượng, EnPI, phát thải và vận hành nhà máy',
  alerts: 'Giám sát, phát hiện và quản lý các bất thường trong tiêu thụ năng lượng, thiết bị và truyền thông',
  data: 'Xem, tìm kiếm và quản lý dữ liệu đo đếm từ 71 điểm đo tại 16 trạm điện',
  settings: 'Quản lý nhà máy, người dùng, phân quyền và cấu hình thiết bị'
});
