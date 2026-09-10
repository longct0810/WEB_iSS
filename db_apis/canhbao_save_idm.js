const oracledb = require('oracledb');
const database = require('../services/database.js');

function save_idm(ti, idm) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_CAUHINH_CANHBAO_SCADA.P_LUU_CONGTHUC_IDM(:ti,:idm,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                ti: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: ti
                },
                idm: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: idm
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
    var ti = oracledb.STRING;
    var idm = oracledb.STRING;
    ti = context.v_ti;
    idm = context.v_idm;
    var data = save_idm(ti, idm);
    return data;

}

module.exports.find = find;
