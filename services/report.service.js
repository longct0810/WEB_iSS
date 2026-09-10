// services/report.service.js
const oracledb = require('oracledb');
const database = require('./database');

async function getDailyOperation({ id_thietbi, tungay, denngay }) {
  const result = await database.execute(
    `BEGIN P_BAOCAO_VANHANH_NGAY(
      :v_id_thietbi,
      :v_tungay,
      :v_denngay,
      :cv_1
    ); END;`,
    {
      v_id_thietbi: Number(id_thietbi),
      v_tungay: tungay,
      v_denngay: denngay,
      cv_1: {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR
      }
    }
  );

  const rs = result.outBinds.cv_1;
  const rows = await rs.getRows(1);
  await rs.close();

  return rows[0] || {};
}

module.exports = {
  getDailyOperation
};