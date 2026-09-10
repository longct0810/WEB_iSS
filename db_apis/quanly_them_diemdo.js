const oracledb = require('oracledb');
const database = require('../services/database.js');

function them_diemdo(v_danhmucid, v_madiemdo, v_makhachhang, v_tenkhachhang, v_ma_loai_kh, v_ma_doi_tuong_kh, v_ghichu, v_macot,
  v_matram, v_soghi, v_loaipha, v_socongto, v_loaicongto, v_matkhaucongto, v_outstation,
  v_cs_giao, v_cs_nhan, v_bt_treo, v_cd_treo, v_td_treo,
  v_sg_treo, v_vc_treo, v_bn_treo, v_cn_treo, v_tn_treo, v_sn_treo, v_vn_treo
  , v_imei, v_loaiheso, v_TU_NO, v_NAMSANXUAT_TU, v_NGAY_KD_TU, v_LOAI_TU, v_TYSOBIEN_TU, v_MATEM_TU, v_MACHI_TU, v_SOVIEN_CHI_TU,
  v_SOVIEN_TEM_TU, v_TI_NO, v_NAMSANXUAT_TI, v_NGAY_KD_TI, v_LOAI_TI, v_TYSOBIEN_TI, v_MATEM_TI, v_MACHI_TI, v_SOVIEN_CHI_TI,
  v_SOVIEN_TEM_TI, v_CHECK_TI, v_CHECK_TU, v_din_dk) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_QUANLY_DIEMDO.P_THEM_DIEMDO(:danhmucid,:madiemdo, :makhachhang,:tenkhachhang,:ma_loaikh,:ma_doituong, :ghichu, :macot, 
  :matram,:soghi,:loaipha,:socongto,:loaicongto,:outstation,:matkhaucongto,
  :cs_giao,:cs_nhan,:bt_treo,:cd_treo,:td_treo, :sg_treo,:vc_treo,:bn_treo,:cn_treo,:tn_treo,:sn_treo,:vn_treo
  ,:imei,:loaiheso,:TU_NO,:NAMSANXUAT_TU,:NGAY_KD_TU,:LOAI_TU,:TYSOBIEN_TU,:MATEM_TU,:MACHI_TU,:SOVIEN_CHI_TU,
  :SOVIEN_TEM_TU,
  :TI_NO,:NAMSANXUAT_TI,:NGAY_KD_TI,:LOAI_TI,:TYSOBIEN_TI,:MATEM_TI,:MACHI_TI,:SOVIEN_CHI_TI,
  :SOVIEN_TEM_TI,:TU_CHECK,:TI_CHECK,:din_dk,:CV_1); END;`,
        { // EXECUTE ORACLE PROCEDURE
          danhmucid: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_danhmucid
          },
          madiemdo: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_madiemdo
          },
          makhachhang: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_makhachhang
          },
          tenkhachhang: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_tenkhachhang
          },
          ma_loaikh: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_ma_loai_kh
          },
          ma_doituong: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_ma_doi_tuong_kh
          },
          ghichu: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_ghichu
          },
          macot: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_macot
          },
          matram: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_matram
          },
          soghi: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_soghi
          },
          loaipha: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_loaipha
          },
          socongto: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_socongto
          },
          loaicongto: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_loaicongto
          },
          matkhaucongto: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_matkhaucongto
          },
          outstation: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_outstation
          },
          cs_giao: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cs_giao
          },
          cs_nhan: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cs_nhan
          },
          bt_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_bt_treo
          },
          cd_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cd_treo
          },
          td_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_td_treo
          },
          sg_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_sg_treo
          },
          vc_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_vc_treo
          },
          bn_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_bn_treo
          },
          cn_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_cn_treo
          },
          tn_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_tn_treo
          },
          sn_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_sn_treo
          },
          vn_treo: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_vn_treo
          },
          imei: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_imei
          },
          loaiheso: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_loaiheso
          },
          TU_NO: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_TU_NO
          },
          NAMSANXUAT_TU: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_NAMSANXUAT_TU
          },
          NGAY_KD_TU: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_NGAY_KD_TU
          },
          LOAI_TU: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_LOAI_TU
          },
          TYSOBIEN_TU: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_TYSOBIEN_TU
          },
          MATEM_TU: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_MATEM_TU
          },
          MACHI_TU: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_MACHI_TU
          },
          SOVIEN_CHI_TU: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_SOVIEN_CHI_TU
          },
          SOVIEN_TEM_TU: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_SOVIEN_TEM_TU
          },
          TI_NO: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_TI_NO
          },
          NAMSANXUAT_TI: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_NAMSANXUAT_TI
          },
          NGAY_KD_TI: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_NGAY_KD_TI
          },
          LOAI_TI: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_LOAI_TI
          },
          TYSOBIEN_TI: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_TYSOBIEN_TI
          },
          MATEM_TI: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_MATEM_TI
          },
          MACHI_TI: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_MACHI_TI
          },
          SOVIEN_CHI_TI: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_SOVIEN_CHI_TI
          },
          SOVIEN_TEM_TI: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_SOVIEN_TEM_TI
          },
          TU_CHECK: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_CHECK_TU
          },
          TI_CHECK: {
            type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: v_CHECK_TI
          },
          din_dk: {
            type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_din_dk
          },
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
          console.error(err);
          return 'failure';
        })
    });
}
async function find(context) {
  var binds = {};

  var danhmucid = oracledb.STRING;
  var madiemdo = oracledb.STRING;
  var makhachhang = oracledb.STRING;
  var ghichu = oracledb.STRING;

  var macot = oracledb.STRING;
  var matram = oracledb.STRING;
  var soghi = oracledb.STRING;
  var loaipha = oracledb.NUMBER;
  var socongto = oracledb.STRING;
  var loaicongto = oracledb.STRING;
  var matkhaucongto = oracledb.STRING;
  var outstation = oracledb.STRING;
  var cs_giao = oracledb.NUMBER;
  var cs_nhan = oracledb.NUMBER;
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

  var imei = oracledb.STRING;
  var loaiheso = oracledb.STRING;
  var TU_NO = oracledb.STRING;
  var NAMSANXUAT_TU = oracledb.STRING;
  var NGAY_KD_TU = oracledb.STRING;
  var LOAI_TU = oracledb.STRING;
  var TYSOBIEN_TU = oracledb.STRING;
  var MATEM_TU = oracledb.STRING;
  var MACHI_TU = oracledb.STRING;
  var SOVIEN_CHI_TU = oracledb.STRING;
  var SOVIEN_TEM_TU = oracledb.STRING;
  var TI_NO = oracledb.STRING;
  var NAMSANXUAT_TI = oracledb.STRING;
  var NGAY_KD_TI = oracledb.STRING;
  var LOAI_TI = oracledb.STRING;
  var TYSOBIEN_TI = oracledb.STRING;
  var MATEM_TI = oracledb.STRING;
  var MACHI_TI = oracledb.STRING;
  var SOVIEN_CHI_TI = oracledb.STRING;
  var SOVIEN_TEM_TI = oracledb.STRING;
  var TU_CHECK = oracledb.NUMBER;
  var TI_CHECK = oracledb.NUMBER;
  var din_dk = oracledb.STRING;
  if (context.danhmucid) {

    danhmucid = context.danhmucid;
    madiemdo = context.madiemdo;
    makhachhang = context.makhachhang;
    tenkhachhang = context.tenkhachhang;
    ma_loai_kh = context.ma_loaikh;
    ma_doi_tuong_kh = context.ma_doituong;
    ghichu = context.ghichu;
    macot = context.macot;
    matram = context.matram;
    soghi = context.soghi;
    loaipha = context.loaipha;
    socongto = context.socongto;
    loaicongto = context.loaicongto;
    matkhaucongto = context.matkhaucongto;
    outstation = context.outstation;
    cs_giao = context.cs_giao;
    cs_nhan = context.cs_nhan;
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

    imei = context.imei;
    loaiheso = context.loaiheso;
    TU_NO = context.TU_NO;
    NAMSANXUAT_TU = context.NAMSANXUAT_TU;
    NGAY_KD_TU = context.NGAY_KD_TU;
    LOAI_TU = context.LOAI_TU;
    TYSOBIEN_TU = context.TYSOBIEN_TU;
    MATEM_TU = context.MATEM_TU;
    MACHI_TU = context.MACHI_TU;
    SOVIEN_CHI_TU = context.SOVIEN_CHI_TU;
    SOVIEN_TEM_TU = context.SOVIEN_TEM_TU;
    TI_NO = context.TI_NO;
    NAMSANXUAT_TI = context.NAMSANXUAT_TI;
    NGAY_KD_TI = context.NGAY_KD_TI;
    LOAI_TI = context.LOAI_TI;
    TYSOBIEN_TI = context.TYSOBIEN_TI;
    MATEM_TI = context.MATEM_TI;
    MACHI_TI = context.MACHI_TI;
    SOVIEN_CHI_TI = context.SOVIEN_CHI_TI;
    SOVIEN_TEM_TI = context.SOVIEN_TEM_TI;
    TU_CHECK = context.TU_CHECK;
    TI_CHECK = context.TI_CHECK;
    din_dk = context.din_dk;

    var data = them_diemdo(danhmucid, madiemdo, makhachhang, tenkhachhang, ma_loai_kh, ma_doi_tuong_kh, ghichu, macot, matram, soghi, loaipha, socongto
      , loaicongto, matkhaucongto, outstation, cs_giao, cs_nhan, bt_treo, cd_treo, td_treo, sg_treo, vc_treo, bn_treo, cn_treo, tn_treo, sn_treo, vn_treo
      , imei, loaiheso, TU_NO, NAMSANXUAT_TU, NGAY_KD_TU, LOAI_TU, TYSOBIEN_TU, MATEM_TU, MACHI_TU, SOVIEN_CHI_TU, SOVIEN_TEM_TU
      , TI_NO, NAMSANXUAT_TI, NGAY_KD_TI, LOAI_TI, TYSOBIEN_TI, MATEM_TI, MACHI_TI, SOVIEN_CHI_TI, SOVIEN_TEM_TI, TU_CHECK, TI_CHECK, din_dk);
    return data;

  } else {
    return "Chưa chọn danh mục"
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
