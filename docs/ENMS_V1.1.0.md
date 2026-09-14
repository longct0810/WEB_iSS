# EnMS v1.1.0 – Advanced 17-Module UI Expansion

## 1. Phạm vi nâng cấp

v1.1.0 phát triển trực tiếp từ v1.0.1. Mục tiêu là cập nhật giao diện và bổ sung đầy đủ các màn hình theo bộ ảnh EnMS Advanced, đồng thời giữ nguyên trust boundary hiện tại của login JWT và HES WebSocket.

Không thay đổi schema database, không đổi biến kết nối `DB_*`, không thay login flow và không thay cơ chế socket authentication.

## 2. Danh sách module

| Mã | Route | Module |
|---|---|---|
| M1 | `/enms/overview` | Executive Dashboard – Tổng quan điều hành |
| M2 | `/enms/realtime` | Giám sát thời gian thực |
| M3 | `/enms/balance` | Bản đồ năng lượng & Energy Balance |
| M4 | `/enms/seu` | SEU & EnPI |
| M5 | `/enms/targets` | Mục tiêu & Hành động |
| M6 | `/enms/alerts` | Phân tích & Cảnh báo |
| M7 | `/enms/savings` | Tiết kiệm năng lượng & M&V |
| M8 | `/enms/emissions` | Phát thải CO₂ & ESG |
| M9 | `/enms/reports` | Báo cáo & Dashboard quản trị |
| M10 | `/enms/data` | Quản lý dữ liệu & Hệ thống |
| M11 | `/enms/forecast` | Dự báo & Kế hoạch năng lượng |
| M12 | `/enms/optimization` | Tối ưu hóa & Hỗ trợ ra quyết định |
| M13 | `/enms/iso50001` | ISO 50001 & Kiểm toán năng lượng |
| M14 | `/enms/analytics` | AI Analytics & Predictive Intelligence |
| M15 | `/enms/digital-twin` | Energy Digital Twin |
| M16 | `/enms/ai-decision` | AI Optimization & Decision Intelligence |
| M17 | `/enms/autonomous` | Autonomous Energy Management |

Utility routes giữ lại để tương thích: `/enms/map` và `/enms/settings`.

## 3. Kiến trúc view module

```text
views/enms/
├── index.ejs
├── partials/
│   ├── head.ejs
│   ├── sidebar.ejs
│   ├── topbar.ejs
│   ├── page-header.ejs
│   ├── statusbar.ejs
│   ├── dialogs.ejs
│   ├── scripts.ejs
│   └── module-dashboard.ejs
└── pages/
    ├── overview/
    ├── realtime/
    ├── balance/
    ├── seu/
    ├── targets/
    ├── alerts/
    ├── savings/
    ├── emissions/
    ├── reports/
    ├── data/
    ├── forecast/
    ├── optimization/
    ├── iso50001/
    ├── analytics/
    ├── digital-twin/
    ├── ai-decision/
    ├── autonomous/
    ├── map/
    └── settings/
```

Các trang mới dùng `partials/module-dashboard.ejs` cho cấu trúc KPI + visualization + table + insight. Mỗi page vẫn có entry riêng, do đó khi một module cần giao diện đặc thù có thể tách dần mà không ảnh hưởng các module khác.

## 4. Kiến trúc JavaScript

```text
public/enms/js/
├── bootstrap.js
├── core/
│   ├── api.js
│   ├── charts.js
│   ├── config.js
│   ├── dom.js
│   ├── realtime.js
│   └── state.js
├── components/
│   ├── factory.js
│   ├── ui.js
│   └── module-page.js
└── pages/
    └── <17 module + utility pages>.js
```

`module-page.js` render các kiểu visualization dùng chung:

- line / area / bar
- donut
- energy flow
- target progress
- maturity/compliance score
- decision matrix
- digital twin mockup
- detail table
- insight/action cards

## 5. Mock data contract

`public/enms/mock.js` vẫn cung cấp dữ liệu deterministic cho preview. v1.1.0 bổ sung 17 payload module.

Ví dụ:

```json
{
  "id": "forecast",
  "code": "M11",
  "title": "Dự báo & Kế hoạch năng lượng",
  "kpis": [],
  "primary": {},
  "secondary": {},
  "table": {},
  "insights": []
}
```

API:

```text
GET /api/enms/v1/modules
GET /api/enms/v1/modules/:id
```

Khi chuyển sang dữ liệu thật, provider database nên trả đúng contract trên. Frontend không cần biết dữ liệu đến từ mock hay PostgreSQL.

## 6. Login JWT

Không thay đổi.

Luồng live:

```text
Browser
  -> login hiện tại
  -> hes_login_token
  -> Authorization: Bearer <JWT>
  -> /api/enms/v1/*
  -> verifyLoginToken()
```

Không tạo access token mới cho EnMS.

## 7. HES WebSocket

Không thay đổi trust boundary hiện có:

```text
Browser
  -> Bearer login JWT
  -> /api/hes/ws-ticket
  -> ticket signed
  -> WebSocket subprotocol hes104-v1
  -> device ACL
  -> SUBSCRIBE
```

Mock IDs không được dùng để xin ticket HES.

## 8. Database

v1.1.0 chưa thay schema và chưa ép project sang provider database mới.

```env
ENMS_DATA_SOURCE=mock
```

Khi triển khai provider thật:

```env
ENMS_DATA_SOURCE=database
```

`services/enms-service.js` hiện fail-closed khi chọn `database` nhưng provider chưa được cài đặt. Điều này tránh việc mock bị hiển thị nhầm như dữ liệu thật.

## 9. Nâng cấp từ v1.0.1

Không cần migration database.

Các file chính thay đổi / bổ sung:

```text
config/enms-menu.js
routes/enms.js
services/enms-service.js
public/enms/mock.js
public/enms/css/module-dashboard.css
public/enms/js/bootstrap.js
public/enms/js/core/config.js
public/enms/js/core/state.js
public/enms/js/components/module-page.js
public/enms/js/components/ui.js
views/enms/partials/sidebar.ejs
views/enms/partials/topbar.ejs
views/enms/partials/page-header.ejs
views/enms/partials/module-dashboard.ejs
views/enms/pages/*
tests/enms.test.js
tests/enms_modular.test.js
```

## 10. Preview

```bash
npm install
npm run preview:enms
```

Mở `http://127.0.0.1:3100/enms/preview/overview` và chuyển qua 17 menu để kiểm tra.

## 11. Ghi chú kiểm thử

Trong môi trường đóng gói hiện tại không có `node_modules`, vì vậy full `npm test` cần chạy sau `npm install`. Static syntax checks của các file JavaScript EnMS và contract mock 17 module đã được kiểm tra độc lập bằng Node.js.
