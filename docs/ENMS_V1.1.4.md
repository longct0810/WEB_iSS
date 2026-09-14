# EnMS v1.1.4 — M3 Energy Map & Energy Balance

Ngày: 14/09/2026

## Phạm vi

v1.1.4 chỉ rà soát và hoàn thiện **M3 – Bản đồ năng lượng & Energy Balance** theo ảnh giao diện chuẩn. Shell EnMS, M1 v1.1.2, M2 v1.1.3 và các module M4–M17 được giữ nguyên về nghiệp vụ.

## Giao diện M3

M3 được chuyển từ shared Advanced renderer sang page module riêng để bám sát bố cục tham chiếu:

- Thanh chế độ: Tổng quan, Bản đồ năng lượng, Energy Balance, Sơ đồ Sankey, Phân bổ năng lượng, So sánh theo thời gian.
- 6 KPI: Điện, Than, Dầu, Hơi, Nước, CO₂.
- Energy Balance 3 lớp: Đầu vào năng lượng → Công đoạn → Đầu ra có ích / Tổn thất.
- Chuyển đơn vị MWh / GJ / toe.
- Bản đồ năng lượng nhà máy với 5 khu vực và 3 chế độ xem.
- Cụm hiệu suất tổng thể: Useful Energy, Loss, SEC, Clinker factor.
- Bảng cân đối chi tiết có 4 chế độ và xuất Excel.
- Donut phân bổ theo công đoạn / loại năng lượng.
- Trend Energy Balance theo tháng với lựa chọn Loss rate / Useful rate / SEC.

## Contract API M3

`GET /api/enms/v1/modules/balance`

Ngoài contract tương thích `primary`, `secondary`, `table`, `insights`, payload M3 có thêm:

```text
kpis
energyBalance
  inputs
  processes
  usefulOutputs
  losses
energyMap
efficiency
balanceTable
  process
  energy
  unit
  compare
distribution
trend
```

Mock hiện tại đảm bảo:

```text
Tổng đầu vào      1,245,600 MWh
Đầu ra hữu ích    1,058,400 MWh
Tổn thất            187,200 MWh
Tỷ lệ hữu ích          85.0%
Tỷ lệ tổn thất         15.0%
```

## Bảo mật và dữ liệu

Không thay đổi:

- `services/login-jwt.js`.
- Bearer JWT của API EnMS.
- HES WebSocket ticket, `hes104-v1`, device ACL và `SUBSCRIBE`.
- PostgreSQL schema và biến `DB_*`.
- Cơ chế fail-closed khi `ENMS_DATA_SOURCE=database` nhưng provider thật chưa được triển khai.

## File chính thay đổi

```text
views/enms/pages/balance/index.ejs
views/enms/pages/balance/_tabs.ejs
views/enms/pages/balance/_summary.ejs
views/enms/pages/balance/_main.ejs
views/enms/pages/balance/_bottom.ejs
public/enms/js/pages/balance.js
public/enms/css/pages/balance.css
public/enms/mock.js
public/enms/js/bootstrap.js
public/enms/js/core/config.js
config/enms-menu.js
services/enms-service.js
```

Package, API metadata, frontend VERSION và sidebar: `1.1.4`.
