const oracledb = require('oracledb');
const database = require('../services/database.js');

function them_taikhoan(v_taikhoanthuchien, v_taikhoan, v_matkhau, v_tennguoidung, v_email, v_sodienthoai, v_diachi, v_danhmucid) {
  return oracledb.getConnection()
    .then(function (conn) {
      return conn.execute(`BEGIN PKG_TAIKHOAN.P_THEM_TAIKHOAN(:taikhoanthuchien,:taikhoan,:matkhau,:tennguoidung,:email,:sodienthoai,:diachi,:danhmucid,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
        taikhoanthuchien: {
          type: oracledb.NUMBER,
          dir: oracledb.BIND_IN,
          val: v_taikhoanthuchien
        },
        taikhoan: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_taikhoan
        },
        matkhau: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_matkhau
        },
        tennguoidung: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_tennguoidung
        },
        email: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_email
        },
        sodienthoai: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_sodienthoai
        },
        diachi: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_diachi
        },
        danhmucid: {
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
          val: v_danhmucid
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
  var taikhoanthuchien = oracledb.NUMBER;
  var taikhoan = oracledb.STRING;
  var matkhau = oracledb.STRING;
  var tennguoidung = oracledb.STRING;
  var email = oracledb.STRING;
  var sodienthoai = oracledb.STRING;
  var diachi = oracledb.STRING;
  var danhmucid = oracledb.STRING;
  if (context.taikhoanthuchien || context.taikhoanthuchien == 0) {
    taikhoanthuchien = context.taikhoanthuchien;
    taikhoan = context.taikhoan;
    matkhau = context.matkhau;
    tennguoidung = context.tennguoidung;
    email = context.email;
    sodienthoai = context.sodienthoai;
    diachi = context.diachi;
    danhmucid = context.danhmucid;
    var data = them_taikhoan(taikhoanthuchien, taikhoan, matkhau, tennguoidung, email, sodienthoai, diachi, danhmucid);
    return data;

  } else {
    return "Tài khoản đăng nhập không đúng"
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


