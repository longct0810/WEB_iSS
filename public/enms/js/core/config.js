export const page = document.body.dataset.page;
export const preview = document.body.dataset.preview === 'true';
export const base = `/enms/${preview ? 'preview/' : ''}`;
export const VERSION = '1.1.9';

export const descriptions = Object.freeze({
  overview: 'Cái nhìn toàn diện về năng lượng — sản xuất — chi phí — phát thải — hiệu quả — tiến độ mục tiêu.',
  realtime: 'Theo dõi liên tục các thông số năng lượng, vận hành tại 16 trạm điện và các hệ thống năng lượng khác.',
  balance: 'Theo dõi dòng năng lượng từ đầu vào → các công đoạn → sản phẩm và tổn thất.',
  seu: 'Quản lý khu vực sử dụng năng lượng đáng kể (SEU), EnPI và các yếu tố ảnh hưởng hiệu suất năng lượng.',
  targets: 'Thiết lập mục tiêu, theo dõi KPI và quản lý kế hoạch hành động cải tiến năng lượng theo ISO 50001.',
  alerts: 'Phân tích & cảnh báo theo mức độ, khu vực, nguyên nhân và trạng thái xử lý để ưu tiên hành động.',
  savings: 'Xác định, theo dõi và đo lường hiệu quả các giải pháp tiết kiệm năng lượng (ISO 50001 & IPMVP).',
  emissions: 'Đo lường, giám sát, phân tích và báo cáo phát thải khí nhà kính, hỗ trợ chiến lược phát triển bền vững.',
  reports: 'Tổng hợp dữ liệu – Phân tích – Tự động hóa báo cáo – Phục vụ điều hành và công bố ESG.',
  data: 'Kết nối – Thu thập – Lưu trữ – Xử lý – Bảo mật – Phục vụ vận hành và báo cáo năng lượng & ESG.',
  forecast: 'Dự báo nhu cầu – Lập kế hoạch – Quản lý ngân sách năng lượng – Hỗ trợ điều hành sản xuất.',
  optimization: 'Tối ưu vận hành – Giảm chi phí năng lượng – Giảm phát thải – Tăng hiệu quả sản xuất.',
  iso50001: 'Quản lý tuân thủ – Bằng chứng – Đánh giá – Hành động khắc phục – Cải tiến liên tục.',
  analytics: 'AI phát hiện bất thường, dự báo xu hướng, nhận diện nguyên nhân và đánh giá độ tin cậy mô hình.',
  'digital-twin': 'Mô hình số nhà máy để quan sát trạng thái tài sản, mô phỏng kịch bản và so sánh thực tế với mô hình.',
  'ai-decision': 'AI tối ưu đa mục tiêu và đề xuất quyết định có giải thích, mức tin cậy, tác động và lợi ích ước tính.',
  autonomous: 'Điều phối năng lượng tự động theo chính sách, vòng kiểm soát và cơ chế an toàn có giám sát của người vận hành.',
  map: 'Sơ đồ một sợi (Single Line Diagram) và bản đồ 16 trạm điện của nhà máy.',
  settings: 'Quản lý nhà máy, người dùng, phân quyền và cấu hình thiết bị.'
});

export const advancedPages = new Set([
  'targets','savings','emissions','forecast','optimization','iso50001','analytics','digital-twin','ai-decision','autonomous'
]);
