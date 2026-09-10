const oracledb = require('oracledb');
const database = require('../services/database.js');

function laythongkechatluong(danhmucid, ngay, starttime, currenttime, mataikhoan) {
    return oracledb.getConnection()
        .then(async (conn) => {
            try {
                // Gọi procedure Oracle
                const result = await conn.execute(
                    `BEGIN PKG_THONGKE_CHATLUONG_HT.P_LAY_THONGKE_CHATLUONG(
                        :danhmucid, :ngay, :starttime, :currenttime, :mataikhoan, :CV_1, :CV_2
                    ); END;`,
                    {
                        danhmucid: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: danhmucid },
                        ngay: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: ngay },
                        starttime: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: starttime },
                        currenttime: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: currenttime },
                        mataikhoan: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: mataikhoan },
                        CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
                        CV_2: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
                    }
                );

                // Xử lý dữ liệu từ cả hai CURSOR
                const processStream = (resultSet) => {
                    return new Promise((resolve, reject) => {
                        const resRows = [];
                        const queryStream = resultSet.toQueryStream();

                        queryStream.on('metadata', (metadata) => {
                            resRows.metadata = metadata.map(col => col.name.toLowerCase());
                        });

                        queryStream.on('data', (row) => {
                            const rowData = {};
                            row.forEach((val, index) => {
                                rowData[resRows.metadata[index]] = val;
                            });
                            resRows.push(rowData);
                        });

                        queryStream.on('error', (err) => reject(err));
                        queryStream.on('close', () => resolve(resRows));
                    });
                };

                // Chạy cả hai stream đồng thời
                const [rows1, rows2] = await Promise.all([
                    processStream(result.outBinds.CV_1),
                    processStream(result.outBinds.CV_2)
                ]);

                // Trả về dữ liệu
                return { rows1, rows2 };
            } catch (err) {
                console.error('Error executing procedure:', err);
                return 'failure';
            } finally {
                await conn.close(); // Đảm bảo đóng kết nối
            }
        })
        .catch((err) => {
            console.error('Error connecting to OracleDB:', err);
            return 'failure';
        });
}

async function find(context) {
    var danhmucid = oracledb.STRING;
    var ngay = oracledb.STRING;
    var starttime = oracledb.STRING;
    var currenttime = oracledb.STRING;
    var mataikhoan = oracledb.NUMBER;
    danhmucid = context.danhmucid;
    ngay = context.ngay;
    starttime = context.starttime;
    currenttime = context.currenttime;
    mataikhoan = context.mataikhoan;
    var data = laythongkechatluong(danhmucid, ngay, starttime, currenttime, mataikhoan);
    return data;

}

module.exports.find = find;
