# EnMS v1.0.1 — Frontend Modularization

## Mục tiêu

v1.0.1 giữ nguyên nghiệp vụ, API, cấu hình database, login JWT và cơ chế xác thực HES WebSocket của v1.0.0; thay đổi chính là tách giao diện EnMS thành các module độc lập để dễ bảo trì và chuẩn bị cho giai đoạn nối dữ liệu PostgreSQL thực.

## Kiến trúc view

Shell EJS dùng chung:

```text
views/enms/
├── index.ejs
├── partials/
│   ├── head.ejs
│   ├── sidebar.ejs
│   ├── topbar.ejs
│   ├── page-header.ejs
│   ├── statusbar.ejs
│   ├── dialogs.ejs
│   └── scripts.ejs
└── pages/
    ├── overview/
    ├── realtime/
    ├── map/
    ├── seu/
    ├── reports/
    ├── alerts/
    ├── data/
    └── settings/
```

Bảy màn hình nghiệp vụ đều có `index.ejs` riêng; các màn hình lớn tiếp tục tách thành partial theo từng section như summary, factory map, analytics, workspace và toolbar.

`routes/enms.js` chỉ xác định page hợp lệ và truyền `viewPage=pages/<page>/index` cho shell. Vì vậy sidebar/topbar/dialog/statusbar không bị copy giữa các trang.

## Kiến trúc JavaScript

```text
public/enms/js/
├── bootstrap.js
├── core/
│   ├── api.js
│   ├── charts.js
│   ├── config.js
│   ├── dom.js
│   ├── realtime.js
│   └── state.js
├── components/
│   ├── factory.js
│   └── ui.js
└── pages/
    ├── overview.js
    ├── realtime.js
    ├── map.js
    ├── seu.js
    ├── reports.js
    ├── alerts.js
    ├── data.js
    └── settings.js
```

`bootstrap.js` chịu trách nhiệm khởi tạo shell, đọc dữ liệu dùng chung, đăng ký event delegation và nạp page controller bằng ES module động.

Mỗi page module chỉ xử lý nghiệp vụ của màn hình đó thông qua các hook:

- `mount()`
- `onAction()`
- `onTab()`
- `onInput()`
- `onChange()`
- `onSubmit()`
- `dispose()` khi màn hình có timer/socket

Các phần UI dùng lại như card KPI, table, tab, status badge, station list và export helper nằm ở module dùng chung thay vì copy vào từng trang.

## CSS

CSS EnMS được chuyển sang:

```text
public/enms/css/
├── core.css
└── pages/
    ├── overview.css
    ├── realtime.css
    ├── map.css
    ├── seu.css
    ├── reports.css
    ├── alerts.css
    ├── data.css
    └── settings.css
```

`core.css` giữ design system và responsive rules chung. Mỗi page có file CSS riêng cho phần đặc thù.

## Bảo mật không thay đổi

- Login vẫn dùng `services/login-jwt.js`.
- API EnMS vẫn yêu cầu `Authorization: Bearer <login JWT>`.
- Frontend live vẫn đọc token hiện có từ `hes_login_token`.
- Realtime vẫn xin ticket tại `/api/hes/ws-ticket` bằng Bearer JWT.
- WebSocket vẫn dùng subprotocol `hes104-v1` + ticket và chỉ `SUBSCRIBE` các device ID được HES cho phép.
- ID mock không được dùng để xin ticket HES.

## API và database

Không thay đổi contract `/api/enms/v1/*` so với v1.0.0. Không thay đổi cấu hình `DB_*` hiện tại.

Nguồn dữ liệu mặc định vẫn là:

```env
ENMS_DATA_SOURCE=mock
```

Khi chuyển sang PostgreSQL thực ở v1.1.0, frontend page/module không cần thay đổi nếu provider mới giữ nguyên contract JSON hiện tại.

## Preview

```bash
npm install
npm run preview:enms
```

Mở:

```text
http://127.0.0.1:3100/enms/preview/overview
```

## Kiểm thử v1.0.1

Bổ sung `tests/enms_modular.test.js` để kiểm tra:

- shell EJS đã tách partial dùng chung;
- 7 page có view module + JavaScript module + CSS page riêng;
- `app.js`, `api.js`, `realtime.js` nguyên khối cũ đã được loại bỏ khỏi `public/enms/`;
- route truyền đúng page partial;
- version package là 1.0.1;
- login JWT và HES ticket trust boundary vẫn tồn tại.

## Lưu ý khi triển khai

Gói source v1.0.1 không kèm `.env` và private key. Khi cập nhật từ v1.0.0, giữ nguyên cấu hình database, `LOGIN_JWT_SECRET`, `HES_WS_PRIVATE_KEY_PATH`, key ID/issuer/audience và các khóa TLS đang quản lý trên server.
