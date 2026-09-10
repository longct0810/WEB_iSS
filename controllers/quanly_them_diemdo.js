const employees = require('../db_apis/quanly_them_diemdo.js'); 

async function get(req, res, next) {
  try {
    const context = {};

    context.id = parseInt(req.params.id, 10);

    const rows = await employees.find(context);

    if (req.params.id) {
      if (rows.length === 1) {
        res.status(200).json(rows[0]);
      } else {
        res.status(404).end();
      }
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
}

module.exports.get = get;

function getEmployeeFromRec(req) {
  const employee = {
    danhmucid: req.body.v_danhmucid,
    madiemdo: req.body.v_madiemdo,
    makhachhang: req.body.v_makhachhang,
    tenkhachhang: req.body.v_tenkhachhang,
    ma_loaikh: req.body.v_ma_loai_kh,
    ma_doituong: req.body.v_ma_doi_tuong_kh,
    ghichu: req.body.v_ghichu,
    macot: req.body.v_macot,
    matram: req.body.v_matram,
    soghi: req.body.v_soghi,
    loaipha: req.body.v_loaipha,
    socongto: req.body.v_socongto,
    loaicongto: req.body.v_loaicongto,
    matkhaucongto: req.body.v_matkhaucongto,
    outstation: req.body.v_outstation,
    cs_giao: req.body.v_cs_giao,
    cs_nhan: req.body.v_cs_nhan,
    bt_treo: req.body.v_bt_treo,
    cd_treo: req.body.v_cd_treo,
    td_treo: req.body.v_td_treo,
    sg_treo: req.body.v_sg_treo,
    vc_treo: req.body.v_vc_treo,
    bn_treo: req.body.v_bn_treo,
    cn_treo: req.body.v_cn_treo,
    tn_treo: req.body.v_tn_treo,
    sn_treo: req.body.v_sn_treo,
    vn_treo: req.body.v_vn_treo,
    imei: req.body.v_imei,
    loaiheso: req.body.v_loaiheso,
    TU_NO: req.body.v_TU_NO,
    NAMSANXUAT_TU: req.body.v_NAMSANXUAT_TU,
    NGAY_KD_TU: req.body.v_NGAY_KD_TU,
    LOAI_TU: req.body.v_LOAI_TU,
    TYSOBIEN_TU: req.body.v_TYSOBIEN_TU,
    MATEM_TU: req.body.v_MATEM_TU,
    MACHI_TU: req.body.v_MACHI_TU,
    SOVIEN_CHI_TU: req.body.v_SOVIEN_CHI_TU,
    SOVIEN_TEM_TU: req.body.v_SOVIEN_TEM_TU,
    TI_NO: req.body.v_TI_NO,
    NAMSANXUAT_TI: req.body.v_NAMSANXUAT_TI,
    NGAY_KD_TI: req.body.v_NGAY_KD_TI,
    LOAI_TI: req.body.v_LOAI_TI,
    TYSOBIEN_TI: req.body.v_TYSOBIEN_TI,
    MATEM_TI: req.body.v_MATEM_TI,
    MACHI_TI: req.body.v_MACHI_TI,
    SOVIEN_CHI_TI: req.body.v_SOVIEN_CHI_TI,
    SOVIEN_TEM_TI: req.body.v_SOVIEN_TEM_TI,
    TU_CHECK: req.body.v_CHECK_TU,
    TI_CHECK: req.body.v_CHECK_TI,
    din_dk: req.body.v_din_dk
  };
  return employee;
}

async function post(req, res, next) {
  try {
    
    let employee = getEmployeeFromRec(req);
    console.log("NHẬN: " + JSON.stringify(employee));
    employee = await employees.find(employee);
    console.log("employee: " + employee);
    if (employee.length === 1) {
      res.status(200).json(employee);
    } else {
      res.status(404).json(employee);
    }
  } catch (err) {
    // console.log("err: >>>>> " + err);
    next(err);
  }
}

module.exports.post = post;

async function put(req, res, next) {
  try {
    let employee = getEmployeeFromRec(req);

    employee.employee_id = parseInt(req.params.id, 10);

    employee = await employees.update(employee);

    if (employee !== null) {
      res.status(200).json(employee);
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.put = put;

async function del(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);

    const success = await employees.delete(id);

    if (success) {
      res.status(204).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    next(err);
  }
}

module.exports.delete = del;

