const oracledb = require('oracledb');
const database = require('../services/database.js');

function laycanhbaoami(danhmucid, meterid, tungay, denngay, loaicanhbao) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_THONGTIN_CANHBAO.P_GET_CANHBAO_VANHANH_CHITIET(:danhmucid, :meterid, :tungay, :denngay,:loaicanhbao,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                danhmucid: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: danhmucid
                },
                meterid: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: meterid
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
                loaicanhbao: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: loaicanhbao
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
    var meterid = oracledb.STRING;
    var tungay = oracledb.STRING;
    var denngay = oracledb.STRING;
    var loaicanhbao = oracledb.STRING;
    danhmucid = context.danhmucid;
    meterid = context.meterid;
    tungay = context.tungay;
    denngay = context.denngay;
    loaicanhbao = context.loaicanhbao;
    var data = laycanhbaoami(danhmucid, meterid, tungay, denngay, loaicanhbao);
    return data;

}

module.exports.find = find;
