const oracledb = require('oracledb');
const database = require('../services/database.js');

function dulieusonghai(MeterId, SoCongTo, TuNgay, gio, SoDong, SoTrang, mataikhoan) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_DULIEUSONGHAI.P_LAYDS_DULIEUSONGHAI_KH(:MeterId,:SoCongTo,:TuNgay,:gio, :SoTrang, :SoDong,:mataikhoan,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                MeterId: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: MeterId
                },
                SoCongTo: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: SoCongTo
                },
                TuNgay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: TuNgay
                },
                gio: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: gio
                },
                SoDong: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: SoDong
                },
                SoTrang: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: SoTrang
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
    var MeterId = oracledb.NUMBER;
    var SoCongTo = oracledb.STRING;
    var TuNgay = oracledb.STRING;
    var gio = oracledb.STRING;
    var SoDong = oracledb.NUMBER;
    var SoTrang = oracledb.NUMBER;
    var mataikhoan = oracledb.NUMBER;
    MeterId = context.MeterId;
    SoCongTo = context.SoCongTo;
    TuNgay = context.TuNgay;
    gio = context.gio;
    SoTrang = context.SoTrang;
    SoDong = context.SoDong;
    mataikhoan = context.mataikhoan;
    var data = dulieusonghai(MeterId, SoCongTo, TuNgay, gio, SoDong, SoTrang, mataikhoan);
    return data;

}

module.exports.find = find;
