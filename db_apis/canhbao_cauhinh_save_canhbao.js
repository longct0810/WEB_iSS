const oracledb = require('oracledb');
const database = require('../services/database.js');

function getDatakhaibaotb(v_cambien_nhiet_duoi, v_cambien_nhiet_tren, v_cambien_nhiet_type, v_cambien_nhiet_check, v_cambien_doam_duoi, v_cambien_doam_tren, v_cambien_doam_type, v_cambien_doam_check
    , v_nhietdo_fi_duoi, v_nhietdo_fi_tren, v_nhietdo_fi_type, v_nhietdo_fi_check, v_dong_fi_duoi, v_dong_fi_tren, v_dong_fi_type, v_dong_fi_check
    , v_cambien_khi_duoi, v_cambien_khi_tren, v_cambien_khi_type, v_cambien_khi_check, v_dienap_pin_type, v_dienap_pin_check
) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_CAUHINH_CANHBAO_SCADA.P_THEM_CAUHINH_CANHBAO(:cambien_nhiet_duoi,:cambien_nhiet_tren,:cambien_nhiet_type,:cambien_nhiet_check,:cambien_doam_duoi,:cambien_doam_tren,:cambien_doam_type,:cambien_doam_check,:nhietdo_fi_duoi,:nhietdo_fi_tren,:nhietdo_fi_type,:nhietdo_fi_check,:dong_fi_duoi,:dong_fi_tren,:dong_fi_type,:dong_fi_check,:cambien_khi_duoi,:cambien_khi_tren,:cambien_khi_type,:cambien_khi_check,:dienap_pin_type,:dienap_pin_check,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                cambien_nhiet_duoi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_nhiet_duoi
                },
                cambien_nhiet_tren: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_nhiet_tren
                },
                cambien_nhiet_type: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_nhiet_type
                },
                cambien_nhiet_check: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_nhiet_check
                },
                cambien_doam_duoi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_doam_duoi
                },
                cambien_doam_tren: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_doam_tren
                },
                cambien_doam_type: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_doam_type
                },
                cambien_doam_check: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_doam_check
                },
                nhietdo_fi_duoi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_nhietdo_fi_duoi
                },
                nhietdo_fi_tren: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_nhietdo_fi_tren
                },
                nhietdo_fi_type: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_nhietdo_fi_type
                },
                nhietdo_fi_check: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_nhietdo_fi_check
                },
                dong_fi_duoi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_dong_fi_duoi
                },
                dong_fi_tren: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_dong_fi_tren
                },
                dong_fi_type: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_dong_fi_type
                },
                dong_fi_check: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_dong_fi_check
                },
                cambien_khi_duoi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_khi_duoi
                },
                cambien_khi_tren: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_khi_tren
                },
                cambien_khi_type: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_khi_type
                },
                cambien_khi_check: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_cambien_khi_check
                },
                dienap_pin_type: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_dienap_pin_type
                },
                dienap_pin_check: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_dienap_pin_check
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
    var cambien_nhiet_duoi = oracledb.STRING;
    var cambien_nhiet_tren = oracledb.STRING;
    var cambien_nhiet_type = oracledb.STRING;
    var cambien_nhiet_check = oracledb.STRING;
    var cambien_doam_duoi = oracledb.STRING;
    var cambien_doam_tren = oracledb.STRING;
    var cambien_doam_type = oracledb.STRING;
    var cambien_doam_check = oracledb.STRING;
    var nhietdo_fi_duoi = oracledb.STRING;
    var nhietdo_fi_tren = oracledb.STRING;
    var nhietdo_fi_type = oracledb.STRING;
    var nhietdo_fi_check = oracledb.STRING;
    var dong_fi_duoi = oracledb.STRING;
    var dong_fi_tren = oracledb.STRING;
    var dong_fi_type = oracledb.STRING;
    var dong_fi_check = oracledb.STRING;
    var cambien_khi_duoi = oracledb.STRING;
    var cambien_khi_tren = oracledb.STRING;
    var cambien_khi_type = oracledb.STRING;
    var cambien_khi_check = oracledb.STRING;
    var dienap_pin_type = oracledb.STRING;
    var dienap_pin_check = oracledb.STRING;
    cambien_nhiet_duoi = context.cambien_nhiet_duoi;
    cambien_nhiet_tren = context.cambien_nhiet_tren;
    cambien_nhiet_type = context.cambien_nhiet_type;
    cambien_nhiet_check = context.cambien_nhiet_check;
    cambien_doam_duoi = context.cambien_doam_duoi;
    cambien_doam_tren = context.cambien_doam_tren;
    cambien_doam_type = context.cambien_doam_type;
    cambien_doam_check = context.cambien_doam_check;
    nhietdo_fi_duoi = context.nhietdo_fi_duoi;
    nhietdo_fi_tren = context.nhietdo_fi_tren;
    nhietdo_fi_type = context.nhietdo_fi_type;
    nhietdo_fi_check = context.nhietdo_fi_check;
    dong_fi_duoi = context.dong_fi_duoi;
    dong_fi_tren = context.dong_fi_tren;
    dong_fi_type = context.dong_fi_type;
    dong_fi_check = context.dong_fi_check;
    cambien_khi_duoi = context.cambien_khi_duoi;
    cambien_khi_tren = context.cambien_khi_tren;
    cambien_khi_type = context.cambien_khi_type;
    cambien_khi_check = context.cambien_khi_check;
    dienap_pin_type = context.dienap_pin_type;
    dienap_pin_check = context.dienap_pin_check;
    var data = getDatakhaibaotb(cambien_nhiet_duoi, cambien_nhiet_tren, cambien_nhiet_type, cambien_nhiet_check, cambien_doam_duoi, cambien_doam_tren, cambien_doam_type, cambien_doam_check, nhietdo_fi_duoi, nhietdo_fi_tren, nhietdo_fi_type, nhietdo_fi_check, dong_fi_duoi, dong_fi_tren, dong_fi_type, dong_fi_check, cambien_khi_duoi, cambien_khi_tren, cambien_khi_type, cambien_khi_check, dienap_pin_type, dienap_pin_check);
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
