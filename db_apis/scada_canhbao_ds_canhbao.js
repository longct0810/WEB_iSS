const oracledb = require('oracledb');
const database = require('../services/database.js');

function getDatakhaibaotb(v_tungay, v_denngay, v_danhmucid, v_idthietbi) {

    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_CAUHINH_CANHBAO_SCADA.P_LAY_DS_CANHBAO_SCADA(:tungay,:denngay,:danhmucid,:idthietbi,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                tungay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_tungay
                },
                denngay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_denngay
                },
                danhmucid: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_danhmucid
                },
                idthietbi: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_idthietbi
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
    var tungay = oracledb.STRING;
    var denngay = oracledb.STRING;
    var danhmucid = oracledb.STRING;
    var idthietbi = oracledb.NUMBER;
    tungay = context.tungay;
    denngay = context.denngay;
    danhmucid = context.danhmucid;
    idthietbi = context.idthietbi;
    var data = getDatakhaibaotb(tungay, denngay, danhmucid, idthietbi);
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
