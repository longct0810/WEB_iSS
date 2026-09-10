const oracledb = require('oracledb');
const database = require('../services/database.js');

function chisocongtoPmax(danhmucid, locdulieu, ngay, loaipha, sotrang, sodong, mataikhoan, loaichiso) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_DULIEUPMAX.P_LAYDS_CHISOCTO_PMAX(:danhmucid,:locdulieu,:ngay,:loaipha,:sotrang,:sodong,:mataikhoan,:loaichiso,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
                danhmucid: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: danhmucid
                },
                locdulieu: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: locdulieu
                },
                ngay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: ngay
                },
                loaipha: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: loaipha
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
                loaichiso: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: loaichiso
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
    var locdulieu = oracledb.NUMBER;
    var ngay = oracledb.STRING;
    var LoaiPha = oracledb.NUMBER;
    var SoTrang = oracledb.NUMBER;
    var SoDong = oracledb.NUMBER;
    var mataikhoan = oracledb.NUMBER;
    var LoaiChiSo = oracledb.STRING;
    danhmucid = context.danhmucid;
    locdulieu = context.locdulieu;
    ngay = context.ngay;
    LoaiPha = context.loaipha;
    SoTrang = context.sotrang;
    SoDong = context.sodong;
    mataikhoan = context.mataikhoan;
    LoaiChiSo = context.loaichiso;
    var data = chisocongtoPmax(danhmucid, locdulieu, ngay, LoaiPha, SoTrang, SoDong, mataikhoan, LoaiChiSo);
    return data;

}

module.exports.find = find;
