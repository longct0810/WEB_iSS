const { find } = require('../db_apis/khaithacdulieu_sukiencongto_laysukienct.js');

const validateInput = (req) => {
    const input = {
        danhmucid: req.body.v_danhmucid,
        type: req.body.v_type,
        tungay: req.body.v_tungay,
        denngay: req.body.v_denngay,
        meterid: req.body.v_meterid
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

module.exports = { post };


