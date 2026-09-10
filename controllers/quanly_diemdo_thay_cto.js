const employees = require('../db_apis/quanly_diemdo_thay_cto.js');

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
    CHECK_THAY_CTO: req.body.v_CHECK_THAY_CTO,
    meterid: req.body.v_meterid,
    socongto_cu: req.body.v_socongto_cu,
    socongto_moi: req.body.v_socongto_moi,
   
    matkhaucongto: req.body.v_matkhaucongto,
    outstation: req.body.v_outstation,
    cs_giao_treo: req.body.v_cs_giao_treo,
    cs_nhan_treo: req.body.v_cs_nhan_treo,
    cs_giao_thao: req.body.v_cs_giao_thao,
    cs_nhan_thao: req.body.v_cs_nhan_thao,
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
    bt_thao: req.body.v_bt_thao,
    cd_thao: req.body.v_cd_thao,
    td_thao: req.body.v_td_thao,
    sg_thao: req.body.v_sg_thao,
    vc_thao: req.body.v_vc_thao,
    bn_thao: req.body.v_bn_thao,
    cn_thao: req.body.v_cn_thao,
    tn_thao: req.body.v_tn_thao,
    sn_thao: req.body.v_sn_thao,
    vn_thao: req.body.v_vn_thao,
    CHECK_TU: req.body.v_CHECK_TU,
    TU_NO: req.body.v_TU_NO,
    NAMSANXUAT_TU: req.body.v_NAMSANXUAT_TU,
    NGAY_KD_TU: req.body.v_NGAY_KD_TU,
    MATEM_TU: req.body.v_MATEM_TU,
    MACHI_TU: req.body.v_MACHI_TU,
    SOVIEN_CHI_TU: req.body.v_SOVIEN_CHI_TU,
    SOVIEN_TEM_TU: req.body.v_SOVIEN_TEM_TU,
    TYSOBIEN_TU: req.body.v_TYSOBIEN_TU,
    LOAI_TU: req.body.v_LOAI_TU,
    CHECK_TI: req.body.v_CHECK_TI,
    TI_NO: req.body.v_TI_NO,
    NAMSANXUAT_TI: req.body.v_NAMSANXUAT_TI,
    NGAY_KD_TI: req.body.v_NGAY_KD_TI,
    MATEM_TI: req.body.v_MATEM_TI,
    MACHI_TI: req.body.v_MACHI_TI,
    SOVIEN_CHI_TI: req.body.v_SOVIEN_CHI_TI,
    SOVIEN_TEM_TI: req.body.v_SOVIEN_TEM_TI,
    TYSOBIEN_TI: req.body.v_TYSOBIEN_TI,
    LOAI_TI: req.body.v_LOAI_TI,
    MaTaiKhoan: req.body.v_MaTaiKhoan,
    loaicongto: req.body.v_loaicongto
  };
  return employee;
}

async function post(req, res, next) {
  try {
    let employee = getEmployeeFromRec(req);
    //console.log("NHẬN: " + JSON.stringify(employee));
    employee = await employees.find(employee);
    if (employee.length === 1) {
      res.status(200).json(employee);
    } else {
      res.status(404).json(employee);
    }
  } catch (err) {
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

