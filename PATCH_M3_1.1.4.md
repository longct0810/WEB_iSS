# Patch M3 — EnMS v1.1.3 → v1.1.4

Patch này chỉ nâng M3 Bản đồ năng lượng & Energy Balance và metadata version.

## Cách áp dụng

1. Backup source v1.1.3 hiện tại.
2. Copy đè toàn bộ nội dung patch vào thư mục project.
3. Giữ nguyên `.env`, certificate và private key trên server.
4. Chạy `npm test`.
5. Restart ứng dụng bằng PM2 hoặc Node.js.
6. Trình duyệt dùng `Ctrl+F5` để xóa cache asset cũ.

Không có file cũ nào bắt buộc phải xóa trong patch này.
