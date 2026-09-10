const oracledb = require('oracledb');
const { executeMultiCursor, executeCursor } = require('./oracleConnection');
const validateInput = (req) => {

    const input = {
        v_code: req.body.code
    };
    return input;
};


const DSKHDocTucThoi = async (req, res, next) => {
    try {
        const input = validateInput(req);
        const result = await getDSKHDocTucThoi(input);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

async function getDSKHDocTucThoi(context) {

    const { v_code } = context;
    const sql = `
                     BEGIN PKG_DOCTUCTHOI.P_GET_DS_KHACHHANG(:v_code,:CV_1); END;
                 `;

    const binds = {
        v_code: { type: oracledb.STRING, dir: oracledb.BIND_IN, val: v_code },
        CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    };
    return await executeCursor(sql, binds);

}

module.exports = { DSKHDocTucThoi };


