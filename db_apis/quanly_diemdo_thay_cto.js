const oracledb = require('oracledb');
const database = require('../services/database.js');

function sua_tt_diemdo(v_CHECK_THAY_CTO, v_meterid, v_socongto_cu, v_socongto_moi, v_matkhaucongto, v_outstation
  , v_cs_giao_treo, v_cs_nhan_treo, v_cs_giao_thao, v_cs_nhan_thao,
  v_bt_treo, v_cd_treo, v_td_treo, v_sg_treo, v_vc_treo, v_bn_treo, v_cn_treo, v_tn_treo, v_sn_treo, v_vn_treo
  , v_bt_thao, v_cd_thao, v_td_thao, v_sg_thao, v_vc_thao, v_bn_thao, v_cn_thao, v_tn_thao, v_sn_thao, v_vn_thao
  , v_CHECK_TU, v_TU_NO, v_NAMSANXUAT_TU, v_NGAY_KD_TU, v_MATEM_TU, v_MACHI_TU, v_SOVIEN_CHI_TU, v_SOVIEN_TEM_TU, v_TYSOBIEN_TU, v_LOAI_TU
  , v_CHECK_TI, v_TI_NO, v_NAMSANXUAT_TI, v_NGAY_KD_TI, v_MATEM_TI, v_MACHI_TI, v_SOVIEN_CHI_TI, v_SOVIEN_TEM_TI, v_TYSOBIEN_TI, v_LOAI_TI
  , v_MaTaiKhoan, v_loaicongto) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_QUANLY_DIEMDO.P_THAY_CONGTO(:x1,:x2,:x3,:x4,:x5,:x6,:x7,:x8,
        :x9,:x10,:x11,:x12,:x13,:x14,:x15,:x16,:x17,:x18,:x19,:x20,:x21,
        :x22,:x23,:x24,:x25,:x26,:x27,:x28,:x29,:x30,:x31,:x32,:x33,:x34,:x35,:x36,
        :x37,:x38,:x39,:x40,:x41,:x42,:x43,:x44,:x45,:x46,:x47,:x48,:x49,:x50,:x51,:x52,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        x1: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_CHECK_THAY_CTO },
        x2: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_meterid },
        x3: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_socongto_cu },
        x4: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_socongto_moi },
        x5: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_matkhaucongto },
        x6: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_outstation },
        x7: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cs_giao_treo },
        x8: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cs_nhan_treo },
        x9: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cs_giao_thao },
        x10: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cs_nhan_thao },
        x11: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_bt_treo },
        x12: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cd_treo },
        x13: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_td_treo },
        x14: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_sg_treo },
        x15: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_vc_treo },
        x16: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_bn_treo },
        x17: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cn_treo },
        x18: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_tn_treo },
        x19: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_sn_treo },
        x20: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_vn_treo },
        x21: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_bt_thao },
        x22: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cd_thao },
        x23: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_td_thao },
        x24: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_sg_thao },
        x25: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_vc_thao },
        x26: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_bn_thao },
        x27: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cn_thao },
        x28: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_tn_thao },
        x29: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_sn_thao },
        x30: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_vn_thao },
        x31: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_CHECK_TU },
        x32: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_TU_NO },
        x33: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_NAMSANXUAT_TU },
        x34: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_NGAY_KD_TU },
        x35: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_MATEM_TU },
        x36: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_MACHI_TU },
        x37: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_SOVIEN_CHI_TU },
        x38: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_SOVIEN_TEM_TU },
        x39: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_TYSOBIEN_TU },
        x40: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_LOAI_TU },
        x41: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_CHECK_TI },
        x42: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_TI_NO },
        x43: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_NAMSANXUAT_TI },
        x44: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_NGAY_KD_TI },
        x45: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_MATEM_TI },
        x46: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_MACHI_TI },
        x47: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_SOVIEN_CHI_TI },
        x48: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_SOVIEN_TEM_TI },
        x49: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_TYSOBIEN_TI },
        x50: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_LOAI_TI },
        x51: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_MaTaiKhoan },
        x52: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_loaicongto },

        CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
      })
        .then((result) => {
          var resRows = [];
          var resultSet = result.outBinds.CV_1; //RESULT SET FOR OUTPUT
          var queryStream = resultSet.toQueryStream(); //QUERYSTREAM INITIALIZED FOR CURSOR VALUES

          return consumeStream = new Promise((resolve, reject) => {
            queryStream.on('data', (row) => {
              resRows.push(row); //STORE ROWS IN TO BLANK ARRAY 
            });
            queryStream.on('error', reject);
            queryStream.on('close', () => {
              resolve(resRows); //RETURN ON RESOLVING ALL THE ROWS
              conn.close();
              //return resRows;
            });
          });
        })
        .catch((err) => {
          conn.close();
          //console.error(err);
          return 'failure';
        })
    });
}

async function find(context) {
  var binds = {};
  //var meterid = oracledb.NUMBER;
  var CHECK_THAY_CTO = oracledb.NUMBER;
  var meterid = oracledb.NUMBER;
  var socongto_cu = oracledb.STRING;
  var socongto_moi = oracledb.STRING;
  var matkhaucongto = oracledb.STRING;
  var outstation = oracledb.STRING;
  var cs_giao_treo = oracledb.NUMBER;
  var cs_nhan_treo = oracledb.NUMBER;
  var cs_giao_thao = oracledb.NUMBER;
  var cs_nhan_thao = oracledb.NUMBER;
  var bt_treo = oracledb.NUMBER;
  var cd_treo = oracledb.NUMBER;
  var td_treo = oracledb.NUMBER;
  var sg_treo = oracledb.NUMBER;
  var vc_treo = oracledb.NUMBER;
  var bn_treo = oracledb.NUMBER;
  var cn_treo = oracledb.NUMBER;
  var tn_treo = oracledb.NUMBER;
  var sn_treo = oracledb.NUMBER;
  var vn_treo = oracledb.NUMBER;
  var bt_thao = oracledb.NUMBER;
  var cd_thao = oracledb.NUMBER;
  var td_thao = oracledb.NUMBER;
  var sg_thao = oracledb.NUMBER;
  var vc_thao = oracledb.NUMBER;
  var bn_thao = oracledb.NUMBER;
  var cn_thao = oracledb.NUMBER;
  var tn_thao = oracledb.NUMBER;
  var sn_thao = oracledb.NUMBER;
  var vn_thao = oracledb.NUMBER;
  var CHECK_TU = oracledb.NUMBER;
  var TU_NO = oracledb.STRING;
  var NAMSANXUAT_TU = oracledb.STRING;
  var NGAY_KD_TU = oracledb.STRING;
  var MATEM_TU = oracledb.STRING;
  var MACHI_TU = oracledb.STRING;
  var SOVIEN_CHI_TU = oracledb.STRING;
  var SOVIEN_TEM_TU = oracledb.STRING;
  var TYSOBIEN_TU = oracledb.STRING;
  var LOAI_TU = oracledb.STRING;
  var CHECK_TI = oracledb.NUMBER;
  var TI_NO = oracledb.STRING;
  var NAMSANXUAT_TI = oracledb.STRING;
  var NGAY_KD_TI = oracledb.STRING;
  var MATEM_TI = oracledb.STRING;
  var MACHI_TI = oracledb.STRING;
  var SOVIEN_CHI_TI = oracledb.STRING;
  var SOVIEN_TEM_TI = oracledb.STRING;
  var TYSOBIEN_TI = oracledb.STRING;
  var LOAI_TI = oracledb.STRING;
  var MaTaiKhoan = oracledb.NUMBER;
  var loaicongto = oracledb.STRING;

  if (context.meterid) {
    CHECK_THAY_CTO = context.CHECK_THAY_CTO;
    meterid = context.meterid;
    socongto_cu = context.socongto_cu;
    socongto_moi = context.socongto_moi;
    loaicongto = context.loaicongto;
    matkhaucongto = context.matkhaucongto;
    outstation = context.outstation;
    cs_giao_treo = context.cs_giao_treo;
    cs_nhan_treo = context.cs_nhan_treo;
    cs_giao_thao = context.cs_giao_thao;
    cs_nhan_thao = context.cs_nhan_thao;
    bt_treo = context.bt_treo;
    cd_treo = context.cd_treo;
    td_treo = context.td_treo;
    sg_treo = context.sg_treo;
    vc_treo = context.vc_treo;
    bn_treo = context.bn_treo;
    cn_treo = context.cn_treo;
    tn_treo = context.tn_treo;
    sn_treo = context.sn_treo;
    vn_treo = context.vn_treo;
    bt_thao = context.bt_thao;
    cd_thao = context.cd_thao;
    td_thao = context.td_thao;
    sg_thao = context.sg_thao;
    vc_thao = context.vc_thao;
    bn_thao = context.bn_thao;
    cn_thao = context.cn_thao;
    tn_thao = context.tn_thao;
    sn_thao = context.sn_thao;
    vn_thao = context.vn_thao;
    CHECK_TU = context.CHECK_TU;
    TU_NO = context.TU_NO;
    NAMSANXUAT_TU = context.NAMSANXUAT_TU;
    NGAY_KD_TU = context.NGAY_KD_TU;
    MATEM_TU = context.MATEM_TU;
    MACHI_TU = context.MACHI_TU;
    SOVIEN_CHI_TU = context.SOVIEN_CHI_TU;
    SOVIEN_TEM_TU = context.SOVIEN_TEM_TU;
    TYSOBIEN_TU = context.TYSOBIEN_TU;
    LOAI_TU = context.LOAI_TU;
    CHECK_TI = context.CHECK_TI;
    TI_NO = context.TI_NO;
    NAMSANXUAT_TI = context.NAMSANXUAT_TI;
    NGAY_KD_TI = context.NGAY_KD_TI;
    MATEM_TI = context.MATEM_TI;
    MACHI_TI = context.MACHI_TI;
    SOVIEN_CHI_TI = context.SOVIEN_CHI_TI;
    SOVIEN_TEM_TI = context.SOVIEN_TEM_TI;
    TYSOBIEN_TI = context.TYSOBIEN_TI;
    LOAI_TI = context.LOAI_TI;
    MaTaiKhoan = context.MaTaiKhoan;
    var data = sua_tt_diemdo(CHECK_THAY_CTO, meterid, socongto_cu, socongto_moi, matkhaucongto, outstation
      , cs_giao_treo, cs_nhan_treo, cs_giao_thao, cs_nhan_thao,
      bt_treo, cd_treo, td_treo, sg_treo, vc_treo, bn_treo, cn_treo, tn_treo, sn_treo, vn_treo
      , bt_thao, cd_thao, td_thao, sg_thao, vc_thao, bn_thao, cn_thao, tn_thao, sn_thao, vn_thao
      , CHECK_TU, TU_NO, NAMSANXUAT_TU, NGAY_KD_TU, MATEM_TU, MACHI_TU, SOVIEN_CHI_TU, SOVIEN_TEM_TU, TYSOBIEN_TU, LOAI_TU
      , CHECK_TI, TI_NO, NAMSANXUAT_TI, NGAY_KD_TI, MATEM_TI, MACHI_TI, SOVIEN_CHI_TI, SOVIEN_TEM_TI, TYSOBIEN_TI, LOAI_TI
      , MaTaiKhoan,loaicongto);
    return data;

  } else {
    return "không đúng"
  }

}

module.exports.find = find;

const createSql =
  `insert into employees (
    first_name,
    last_name,
    email,
    phone_number,
    hire_date,
    job_id,
    salary,
    commission_pct,
    manager_id,
    department_id
  ) values (
    :first_name,
    :last_name,
    :email,
    :phone_number,
    :hire_date,
    :job_id,
    :salary,
    :commission_pct,
    :manager_id,
    :department_id
  ) returning employee_id
  into :employee_id`;

async function create(emp) {
  const employee = Object.assign({}, emp);

  employee.employee_id = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  };

  const result = await database.simpleExecute(createSql, employee, { autoCommit: true });

  employee.employee_id = result.outBinds.employee_id[0];

  return employee;
}

module.exports.create = create;

const updateSql =
  `update employees
  set first_name = :first_name,
    last_name = :last_name,
    email = :email,
    phone_number = :phone_number,
    hire_date = :hire_date,
    job_id = :job_id,
    salary = :salary,
    commission_pct = :commission_pct,
    manager_id = :manager_id,
    department_id = :department_id
  where employee_id = :employee_id`;

async function update(emp) {
  const employee = Object.assign({}, emp);
  const result = await database.simpleExecute(updateSql, employee, { autoCommit: true });

  if (result.rowsAffected && result.rowsAffected === 1) {
    return employee;
  } else {
    return null;
  }
}

module.exports.update = update;

const deleteSql =
  `begin

    delete from job_history
    where employee_id = :employee_id;

    delete from employees
    where employee_id = :employee_id;

    :rowcount := sql%rowcount;

  end;`;

async function del(id) {
  const binds = {
    employee_id: id,
    rowcount: {
      dir: oracledb.BIND_OUT,
      type: oracledb.NUMBER
    }
  };
  const result = await database.simpleExecute(deleteSql, binds, { autoCommit: true });

  return result.outBinds.rowcount === 1;
}

module.exports.delete = del;
