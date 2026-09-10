const oracledb = require('oracledb');
const database = require('../services/database.js');

function sua_tt_diemdo(v_meterid, v_danhmucid, v_madiemdo, v_makhachhang, v_tenkhachhang, v_loaipha, v_macot, v_matram, v_masoghi, v_ghichu, v_ma_loai_kh, v_ma_doi_tuong_kh, v_din_dk) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_QUANLY_DIEMDO.P_SUA_THONGTIN_DIEMDO(:meterid,:danhmucid,:madiemdo,:makhachhang,:tenkhachhang,:loaipha,:macot,:matram,:masoghi,:ghichu,:ma_loai_kh,:ma_doi_tuong_kh,:din_dk,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        meterid: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: v_meterid
        },
        loaipha: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: v_loaipha
        },
        masoghi: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_masoghi
        },
        ghichu: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_ghichu
        },
        danhmucid: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_danhmucid
        },
        madiemdo: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_madiemdo
        },
        makhachhang: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_makhachhang
        },
        tenkhachhang: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_tenkhachhang
        },
        macot: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_macot
        },
        matram: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_matram
        },
        ma_loai_kh: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_ma_loai_kh
        },
        ma_doi_tuong_kh: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_ma_doi_tuong_kh
        },
        din_dk: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_din_dk
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
          //console.error(err);
          return 'failure';
        })
    });
}

async function find(context) {
  var binds = {};
  var meterid = oracledb.NUMBER;
  var danhmucid = oracledb.STRING;
  var madiemdo = oracledb.STRING;
  var makhachhang = oracledb.STRING;
  var tenkhachhang = oracledb.STRING;
  var loaipha = oracledb.NUMBER;
  var macot = oracledb.STRING;
  var matram = oracledb.STRING;
  var masoghi = oracledb.STRING;
  var ghichu = oracledb.STRING;
  var ma_doi_tuong_kh = oracledb.STRING;
  var ma_loai_kh = oracledb.STRING;
  var din_dk = oracledb.STRING;
  if (context.meterid) {
    meterid = context.meterid;
    danhmucid = context.danhmucid;
    madiemdo = context.madiemdo;
    makhachhang = context.makhachhang;
    tenkhachhang = context.tenkhachhang;
    loaipha = context.loaipha;
    macot = context.macot;
    matram = context.matram;
    masoghi = context.masoghi;
    ghichu = context.ghichu;
    ma_doi_tuong_kh = context.ma_doi_tuong_kh;
    ma_loai_kh = context.ma_loai_kh;
    din_dk = context.din_dk;
    var data = sua_tt_diemdo(meterid, danhmucid, madiemdo, makhachhang, tenkhachhang, loaipha, macot, matram, masoghi, ghichu, ma_loai_kh, ma_doi_tuong_kh, din_dk);
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
