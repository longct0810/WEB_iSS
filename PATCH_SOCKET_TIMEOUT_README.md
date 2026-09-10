# Patch cảnh báo mất dữ liệu socket (không tăng version)

## Chức năng

- Theo dõi thời điểm nhận bản tin realtime gần nhất.
- Nếu quá 120 giây không có dữ liệu socket:
  - Hiện banner đỏ `SERVER MẤT DỮ LIỆU REALTIME`.
  - Chèn cảnh báo `Server mất dữ liệu` mức `Nghiêm trọng` vào bảng cảnh báo.
  - Đóng socket lỗi để cơ chế reconnect hiện có kết nối lại.
- Khi nhận lại dữ liệu:
  - Tự động gỡ banner.
  - Tự động xóa cảnh báo tạm khỏi bảng.
- Không thay đổi version project.

## File thay đổi

- `public/javascripts/socket.js`
- `public/javascripts/socket-data-watchdog.js` (mới)
- `public/css/power-ai-dashboard.css`
- `views/Dashboard/dashboard.ejs`

## Cài patch

Giải nén patch đè vào thư mục project iSS, sau đó:

```bash
pm2 restart smartgrid --update-env
```

Trình duyệt:

```text
Ctrl + Shift + R
```

## Kiểm thử nhanh

Tạm dừng server socket hoặc chặn kết nối WebSocket. Sau 2 phút phải xuất hiện cảnh báo.
Khi server socket hoạt động lại và có bản tin mới, cảnh báo phải tự phục hồi.
