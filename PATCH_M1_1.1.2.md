# Patch M1 — EnMS v1.1.2

Base yêu cầu: **EnMS v1.1.1**.

Patch này chỉ chỉnh M1 Tổng quan và metadata/version liên quan. Không thay database, JWT hoặc HES WebSocket.

## Cách áp dụng

1. Sao lưu source v1.1.1 hiện tại.
2. Copy đè toàn bộ file trong patch theo đúng cây thư mục.
3. Giữ nguyên `.env`, certificate/private key và các file cấu hình môi trường đang dùng trên server.
4. Khởi động lại Node/PM2.
5. Xóa cache trình duyệt hoặc `Ctrl+F5`.
6. Mở `/enms/overview`.

## File nghiệp vụ M1 chính

- `views/enms/pages/overview/index.ejs`
- `views/enms/pages/overview/_summary.ejs`
- `views/enms/pages/overview/_factory.ejs`
- `views/enms/pages/overview/_analytics.ejs`
- `views/enms/pages/overview/_lists.ejs`
- `public/enms/css/pages/overview.css`
- `public/enms/js/pages/overview.js`
- `public/enms/mock.js`

## File tích hợp/version

- `public/enms/js/bootstrap.js`
- `public/enms/js/core/config.js`
- `config/enms-menu.js`
- `services/enms-service.js`
- `views/enms/partials/sidebar.ejs`
- `package.json`, `package-lock.json`, `VERSION`
- `tests/enms.test.js`, `tests/enms_modular.test.js`
