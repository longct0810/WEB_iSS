# Lam Thạch II EnMS

Phiên bản hiện tại: **1.1.9**

EnMS v1.1.9 giữ kiến trúc EnMS Advanced 17 module, kế thừa M1–M10 đã chuẩn hóa và dựng lại M11/M12/M13 theo bộ ảnh giao diện chuẩn ngày 14/09/2026. Kiến trúc gốc vẫn giữ nguyên: Node.js + Express + EJS + PostgreSQL, login JWT hiện tại và HES WebSocket ticket/ACL hiện tại.

## 17 module EnMS Advanced

1. M1 – Executive Dashboard / Tổng quan điều hành
2. M2 – Giám sát thời gian thực
3. M3 – Bản đồ năng lượng & Energy Balance
4. M4 – SEU & EnPI
5. M5 – Mục tiêu & Hành động
6. M6 – Phân tích & Cảnh báo
7. M7 – Tiết kiệm năng lượng & M&V
8. M8 – Phát thải CO₂ & ESG
9. M9 – Báo cáo & Dashboard quản trị
10. M10 – Quản lý dữ liệu & Hệ thống
11. M11 – Dự báo & Kế hoạch năng lượng
12. M12 – Tối ưu hóa & Hỗ trợ ra quyết định
13. M13 – ISO 50001 & Kiểm toán năng lượng
14. M14 – AI Analytics & Predictive Intelligence
15. M15 – Energy Digital Twin
16. M16 – AI Optimization & Decision Intelligence
17. M17 – Autonomous Energy Management

Hai tiện ích kỹ thuật từ v1.0.x vẫn được giữ để tương thích link cũ: **Bản đồ & Sơ đồ trạm** và **Cài đặt hệ thống**.

## Kiến trúc frontend

- Shell dùng chung: `views/enms/partials/*`
- 17 page module: `views/enms/pages/<page>/`
- JavaScript theo page: `public/enms/js/pages/<page>.js`
- Shared components: `public/enms/js/components/*`
- Core: `public/enms/js/core/*`
- Shared Advanced renderer: `public/enms/js/components/module-page.js`
- Shared Advanced styles: `public/enms/css/module-dashboard.css`

M1–M13 đã chuyển sang page module chuyên biệt để bám sát từng màn hình nghiệp vụ. Các module M14–M17 tiếp tục sử dụng renderer dùng chung để tránh nhân bản HTML/JavaScript, nhưng vẫn có page entry riêng để dễ mở rộng.

## API EnMS

Các API cũ được giữ nguyên. v1.1.x hỗ trợ:

```text
GET /api/enms/v1/modules
GET /api/enms/v1/modules/:id
```

`/modules/:id` trả về contract mock gồm KPI, primary visualization, secondary visualization, bảng chi tiết và insights. Khi nối PostgreSQL thật có thể thay provider nhưng giữ nguyên JSON contract để frontend không phải sửa lại.

## Chạy project

```bash
npm install
npm start
```

Sau khi đăng nhập, mở:

```text
/enms/overview
```

## Preview không cần database

```bash
npm install
npm run preview:enms
```

Mở:

```text
http://127.0.0.1:3100/enms/preview/overview
```

Preview dùng dữ liệu mock trong bộ nhớ, không mở database và không mở HES WebSocket.

## Nguồn dữ liệu

Mặc định:

```env
ENMS_DATA_SOURCE=mock
```

Khi tích hợp dữ liệu thực, giữ nguyên cấu hình `DB_*` hiện tại và triển khai provider database ở `services/enms-service.js`. Chế độ `database` hiện vẫn fail-closed nếu provider thật chưa được cấu hình.

## Bảo mật

- Login JWT giữ nguyên qua `services/login-jwt.js`.
- API EnMS vẫn yêu cầu `Authorization: Bearer <login JWT>`.
- HES WebSocket vẫn dùng endpoint cấp ticket, subprotocol `hes104-v1`, device ACL và `SUBSCRIBE` như bản hiện tại.
- Không chuyển ID mock sang HES.

Xem thêm `docs/ENMS_V1.1.9.md` và `CHANGELOG_ENMS.md`.

### Revision M14–M17 (14/09/2026)
Bản v1.1.9 hiện bao gồm giao diện chuyên biệt cho M14 AI Analytics, M15 Digital Twin, M16 AI Optimization và M17 Autonomous Energy Management theo bộ mockup mới. Version được giữ nguyên 1.1.9 theo yêu cầu.
