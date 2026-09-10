const oracledb = require('oracledb');
const database = require('../services/database.js');
const OracleDB = require('oracledb');

function getSaveCanhBaoVanHanh(v_MATAIKHOAN, v_DANHMUCID, v_UTREN, v_UDUOI, v_UTILE, v_U_STATUS, v_ITREN, v_IDUOI, v_IO, v_I_STATUS, v_CB_COSPHI, v_COS_STATUS, v_ANGELTREN, v_ANGELDUOI, v_ANGLE_STATUS) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_CAUHINH_CANHBAO_SCADA.P_THEM_CAUHINH_CANHBAOVANHANH(:MATAIKHOAN,:DANHMUCID,:UTREN, :UDUOI, :UTILE, :U_STATUS, :ITREN, :IDUOI, :IO, :I_STATUS, :CB_COSPHI, :COS_STATUS, :ANGELDUOI, :ANGELTREN, :ANGLE_STATUS,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE

                MATAIKHOAN: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_MATAIKHOAN
                },
                DANHMUCID: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_DANHMUCID
                },
                UTREN: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_UTREN
                },
                UDUOI: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_UDUOI
                },
                UTILE: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_UTILE
                },
                U_STATUS: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_U_STATUS
                },
                ITREN: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_ITREN
                },
                IDUOI: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_IDUOI
                },
                IO: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_IO
                },
                I_STATUS: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_I_STATUS
                },
                CB_COSPHI: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_CB_COSPHI
                },
                COS_STATUS: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_COS_STATUS
                },
                ANGELDUOI: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_ANGELDUOI
                },
                ANGELTREN: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_ANGELTREN
                },
                ANGLE_STATUS: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_ANGLE_STATUS
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
                    console.log(err);
                    return 'failure';
                })
        });
}
async function find(context) {
    //console.log(context);
    var binds = {};
    var v_UTREN = OracleDB.STRING;
    var v_UDUOI = OracleDB.STRING;
    var v_UTILE = OracleDB.STRING;
    var v_U_STATUS = OracleDB.NUMBER;
    var v_ITREN = OracleDB.STRING;
    var v_IDUOI = OracleDB.STRING;
    var v_IO = OracleDB.STRING;
    var v_I_STATUS = OracleDB.NUMBER;
    var v_CB_COSPHI = OracleDB.STRING;
    var v_COS_STATUS = OracleDB.NUMBER;
    var v_ANGELTREN = OracleDB.STRING;
    var v_ANGELDUOI = OracleDB.STRING;
    var v_ANGLE_STATUS = OracleDB.NUMBER;
    var v_DANHMUCID = OracleDB.STRING;
    var v_MATAIKHOAN = OracleDB.NUMBER;
    v_UTREN = context.v_UTREN;
    v_UDUOI = context.v_UDUOI;
    v_UTILE = context.v_UTILE;
    v_U_STATUS = context.v_U_STATUS;
    v_ITREN = context.v_ITREN;
    v_IDUOI = context.v_IDUOI;
    v_IO = context.v_IO;
    v_I_STATUS = context.v_I_STATUS;
    v_CB_COSPHI = context.v_CB_COSPHI;
    v_COS_STATUS = context.v_COS_STATUS;
    v_ANGELTREN = context.v_ANGELTREN;
    v_ANGELDUOI = context.v_ANGELDUOI;
    v_ANGLE_STATUS = context.v_ANGLE_STATUS;
    v_DANHMUCID = context.v_DANHMUCID;
    v_MATAIKHOAN = context.v_MATAIKHOAN;
    var data = getSaveCanhBaoVanHanh(v_MATAIKHOAN, v_DANHMUCID, v_UTREN, v_UDUOI, v_UTILE, v_U_STATUS, v_ITREN, v_IDUOI, v_IO, v_I_STATUS, v_CB_COSPHI, v_COS_STATUS, v_ANGELTREN, v_ANGELDUOI, v_ANGLE_STATUS);
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
