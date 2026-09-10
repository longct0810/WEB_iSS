const oracledb = require('oracledb');
const database = require('../services/database.js');

function getThietBi(imei) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_QUANLY_THIETBI.P_GET_THIETBI(:imei,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                imei: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: imei
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
                    return 'failure';
                })
        });
}
async function find(context) {
    var binds = {};
    var imei = oracledb.STRING;
    imei = context.imei;
    var data = getThietBi(imei);
    return data;

}

module.exports.find = find;
