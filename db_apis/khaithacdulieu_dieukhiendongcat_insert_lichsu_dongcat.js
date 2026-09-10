const oracledb = require('oracledb');

function dieukhiendongcat_save(imei, socongto, event, mataikhoan) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_DIEUKHIEN_THIETBI.P_INSERT_LOG_DONGCAT(:imei,:socongto,:event,:mataikhoan,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                imei: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: imei
                },
                socongto: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: socongto
                },
                event: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: event
                },
                mataikhoan: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: mataikhoan
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
    const { imei, socongto, event, mataikhoan } = context;

    var data = dieukhiendongcat_save(imei, socongto, event, mataikhoan);
    return data;

}

module.exports.find = find;
