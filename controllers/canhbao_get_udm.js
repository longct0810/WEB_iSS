const { find } = require('../db_apis/canhbao_get_udm.js');

const validateInput = (req) => {
    const input = {
        v_danhmucid: req.body.v_danhmucid
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
        const result = await find(input);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};


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

module.exports = { post, get };




