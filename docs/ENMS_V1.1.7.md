# EnMS v1.1.7 — M7 Tiết kiệm năng lượng & M&V / M8 Phát thải CO₂ & ESG

Ngày phát hành: 14/09/2026

## Phạm vi

v1.1.7 tiếp tục chuẩn hóa từng màn hình theo bộ ảnh giao diện. Phiên bản này chỉ tập trung M7 và M8; shell, M1–M6, M9–M17, database schema, biến `DB_*`, Login JWT và HES WebSocket trust boundary được giữ nguyên.

## M7 — Tiết kiệm năng lượng & M&V

- 5 tab: Tổng quan, Danh mục giải pháp, M&V chi tiết, Kết quả & Lợi ích, Bài học & Nhân rộng.
- 5 KPI: tiềm năng tiết kiệm, giá trị tiết kiệm, giảm CO₂, số dự án đã triển khai và ROI trung bình.
- Danh mục 8 giải pháp với CAPEX, ROI, mức tiết kiệm thực tế và trạng thái triển khai.
- Donut tiến độ 8 giải pháp.
- Quy trình M&V 4 bước theo IPMVP: Baseline → Implementation → Verification → Reporting.
- Biểu đồ tích lũy MWh và giá trị tiết kiệm 2022–2025.
- Bảng kết quả M&V, donut đóng góp theo lĩnh vực và danh sách hành động tiếp theo.
- Toolbar: Nhà máy / Năm / Trạng thái / Đề xuất giải pháp.
- Xuất Excel trong preview.

Contract bổ sung tại `GET /api/enms/v1/modules/savings`:

```text
kpis
viewTabs
projects
progressSummary
ipmvpSteps
yearlyImpact
mvResults
contribution
recommendations
```

## M8 — Phát thải CO₂ & ESG

- 7 tab: Tổng quan, Phát thải CO₂, Phân tích theo nguồn, So sánh & Benchmark, Quản lý dữ liệu, Báo cáo ESG, Sáng kiến giảm phát thải.
- 5 KPI: tổng CO₂, cường độ phát thải, mục tiêu giảm 2025, AFR và tỷ lệ điện tái tạo.
- Biểu đồ kết hợp phát thải + cường độ theo tháng.
- Donut cơ cấu phát thải theo nguồn.
- Benchmark Lam Thạch II / trung bình VN / tốt nhất VN / trung bình thế giới.
- Bảng phát thải theo hạng mục, tiến độ mục tiêu giảm phát thải, 6 KPI ESG môi trường.
- Danh sách 5 sáng kiến giảm phát thải, 5 tiêu chí tuân thủ và 5 tài liệu/biểu mẫu.
- Toolbar: Nhà máy / Năm / Khoảng thời gian / Xuất báo cáo ESG.
- Xuất Excel và tải tài liệu mẫu trong preview.

Contract bổ sung tại `GET /api/enms/v1/modules/emissions`:

```text
kpis
viewTabs
trend
breakdown
benchmark
details
targetProgress
esgMetrics
initiatives
compliance
documents
```

## File chính thay đổi

```text
views/enms/pages/savings/*
views/enms/pages/emissions/*
public/enms/js/pages/savings.js
public/enms/js/pages/emissions.js
public/enms/css/pages/savings.css
public/enms/css/pages/emissions.css
public/enms/mock.js
public/enms/js/bootstrap.js
tests/enms_savings_emissions.test.js
tests/enms_modular.test.js
```

## Bảo mật và dữ liệu

Không thay đổi:

- `services/login-jwt.js`
- Bearer JWT của `/api/enms/v1/*`
- HES WS ticket, subprotocol `hes104-v1`, device ACL và `SUBSCRIBE`
- PostgreSQL schema và các biến `DB_*`

## Kiểm thử

Các test EnMS không phụ thuộc Express/node_modules đã chạy đạt 23/23, gồm regression M2–M8, kiến trúc module và chart. Full `npm test` cần chạy sau `npm install` trên môi trường triển khai vì gói bàn giao không chứa `node_modules`.
