const oracledb = require('oracledb');
const database = require('../services/database.js');

function thongsovanhanhchitiet(meterid, socongto, tungay, denngay, sotrang, sodong, mataikhoan) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_THONGSOVANHANH.P_LAY_TSVH_KH(:meterid,:socongto,:tungay,:denngay,:sotrang,:sodong ,:mataikhoan,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                meterid: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: meterid
                },
                socongto: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: socongto
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
                sotrang: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: sotrang
                },
                sodong: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: sodong
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
    var meterid = oracledb.NUMBER;
    var socongto = oracledb.STRING;
    var tungay = oracledb.STRING;
    var denngay = oracledb.STRING;
    var sotrang = oracledb.NUMBER;
    var sodong = oracledb.NUMBER;
    var mataikhoan = oracledb.NUMBER;

    meterid = context.meterid;
    socongto = context.socongto;
    tungay = context.tungay;
    denngay = context.denngay;
    sotrang = context.sotrang;
    sodong = context.sodong;
    mataikhoan = context.mataikhoan;

    var data = thongsovanhanhchitiet(meterid, socongto, tungay, denngay, sotrang, sodong, mataikhoan);
    return data;

}

module.exports.find = find;
