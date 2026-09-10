# iSS PowerAI v1.5.0 - Vietnamese Ollama Assistant

- Bắt buộc chatbot trả lời bằng tiếng Việt và kích hoạt `/no_think` cho Qwen3.
- Không chuyển tiếp trường reasoning/thinking từ Ollama tới trình duyệt.
- Thêm API streaming `POST /api/ai/chat/stream`.
- Trong thời gian chờ chỉ hiển thị trạng thái phân tích, đọc PowerAI và tổng hợp.
- Hiển thị dần câu trả lời cuối cùng, không hiển thị nội dung suy luận.
- Bổ sung định dạng Markdown an toàn, nút sao chép và nguồn/thời gian dữ liệu PowerAI.

## [1.4.1] - 2026-08-06

### Changed

- Khi Ollama đang xử lý, chatbot chỉ hiển thị biểu tượng robot, dòng chữ `Đang suy nghĩ` và ba chấm nhấp nháy.
- Không hiển thị nội dung suy luận nội bộ của model.
- Lọc dự phòng các khối `<think>...</think>` và `<thinking>...</thinking>` tại cả backend và frontend.
- Chỉ render câu trả lời cuối cùng sau khi Ollama hoàn tất.

## 1.4.0 - Ollama AI Assistant - 2026-08-06

### Added

- Tích hợp chatbot AI local qua Ollama, model mặc định `qwen3:4b`.
- Thêm API `/api/ai/health`, `/api/ai/models`, `/api/ai/chat` và `/api/ai/reset`.
- Chatbot sử dụng ngữ cảnh sức khỏe, cảnh báo và dự báo từ PowerAI theo thiết bị đang chọn.
- Lưu ngữ cảnh hội thoại ngắn theo `conversation_id`; cho phép tạo hội thoại mới.
- Hiển thị trạng thái AI Online/Offline và model đang hoạt động trên giao diện Dashboard.
- Bổ sung kiểm soát timeout, giới hạn nội dung và nguyên tắc không tự tạo số liệu vận hành.

### Changed

- Nâng phiên bản iSS lên `1.4.0`.
- Chatbot Dashboard chuyển từ endpoint chat cố định của PowerAI sang lớp điều phối Ollama + PowerAI.

## 0.7.1 - PowerAI Client 1.3.1

- Sửa thời gian cảnh báo bị trống.
- Hiển thị snapshot UA/UB/UC, IA/IB/IC, Cosφ, tần số và nhiệt độ trong modal.
- Đổi Drift thành “Độ ổn định dữ liệu AI” và Việt hóa trạng thái.


## ISS Frontend 0.6.1 / PowerAI Client 1.2.1 - 2026-08-05

### Fixed

- Tách `client_key` dùng cho giao diện khỏi `event_id` nghiệp vụ.
- Không còn gửi ID tự tạo như `meter-time-incident_type` tới API feedback UUID.
- Chỉ gửi các `event_id` đúng định dạng UUID.
- Hỗ trợ gửi feedback theo `incident_id` khi không có event UUID.
- Hiển thị thông báo rõ ràng khi cảnh báo cũ chưa có UUID hợp lệ.
- Proxy Node.js lọc UUID trước khi chuyển payload tới PowerAI.

# 0.5.2 - 2026-08-04

- Nâng PowerAI Client lên 1.1.0.
- Đồng bộ cảnh báo Explainable Alerts và Incident Classifier.
- Hiển thị PowerAI/model version và ACTIVE/SHADOW/MAINTENANCE.
- Thêm loại cảnh báo, confidence, root cause và recommendation.
- Loại bỏ placeholder “Chưa xác định” đối với cảnh báo có dữ liệu.

# Changelog

Tất cả thay đổi đáng chú ý của SMARTGRID_ được ghi lại trong tài liệu này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
và dự án sử dụng [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.1] - 2026-07-31

### Changed

- Đồng bộ các màn hình dùng sidebar mới với giao diện tối của Dashboard, bao
  gồm nền, card, bộ lọc, bảng, tab, modal và Select2.
- Tăng cache version của tài nguyên Business UI để trình duyệt nhận ngay CSS và
  JavaScript mới.

### Fixed

- Đánh dấu menu đang truy cập trực tiếp từ route phía server, không còn phụ
  thuộc thời điểm JavaScript khởi tạo.
- Sửa Select2 dropdown và các stylesheet riêng của trang ghi đè màu giao diện
  chung trên Thống kê số liệu và Thông số vận hành.

## [0.5.0] - 2026-07-31

### Added

- Thêm lớp giao diện nghiệp vụ dùng chung cho các màn hình ngoài Dashboard:
  card, biểu mẫu, bảng/DataTables, modal, nút, menu, responsive và hỗ trợ
  `prefers-reduced-motion`.
- Thêm kiểm thử tự động bảo đảm các chức năng đang hiển thị trên menu đều có
  route và template hợp lệ, không khai báo trùng route GET và Dashboard không
  nạp nhầm CSS nghiệp vụ.
- Thêm tự động đánh dấu chức năng menu hiện tại và hỗ trợ bàn phím cho menu
  sidebar.

### Changed

- Chuẩn hóa giao diện cho 34 chức năng trên menu nghiệp vụ cũ và các màn hình
  IOA, thống kê số liệu, thông số vận hành SCADA, người dùng, nhật ký đăng nhập,
  nhà máy, cảnh báo, báo cáo vận hành và giám sát TBA trên menu mới.
- Chuẩn hóa nhãn menu, trạng thái đang chọn và giao diện responsive trên desktop,
  tablet và mobile.
- Chuyển Font Awesome của các màn hình nghiệp vụ mới từ CDN sang tài nguyên
  local.
- Nâng phiên bản SMARTGRID lên `0.5.0`.

### Fixed

- Sửa route `/dienapthap` trỏ sai chữ hoa/thường của template trên Linux.
- Loại bỏ route `/dulieusonghai` bị khai báo trùng.
- Loại bỏ tiêu đề thừa đứng trước cấu trúc tài liệu ở màn hình khai báo khách
  hàng.

## [0.4.0] - 2026-07-31

### Added

- Tích hợp endpoint backtest theo thời gian của PowerAI và hiển thị PSI score
  drift trên Dashboard.
- Proxy SMARTGRID cho `/v1/p1/evaluation/temporal`.

### Changed

- Dashboard tương thích forecast v3 và quy trình đánh giá P1 của PowerAI
  `0.10.0`.
- Nâng SMARTGRID lên `0.4.0`.

## [0.3.4] - 2026-07-31

### Fixed

- Dịch glyph cửa khoang xuống 2px so với hiệu chỉnh trước để cân giữa theo
  chiều dọc của khung trạng thái.

## [0.3.3] - 2026-07-31

### Fixed

- Căn giữa quang học icon nhãn trạng thái và biểu tượng cửa trong card Khoang
  hạ thế; giảm khoảng cách icon–nhãn để ba cột cân đối hơn.

## [0.3.2] - 2026-07-31

### Changed

- Mở rộng hiệu ứng cập nhật realtime từ Khoang hạ thế sang các KPI điện,
  thống kê THD, điện áp/dòng realtime, điểm sức khỏe và dự báo PowerAI.
- Mỗi card chỉ pulse khi dữ liệu thuộc card đó thay đổi; không áp hiệu ứng lên
  biểu đồ và bảng cảnh báo để hạn chế nhiễu thị giác.

## [0.3.1] - 2026-07-31

### Added

- Thêm hiệu ứng realtime cho số liệu khoang hạ thế: pulse khi đổi giá trị,
  phân biệt xu hướng tăng/giảm và highlight nhẹ hàng pha vừa cập nhật.
- Thêm hiệu ứng cho kết luận phân tích điện–nhiệt khi trạng thái hoặc chẩn đoán
  thay đổi.
- Tôn trọng thiết lập `prefers-reduced-motion` để bảo đảm khả năng tiếp cận.

## [0.3.0] - 2026-07-31

### Added

- Thêm ánh xạ đầy đủ IOA khoang hạ thế cho U/I/COS từng pha và nhiệt độ đầu
  cực/môi trường.
- Thêm phân tích điện–nhiệt riêng cho khoang hạ thế gồm điểm rủi ro, chẩn đoán,
  xu hướng nhiệt và khuyến nghị vận hành.
- Thêm giao diện và API proxy P1 để quản lý sự cố, xác nhận cảnh báo đơn/nhóm và
  xem các chỉ số đánh giá cảnh báo.
- Thêm báo cáo vận hành ngày, biểu đồ realtime mở rộng và dữ liệu góc pha/công
  suất phản kháng theo IOA.
- Thêm cấu hình PM2 và các lệnh start, restart, stop, status, logs cho môi trường
  production.
- Thêm test cho giới hạn báo cáo AI và ánh xạ IOA.

### Changed

- Gom số liệu, trạng thái và phân tích khoang hạ thế vào một card gọn trong
  `.right-stack`; không lặp lại cảnh báo và dự báo vận hành chung.
- Đồng bộ dữ liệu realtime/lịch sử khoang hạ thế sang PowerAI và cho phép thiếu
  tần số khi vẫn có đủ U/I ba pha.
- Nâng version SMARTGRID từ `0.2.0` lên `0.3.0`.
- Nâng cấp Dashboard PowerAI với chatbot, cảnh báo realtime, đánh giá vận hành,
  biểu đồ điện và luồng cập nhật trạng thái qua Socket.IO.
- PowerAI client tự retry có backoff cho các yêu cầu GET gặp lỗi mạng hoặc lỗi
  upstream tạm thời.
- Tách `POWER_AI_API_KEY` và `POWER_AI_ADMIN_KEY`; production bắt buộc cấu hình
  `POWER_AI_URL` thay vì dùng địa chỉ public mặc định.
- Chuẩn hóa dữ liệu gửi PowerAI và chỉ chuyển `i0` khi nguồn đo trực tiếp được
  bật bằng cấu hình.
- Cải thiện khởi động/dừng web server và vận hành tiến trình bằng PM2.

### Fixed

- Sửa cách hiển thị và cập nhật các biểu đồ realtime.
- Không gửi giá trị `i0` suy diễn từ góc pha sang PowerAI, tránh cảnh báo dòng rò
  giả.
- Giới hạn dữ liệu báo cáo AI và giữ nguyên mã lỗi hợp lệ từ PowerAI cho các API
  P1.

## [0.2.0] - 2026-07-28

### Added

- Tích hợp PowerAI qua lớp proxy Express, không để trình duyệt gọi trực tiếp
  FastAPI.
- Phân tích vận hành hybrid kết hợp rule và anomaly model.
- Theo dõi sức khỏe thiết bị theo `id_thietbi`.
- Danh sách cảnh báo PowerAI và drawer xem chi tiết sự kiện.
- Dự báo chỉ số rủi ro thiết bị trong 24 giờ.
- Trợ lý PowerAI theo thiết bị đang chọn.
- Thanh trạng thái dịch vụ, model, phiên bản và lịch sử PowerAI.
- Liên kết cảnh báo tới KPI, biểu đồ hoặc sơ đồ vận hành liên quan.
- Trạng thái realtime cho điện áp, dòng điện, công suất và cosφ.
- Thống kê trung bình, cực đại và ngưỡng tham chiếu trên biểu đồ THD.
- Hỗ trợ thao tác bàn phím, focus management và reduced motion.

### Changed

- Lấy `id_thietbi` từ `data-id-thietbi` của option đang chọn trong
  `#cbo_nhamay`.
- Chuyển Trung tâm vận hành PowerAI sang sidebar trái.
- Thu gọn Sức khỏe, Dự báo và Cảnh báo thành accordion.
- Đưa biểu đồ THD điện áp và THD dòng điện lên trên khu vực PowerAI.
- Chuẩn hóa bố cục, typography, màu trạng thái và responsive của Dashboard.
- Tách CSS thành các file theo chức năng:
  - `dashboard-kpi-thd.css`
  - `power-ai-dashboard.css`
  - `dashboard_smartgrid.css`
- Chuyển jQuery, Font Awesome và SVG Pan Zoom từ CDN sang tài nguyên local.
- Nâng version frontend từ `0.1.1` lên `0.2.0`.

### Fixed

- Sửa cách tính cosφ trung bình ba pha.
- Giữ báo cáo rule hiện tại làm fallback khi PowerAI lỗi hoặc timeout.
- Không làm đóng accordion khi bấm nút làm mới sức khỏe thiết bị.
- Tránh trùng ID sau khi chuyển PowerAI từ nội dung chính sang sidebar.
- Cải thiện hiển thị cảnh báo trên màn hình nhỏ, không cần cuộn ngang.

### Security

- Escape dữ liệu PowerAI trước khi đưa vào HTML.
- Giới hạn và kiểm tra dữ liệu đầu vào tại các endpoint proxy.
- Không để lộ địa chỉ PowerAI trực tiếp cho trình duyệt.

## [0.1.1] - Previous release

### Added

- Phiên bản nền của ứng dụng SMARTGRID_ sử dụng Express, EJS, PostgreSQL,
  Oracle và giao diện Dashboard SCADA.

[0.2.0]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.2.0
[0.3.0]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.3.0
[0.3.1]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.3.1
[0.3.2]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.3.2
[0.3.3]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.3.3
[0.3.4]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.3.4
[0.4.0]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.4.0
[0.5.0]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.5.0
[0.5.1]: https://github.com/longct08101/SMARTGRID_/releases/tag/v0.5.1
[Unreleased]: https://github.com/longct08101/SMARTGRID_/compare/v0.5.1...HEAD

## ISS Frontend 0.6.0 / PowerAI Client 1.2.0 - 2026-08-05

- Hiển thị drift realtime từ PowerAI v1.2.0.
- Hiển thị tiến độ feedback learning theo số nhãn đã kiểm duyệt.
- Bổ sung proxy API `/api/power-ai/model/drift` và `/api/power-ai/p1/feedback/readiness`.
- Đồng bộ version PowerAI/model/drift/feedback trên dashboard.

## 1.6.0 - 2026-08-06
- Thêm Qwen Intent Planner trả JSON có cấu trúc.
- Thêm Tool Executor whitelist gọi API PowerAI.
- Thêm Answer Composer diễn giải dữ liệu thật bằng tiếng Việt.
- Thêm `GET /api/ai/tools`.
- Giai đoạn đầu chỉ hỗ trợ tool đọc dữ liệu, không điều khiển thiết bị.

## 2.0.0 - 2026-08-06

- Nâng chatbot thành kiến trúc AI Agent gồm Planner, Tool Router, PowerAI Executor và Answer Composer.
- Tách URL Qwen API sang `QWEN_API_URL` trong `.env`.
- Tách URL PowerAI API sang `POWERAI_API_URL` trong `.env`.
- Thêm output guard chặn reasoning và câu trả lời tiếng Anh trước khi gửi frontend.
- Không chuyển `message.thinking` hoặc nội dung suy luận nội bộ tới trình duyệt.
- Giữ tương thích với các biến cấu hình cũ.
