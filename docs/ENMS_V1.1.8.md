# EnMS v1.1.8 — M9 Báo cáo & Dashboard quản trị / M10 Quản lý dữ liệu & Hệ thống

Ngày phát hành: **14/09/2026**

## Phạm vi

v1.1.8 tiếp tục chuẩn hóa từng màn hình theo bộ ảnh giao diện. Phiên bản này tập trung M9 và M10; shell, M1–M8, M11–M17, database schema, biến `DB_*`, Login JWT và HES WebSocket trust boundary được giữ nguyên.

## M9 — Báo cáo & Dashboard quản trị

- Toolbar: Nhà máy, Khoảng thời gian, So sánh, Tạo báo cáo mới.
- 6 tab nghiệp vụ và 6 KPI quản trị.
- Danh sách 7 báo cáo định kỳ với trạng thái và thao tác PDF/Excel/Xem.
- Xu hướng 3 nhóm chỉ số: SEC, phát thải CO₂ và chi phí năng lượng.
- Donut cơ cấu 28 báo cáo theo 6 nhóm.
- 4 mẫu báo cáo tiêu biểu, bảng báo cáo ESG, cấu hình xuất, lịch sử, thông báo và chia sẻ.
- Preview có xuất Excel, in/PDF, tải mẫu và xem chi tiết báo cáo.

Contract chính:

```text
GET /api/enms/v1/modules/reports

kpis
viewTabs
periodicReports
trend
categories
reportTemplates
esgReports
exportConfig
history
notifications
sharing
```

## M10 — Quản lý dữ liệu & Hệ thống

- Toolbar: Nhà máy, Năm, Trạng thái hệ thống, Báo cáo hệ thống.
- 7 tab nghiệp vụ và 6 KPI hệ thống.
- Kiến trúc 4 lớp: thiết bị hiện trường → Edge → Data Platform → ứng dụng EnMS/ESG.
- Luồng dữ liệu chính 6 bước.
- Chất lượng dữ liệu 99.2% và biểu đồ tăng trưởng lưu trữ 2022–2025.
- Danh sách tích hợp SCADA/DCS, CEMS, ERP, CMMS, LIMS, môi trường và cổng dữ liệu đối tác.
- Danh mục bảo mật/ATTT, vận hành/hỗ trợ, roadmap 2025–2030 và tài liệu/biểu mẫu.
- Preview có xuất báo cáo hệ thống Excel, xem integration detail và tải tài liệu mẫu.

Contract chính:

```text
GET /api/enms/v1/modules/data

kpis
viewTabs
architecture
dataFlow
dataQuality
storageGrowth
integrations
security
operations
roadmap
documents
```

## Tương thích

Hai module vẫn trả các field legacy:

```text
primary
secondary
table
insights
```

để provider PostgreSQL/WebSocket thực có thể được nối dần mà không phá frontend cũ.

## Bảo mật và dữ liệu

Không thay đổi:

- `services/login-jwt.js`
- Bearer JWT của API EnMS
- HES WebSocket ticket
- subprotocol `hes104-v1`
- device ACL / `SUBSCRIBE`
- schema PostgreSQL và biến `DB_*`

## Kiểm thử

Bổ sung `tests/enms_reports_data.test.js` kiểm tra contract M9/M10, cấu trúc page module và toolbar. Bộ regression/module test liên quan M2–M10 phải chạy pass trước khi đóng gói.
