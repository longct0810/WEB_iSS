const employees = require('../db_apis/quanly_sua_tt_diemdo.js');

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
    meterid: req.body.v_meterid,
    danhmucid: req.body.v_danhmucid,
    madiemdo: req.body.v_madiemdo,
    makhachhang: req.body.v_makhachhang,
    tenkhachhang: req.body.v_tenkhachhang,
    loaipha: req.body.v_loaipha,
    macot: req.body.v_macot,
    matram: req.body.v_matram,
    masoghi: req.body.v_soghi,
    ghichu: req.body.v_ghichu,
    ma_loai_kh: req.body.v_maloai_kh,
    ma_doi_tuong_kh: req.body.v_madoituong_kh,
    din_dk: req.body.v_din_dk,
  };
  return employee;
}

async function post(req, res, next) {
  try {
    let employee = getEmployeeFromRec(req);
    console.log("NHẬN: " + JSON.stringify(employee));
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

