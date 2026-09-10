import { preview } from '../core/config.js';
import { render } from '../core/dom.js';
import { icon } from '../components/ui.js';

export async function mount() {
  const items=[
    ['quanlynhamay','Quản lý nhà máy','Thông tin nhà máy và danh mục','buildings'],
    ['quanlydiemdo','Quản lý điểm đo','Khai báo thiết bị đo đếm','speedometer2'],
    ['quanlynguoidung','Người dùng','Tài khoản người dùng hệ thống','people'],
    ['phanquyen','Phân quyền chức năng','Quyền truy cập của người dùng','shield-check'],
    ['cauhinhcanhbao','Cấu hình cảnh báo','Ngưỡng và quy tắc cảnh báo','bell'],
    ['thongkedangnhap','Nhật ký đăng nhập','Lịch sử truy cập hệ thống','clock-history']
  ];
  render('#settings-grid', items.map(([route,title,description,glyph])=>`<a class="settings-link" href="${preview?'#':`/${route}`}" ${preview?'data-action="legacy-preview"':''}>${icon(glyph)}<span><b>${title}</b><small>${description}</small></span>${icon('arrow-up-right')}</a>`).join(''));
  render('#settings-source', `Nguồn dữ liệu: ${preview?'Preview độc lập':'Mock API có xác thực JWT'}. Dữ liệu vận hành minh họa chưa được liên kết với thiết bị thực.`);
}
