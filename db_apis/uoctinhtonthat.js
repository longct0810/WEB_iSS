const oracledb = require('oracledb');
const database = require('../services/database.js');

function uoctinhtonthat(danhmucid, tungay, denngay, ddo_daunguon) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_TONTHAT.P_LAY_UOCTINH_TONTHAT(:danhmucid, :tungay, :denngay, :ddo_daunguon,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                danhmucid: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: danhmucid
                },
                tungay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: tungay
                },
                denngay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: denngay
                },
                ddo_daunguon: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: ddo_daunguon
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
    var ddo_daunguon = oracledb.STRING;
    danhmucid = context.danhmucid;
    tungay = context.tungay;
    denngay = context.denngay;
    ddo_daunguon = context.ddo_daunguon;
    var data = uoctinhtonthat(danhmucid, tungay, denngay, ddo_daunguon);
    return data;

}

module.exports.find = find;
