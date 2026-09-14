# EnMS v1.1.9 — M11 Dự báo & Kế hoạch / M12 Tối ưu hóa / M13 ISO 50001

Ngày phát hành: **14/09/2026**

## Phạm vi

v1.1.9 tiếp tục chuẩn hóa từng màn hình theo bộ ảnh giao diện Lam Thạch II. Bản này tập trung ba module M11–M13; giữ nguyên shell, M1–M10, M14–M17, database schema, biến `DB_*`, Login JWT và HES WebSocket trust boundary.

## M11 — Dự báo & Kế hoạch năng lượng

- 6 tab: Tổng quan, Dự báo nhu cầu, Kế hoạch năng lượng, Ngân sách & Chi phí, Kịch bản & What-if, Báo cáo & Xuất dữ liệu.
- 6 KPI: dự báo điện, than, khí/nhiên liệu, hơi, chi phí và CO₂.
- 3 biểu đồ tháng cho điện năng, than và chi phí; có mốc hiện tại và forecast/plan.
- Bảng dự báo theo 6 loại năng lượng.
- 6 kịch bản What-if và 9 giả định chính.
- Biểu đồ SEC dự báo, quy trình lập kế hoạch 4 bước và 5 báo cáo liên quan.
- Toolbar: Nhà máy / Năm / Khoảng thời gian / Tạo kịch bản mới.

Contract bổ sung trong `GET /api/enms/v1/modules/forecast`:

```text
kpis
viewTabs
demandTrend
coalTrend
costTrend
energyTypes
scenarios
assumptions
secTrend
planningSteps
documents
```

## M12 — Tối ưu hóa & Hỗ trợ ra quyết định

- 6 tab nghiệp vụ và 5 KPI theo ảnh mẫu.
- Load Shifting & Peak Shaving: hiện tại / tối ưu / giới hạn hợp đồng.
- Tối ưu cơ cấu nhiên liệu và chi phí theo kịch bản.
- 6 kịch bản What-if với chi phí, tiết kiệm, giảm CO₂, CAPEX và hoàn vốn.
- MACC cho 5 nhóm giải pháp.
- Top 5 khuyến nghị ưu tiên.
- Quy trình hỗ trợ ra quyết định 4 bước và 6 tài liệu/biểu mẫu.
- Toolbar: Nhà máy / Khoảng thời gian / Kịch bản hiển thị / Chạy mô phỏng mới.

Contract bổ sung trong `GET /api/enms/v1/modules/optimization`:

```text
kpis
viewTabs
loadShifting
fuelMix
scenarioCost
scenarios
macc
maccNote
recommendations
decisionFlow
documents
```

## M13 — ISO 50001 & Kiểm toán năng lượng

- 7 tab: Tổng quan, Energy Review, Bằng chứng & Tài liệu, Đánh giá nội bộ, Kiểm toán bên ngoài, NCR/CAPA, Cải tiến liên tục.
- 6 KPI: tuân thủ, bằng chứng, NCR, CAPA, cơ hội cải tiến và mục tiêu SEC.
- Lộ trình chứng nhận 6 mốc.
- Mức đáp ứng ISO 50001:2024 theo 7 nhóm điều khoản.
- Biểu đồ NCR theo tháng.
- Bảng đánh giá/kiểm toán, CAPA 18/20, cơ hội cải tiến và hệ thống tài liệu.
- Quy trình kiểm toán năng lượng theo ISO 50002 gồm 5 bước.
- 6 tài liệu/biểu mẫu.
- Toolbar: Nhà máy / Năm / Chu kỳ đánh giá / Tạo hồ sơ mới.

Contract bổ sung trong `GET /api/enms/v1/modules/iso50001`:

```text
kpis
viewTabs
certificationRoadmap
compliance
ncrTrend
audits
capa
opportunities
documentSystem
auditProcess
documents
```

## Tương thích

Các module M11–M13 vẫn duy trì `primary`, `secondary`, `table`, `insights` để provider PostgreSQL tương lai có thể chuyển đổi theo từng bước mà không phá contract cũ.

Không thay đổi:

- PostgreSQL schema và biến `DB_*`.
- Login JWT (`services/login-jwt.js`).
- HES WebSocket ticket, subprotocol `hes104-v1`, device ACL và `SUBSCRIBE`.
- API route `/api/enms/v1/*`.

## Kiểm thử

Bổ sung `tests/enms_forecast_optimization_iso.test.js` để kiểm tra contract và kiến trúc riêng của M11–M13, đồng thời cập nhật regression modular test cho v1.1.9.
