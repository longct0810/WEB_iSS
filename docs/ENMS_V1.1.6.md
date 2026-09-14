# EnMS v1.1.6 — M5 Mục tiêu & Hành động / M6 Phân tích & Cảnh báo

Ngày cập nhật: 14/09/2026

## Phạm vi

v1.1.6 tiếp tục rà soát từng màn hình theo bộ ảnh chuẩn và chỉ thay đổi M5, M6. Shell EnMS, M1–M4, database schema, biến `DB_*`, login JWT và HES WebSocket trust boundary được giữ nguyên.

## M5 — Mục tiêu & Hành động

- Dựng lại màn hình theo bố cục ISO 50001: tab nghiệp vụ, 5 KPI, bảng 8 mục tiêu, tiến độ tổng thể, tiềm năng tiết kiệm, liên kết ISO 50001 và tài liệu/biểu mẫu.
- Bổ sung 6 tab: Tổng quan, Mục tiêu năng lượng, Kế hoạch hành động, Theo dõi thực hiện, Hiệu quả & Tiết kiệm, Liên quan ISO 50001.
- Bảng mục tiêu gồm mã, nội dung, chỉ số theo dõi, mục tiêu, hiện tại, tiến độ, trạng thái, ngày hoàn thành và owner.
- Bổ sung lọc trạng thái, tìm kiếm mục tiêu và lựa chọn năm.
- Bổ sung biểu đồ xu hướng mục tiêu trọng yếu với Thực tế / Mục tiêu / Kịch bản dự báo.
- Bổ sung danh sách hành động nổi bật và tạo mục tiêu mới trong chế độ preview.
- Xuất báo cáo mục tiêu ra Excel `.xlsx`.
- Bổ sung contract `modules/targets`: `viewTabs`, `goals`, `progress`, `savings`, `isoLinks`, `documents`, `trend`, `actions`.

## M6 — Phân tích & Cảnh báo

- Dựng lại màn hình theo bố cục phân tích cảnh báo: 5 KPI, bản đồ cảnh báo theo khu vực, danh sách cảnh báo mới nhất, RCA, xu hướng & dự báo bất thường, benchmark, tương quan đa biến và khuyến nghị AI.
- Bổ sung 6 tab: Tổng quan, Cảnh báo thời gian thực, Phân tích nguyên nhân (RCA), Phân tích xu hướng, Benchmark & AI, Khuyến nghị tối ưu.
- Bản đồ cảnh báo dùng ảnh nhà máy hiện có và marker theo Nghiền liệu, Lò nung, Nghiền xi, Hệ thống điện, Khí nén, Đóng bao, Khu phụ trợ.
- Marker khu vực có thể bấm để lọc danh sách cảnh báo trên màn hình.
- RCA hỗ trợ dữ liệu 5 Why và chế độ Fishbone minh họa, kèm khuyến nghị và tạo hành động khắc phục.
- Biểu đồ xu hướng có Thực tế / Xu hướng / Ngưỡng cảnh báo / Dự báo AI và bộ chọn 7/30/90 ngày/1 năm.
- Benchmark hiển thị Lam Thạch II so với trung bình ngành, Top 25% và Bottom 25%.
- Bổ sung phân tích tương quan đa biến và 3 thẻ cảnh báo/khuyến nghị AI.
- Xuất danh sách cảnh báo ra Excel `.xlsx`.
- Bổ sung contract `modules/alerts`: `viewTabs`, `severitySummary`, `areaAlerts`, `latestAlerts`, `rca`, `trend`, `benchmark`, `correlations`, `aiRecommendations`.

## Toolbar

M5:

```text
Nhà máy | Năm | Trạng thái | Tạo mục tiêu mới
```

M6:

```text
Nhà máy | Khoảng thời gian | Phạm vi | Xuất báo cáo
```

## Tương thích

Không thay đổi:

- `services/login-jwt.js`
- `Authorization: Bearer <login JWT>` của API EnMS
- HES WebSocket ticket
- subprotocol `hes104-v1`
- device ACL và `SUBSCRIBE`
- PostgreSQL schema và cấu hình `DB_*`
- API cũ `/api/enms/v1/alerts` và cơ chế PATCH trạng thái cảnh báo

Các field generic `primary`, `secondary`, `table`, `insights` vẫn được giữ trong mock contract M5/M6 để không phá compatibility.

## Kiểm thử

Đã bổ sung `tests/enms_targets_alerts.test.js` và cập nhật modular regression test. Các test chuyên biệt M2–M6, modular architecture và chart regression đều đạt.
