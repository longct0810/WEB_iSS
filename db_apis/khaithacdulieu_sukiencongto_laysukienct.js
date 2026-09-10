const oracledb = require('oracledb');
const database = require('../services/database.js');

function sukiencongto(danhmucid, type, tungay, denngay, meterid) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_SUKIEN_CONGTO.P_LAYDS_SUKIENCONGTO_DETAIL(:danhmucid,:type,:tungay,:denngay,:meterid,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                danhmucid: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: danhmucid
                },
                type: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: type
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
                meterid: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: meterid
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
    var danhmucid = oracledb.STRING;
    var type = oracledb.STRING;
    var tungay = oracledb.STRING;
    var denngay = oracledb.STRING;
    var meterid = oracledb.NUMBER;
    danhmucid = context.danhmucid;
    type = context.type;
    ngay = context.ngay;
    tungay = context.tungay;
    denngay = context.denngay;
    meterid = context.meterid;
    var data = sukiencongto(danhmucid, type, tungay, denngay, meterid);
    return data;

}

module.exports.find = find;
