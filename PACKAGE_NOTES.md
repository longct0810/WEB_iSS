# Package notes — EnMS v1.1.9

- Khuyến nghị cập nhật từ EnMS v1.1.8 bằng patch M11/M12/M13.
- Không ghi đè `.env`, private key, PFX hoặc certificate riêng của môi trường triển khai.
- v1.1.9 không thay PostgreSQL schema hoặc các biến `DB_*`.
- Public WebSocket verification key và trust boundary HES giữ nguyên.
- M11–M13 đã chuyển từ generic `module-dashboard` sang page module chuyên biệt.
- Sau khi copy patch: chạy `npm test`, restart tiến trình và hard refresh trình duyệt.
