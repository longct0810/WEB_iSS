# Changelog EnMS

## 1.0.1 - 2026-09-10

- Refactor giao diện EnMS sang kiến trúc module, không thay đổi contract nghiệp vụ.
- Tách shell EJS thành partial dùng chung: head, sidebar, topbar, page header, statusbar, dialog và scripts.
- Tách 7 màn hình nghiệp vụ thành thư mục view riêng; các màn hình lớn tiếp tục chia section partial.
- Tách JavaScript nguyên khối thành `core/`, `components/` và `pages/`, sử dụng ES modules.
- Tách API client, state, DOM helper, chart helper và HES realtime adapter khỏi page controller.
- Tách CSS core và CSS đặc thù theo page.
- Loại bỏ các file frontend nguyên khối cũ `public/enms/app.js`, `public/enms/api.js`, `public/enms/realtime.js`.
- Giữ nguyên login JWT và HES WebSocket ticket/device ACL.
- Giữ nguyên API `/api/enms/v1/*`, dữ liệu mock và cấu hình database.
- Cập nhật version lên `1.0.1` và bổ sung kiểm thử kiến trúc module.

## 1.0.0 - 2026-09-10

- Chuyển shell giao diện sang EnMS theo bộ ảnh Lam Thạch II.
- Thêm module menu EnMS gồm 7 màn hình nghiệp vụ và khu vực Cài đặt hệ thống.
- Dựng 7 trang: Tổng quan, Realtime, Bản đồ/Sơ đồ trạm, SEU/EnPI, Báo cáo, Cảnh báo/Sự kiện, Quản lý dữ liệu.
- Thêm bộ dữ liệu mock để preview không cần database.
- Thêm API `/api/enms/v1/*` có xác thực login JWT.
- Giữ nguyên login JWT hiện có; không tạo cơ chế login mới.
- Giữ HES WebSocket trust boundary; realtime adapter chỉ xin ticket bằng Bearer JWT và device ACL.
- Thêm cơ chế fail-closed khi chọn nguồn database nhưng provider thật chưa được cấu hình.
- Thêm standalone preview `npm run preview:enms`.
- Thêm test cho JWT, API mock, phân trang/filter, report, route và fail-closed.
