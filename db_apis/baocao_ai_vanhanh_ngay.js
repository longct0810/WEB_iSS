const oracledb = require('oracledb');
const aiRule = require('../services/report_ai_rule.js');

const IOA = require('../services/ioa_map');

const DEFAULT_IOA = Object.values(IOA).join(',');
console.log('DEFAULT_IOA:', DEFAULT_IOA);
function parseJsonRows(rows) {
    return rows.map(r => {
        const raw = r.JSON_DATA || r.json_data;
        return typeof raw === 'string' ? JSON.parse(raw) : raw;
    });
}

async function callThongKeSoLieu(id_thietbi, tungay, denngay, ioa) {
    let conn;

    try {
        conn = await oracledb.getConnection();
        console.log('===== CALL P_THONGKESOLIEU_AI =====');
        console.log('id_thietbi:', id_thietbi, typeof id_thietbi);
        console.log('tungay:', tungay);
        console.log('denngay:', denngay);
        console.log('ioa:', ioa);
        const result = await conn.execute(
            `BEGIN PKG_SCADA.P_THONGKESOLIEU_AI(
        :id_thietbi,
        :tungay,
        :denngay,
        :ioa,
        :CV_1
      ); END;`,
            {
                id_thietbi: {
                    type: oracledb.NUMBER,
                    dir: oracledb.BIND_IN,
                    val: Number(id_thietbi)
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
                ioa: {
                    type: oracledb.STRING,
                    dir: oracledb.BIND_IN,
                    val: ioa
                },
                CV_1: {
                    dir: oracledb.BIND_OUT,
                    type: oracledb.CURSOR
                }
            },
            {
                outFormat: oracledb.OBJECT
            }
        );

        const rs = result.outBinds.CV_1;
        const rows = await rs.getRows(1000);
        await rs.close();
        console.log(`Fetched ${rows.length} rows from PKG_SCADA.P_THONGKESOLIEU_AI`);
        console.log('Sample row:', rows[0]);
        return rows;
    } finally {
        if (conn) {
            await conn.close();
        }
    }
}

async function find(context) {
    if (!context.id_thietbi) {
        return {
            success: false,
            message: 'Không tìm thấy thiết bị'
        };
    }

    const rows = await callThongKeSoLieu(
        context.id_thietbi,
        context.tungay,
        context.denngay,
        DEFAULT_IOA
    );

    const ioaData = parseJsonRows(rows);

    return aiRule.buildDailyReport({
        id_thietbi: context.id_thietbi,
        tungay: context.tungay,
        denngay: context.denngay,
        ioaData
    });
}

module.exports.find = find;