# Patch EnMS v1.1.9 — M11/M12/M13

Áp dụng trên **EnMS v1.1.8**.

## Thay đổi

- Dựng riêng M11 `Dự báo & Kế hoạch năng lượng` theo ảnh chuẩn.
- Dựng riêng M12 `Tối ưu hóa & Hỗ trợ ra quyết định` theo ảnh chuẩn.
- Dựng riêng M13 `ISO 50001 & Kiểm toán năng lượng` theo ảnh chuẩn.
- Mở rộng mock/API contract cho forecast, optimization và iso50001.
- Cập nhật toolbar M11/M12/M13 và metadata lên 1.1.9.
- Bổ sung regression test cho ba màn hình.

## File thay đổi chính

```text
views/enms/pages/forecast/*
views/enms/pages/optimization/*
views/enms/pages/iso50001/*
public/enms/js/pages/forecast.js
public/enms/js/pages/optimization.js
public/enms/js/pages/iso50001.js
public/enms/css/pages/forecast.css
public/enms/css/pages/optimization.css
public/enms/css/pages/iso50001.css
public/enms/mock.js
public/enms/js/bootstrap.js
public/enms/js/core/config.js
public/enms/js/core/charts.js
config/enms-menu.js
services/enms-service.js
views/enms/partials/sidebar.ejs
package.json
package-lock.json
VERSION
tests/enms_modular.test.js
tests/enms_forecast_optimization_iso.test.js
```

## Triển khai

1. Backup source và `.env` hiện tại.
2. Copy đè toàn bộ nội dung patch vào project v1.1.8.
3. Không thay `.env`, private key/certificate hoặc database config.
4. Chạy:

```bash
npm test
pm2 restart smartgrid --update-env
```

5. Hard refresh trình duyệt (`Ctrl+F5`).

Không có file cần xóa trong patch này.
