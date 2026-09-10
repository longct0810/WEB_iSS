const employees = require('../db_apis/quanly_thay_imei.js');
const oracledb = require('oracledb');
const { executeCursor } = require('./oracleConnection');

function getEmployeeFromRec(req) {
  const employee = {

    meterid: req.body.v_meterid,
    socongto_cu: req.body.v_socongto_dangtreo,
    imei_cu: req.body.v_imei_cu,
    imei_moi: req.body.v_imei_moi,
    mataikhoan: req.body.v_mataikhoan
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


const thayModemImei = async (req, res, next) => {
  try {
    const input = {
      imei_cu: req.body.v_imei_cu,
      imei_moi: req.body.v_imei_moi,
      mataikhoan: req.body.v_mataikhoan,
      danhmucid: req.body.v_danhmucid
    };
    const result = await save_ThayModemImei(input);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
async function save_ThayModemImei(input) {
  const { imei_cu, imei_moi, mataikhoan, danhmucid } = input;

  const sql = `BEGIN PKG_QUANLY_DCU.P_THAY_DCU(:imei_cu,:imei_moi,:mataikhoan,:danhmucid,:CV_1); END;`;

  const binds = {
    imei_cu: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: imei_cu },
    imei_moi: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: imei_moi },
    mataikhoan: { dir: oracledb.BIND_IN, type: oracledb.NUMBER, val: mataikhoan },
    danhmucid: { dir: oracledb.BIND_IN, type: oracledb.STRING, val: danhmucid },
    CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
  };
  return await executeCursor(sql, binds, 1, true);

}
module.exports = { post, thayModemImei };

