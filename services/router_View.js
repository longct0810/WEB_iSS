const { render } = require('ejs');
var express = require('express');
var router = express.Router();

router.use(function exposeCurrentPath(req, res, next) {
    res.locals.currentPath = req.path;
    next();
});

router.get('/giamsat', function (req, res, next) {
    res.render('giamsat', { title: 'Giám sát' });
});
router.get('/nhapthongtinnhadat', function (req, res, next) {
    res.render('nhapthongtinnhadat', { title: 'Nhập thông tin Nhà Đất' });
});
router.get('/khaibaovattu', function (req, res, next) {
    res.render('khaibaovattu', { title: 'Khai báo vật tư' });
});
router.get('/chisocongto', function (req, res, next) {
    res.render('giamsat/chisocongto', { title: 'Chỉ số công tơ' });
});
router.get('/chisopmax', function (req, res, next) {
    res.render('giamsat/chisopmax', { title: 'Chỉ số PMAX' });
});
router.get('/thongsovanhanh', function (req, res, next) {
    res.render('giamsat/thongsovanhanh', { title: 'Thông số vận hành' });
});
router.get('/bieudophutai', function (req, res, next) {
    res.render('giamsat/bieudophutai', { title: 'Biểu đồ phụ tải' });
});
router.get('/dulieusonghai', function (req, res, next) {
    res.render('giamsat/dulieusonghai', { title: 'Dữ liệu sóng hài' });
});
router.get('/dieukhiendongcatdin', function (req, res, next) {
    res.render('giamsat/dieukhiendongcatdin', { title: 'Điều khiển đóng cắt DIN' });
});
router.get('/dieukhiendongcat', function (req, res, next) {
    res.render('giamsat/dieukhiendongcat', { title: 'Điều khiển đóng cắt' });
});
router.get('/sukiencongto', function (req, res, next) {
    res.render('giamsat/sukiencongto', { title: 'Sự kiện công tơ' });
});
router.get('/thongsovanhanhscada', function (req, res, next) {
    res.render('scada/thongsovanhanhscada', { title: 'Thông số vận hành' });
});
router.get('/baocaohoatdongscada', function (req, res, next) {
    res.render('scada/baocaohoatdongscada', { title: 'Báo cáo hoạt động' });
});
router.get('/quanlydanhmuc', function (req, res, next) {
    res.render('quanly/quanlydanhmuc', { title: 'Quản lý danh mục' });
});
router.get('/quanlydiemdo', function (req, res, next) {
    res.render('quanly/quanlydiemdo', { title: 'Quản lý điểm đo' });
});
router.get('/quanlynguoidung', function (req, res, next) {
    res.render('quanly/quanlynguoidung', { title: 'Quản lý người dùng' });
});
router.get('/quanlyioa', function (req, res, next) {
    res.render('quanly/quanlyioa', { title: 'Quản lý IOA' });
});
router.get('/cauhinhcanhbao', function (req, res, next) {
    res.render('canhbao/cauhinhcanhbao', { title: 'Cấu hình cảnh báo' });
});
router.get('/danhsachcanhbao', function (req, res, next) {
    res.render('canhbao/danhsachcanhbao', { title: 'Danh sách cảnh báo' });
});

router.get('/khaibaokhachhang', function (req, res, next) {
    res.render('quanly/khaibaokhachhang', { title: 'Khai báo khách hàng' });
});
router.get('/phanquyen', function (req, res, next) {
    res.render('quanly/quanlyphanquyenchucnang', { title: 'Phân quyền' });
});
router.get('/login', function (req, res, next) {
    res.render('quanly/login', { title: 'Đăng nhập' });
});
router.get('/baocaoloduongday', function (req, res, next) {
    res.render('baocao/baocaoloduongday', { title: 'Báo cáo lộ đường dây' });
});
router.get('/quanlymodemdcu', function (req, res, next) {
    res.render('quanly/quanlymodemdcu', { title: 'Quản lý Modem/DCU' });
});
router.get('/thongkedangnhap', function (req, res, next) {
    res.render('quanly/thongkedangnhap', { title: 'Thống kê đăng nhập' });
});
router.get('/canhbaomatdien', function (req, res, next) {
    res.render('canhbao/canhbaomatdien', { title: 'Cảnh báo mất điện' });
});
router.get('/cauhinhthietbitruyenthong', function (req, res, next) {
    res.render('quanly/cauhinhthietbitruyenthong', { title: 'Cấu hình thiết bị truyền thông(DCU/MODEM)' });
});
router.get('/thongkemangtai', function (req, res, next) {
    res.render('baocao/thongkemangtai', { title: 'Thống kê mang tải' });
});
router.get('/uoctinhtonthat', function (req, res, next) {
    res.render('baocao/uoctinhtonthat', { title: 'Ước tính tổn thất' });
});
router.get('/giamsat_tba', function (req, res, next) {
    res.render('giamsat/giamsat_tba', {
        title: 'Giám sát TBA',
        alarms: []
    });
});

router.get('/thongkechatluong', function (req, res, next) {
    res.render('baocao/thongkechatluong', { title: 'Thống kê chất lượng' });

});
router.get('/thongkesolieu', function (req, res, next) {
    res.render('scada/thongkesolieu', { title: 'Thống kê số liệu' });
});

router.get('/ungtruocsanluong', function (req, res, next) {
    res.render('giamsat/ungtruocsanluong', { title: 'Ứng trước sản lượng' });

});
router.get('/dienapthap', function (req, res, next) {
    res.render('Dashboard/DienApThap', { title: 'Điện áp thấp' });
});
router.get('/cauhinhdienapthap', function (req, res, next) {
    res.render('quanly/cauhinhdienapthap', { title: 'Cấu hình điện áp thấp' });
});
router.get('/cauhinhcanhbaosukiencongto', function (req, res, next) {
    res.render('canhbao/cauhinhcanhbaosukiencongto', { title: 'Cấu hình công tơ' });
});
router.get('/khaibaoioa', function (req, res, next) {
    res.render('scada/khaibaoioa', { title: 'Khai báo IOA',  alarms: [] });
});
router.get('/doctucthoi', function (req, res, next) {
    res.render('giamsat/doctucthoi', { title: 'Đọc tức thời' });
});
router.get('/dongbocmis', function (req, res, next) {
    res.render('giamsat/dongbocmis', { title: 'Đồng bộ cmiss' });
});
router.get('/dashboard', function (req, res, next) {
    res.redirect('/enms/overview');
});

router.get('/dashboard2', function (req, res, next) {
    res.render('Dashboard/dashboard copy', {
        title: 'Dashboard SCADA'
    });
});

router.get('/', function (req, res, next) {
    res.redirect('/enms/overview');
});
router.get('/ioa', function (req, res, next) {
    res.render('scada/khaibaoioa_dash', { title: 'Khai báo IOA',  alarms: [] });
});

router.get('/quanlynhamay', function (req, res, next) {
  res.render('quanly/quanlynhamay', { title: 'Quản lý nhà máy' });
});
router.get('/baocaovanhanhngay', function (req, res, next) {
  res.render('baocao/baocaovanhanhngay', { title: 'Báo cáo vận hành ngày' });
});
module.exports = router;
