const inputService = require('../db_apis/themthongtinnhadat.js');


const validateInput = (req) => {
  const input = {
    idkhuvuc: req.body.v_idkhuvuc,
    tenbds: req.body.v_tenbds,
    giaban: req.body.v_giaban,
    thoidiem: req.body.v_thoidiem,
    loaibds: req.body.v_loaibds,
    trangthai: req.body.v_trangthai,
    dientich_thucte: req.body.v_dientich_thucte,
    dientich_so: req.body.v_dientich_so,
    sotang: req.body.v_sotang,
    loaimai: req.body.v_loaimai,
    so_mattien: req.body.v_so_mattien,
    kichthuoc_mattien: req.body.v_kichthuoc_mattien,
    kichthuoc_longdong: req.body.v_kichthuoc_longdong,
    kichthuoc_viahe: req.body.v_kichthuoc_viahe,
    loaiduong: req.body.v_loaiduong,
    khoangcach_duonglon: req.body.v_khoangcach_duonglon,
    huong: req.body.v_huong,
    nohau: req.body.v_nohau,
    hinhthai_thuadat: req.body.v_hinhthai_thuadat,
    hientrang_sudung: req.body.v_hientrang_sudung,
    tinhtrang_congtrinh: req.body.v_tinhtrang_congtrinh,
    nguontin: req.body.v_nguontin,
    mota: req.body.v_mota,
    nhanvien_id: req.body.v_nhanvien_id,
    hinhanh: req.body.v_hinhanh
  };
  return input;
};


const post = async (req, res, next) => {
  try {

    const input = validateInput(req);
    //console.log(input);
    const result = await inputService.find(input);
    // console.log(result);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { post };


