# ISS Frontend PowerAI Client 1.2.1

Bản vá luồng feedback PowerAI:

- `event_id` chỉ giữ UUID thật do backend cấp.
- `client_key` dùng riêng để định danh dòng trên giao diện.
- Lọc bỏ ID tự tạo trước khi gửi `/p1/alert-feedback/bulk`.
- Cho phép gửi feedback bằng `incident_id` khi không có event UUID.
- Proxy Node.js kiểm tra UUID trước khi chuyển request tới PowerAI.

Sau khi cập nhật:

```bash
npm install
pm2 restart smartgrid --update-env
```

Sau đó tải lại trình duyệt bằng `Ctrl + Shift + R`.
