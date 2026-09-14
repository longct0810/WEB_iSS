# Changelog EnMS

## 1.1.9 - 2026-09-14

- Rà soát và dựng lại M11 `Dự báo & Kế hoạch năng lượng`, M12 `Tối ưu hóa & Hỗ trợ ra quyết định` và M13 `ISO 50001 & Kiểm toán năng lượng` theo ba ảnh giao diện chuẩn, giữ nguyên shell EnMS hiện tại.
- M11: bổ sung 6 tab, 6 KPI, forecast điện/than/chi phí theo tháng, bảng dự báo 6 loại năng lượng, 6 kịch bản What-if, 9 giả định, dự báo SEC, quy trình lập kế hoạch 4 bước và báo cáo liên quan.
- M12: bổ sung 6 tab, 5 KPI, Load Shifting/Peak Shaving, tối ưu fuel mix, chi phí theo kịch bản, 6 kịch bản What-if, MACC, Top 5 khuyến nghị, quy trình ra quyết định và tài liệu.
- M13: bổ sung 7 tab, 6 KPI, lộ trình chứng nhận, mức đáp ứng ISO 50001:2024, NCR trend, danh sách audit, CAPA, cơ hội cải tiến, hệ thống tài liệu, quy trình ISO 50002 và tài liệu/biểu mẫu.
- Toolbar M11 đổi thành Nhà máy/Năm/Khoảng thời gian/Tạo kịch bản mới; M12 đổi thành Nhà máy/Khoảng thời gian/Kịch bản hiển thị/Chạy mô phỏng mới; M13 đổi thành Nhà máy/Năm/Chu kỳ đánh giá/Tạo hồ sơ mới.
- Mở rộng contract `modules/forecast`, `modules/optimization`, `modules/iso50001` nhưng vẫn giữ `primary`, `secondary`, `table`, `insights` để tương thích provider dữ liệu thật.
- M11–M13 không còn phụ thuộc shared `module-dashboard`; M14–M17 tiếp tục sử dụng renderer chung.
- Chart helper deep-merge `chart` overrides để stacked/mixed charts không làm mất `type`, `height`, toolbar và animation defaults.
- Giữ nguyên PostgreSQL schema, `DB_*`, Login JWT, HES WebSocket ticket/ACL/SUBSCRIBE và API route hiện có.
- Nâng package/API/UI metadata lên `1.1.9`.

## 1.1.8 - 2026-09-14

- Rà soát và dựng lại M9 `Báo cáo & Dashboard quản trị` và M10 `Quản lý dữ liệu & Hệ thống (Data Management & IT/OT)` theo hai ảnh giao diện chuẩn, giữ nguyên shell EnMS hiện tại.
- M9: bổ sung 6 tab nghiệp vụ, 6 KPI, danh sách 7 báo cáo định kỳ, xu hướng SEC/CO₂/chi phí, cơ cấu 28 báo cáo theo nhóm, 4 mẫu báo cáo, báo cáo ESG, cấu hình xuất, lịch sử, nhắc việc và chia sẻ.
- M9: bổ sung thao tác xem/tải báo cáo preview, xuất Excel, in/PDF, thư viện mẫu và tạo báo cáo mới ở mức UI contract.
- M10: bổ sung 7 tab nghiệp vụ, 6 KPI, kiến trúc 4 lớp OT/Edge/Data Platform/Application, luồng dữ liệu 6 bước, chất lượng dữ liệu, tăng trưởng lưu trữ, tích hợp hệ thống, bảo mật, vận hành, roadmap 2025–2030 và tài liệu.
- M10: bổ sung báo cáo hệ thống Excel, xem chi tiết tích hợp và tải tài liệu mẫu ở chế độ preview.
- Toolbar M9 đổi thành Nhà máy/Khoảng thời gian/So sánh/Tạo báo cáo mới; toolbar M10 đổi thành Nhà máy/Năm/Trạng thái hệ thống/Báo cáo hệ thống.
- Mở rộng contract `modules/reports` và `modules/data` nhưng vẫn giữ `primary`, `secondary`, `table`, `insights` để tương thích provider dữ liệu thật.
- Giữ nguyên PostgreSQL schema, `DB_*`, Login JWT, HES WebSocket ticket/ACL/SUBSCRIBE và API route hiện có.
- Nâng package/API/UI metadata lên `1.1.8`.

## 1.1.7 - 2026-09-14

- Rà soát và dựng lại M7 `Tiết kiệm năng lượng & M&V` và M8 `Phát thải CO₂ & ESG` theo hai ảnh giao diện chuẩn, giữ nguyên shell EnMS hiện tại.
- M7: bổ sung 5 tab nghiệp vụ, 5 KPI, danh mục 8 giải pháp, tiến độ triển khai, quy trình M&V theo IPMVP, hiệu quả tích lũy theo năm, kết quả M&V, đóng góp theo lĩnh vực và khuyến nghị hành động.
- M7: bổ sung lọc trạng thái, tạo đề xuất giải pháp preview và xuất Excel danh mục giải pháp.
- M8: bổ sung 7 tab nghiệp vụ, 5 KPI, xu hướng CO₂ + cường độ phát thải, cơ cấu theo nguồn, benchmark, bảng chi tiết phát thải, tiến độ mục tiêu, bộ chỉ số ESG, sáng kiến giảm phát thải, tuân thủ và tài liệu/biểu mẫu.
- M8: bổ sung xuất báo cáo ESG Excel và tải tài liệu mẫu trong chế độ preview.
- Toolbar M7 đổi thành Nhà máy/Năm/Trạng thái/Đề xuất giải pháp; toolbar M8 đổi thành Nhà máy/Năm/Khoảng thời gian/Xuất báo cáo ESG.
- Mở rộng contract `modules/savings` và `modules/emissions` nhưng vẫn giữ `primary`, `secondary`, `table`, `insights` để tương thích với provider tương lai.
- M7/M8 không còn phụ thuộc shared `module-dashboard` cho giao diện chính; M11–M17 tiếp tục dùng renderer chung.
- Giữ nguyên PostgreSQL schema, `DB_*`, Login JWT, HES WebSocket ticket/ACL/SUBSCRIBE và API route hiện có.
- Nâng package/API/UI metadata lên `1.1.7`.

## 1.1.6 - 2026-09-14

- Rà soát và dựng lại M5 `Mục tiêu & Hành động` và M6 `Phân tích & Cảnh báo` theo 2 ảnh giao diện chuẩn, giữ nguyên shell EnMS hiện tại.
- M5: bổ sung 6 tab nghiệp vụ, 5 KPI, bảng 8 mục tiêu, tiến độ tổng thể, tiềm năng tiết kiệm, liên kết ISO 50001, tài liệu/biểu mẫu, xu hướng mục tiêu và kế hoạch hành động.
- M5: bổ sung tìm kiếm/lọc trạng thái, tạo mục tiêu preview và xuất Excel.
- M6: bổ sung 6 tab nghiệp vụ, 5 KPI, bản đồ cảnh báo theo khu vực, danh sách cảnh báo mới nhất, RCA 5 Why, phân tích xu hướng/dự báo AI, benchmark, tương quan đa biến và khuyến nghị AI.
- M6: marker bản đồ có thể lọc cảnh báo theo khu vực; bổ sung tạo hành động khắc phục preview và xuất báo cáo Excel.
- Mở rộng contract `modules/targets` và `modules/alerts` nhưng vẫn giữ `primary`, `secondary`, `table`, `insights` để tương thích.
- Toolbar M5 đổi thành Nhà máy/Năm/Trạng thái/Tạo mục tiêu mới; toolbar M6 đổi thành Nhà máy/Khoảng thời gian/Phạm vi/Xuất báo cáo.
- Giữ nguyên PostgreSQL schema, `DB_*`, Login JWT, HES WebSocket ticket/ACL/SUBSCRIBE và API cảnh báo cũ.
- Nâng package/API/UI metadata lên `1.1.6`.

## 1.1.5 - 2026-09-14

- Rà soát và dựng lại M4 `SEU & EnPI` bám sát ảnh giao diện chuẩn, giữ nguyên shell EnMS hiện có.
- Bổ sung thanh chức năng M4: Tổng quan, Danh sách SEU, EnPI chi tiết, Đường cơ sở năng lượng (EnB), So sánh & Benchmark và Phân tích xu hướng.
- Dựng đúng 5 KPI chính: tổng tiêu thụ điện, sản lượng clinker, SEC toàn nhà máy, chi phí năng lượng và phát thải CO₂.
- Bổ sung cây cấu trúc 12 SEU theo nhóm công nghệ, tìm kiếm, mở/thu nhóm và chọn SEU để đồng bộ bảng/biểu đồ.
- Bổ sung bảng EnPI theo SEU với sản lượng, điện năng, EnPI, EnB, chênh lệch, xu hướng và trạng thái; hỗ trợ lọc theo nhóm SEU.
- Bổ sung biểu đồ xu hướng EnPI theo SEU, đường cơ sở EnB, mục tiêu và khối phân tích nguyên nhân.
- Bổ sung so sánh EnPI theo tháng, Top 5 SEU có tiềm năng cải thiện và nhóm chỉ số hiệu suất bổ sung.
- Bổ sung xuất báo cáo EnPI Excel và các nút điều hướng sang cơ hội tiết kiệm/cấu hình EnPI-EnB.
- Mở rộng contract `modules/seu` với `structure`, `enpi`, `trend`, `comparison`, `potential`, `performance`; vẫn giữ `primary`, `secondary`, `table`, `insights` để tương thích.
- Toolbar M4 có Nhà máy, Thời gian, Đơn vị/nhóm SEU và Xuất báo cáo; không thay database schema, `DB_*`, Login JWT hoặc HES WebSocket authentication.
- Nâng package/API/UI metadata lên `1.1.5`.

## 1.1.4 - 2026-09-14

- Rà soát và dựng lại M3 `Bản đồ năng lượng & Energy Balance` bám sát ảnh giao diện chuẩn, giữ nguyên shell EnMS hiện có.
- Bổ sung đúng 6 KPI nguồn năng lượng: Điện, Than, Dầu, Hơi, Nước và CO₂.
- Bổ sung thanh chế độ M3: Tổng quan, Bản đồ năng lượng, Energy Balance, Sơ đồ Sankey, Phân bổ năng lượng và So sánh theo thời gian.
- Dựng Energy Balance 3 lớp `Đầu vào → Công đoạn → Đầu ra có ích/Tổn thất` bằng SVG flow band, có chuyển đơn vị MWh/GJ/toe và nút tái tính.
- Dựng bản đồ năng lượng theo khu vực trên nền nhà máy với 5 vùng Nghiền liệu/Lò nung/Nghiền xi/Đóng bao/Phụ trợ; hỗ trợ chế độ tỷ trọng, cường độ năng lượng và tổn thất.
- Bổ sung 4 KPI hiệu suất: tỷ lệ năng lượng hữu ích, tổn thất, SEC điện+nhiệt và clinker factor.
- Bổ sung bảng cân đối chi tiết với 4 chế độ, xuất Excel, biểu đồ donut phân bổ và xu hướng Energy Balance theo tháng.
- Mở rộng contract `modules/balance` với `energyBalance`, `energyMap`, `efficiency`, `balanceTable`, `distribution`, `trend`; vẫn giữ `primary`, `secondary`, `table`, `insights` để tương thích.
- Toolbar M3 có Nhà máy, Thời gian, Kịch bản và Xuất báo cáo; không thay database schema, `DB_*`, Login JWT hoặc HES WebSocket authentication.
- Nâng package/API/UI metadata lên `1.1.4`.

## 1.1.3 - 2026-09-14

- Rà soát và dựng lại M2 `Giám sát thời gian thực` bám sát ảnh giao diện chuẩn, giữ nguyên shell EnMS hiện có.
- Bổ sung đúng 6 KPI realtime: công suất điện, nhiệt, than, nước, CO₂ và chi phí năng lượng.
- Thay M2 cũ bằng bố cục giám sát 3 lớp: thanh chế độ năng lượng + trạng thái; sơ đồ luồng năng lượng nhà máy và 2 biểu đồ realtime; cụm bảng trạm điện/thông số năng lượng/cảnh báo thời gian thực.
- Bổ sung interaction cho các tab Sơ đồ tổng thể/Điện/Nhiệt/Hơi/Nước/Năng lượng tái tạo/Tùy chỉnh; biểu đồ 24h/8h/4h; sản lượng Hôm nay/Hôm qua; tìm kiếm và lọc trạm.
- Bổ sung nút Toàn màn hình, Chú thích, Xem lịch sử dữ liệu, Xuất báo cáo nhanh và Cấu hình cảnh báo.
- Mở rộng contract `modules/realtime` với `systemStatus`, `flow`, `realtimeTrend`, `shiftProduction`, `stations`, `parameters`, `realtimeAlerts`; vẫn giữ `primary`, `secondary`, `table`, `insights` để tương thích.
- Tiếp tục giữ Login JWT, HES WebSocket ticket/ACL/SUBSCRIBE và polling API 5 giây; không thay database schema hoặc `DB_*`.
- Không thay đổi nghiệp vụ M1 và M3–M17.
- Nâng package/API/UI metadata lên `1.1.3`.

## 1.1.2 - 2026-09-14

- Rà soát và dựng lại M1 `Executive Dashboard – Tổng quan điều hành` bám sát ảnh giao diện chuẩn, giữ nguyên shell EnMS hiện có.
- Thay M1 cũ bằng bố cục 4 lớp: 6 KPI, hero nhà máy + Sản lượng & EnPI, phân tích năng lượng 3 cột, khối cảnh báo/mục tiêu/tài chính-môi trường.
- Bổ sung bộ lọc M1: Nhà máy, Thời gian, So sánh với và nút Xuất báo cáo.
- Bổ sung interaction cho các tab Sản lượng/EnPI/Chi phí-Tấn/Phát thải-Tấn; cơ cấu Theo năng lượng/Theo khu vực; xu hướng Điện/Than/Hơi/Nhiệt/Tổng quy đổi.
- Mở rộng contract `modules/overview` với `plant`, `production`, `energyMix`, `energyTrend`, `efficiency`, `alertHighlights`, `targets`, `impacts`; vẫn giữ các field contract cũ để tương thích.
- Không thay database schema, `DB_*`, login JWT, HES WebSocket ticket/ACL/SUBSCRIBE hoặc các màn hình M2–M17.
- Nâng package/API/UI metadata lên `1.1.2`.

## 1.1.1 - 2026-09-14

- Sửa lỗi M8 `Phát thải CO₂ & ESG` hiển thị `Cannot read properties of undefined (reading 'bar')`.
- Nguyên nhân: shared renderer truyền `plotOptions: undefined` cho biểu đồ `area/line`; ApexCharts 3.x có thể làm mất nhóm default `plotOptions` và truy cập `plotOptions.bar` khi render.
- `module-page.js` chỉ truyền `plotOptions.bar` khi loại biểu đồ thực sự là `bar`.
- `core/charts.js` bổ sung lớp bảo vệ loại bỏ mọi option top-level có giá trị `undefined` trước khi merge cấu hình ApexCharts.
- Bổ sung regression test cho shared chart renderer để ngăn lỗi tái diễn ở M3–M17.
- Không thay API contract, mock data, database schema, login JWT hoặc HES WebSocket authentication.
- Nâng package/API/UI metadata lên `1.1.1`.

## 1.1.0 - 2026-09-14

- Mở rộng EnMS v1.0.1 thành EnMS Advanced với 17 module M1–M17 theo bộ giao diện tham chiếu mới.
- Cập nhật sidebar thành menu 17 module, chia nhóm Vận hành & Hiệu suất, Phân tích & Quản trị, Kế hoạch & Tối ưu, AI & Tự động hóa.
- Bổ sung 11 page mới: Energy Balance, Mục tiêu & Hành động, Tiết kiệm NL & M&V, CO₂ & ESG, Dự báo, Tối ưu, ISO 50001, AI Analytics, Digital Twin, AI Decision và Autonomous Energy.
- Giữ và cập nhật 6 page hiện có tương ứng M1, M2, M4, M6, M9, M10; route Map/Settings tiếp tục tồn tại dưới dạng utility để tương thích link cũ.
- Bổ sung shared EJS `module-dashboard.ejs`, component `module-page.js` và `module-dashboard.css` để tránh nhân bản code giữa các module mới.
- Bổ sung API mock `GET /api/enms/v1/modules` và `GET /api/enms/v1/modules/:id`.
- Bổ sung mock contract KPI, chart/flow/matrix/digital twin, bảng chi tiết và insight cho toàn bộ 17 module.
- Cập nhật M1 Executive KPI thành 6 thẻ và M10 bổ sung khu vực Quản trị & tích hợp hệ thống.
- Cập nhật topbar/sidebar theo phong cách EnMS Advanced, responsive cho menu dài.
- Giữ nguyên login JWT, HES WebSocket ticket/subprotocol/device ACL/SUBSCRIBE.
- Không thay schema database và không thay cấu hình `DB_*`.
- Nâng package version lên 1.1.0.

## 1.0.1 - 2026-09-10

- Refactor giao diện EnMS sang kiến trúc module, không thay đổi contract nghiệp vụ.
- Tách shell EJS thành partial dùng chung: head, sidebar, topbar, page header, statusbar, dialog và scripts.
- Tách 7 màn hình nghiệp vụ thành thư mục view riêng; các màn hình lớn tiếp tục chia section partial.
- Tách JavaScript nguyên khối thành `core/`, `components/` và `pages/`, sử dụng ES modules.
- Tách API client, state, DOM helper, chart helper và HES realtime adapter khỏi page controller.
- Tách CSS core và CSS đặc thù theo page.
- Loại bỏ các file frontend nguyên khối cũ `public/enms/app.js`, `public/enms/api.js`, `public/enms/realtime.js`.
- Giữ nguyên login JWT và HES WebSocket ticket/device ACL.
- Giữ nguyên API `/api/enms/v1/*`, dữ liệu mock và cấu hình database.
- Cập nhật version lên `1.0.1` và bổ sung kiểm thử kiến trúc module.

## 1.0.0 - 2026-09-10

- Chuyển shell giao diện sang EnMS theo bộ ảnh Lam Thạch II.
- Thêm module menu EnMS gồm 7 màn hình nghiệp vụ và khu vực Cài đặt hệ thống.
- Dựng 7 trang: Tổng quan, Realtime, Bản đồ/Sơ đồ trạm, SEU/EnPI, Báo cáo, Cảnh báo/Sự kiện, Quản lý dữ liệu.
- Thêm bộ dữ liệu mock để preview không cần database.
- Thêm API `/api/enms/v1/*` có xác thực login JWT.
- Giữ nguyên login JWT hiện có; không tạo cơ chế login mới.
- Giữ HES WebSocket trust boundary; realtime adapter chỉ xin ticket bằng Bearer JWT và device ACL.
- Thêm cơ chế fail-closed khi chọn nguồn database nhưng provider thật chưa được cấu hình.
- Thêm standalone preview `npm run preview:enms`.
- Thêm test cho JWT, API mock, phân trang/filter, report, route và fail-closed.

## v1.1.9 – M14–M17 AI & Automation review (14/09/2026)
- Rà soát và chuyên biệt hóa 4 màn hình M14–M17 theo bộ mockup AI/Tự động hóa mới, vẫn giữ version 1.1.9 theo yêu cầu.
- M14: forecast AI, anomaly detection, RCA, predictive maintenance, model accuracy, AI pipeline.
- M15: Energy Digital Twin, flow realtime, calibration status, What-if, heatmap, roadmap.
- M16: AI Optimization đa mục tiêu, load shifting, fuel mix, Pareto, constraints, solution ranking, integration.
- M17: Autonomous Energy Management, closed-loop architecture, autonomy L0–L4, safety guardrails, pilot results, decision audit log.
- Giữ nguyên Login JWT, HES WebSocket ticket/ACL/SUBSCRIBE, DB_* và API legacy contracts.
