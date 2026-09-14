export const page = document.body.dataset.page;
export const preview = document.body.dataset.preview === 'true';
export const base = `/enms/${preview ? 'preview/' : ''}`;
export const VERSION = '1.1.1';

export const descriptions = Object.freeze({
  overview: 'Bức tranh điều hành toàn nhà máy: năng lượng, sản lượng, EnPI, phát thải, cảnh báo và tiến độ mục tiêu.',
  realtime: 'Theo dõi liên tục công suất, điện năng, chất lượng điện, trạng thái trạm và điểm đo theo thời gian thực.',
  balance: 'Bản đồ dòng năng lượng từ đầu vào đến các công đoạn, sản phẩm và tổn thất; hỗ trợ cân bằng, đối soát và phát hiện chênh lệch.',
  seu: 'Quản lý khu vực sử dụng năng lượng đáng kể (SEU), EnPI và các yếu tố ảnh hưởng hiệu suất năng lượng.',
  targets: 'Thiết lập mục tiêu, theo dõi KPI và quản lý kế hoạch hành động cải tiến năng lượng theo ISO 50001.',
  alerts: 'Phân tích & cảnh báo theo mức độ, khu vực, nguyên nhân và trạng thái xử lý để ưu tiên hành động.',
  savings: 'Quản lý cơ hội tiết kiệm, dự án cải tiến và đo lường & xác minh hiệu quả tiết kiệm năng lượng (M&V).',
  emissions: 'Theo dõi phát thải CO₂, cơ cấu nguồn phát thải và các chỉ số ESG liên quan đến sử dụng năng lượng.',
  reports: 'Tạo, quản lý, lập lịch và xuất các báo cáo quản trị, EnPI, phát thải, vận hành và tuân thủ.',
  data: 'Quản lý nguồn dữ liệu, chất lượng dữ liệu, trạng thái thu thập, lịch sử đo đếm và cấu hình hệ thống.',
  forecast: 'Dự báo phụ tải và tiêu thụ năng lượng, xây dựng kế hoạch theo ngày/tuần/tháng và so sánh các kịch bản.',
  optimization: 'Tối ưu vận hành, xếp hạng cơ hội và hỗ trợ ra quyết định theo chi phí, năng lượng, rủi ro và sản lượng.',
  iso50001: 'Theo dõi mức độ đáp ứng ISO 50001, kế hoạch kiểm toán năng lượng, phát hiện và hành động khắc phục.',
  analytics: 'AI phát hiện bất thường, dự báo xu hướng, nhận diện nguyên nhân và đánh giá độ tin cậy mô hình.',
  'digital-twin': 'Mô hình số nhà máy để quan sát trạng thái tài sản, mô phỏng kịch bản và so sánh thực tế với mô hình.',
  'ai-decision': 'AI tối ưu đa mục tiêu và đề xuất quyết định có giải thích, mức tin cậy, tác động và lợi ích ước tính.',
  autonomous: 'Điều phối năng lượng tự động theo chính sách, vòng kiểm soát và cơ chế an toàn có giám sát của người vận hành.',
  map: 'Sơ đồ một sợi (Single Line Diagram) và bản đồ 16 trạm điện của nhà máy.',
  settings: 'Quản lý nhà máy, người dùng, phân quyền và cấu hình thiết bị.'
});

export const advancedPages = new Set([
  'balance','targets','savings','emissions','forecast','optimization','iso50001','analytics','digital-twin','ai-decision','autonomous'
]);
