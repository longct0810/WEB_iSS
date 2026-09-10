const oracledb = require('oracledb');
const database = require('../services/database.js');

function chisocongto(danhmucid, locdulieu, loaihienthi, ngay, Gio, LoaiPha, SoTrang, SoDong, mataikhoan, LoaiChiSo, PhaCongTo) {
    return oracledb.getConnection()
        .then(function (conn) {
            return conn.execute(`BEGIN PKG_THONGSOVANHANH.P_LAYDS_CHISOCTO(:danhmucid,:locdulieu,:loaihienthi,:ngay,:Gio,:LoaiPha,:SoTrang,:SoDong,:mataikhoan,:LoaiChiSo,:PhaCongTo,:CV_1); END;`, { // EXECUTE ORACLE PROCEDURE
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
                loaihienthi: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: loaihienthi
                },
                ngay: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: ngay
                },
                Gio: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: Gio
                },
                LoaiPha: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: LoaiPha
                },
                SoTrang: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: SoTrang
                },
                SoDong: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: SoDong
                },
                mataikhoan: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: mataikhoan
                },
                LoaiChiSo: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: LoaiChiSo
                },
                PhaCongTo: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: PhaCongTo
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
    var loaihienthi = oracledb.STRING;
    var ngay = oracledb.STRING;
    var Gio = oracledb.STRING;
    var LoaiPha = oracledb.NUMBER;
    var SoTrang = oracledb.NUMBER;
    var SoDong = oracledb.NUMBER;
    var mataikhoan = oracledb.NUMBER;
    var LoaiChiSo = oracledb.STRING;
    var PhaCongTo = oracledb.STRING;
    danhmucid = context.danhmucid;
    locdulieu = context.locdulieu;
    loaihienthi = context.loaihienthi;
    ngay = context.ngay;
    Gio = context.Gio;
    LoaiPha = context.LoaiPha;
    SoTrang = context.SoTrang;
    SoDong = context.SoDong;
    mataikhoan = context.mataikhoan;
    LoaiChiSo = context.LoaiChiSo;
    PhaCongTo = context.PhaCongTo;
    var data = chisocongto(danhmucid, locdulieu, loaihienthi, ngay, Gio, LoaiPha, SoTrang, SoDong, mataikhoan, LoaiChiSo, PhaCongTo);
    return data;

}

module.exports.find = find;
