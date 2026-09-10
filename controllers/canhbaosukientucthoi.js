const oracledb = require('oracledb');
const { executeCursor } = require('./oracleConnection');

const getCanhBao = async (req, res, next) => {
    try {
        const result = await getCanhBaoTucThoi();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
async function getCanhBaoTucThoi() {

    const sql = `
                     BEGIN PKG_SUKIEN_CONGTO.P_CANHBAO_SUKIEN_TUCTHOI(:CV_1); END;
                    `;

    const binds = {
        CV_1: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    };
    return await executeCursor(sql, binds);

}

module.exports = { getCanhBao };


