const oracledb = require('oracledb');
const { executeCursor } = require('./oracleConnection');
const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        meterid: req.body.v_meterid,
        skip: req.body.v_start,
        limit: req.body.v_length,
        search: req.body.v_search

    };
    return input;
};


const post = async (req, res, next) => {
    try {
        if (!req.body.v_danhmucid) {
            return res.status(400).json({
                message: "Chưa nhập danh mục"
            })
        }
        const input = validateInput(req);

        const rows = await find(input);

        const recordsTotal = rows.length ? Number(rows[0].records_total || 0) : 0;
        const recordsFiltered = rows.length ? Number(rows[0].records_filtered || 0) : 0;

        const data = rows.map(row => ({
            stt: row.stt,
            ten_khachhang: row.ten_khachhang,
            socongto: row.socongto,
            event: row.event,
            timemin: row.timemin,
            donvi: row.donvi,
            value: row.value
        }));

        res.json({
            recordsTotal,
            recordsFiltered,
            data
        });
    } catch (err) {
        next(err);
    }
};

async function find(context) {

    const { danhmucid, meterid, draw, skip, limit, search } = context;
    const sql = `
                     BEGIN PKG_SUKIEN_CONGTO.P_LAYCANHBAOTUCTHOI(:danhmucid,:meterid,:skip,:limit,:search,:CV_1); END;
                    `;

    const binds = {
        danhmucid: { type: oracledb.String, dir: oracledb.BIND_IN, val: danhmucid },
        meterid: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: meterid },
        skip: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: skip },
        limit: { type: oracledb.NUMBER, dir: oracledb.BIND_IN, val: limit },
        search: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: search },
        CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    };
    return await executeCursor(sql, binds);

}

module.exports = { post };


