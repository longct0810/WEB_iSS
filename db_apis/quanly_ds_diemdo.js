const oracledb = require('oracledb');
const database = require('../services/database.js');

function ql_ds_diemdo(v_danhmucid, v_mataikhoan, v_doituong, v_loaikh, v_trangthai, v_madiemdo, v_thanhly) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_QUANLY_DIEMDO.P_LAYDS_DIEMDO(:danhmucid,:taikhoanthuchien,:doituong,:loaikh,:trangthai,:madiemdo,:thanhly,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        danhmucid: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_danhmucid
        },
        taikhoanthuchien: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: v_mataikhoan
        },
        doituong: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_doituong
        },
        loaikh: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_loaikh
        },
        trangthai: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_trangthai
        },
        madiemdo: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_madiemdo
        },
        thanhly: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_thanhly
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

  var v_danhmucid = oracledb.STRING;
  var v_mataikhoan = oracledb.NUMBER;
  var v_doituong = oracledb.STRING;
  var v_loaikh = oracledb.STRING;
  var v_madiemdo = oracledb.STRING;
  var v_trangthai = oracledb.STRING;
  var v_thanhly = oracledb.STRING;
  v_danhmucid = context.danhmucid;
  v_mataikhoan = context.taikhoan
  v_doituong = context.doituong;
  v_loaikh = context.loaikh;
  v_trangthai = context.trangthai;
  v_madiemdo = context.madiemdo;
  v_thanhly = "0";
  var data = ql_ds_diemdo(v_danhmucid, v_mataikhoan, v_doituong, v_loaikh, v_trangthai, v_madiemdo, v_thanhly);
  return data;
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
