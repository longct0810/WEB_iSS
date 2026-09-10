# Lam Thạch II EnMS

Phiên bản hiện tại: **1.0.0**

Hệ thống quản lý năng lượng nhà máy được chuyển đổi trên nền kiến trúc project SMARTGRID hiện có: Node.js + Express + EJS + PostgreSQL, giữ nguyên luồng login JWT và HES WebSocket ticket/ACL.

## EnMS v1.0.0

Bản đầu tiên cung cấp 7 màn hình nghiệp vụ theo bộ giao diện mẫu:

- Tổng quan
- Giám sát thời gian thực
- Bản đồ & Sơ đồ trạm
- SEU & EnPI
- Báo cáo
- Cảnh báo & Sự kiện
- Quản lý dữ liệu

`Cài đặt hệ thống` tiếp tục liên kết đến các module quản trị của project gốc.

## Chạy project

```bash
npm install
npm start
```

Sau khi đăng nhập, truy cập `/enms/overview`. Route `/` và `/dashboard` được chuyển về màn hình Tổng quan EnMS.

## Preview giao diện không cần database

```bash
npm run preview:enms
```

Mở `http://127.0.0.1:3100/enms/preview/overview`.

Preview dùng dữ liệu mock trong bộ nhớ, không mở database và không mở HES WebSocket.

## Nguồn dữ liệu

Mặc định:

```env
ENMS_DATA_SOURCE=mock
```

Frontend đã sử dụng API `/api/enms/v1/*`. Khi hoàn tất ánh xạ database thật, chỉ thay provider dữ liệu và đặt `ENMS_DATA_SOURCE=database`; cấu hình `DB_*` hiện có không thay đổi.

Xem chi tiết tại `docs/ENMS_V1.0.0.md` và `CHANGELOG_ENMS.md`.
