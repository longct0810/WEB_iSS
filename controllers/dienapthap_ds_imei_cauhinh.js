const inputService = require('../db_apis/dienapthap_ds_imei_cauhinh.js');

let get = async (req, res, next) => {
    try {
        const context = {};
        const rows = await find(context);
        if (req.params.id) {
            if (rows.length === 1) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).end();
            }
        } else {
            res.status(200).json(rows);
        }
    } catch (err) {
        next(err);
    }
}
const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        mataikhoan: req.body.v_mataikhoan
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
        const result = await inputService.find(input);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

module.exports = { get, post };




