# Patch M4 — EnMS 1.1.4 → 1.1.5

Patch này chỉ thay các file cần thiết để dựng lại M4 SEU & EnPI và đồng bộ version.

## Sau khi copy patch

Xóa file M4 cũ không còn sử dụng:

```text
views/enms/pages/seu/_content.ejs
```

Giữ nguyên `.env`, certificate/key, cấu hình PostgreSQL, Login JWT và HES WebSocket.

Khởi động lại ứng dụng rồi hard refresh trình duyệt (`Ctrl+F5`).
