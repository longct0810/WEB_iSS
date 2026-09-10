const oracledb = require('oracledb');
const database = require('../services/database.js');

function getThongKeMangTai(v_Danhmucid, v_Tungay, v_Denngay, v_Loaitai, v_Canpha, v_pagenum, v_numrecs, v_mataikhoan) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_BC_THONGKEMANGTAI.P_LAY_THONGKE_MANGTAI(:danhmucid,:tungay,:denngay,:loaitai,:canpha,:pagenum,:numrecs,:mataikhoan,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                danhmucid: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_Danhmucid
                },
                tungay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_Tungay
                },
                denngay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_Denngay
                },
                loaitai: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_Loaitai
                },
                canpha: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_Canpha
                },
                pagenum: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_pagenum
                },
                numrecs: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_numrecs
                },
                mataikhoan: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_mataikhoan
                },
                CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
            })
                .then((result) => {
                    var resRows = [];
                    var metaData = [];
                    var resultSet = result.outBinds.CV_1;
                    var queryStream = resultSet.toQueryStream();

                    var rowData = {};
                    var ColumNames = {};
                    var metadataProcessed = false;
                    return consumeStream = new Promise((resolve, reject) => {
                        queryStream.on('metadata', (metadata) => {
                            metadata.forEach((column, index) => {
                                ColumNames[column.name.toLowerCase()] = index;
                            });
                            metadataProcessed = true;
                        });

                        queryStream.on('data', (row) => {

                            if (!metadataProcessed) {
                                return;
                            }
                            rowData = {};
                            for (const key in ColumNames) {
                                rowData[key] = row[ColumNames[key]];
                            }
                            resRows.push(rowData);

                        });
                        queryStream.on('error', (err) => {
                            console.error(err);
                        });
                        queryStream.on('close', () => {
                            resolve(resRows); //RETURN ON RESOLVING ALL THE ROWS
                            conn.close();

                        });
                    })
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
    var tungay = oracledb.STRING;
    var denngay = oracledb.STRING;
    var loaitai = oracledb.NUMBER;
    var canpha = oracledb.NUMBER;
    var pagenum = oracledb.NUMBER;
    var numrecs = oracledb.NUMBER;
    var mataikhoan = oracledb.NUMBER;
    if (context.danhmucid) {
        danhmucid = context.danhmucid;
        tungay = context.tungay;
        denngay = context.denngay;
        loaitai = context.loaitai;
        canpha = context.canpha;
        pagenum = context.pagenum;
        numrecs = context.numrecs;
        mataikhoan = context.mataikhoan;
        var data = getThongKeMangTai(danhmucid, tungay, denngay, loaitai, canpha, pagenum, numrecs, mataikhoan);

        return data;

    } else {
        return "Vui lòng chọn danh mục"
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
