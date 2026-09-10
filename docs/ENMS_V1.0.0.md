# EnMS v1.0.0

## Phạm vi phiên bản

EnMS v1.0.0 chuyển giao diện nghiệp vụ của project gốc sang hệ thống quản lý năng lượng nhà máy nhưng giữ nguyên kiến trúc Node.js + Express + EJS và lớp kết nối PostgreSQL hiện có.

Bảy màn hình demo đã được dựng theo bộ ảnh tham chiếu:

1. Tổng quan
2. Giám sát thời gian thực
3. Bản đồ & Sơ đồ trạm
4. SEU & EnPI
5. Báo cáo
6. Cảnh báo & Sự kiện
7. Quản lý dữ liệu

Menu `Cài đặt hệ thống` là cổng vào các chức năng quản trị legacy hiện có, không tính vào 7 màn hình demo.

## Bảo mật được giữ nguyên

- Login tiếp tục phát JWT bằng `services/login-jwt.js` và lưu token theo luồng đăng nhập hiện tại.
- Toàn bộ `/api/enms/v1/*` yêu cầu `Authorization: Bearer <login JWT>`.
- WebSocket EnMS không tạo kết nối ẩn danh. Khi dữ liệu thực cung cấp `hesDeviceId`/`deviceId`/`id_thietbi`, trang realtime xin ticket tại `/api/hes/ws-ticket`, sau đó kết nối HES bằng subprotocol `hes104-v1` + ticket JWT và phạm vi thiết bị do ACL kiểm tra.
- Các ID mock (`MT-xxx`, station 1..16) không được dùng để xin HES ticket.

## Chế độ dữ liệu

`ENMS_DATA_SOURCE=mock` là mặc định của v1.0.0. Frontend chỉ gọi API EnMS, không đọc trực tiếp database. Khi chuyển sang dữ liệu thật, giữ nguyên cấu hình `DB_*` hiện tại và thay implementation ở `services/enms-service.js`/provider dữ liệu; không cần đổi route hoặc giao diện.

Nếu `ENMS_DATA_SOURCE` khác `mock` khi provider thật chưa được ánh xạ, API trả `503` thay vì âm thầm hiển thị dữ liệu mẫu như dữ liệu thật.

## API v1

Base URL: `/api/enms/v1`. Tất cả endpoint dưới đây cần Bearer JWT.

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/summary` | KPI tổng quan nhà máy |
| GET | `/stations` | Danh sách trạm/khu vực |
| GET | `/meters` | Danh sách điểm đo |
| GET | `/readings` | Dữ liệu lịch sử theo điểm đo, thời gian, chu kỳ, phân trang |
| GET | `/seu` | Danh sách SEU và EnPI |
| GET | `/alerts` | Danh sách sự kiện/cảnh báo có filter và phân trang |
| GET | `/alerts/:id` | Chi tiết cảnh báo |
| PATCH | `/alerts/:id` | Cập nhật trạng thái xử lý cảnh báo |
| GET | `/reports` | Danh sách báo cáo |
| GET | `/reports/:id` | Chi tiết báo cáo |
| POST | `/reports` | Tạo báo cáo |

### Contract cần có khi nối database thật

`meters` nên trả thêm một trong các trường `hesDeviceId`, `deviceId` hoặc `id_thietbi` nếu muốn trang Giám sát thời gian thực tự kết nối HES. Đây phải là ID thiết bị thật đã nằm trong ACL của user hiện tại.

Các endpoint lịch sử nên giữ contract JSON hiện tại để frontend không phải sửa khi đổi `mock -> database`.

## Preview không cần database

Sau khi cài dependency:

```bash
npm run preview:enms
```

Mở:

```text
http://127.0.0.1:3100/enms/preview/overview
```

Preview chỉ dùng mock trong bộ nhớ, không khởi tạo database, không phát login JWT và không mở HES socket.

## Các file chính

- `config/enms-menu.js`: cấu hình menu EnMS.
- `routes/enms.js`: page routes + API v1 routes.
- `controllers/enms.js`: xác thực JWT và HTTP controller.
- `services/enms-service.js`: lớp nguồn dữ liệu EnMS.
- `views/enms/index.ejs`: shell giao diện chung.
- `public/enms/app.js`: 7 màn hình nghiệp vụ + interaction/chart/export.
- `public/enms/mock.js`: dữ liệu mock xác định, dùng cả preview và API mock.
- `public/enms/realtime.js`: adapter HES WebSocket có ticket JWT.
- `public/enms/enms.css`: giao diện responsive theo mẫu.

## Chuyển sang dữ liệu thật ở phiên bản tiếp theo

Không thay đổi database connection. Chỉ cần ánh xạ các procedure/query hiện có vào contract của `summary`, `stations`, `meters`, `readings`, `seu`, `alerts`, `reports`, sau đó đặt `ENMS_DATA_SOURCE=database`. Nên thực hiện ánh xạ theo từng endpoint và kiểm thử ACL trước khi bật production.
