const oracledb = require('oracledb');
const database = require('../services/database.js');

function save_apdung_udm(v_apdung, v_mataikhoanthuchien, v_danhmucid) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_CAUHINH_CANHBAO_SCADA.P_APDUNG_CONGTHUC_UDM(:apdung,:danhmucid,:mataikhoan,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                apdung: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_apdung
                },
                danhmucid: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: v_danhmucid
                },
                mataikhoan: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: v_mataikhoanthuchien
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
    var v_apdung = oracledb.STRING;
    var v_mataikhoanthuchien = oracledb.NUMBER;
    var v_danhmucid = oracledb.STRING;
    v_apdung = JSON.stringify(JSON.parse(context.v_apdung));
    v_mataikhoanthuchien = context.v_mataikhoanthuchien;
    v_danhmucid = context.v_danhmucid;
    var data = save_apdung_udm(v_apdung, v_mataikhoanthuchien, v_danhmucid);
    return data;

}

module.exports.find = find;
