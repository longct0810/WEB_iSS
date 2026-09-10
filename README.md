# Lam Thạch II EnMS

Phiên bản hiện tại: **1.0.1**

Hệ thống quản lý năng lượng nhà máy được chuyển đổi trên nền kiến trúc project hiện có: Node.js + Express + EJS + PostgreSQL, giữ nguyên luồng login JWT và HES WebSocket ticket/ACL.

## EnMS v1.0.1

v1.0.1 là bản **Frontend Modularization**. Bảy màn hình nghiệp vụ của v1.0.0 được giữ nguyên nhưng view, JavaScript và CSS được tách thành module theo từng page/section.

Các màn hình nghiệp vụ:

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

Sau khi đăng nhập, truy cập `/enms/overview`.

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

Frontend tiếp tục sử dụng API `/api/enms/v1/*`. Khi hoàn tất ánh xạ database thật, chỉ thay provider dữ liệu và đặt `ENMS_DATA_SOURCE=database`; cấu hình `DB_*` hiện có không thay đổi.

Xem `docs/ENMS_V1.0.1.md` và `CHANGELOG_ENMS.md`.

## File cấu hình triển khai

Gói source bàn giao không đóng gói `.env` hoặc private key. Khi nâng cấp trên server, giữ nguyên `.env`, `HES_WS_PRIVATE_KEY_PATH` và các khóa/certificate riêng đang dùng tại môi trường hiện tại.
