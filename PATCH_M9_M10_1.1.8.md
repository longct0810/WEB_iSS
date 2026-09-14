# Patch EnMS v1.1.8 — M9/M10

Patch này áp dụng trên **EnMS v1.1.7**.

## Cập nhật

- Dựng lại M9 Báo cáo & Dashboard quản trị theo ảnh chuẩn.
- Dựng lại M10 Quản lý dữ liệu & Hệ thống theo ảnh chuẩn.
- Mở rộng mock contract `modules/reports` và `modules/data`.
- Cập nhật toolbar, title, description và metadata lên 1.1.8.
- Bổ sung test regression cho M9/M10.

## Không thay đổi

- `.env`
- PostgreSQL schema / `DB_*`
- Login JWT
- HES WebSocket private/public key
- WebSocket ticket / ACL / `SUBSCRIBE`

## File cũ cần xóa sau khi copy patch

```text
views/enms/pages/reports/_content.ejs
views/enms/pages/data/_toolbar.ejs
views/enms/pages/data/_system.ejs
```

## Sau khi copy

```bash
npm test
pm2 restart smartgrid --update-env
```

Sau đó hard refresh trình duyệt (`Ctrl+F5`).
