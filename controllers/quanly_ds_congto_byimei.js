const oracledb = require('oracledb');
const { executeCursor } = require('./oracleConnection');

function getEmployeeFromRec(req) {
  const body = req.body || {};

  const imei = body.v_imei;
  const danhmucidRaw = body.v_danhmucid;

  const danhmucid =
    danhmucidRaw === undefined || danhmucidRaw === null || danhmucidRaw === ''
      ? -1
      : Number(danhmucidRaw);

  return {
    imei,
    danhmucid: Number.isNaN(danhmucid) ? -1 : danhmucid
  };
}

async function post(req, res, next) {
  try {
    const employee = getEmployeeFromRec(req);

    const result = await find(employee.imei, employee.danhmucid);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function find(v_imei, danhmucid) {
  const sql = `
    BEGIN
      PKG_QUANLY_DCU.P_GET_LIST_CTO_BY_IMEI(:imei, :danhmucid, :CV_1);
    END;
  `;

  const binds = {
    imei: {
      type: oracledb.STRING,
      dir: oracledb.BIND_IN,
      val: v_imei || ''
    },
    danhmucid: {
      type: oracledb.NUMBER,
      dir: oracledb.BIND_IN,
      val: danhmucid
    },
    CV_1: {
      dir: oracledb.BIND_OUT,
      type: oracledb.CURSOR
    }
  };

  return await executeCursor(sql, binds);
}

module.exports = { post };