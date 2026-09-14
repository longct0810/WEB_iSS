# EnMS v1.1.5 — M4 SEU & EnPI

Ngày phát hành: 14/09/2026.

## Phạm vi

v1.1.5 chỉ rà soát và hoàn thiện **M4 – SEU & EnPI** theo ảnh giao diện chuẩn. Shell EnMS, M1 v1.1.2, M2 v1.1.3, M3 v1.1.4 và nghiệp vụ M5–M17 được giữ nguyên.

## Giao diện M4

M4 được tách thành các partial:

```text
views/enms/pages/seu/
├── index.ejs
├── _tabs.ejs
├── _summary.ejs
├── _workspace.ejs
└── _bottom.ejs
```

Các khối chính:

1. 6 tab nghiệp vụ M4.
2. 5 KPI năng lượng/hiệu suất.
3. Cây cấu trúc 12 SEU theo nhóm công nghệ.
4. Bảng EnPI theo SEU.
5. Xu hướng EnPI + EnB + mục tiêu và phân tích nguyên nhân.
6. So sánh EnPI theo tháng.
7. Top 5 SEU có tiềm năng cải thiện.
8. Chỉ số hiệu suất bổ sung.

## Contract API mock

`GET /api/enms/v1/modules/seu` bổ sung:

```text
structure
  groups[]

enpi
  metrics[]
  rows[]

trend
  categories[]
  actual[]
  baseline[]
  bySeu{}

comparison
  overall
  bySeu{}

potential[]
performance[]
```

Các field compatibility vẫn được giữ:

```text
primary
secondary
table
insights
```

## Tương tác

- Tìm kiếm SEU trong cây.
- Mở/thu nhóm công nghệ.
- Chọn SEU đồng bộ bảng và biểu đồ xu hướng.
- Lọc theo nhóm SEU từ toolbar.
- Chọn loại EnPI.
- Chuyển kỳ xu hướng.
- So sánh EnPI theo SEU/tháng.
- Xuất báo cáo EnPI `.xlsx`.
- Điều hướng sang M7 từ danh sách cơ hội tiết kiệm.

## Bảo mật và dữ liệu

Không thay đổi:

- `DB_*` và schema PostgreSQL.
- Login JWT.
- HES WebSocket ticket.
- subprotocol `hes104-v1`.
- device ACL và `SUBSCRIBE`.

## Version

Package, API metadata, frontend VERSION và sidebar: `1.1.5`.
